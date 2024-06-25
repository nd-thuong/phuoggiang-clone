import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { RefreshToken } from './refresh-token.entity';
// import { ValidationMiddleware } from './exceptionFilter';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from '@/strategies/local.strategy';
import { JwtStrategy } from '@/strategies/jwt.strategy';
import { RefreshJwtStrategy } from '@/strategies/refresh-jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, RefreshToken]),
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, RefreshJwtStrategy],
})
export class AuthModule {
  // configure(consumer: MiddlewareConsumer) {
  //   consumer
  //     .apply(ValidationMiddleware)
  //     .forRoutes({ path: '/auth/register', method: RequestMethod.POST });
  // }
}
