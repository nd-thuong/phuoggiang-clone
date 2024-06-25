import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '@/app/auth/auth.service';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { LoginDto } from '@/app/auth/user.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(username: string, password: string) {
    const data = plainToClass(LoginDto, { username, password });
    const errors = await validate(data);
    if (errors.length > 0) {
      const validationErrors = errors.map((error) =>
        Object.values(error.constraints),
      );
      throw new HttpException(
        {
          message: 'Validation failed',
          errors: validationErrors.flat(),
          statusCode: HttpStatus.BAD_REQUEST,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    const user = await this.authService.login({ username, password });
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
