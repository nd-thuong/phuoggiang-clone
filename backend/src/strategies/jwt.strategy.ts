import { AuthService } from '@/app/auth/auth.service';
import { UserEntity } from '@/app/auth/user.entity';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'Jwt') {
  public constructor(
    private _configService: ConfigService,
    private authService: AuthService,
  ) {
    const accessSecret = _configService.get('APP_JWT_ACCESS_TOKEN_SECRET');
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.[
            _configService.get('APP_JWT_ACCESS_TOKEN_KEY')
          ];
        },
      ]),
      secretOrKey: accessSecret,
    });
  }

  public async validate(payload: UserEntity) {
    const user = await this.authService.getInfoUserByUsername(payload.username);
    return user;
  }
}
