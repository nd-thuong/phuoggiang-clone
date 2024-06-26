import { Request } from 'express';
import { UserEntity } from './user.entity';

export interface RequestWithUser<T = UserEntity> extends Request {
  user: T;
}
