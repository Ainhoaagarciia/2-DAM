import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsYouTubeUrl(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isYouTubeUrl',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          return typeof value === 'string' &&
            /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//.test(value);
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} debe ser una URL válida de YouTube.`;
        }
      }
    });
  };
}