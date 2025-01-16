import { TransformFnParams } from 'class-transformer';
import { isDateString } from 'class-validator';

export const FormDataTransformer = (params: TransformFnParams) => {
  const { value } = params;
  if (!value) return undefined;
  try {
    return JSON.parse(value);
  } catch {
    if (isDateString(value)) return new Date(value);
    return value;
  }
};
