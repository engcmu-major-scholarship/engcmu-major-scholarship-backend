import { BadRequestException, PipeTransform } from '@nestjs/common';
import { FileFields } from '../Types/FileFields';

export class ParseFileFieldsPipe<T extends FileFields<T>, R extends T = T>
  implements PipeTransform<T, R>
{
  constructor(private readonly fieldsPattern: FieldsPattern<T>) {}

  transform(value: T): R {
    if (!value) {
      throw new BadRequestException('No files provided');
    }
    for (const key in this.fieldsPattern) {
      const validateOptions = this.fieldsPattern[key];
      const fieldValue = value[key];

      if (validateOptions.required && !fieldValue) {
        throw new BadRequestException(`Field ${key} is required`);
      }

      if (!fieldValue) {
        continue;
      }

      if (
        validateOptions.minCount &&
        fieldValue.length < validateOptions.minCount
      ) {
        throw new BadRequestException(
          `Field ${key} should have at least ${validateOptions.minCount} files`,
        );
      }

      if (
        validateOptions.itemCount &&
        fieldValue.length !== validateOptions.itemCount
      ) {
        throw new BadRequestException(
          `Field ${key} should have exactly ${validateOptions.itemCount} files`,
        );
      }

      if (
        validateOptions.maxCount &&
        fieldValue.length > validateOptions.maxCount
      ) {
        throw new BadRequestException(
          `Field ${key} should have at most ${validateOptions.maxCount} files`,
        );
      }

      if (validateOptions.type) {
        if (validateOptions.type instanceof RegExp) {
          for (const file of fieldValue) {
            if (!validateOptions.type.test(file.mimetype)) {
              throw new BadRequestException(
                `Field ${key} must be of type ${validateOptions.type}`,
              );
            }
          }
        } else {
          for (const file of fieldValue) {
            if (file.mimetype !== validateOptions.type) {
              throw new BadRequestException(
                `Field ${key} must be of type ${validateOptions.type}`,
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

export class ValidateOptions {
  type?: string | RegExp;
  required?: boolean;
  minCount?: number;
  itemCount?: number;
  maxCount?: number;
}
