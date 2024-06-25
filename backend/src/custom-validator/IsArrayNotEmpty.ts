import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: true })
export class IsArrayNotEmptyConstraint implements ValidatorConstraintInterface {
  validate(value: any[], args: ValidationArguments) {
    return Array.isArray(value) && value.length > 0;
  }

  defaultMessage(args: ValidationArguments) {
    return '$property must not be empty';
  }
}

export function IsArrayNotEmpty(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsArrayNotEmptyConstraint,
    });
  };
}
