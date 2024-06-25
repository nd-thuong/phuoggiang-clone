import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  ValidationOptions,
  registerDecorator,
} from 'class-validator';

@ValidatorConstraint({ name: 'regexPassword', async: false })
class PasswordWithRegex implements ValidatorConstraintInterface {
  validate(password: string, args: ValidationArguments) {
    // Regular expression for password validation
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()\-_=+{};:,<.>]).{7,}$/;
    return regex.test(password);
  }

  defaultMessage(args: ValidationArguments) {
    return 'Password is not in valid format';
  }
}

export function PasswordValidator(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'regexPassword',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: PasswordWithRegex,
    });
  };
}
