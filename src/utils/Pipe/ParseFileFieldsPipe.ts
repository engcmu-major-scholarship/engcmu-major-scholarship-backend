import { BadRequestException, PipeTransform } from '@nestjs/common';

export class ParseFileFieldsPipe<
  T extends Record<string, Array<Express.Multer.File>>,
  R extends T = T,
> implements PipeTransform<T, R>
{
  constructor(private readonly fieldsPattern: FieldsPattern<T>) {}

  transform(value: T): R {
    const fields = Object.keys(this.fieldsPattern);
    for (const fieldName of fields) {
      const fieldKey = fieldName as keyof T;
      const validateOptions = this.fieldsPattern[fieldKey];
      const fieldValue = value[fieldKey];

      if (validateOptions.required && !fieldValue) {
        throw new BadRequestException(`Field ${fieldName} is required`);
      }

      if (!fieldValue) {
        continue;
      }

      if (
        validateOptions.minCount &&
        fieldValue.length < validateOptions.minCount
      ) {
        throw new BadRequestException(
          `Field ${fieldName} should have at least ${validateOptions.minCount} files`,
        );
      }

      if (
        validateOptions.itemCount &&
        fieldValue.length !== validateOptions.itemCount
      ) {
        throw new BadRequestException(
          `Field ${fieldName} should have exactly ${validateOptions.itemCount} files`,
        );
      }

      if (
        validateOptions.maxCount &&
        fieldValue.length > validateOptions.maxCount
      ) {
        throw new BadRequestException(
          `Field ${fieldName} should have at most ${validateOptions.maxCount} files`,
        );
      }

      if (validateOptions.type) {
        if (validateOptions.type instanceof RegExp) {
          for (const file of fieldValue) {
            if (!validateOptions.type.test(file.mimetype)) {
              throw new BadRequestException(
                `Field ${fieldName} must be of type ${validateOptions.type}`,
              );
            }
          }
        } else {
          for (const file of fieldValue) {
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
  itemCount?: number;
  maxCount?: number;
};
