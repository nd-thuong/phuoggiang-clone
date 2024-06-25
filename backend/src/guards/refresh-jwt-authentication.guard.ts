import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class RefreshJwtAuthenticationGuard extends AuthGuard('refresh-jwt') {}
