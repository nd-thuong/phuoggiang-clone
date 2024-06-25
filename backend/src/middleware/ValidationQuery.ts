import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ClassConstructor, plainToClass } from 'class-transformer';
import { Observable } from 'rxjs';
import { validate } from 'class-validator';

@Injectable()
export class ValidationQuery<T extends object> implements NestInterceptor {
  constructor(private dataQuery: ClassConstructor<T>) {}
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const { query } = request;
    const data = plainToClass(this.dataQuery, query);
    const errors = await validate(data);
    if (errors.length > 0) {
      const validationErrors = errors.map((error) =>
        Object.values(error.constraints),
      );
      throw new HttpException(
        {
          message: 'Validation failed',
          errors: validationErrors,
          statusCode: HttpStatus.BAD_REQUEST,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    return next.handle();
  }
}
