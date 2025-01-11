import { BadRequestException, PipeTransform } from '@nestjs/common';

export class ParseFileFieldsPipe<
  T extends Record<string, Express.Multer.File[]>,
  R extends T = T,
> implements PipeTransform<T, R>
{
  constructor(private readonly fields: FieldsPattern<T>) {}

  transform(value: T): R {
    for (const fieldName in this.fields) {
      if (value[fieldName] === undefined) {
        continue;
      }

      const validateOptions = this.fields[fieldName];
      if (validateOptions.required && !value[fieldName].length) {
        throw new BadRequestException(`Field ${fieldName} is required`);
      }
      if (
        validateOptions.minCount &&
        value[fieldName].length < validateOptions.minCount
      ) {
        throw new BadRequestException(
          `Field ${fieldName} should have at least ${validateOptions.minCount} files`,
        );
      }
      if (
        validateOptions.maxCount &&
        value[fieldName].length > validateOptions.maxCount
      ) {
        throw new BadRequestException(
          `Field ${fieldName} should have at most ${validateOptions.maxCount} files`,
        );
      }
      if (validateOptions.type) {
        if (validateOptions.type instanceof RegExp) {
          for (const file of value[fieldName]) {
            if (!validateOptions.type.test(file.mimetype)) {
              throw new BadRequestException(
                `Field ${fieldName} must be of type ${validateOptions.type}`,
              );
            }
          }
        } else {
          for (const file of value[fieldName]) {
            if (file.mimetype !== validateOptions.type) {
              throw new BadRequestException(
                `Field ${fieldName} must be of type ${validateOptions.type}`,
              );
            }
          }
        }
      }
    }
    return value as R;
  }
}

export type FieldsPattern<T = any> = {
  [K in keyof T]?: ValidateOptions;
};

export type ValidateOptions = {
  type?: string | RegExp;
  required?: boolean;
  minCount?: number;
  maxCount?: number;
};
