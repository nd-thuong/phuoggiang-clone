import { AuthService } from '@/app/auth/auth.service';
import { TokenPayload } from '@/constants/token-payload';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(
  Strategy,
  'refresh-jwt',
) {
  public constructor(
    private _configService: ConfigService,
    private authService: AuthService,
  ) {
    const refreshSecret = _configService.get('APP_JWT_REFRESH_TOKEN_SECRET');
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refresh-token'),
      secretOrKey: refreshSecret,
    });
  }

  async validate(payload: TokenPayload) {
    const user = await this.authService.getInfoUserByUserId(payload.id);
    return user;
  }
}
