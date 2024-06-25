import {
  ConflictException,
  Injectable,
  BadRequestException,
  GoneException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { RefreshToken } from './refresh-token.entity';
import { Repository } from 'typeorm';
import { LoginDto, RegisterDto, UpdateInfoUserDto } from './user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(RefreshToken)
    private refreshTokenRepository: Repository<RefreshToken>,
    private jwtService: JwtService,
    private _configService: ConfigService,
  ) {}

  private async generateHash(password: string): Promise<string> {
    const saltRounds = 12;
    const salt = await bcrypt.genSalt(saltRounds);
    return await bcrypt.hash(password, salt);
  }

  private async compareBcrypt(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }

  async generateRefreshToken(user: UserEntity): Promise<RefreshToken> {
    const payload = {
      username: user.username,
      email: user.email,
      id: user.id,
      role: user.role,
    };
    const refreshTokenWithUser = await this.refreshTokenRepository.find({
      where: {
        userId: user.id,
      },
    });
    const tokenRevoked = refreshTokenWithUser.find((el) => !el.isRevoked);
    const validateRefreshToken = await this.validateRefreshToken(
      tokenRevoked?.token,
    );
    if (!validateRefreshToken?.token || !tokenRevoked) {
      const refreshToken = this.jwtService.sign(payload, {
        expiresIn: '3d',
        secret: this._configService.getOrThrow('APP_JWT_REFRESH_TOKEN_SECRET'),
      });

      // Lưu refreshToken vào cơ sở dữ liệu
      const tokenEntity = this.refreshTokenRepository.create({
        userId: user.id,
        token: refreshToken,
        isRevoked: false,
        expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });
      await this.refreshTokenRepository.save(tokenEntity);
      return tokenEntity;
    }
    return validateRefreshToken;
  }

  async generateAccessToken(user: UserEntity) {
    const payload = {
      username: user.username,
      email: user.email,
      id: user.id,
      role: user.role,
    };
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '12h',
      secret: this._configService.getOrThrow('APP_JWT_ACCESS_TOKEN_SECRET'),
    });
    return {
      token: accessToken,
      expiresIn: 1000 * 60 * 60 * 12,
    };
  }

  private async validateRefreshToken(token: string): Promise<RefreshToken> {
    if (!token) {
      return null;
    }
    try {
      const tokenPayload = this.jwtService.verify(token, {
        secret: this._configService.getOrThrow('APP_JWT_REFRESH_TOKEN_SECRET'),
      });
      if (tokenPayload) {
        const tokenDb = await this.refreshTokenRepository.findOne({
          where: { token },
        });

        if (!tokenDb || tokenDb.isRevoked) {
          throw new UnauthorizedException('The token has been revoked');
        }

        return tokenDb;
      }
    } catch (err) {
      return null;
    }
  }

  private verifyRefreshToken(token: string) {
    let payload;
    try {
      payload = this.jwtService.verify(token, {
        secret: this._configService.get('APP_JWT_REFRESH_TOKEN_SECRET'),
      });
    } catch (error) {
      throw new BadRequestException('Wrong refresh token');
    }
    return payload;
  }

  async register(data: RegisterDto): Promise<UserEntity> {
    try {
      const { password } = data;
      const passwordHash = await this.generateHash(password);
      const user = this.userRepository.create({
        ...data,
        password: passwordHash,
      });
      await this.userRepository.save(user);
      const result = await this.login({
        username: data.username,
        password: data.password,
      });
      return result;
    } catch (error) {
      if (error.code === '23505') {
        // '23505' là mã lỗi cho việc vi phạm ràng buộc unique trong PostgreSQL
        throw new ConflictException('username hoặc email đã tồn tại!');
      }
      throw new BadRequestException(error?.message);
    }
  }

  async login(data: LoginDto) {
    try {
      const { username, password } = data;
      const user = await this.userRepository
        .createQueryBuilder('users')
        .leftJoinAndSelect('users.refreshTokens', 'refreshToken')
        .where('users.username= :username OR users.email= :email', {
          username,
          email: username,
        })
        .getOne();
      if (!user) {
        throw new BadRequestException('Sai tài khoản hoặc email');
      }
      const isPassword = await this.compareBcrypt(password, user.password);
      if (isPassword) {
        return user;
      }
      throw new BadRequestException('Sai mật khẩu');
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async removeUser(id: string): Promise<boolean> {
    try {
      const user = await this.userRepository.findOne({
        where: { id },
        relations: ['refreshTokens'],
      });
      if (!user) {
        throw new NotFoundException(`Không tìm thấy người dùng có id ${id}`);
      }
      // Nếu người dùng tồn tại và có refreshTokens
      if (user.refreshTokens) {
        for (const refreshToken of user.refreshTokens) {
          // Tiến hành xóa refreshTokens
          await this.refreshTokenRepository.remove(refreshToken);
        }
      }
      await this.userRepository.remove(user);
      return true;
    } catch (error) {
      if (error.code === '22P02') {
        throw new GoneException('Sai id user');
      }
      throw new BadRequestException(error.message);
    }
  }

  async updateUser(
    id: string,
    data: Partial<RegisterDto>,
  ): Promise<UserEntity> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('Không tìm thấy user');
    }
    Object.assign(user, data);
    return this.userRepository.save(user);
  }

  async getInfoUserByUsername(username: string): Promise<UserEntity> {
    const user = await this.userRepository.findOneBy({ username });
    return user;
  }

  async getInfoUserByUserId(userId: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['refreshTokens'],
    });
    return user;
  }

  async logout(refreshToken: string) {
    try {
      const result = this.verifyRefreshToken(refreshToken);
      if (!result) {
        const dataRefreshToken = await this.refreshTokenRepository.findOne({
          where: {
            token: refreshToken,
          },
        });
        dataRefreshToken.isRevoked = true;
        await this.refreshTokenRepository.save(dataRefreshToken);
      }
      return {
        message: 'Đăng xuất thành công',
      };
    } catch (err) {
      throw new BadRequestException(err?.message);
    }
  }

  async refreshToken(user: UserEntity) {
    const userToken = user.refreshTokens.find((el) => !el.isRevoked);
    if (!userToken) {
      throw new UnauthorizedException('Không có token hợp lệ');
    }
    const accessToken = await this.generateAccessToken(user);
    return { accessToken, refreshToken: userToken.token };
  }

  async checkPassword(user: UserEntity, password: string): Promise<boolean> {
    return await this.compareBcrypt(password, user.password);
  }

  async changePassword(user: UserEntity, password: string): Promise<boolean> {
    try {
      const generateHash = await this.generateHash(password);
      user.password = generateHash;
      await this.userRepository.save(user);
      return true;
    } catch (error) {
      return false;
    }
  }

  async updateInfoUser(
    user: UserEntity,
    info: UpdateInfoUserDto,
  ): Promise<boolean> {
    try {
      const infoUpdate = { ...user, ...info };
      await this.userRepository.save(infoUpdate as UserEntity);
      return true;
    } catch (error) {
      throw new BadRequestException(error?.message);
    }
  }

  async revokedRefreshToken(token: string): Promise<boolean> {
    try {
      const result = await this.refreshTokenRepository.findOneBy({ token });
      if (!result) {
        throw new NotFoundException('refresh token not found');
      }
      result.isRevoked = true;
      await this.refreshTokenRepository.save(result);
      return true;
    } catch (error) {
      throw new BadRequestException(error?.message);
    }
  }
}
