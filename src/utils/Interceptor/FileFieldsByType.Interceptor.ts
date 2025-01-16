import { NestInterceptor, Type } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import {
  MulterField,
  MulterOptions,
} from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { FileFields } from '../Types/FileFields';

export function FileFieldsByTypeInterceptor<T extends FileFields<T>>(
  fieldsConfig: FieldsOption<T>,
  localOptions?: MulterOptions,
): Type<NestInterceptor> {
  const fields: MulterField[] = [];
  for (const key in fieldsConfig) {
    fields.push({
      name: key,
      maxCount: fieldsConfig[key].maxCount,
    });
  }
  return FileFieldsInterceptor(fields, localOptions);
}

export type FieldsOption<T> = {
  [K in keyof T]: ValidateOptions;
};

export type FieldsOptionPartial<T> = {
  [K in keyof T]?: ValidateOptions;
};

export class ValidateOptions {
  maxCount: number;
}
