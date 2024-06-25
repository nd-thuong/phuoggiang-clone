import {
  Injectable,
  NestMiddleware,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { RegisterDto } from './user.dto';

@Injectable()
export class ValidationMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    const { body } = req;
    const productTypeDto = plainToClass(RegisterDto, body);
    const errors = await validate(productTypeDto);
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
    next();
  }
}
