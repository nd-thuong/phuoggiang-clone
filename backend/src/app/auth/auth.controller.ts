import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  PasswordDto,
  RefreshTokenDto,
  RegisterDto,
  ResultLogin,
  UpdateInfoUserDto,
  UserDto,
} from './user.dto';
import { plainToInstance } from 'class-transformer';
import { UserEntity } from './user.entity';
import { RequestWithUser } from './request-with-user';
import { JwtAuthenticationGuard } from '@/guards/jwt-authentication.guard';
import { RolesGuard } from '@/guards/role.guard';
import { RefreshJwtAuthenticationGuard } from '@/guards/refresh-jwt-authentication.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import * as cookie from 'cookie';
import { JwtLocalAuthenticationGuard } from '@/guards/jwt-local-authentication.guard';
import { TypeAccessToken } from '@/constants/type-accessToken';
import { ConfigService } from '@nestjs/config';
import { ValidationBodyData } from '@/middleware/ValidationBodyData';

@ApiTags('auth')
@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly _configService: ConfigService,
  ) {}

  @ApiOperation({ summary: 'Register a new user' })
  @Post('/register')
  @UseInterceptors(new ValidationBodyData<RegisterDto>(RegisterDto))
  async registerUser(
    @Body() body: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ResultLogin> {
    const user = await this.authService.register(body);
    // return plainToInstance(UserDto, user);
    const accessToken: TypeAccessToken =
      await this.authService.generateAccessToken(user);
    const refreshToken = await this.authService.generateRefreshToken(user);
    res.setHeader('Set-Cookie', [
      cookie.serialize(
        this._configService.get('APP_JWT_ACCESS_TOKEN_KEY'),
        accessToken.token,
        {
          httpOnly: true,
          maxAge: accessToken.expiresIn,
          // sameSite: 'strict',
          path: '/',
          sameSite: 'none', // Đảm bảo sử dụng HTTPS khi dùng tùy chọn này
          secure: true,
        },
      ),
    ]);
    return { refreshToken: refreshToken.token };
  }

  @ApiOperation({ summary: 'Login user' })
  @Post('/login')
  @UseGuards(JwtLocalAuthenticationGuard)
  async loginUser(
    @Req() req: RequestWithUser<UserEntity>,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ResultLogin> {
    try {
      const { user } = req;
      const accessToken: TypeAccessToken =
        await this.authService.generateAccessToken(user);
      const refreshToken = await this.authService.generateRefreshToken(user);
      res.setHeader('Set-Cookie', [
        cookie.serialize(
          this._configService.get('APP_JWT_ACCESS_TOKEN_KEY'),
          accessToken.token,
          {
            httpOnly: true,
            maxAge: accessToken.expiresIn,
            // sameSite: 'strict',
            path: '/',
            sameSite: 'none', // Đảm bảo sử dụng HTTPS khi dùng tùy chọn này
            secure: true,
          },
        ),
      ]);
      return { refreshToken: refreshToken.token };
    } catch (error) {
      console.log(error);
    }
  }

  @ApiOperation({ summary: 'Get current user' })
  @UseGuards(JwtAuthenticationGuard)
  @Get('/me')
  async getInfoUser(@Req() req: RequestWithUser<UserEntity>): Promise<UserDto> {
    const user = req.user;
    return plainToInstance(UserDto, user);
  }

  @ApiOperation({ summary: 'Remove a user' })
  @Delete('/user/:id')
  @UseGuards(RolesGuard(['admin']))
  async removeUser(@Param('id') id: string): Promise<boolean> {
    return await this.authService.removeUser(id);
  }

  @ApiOperation({ summary: 'Logout' })
  @Post('/logout')
  @UseGuards(JwtAuthenticationGuard)
  async logOut(
    @Res() res: Response,
    @Req() req: RequestWithUser<UserEntity>,
    @Body() data: RefreshTokenDto,
  ) {
    if (!req.user) {
      throw new UnauthorizedException();
    }
    await this.authService.logout(data['refresh-token']);

    res.clearCookie(this._configService.get('APP_JWT_ACCESS_TOKEN_KEY'));
    res.status(HttpStatus.OK).json({
      message: 'Đăng xuất thành công',
    });
  }

  @ApiOperation({ summary: 'refresh token' })
  @Post('/refresh-token')
  @UseGuards(RefreshJwtAuthenticationGuard)
  async refreshToken(
    @Req() request: RequestWithUser<UserEntity>,
    @Res({ passthrough: true }) res: Response,
  ): Promise<boolean> {
    const token = await this.authService.refreshToken(request.user);
    res.clearCookie(this._configService.get('APP_JWT_ACCESS_TOKEN_KEY'));
    res.setHeader('Set-Cookie', [
      cookie.serialize(
        this._configService.get('APP_JWT_ACCESS_TOKEN_KEY'),
        token.accessToken.token,
        {
          httpOnly: true,
          maxAge: token.accessToken.expiresIn,
          // sameSite: 'strict',
          path: '/',
          sameSite: 'none', // Đảm bảo sử dụng HTTPS khi dùng tùy chọn này
          secure: true,
        },
      ),
    ]);
    return true;
  }

  @ApiOperation({ summary: 'Check password' })
  @Post('/check-password')
  @UseGuards(JwtAuthenticationGuard)
  async checkPassword(
    @Req() req: RequestWithUser<UserEntity>,
    @Body() data: PasswordDto,
  ): Promise<boolean> {
    return this.authService.checkPassword(req.user, data.password);
  }

  @ApiOperation({ summary: 'Change password' })
  @Post('/change-password')
  @UseGuards(JwtAuthenticationGuard)
  async changePassword(
    @Req() req: RequestWithUser<UserEntity>,
    @Body() data: PasswordDto,
  ): Promise<boolean> {
    return await this.authService.changePassword(req.user, data.password);
  }

  @ApiOperation({ summary: 'update info user' })
  @Put('/update-info-user')
  @UseGuards(JwtAuthenticationGuard)
  async updateInfoUser(
    @Req() req: RequestWithUser<UserEntity>,
    @Body() data: UpdateInfoUserDto,
  ): Promise<boolean> {
    return await this.authService.updateInfoUser(req.user, data);
  }

  @ApiOperation({ summary: 'revoked refresh token' })
  @Post('/revoked/refresh-token')
  async revokedRefreshToken(@Body() data: RefreshTokenDto): Promise<boolean> {
    return await this.authService.revokedRefreshToken(data['refresh-token']);
  }
}
