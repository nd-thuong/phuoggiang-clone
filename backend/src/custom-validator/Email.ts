import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  ValidationOptions,
  registerDecorator,
} from 'class-validator';

@ValidatorConstraint({ name: 'isEmailWithRegex', async: false })
class IsEmailWithRegex implements ValidatorConstraintInterface {
  validate(email: string, args: ValidationArguments) {
    // Regular expression for email validation
    const regex = /^[a-zA-Z0-9_]+@gmail\.com$/;
    return regex.test(email);
  }

  defaultMessage(args: ValidationArguments) {
    return 'Email is not in valid format';
  }
}

export function EmailValidator(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isEmailWithRegex',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: IsEmailWithRegex,
    });
  };
}
