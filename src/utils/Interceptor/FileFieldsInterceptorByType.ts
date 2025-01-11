import { NestInterceptor, Type } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import {
  MulterField,
  MulterOptions,
} from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

export function FileFieldsInterceptorByType<
  T extends Record<string, Array<Express.Multer.File>>,
>(
  fieldsConfig: FieldsOption<T>,
  localOptions?: MulterOptions,
): Type<NestInterceptor> {
  const fields = Object.keys(fieldsConfig);
  return FileFieldsInterceptor(
    fields.map(
      (field) =>
        ({
          name: field,
          maxCount: fieldsConfig[field as keyof T].maxCount,
        }) as MulterField,
    ),
    localOptions,
  );
}

export type FieldsOption<T> = {
  [K in keyof T]: ValidateOptions;
};

export type ValidateOptions = {
  maxCount: number;
};
