import { validate as isUUID } from 'uuid';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  registerDecorator,
  ValidationOptions,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsUUIDOrNullConstraint implements ValidatorConstraintInterface {
  validate(value: null | string) {
    if (value === null) return true;
    return typeof value === 'string' && isUUID(value);
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return `${validationArguments.property} must be a valid UUID or null`;
  }
}

export function IsUUIDOrNull(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: IsUUIDOrNullConstraint,
    });
  };
}
