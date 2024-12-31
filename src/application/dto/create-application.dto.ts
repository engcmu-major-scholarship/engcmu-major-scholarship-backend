import { IsIn, IsNumber, IsOptional, IsPositive, ValidateIf } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateApplicationDto {
  @IsNumber()
  @IsPositive()
  readonly scholar_id: number;

  @IsNumber()
  @IsPositive()
  readonly year: number;

  @IsIn(['1', '2'], {
    message: 'Semester must be one of the following: 1 or 2',
  })
  readonly semester: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  readonly budget?: number;

  // Not my bussiness
  @IsOptional()
  readonly doc: string;
  // readonly doc?: Express.Multer.File;
}