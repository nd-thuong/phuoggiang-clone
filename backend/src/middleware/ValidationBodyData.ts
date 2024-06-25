import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { Observable } from 'rxjs';
import { validate } from 'class-validator';
import { ClassConstructor } from 'class-transformer/types/interfaces';
@Injectable()
export class ValidationBodyData<T extends object> implements NestInterceptor {
  constructor(private dto: ClassConstructor<T>) {}
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const { body } = request;
    const data = plainToClass(this.dto, body);
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

    return next.handle();
  }
}
