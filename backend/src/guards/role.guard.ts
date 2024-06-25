import { RequestWithUser } from '../app/auth/request-with-user';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  mixin,
  Type,
} from '@nestjs/common';
import { JwtAuthenticationGuard } from './jwt-authentication.guard';

export const RolesGuard = (roles: string[]): Type<CanActivate> => {
  class RoleGuardMixin extends JwtAuthenticationGuard {
    async canActivate(context: ExecutionContext) {
      await super.canActivate(context);
      const request = context.switchToHttp().getRequest<RequestWithUser>();
      const user = request.user;
      if (roles.includes(user.role)) {
        return true;
      }
      throw new ForbiddenException(
        `Tài khoản không có vai trò ${roles.join('/')}`,
      );
    }
  }

  return mixin(RoleGuardMixin);
};
