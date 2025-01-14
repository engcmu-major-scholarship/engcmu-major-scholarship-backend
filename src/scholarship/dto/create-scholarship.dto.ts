import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  isBooleanString,
  IsDate,
  isDateString,
  IsNotEmpty,
  IsNumber,
  isNumberString,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreateScholarshipDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  requirement: string;

  @ApiProperty()
  @IsPositive()
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'null') {
      return null;
    }
    if (isNumberString(value)) {
      return parseInt(value, 10);
    }
    return value;
  })
  defaultBudget?: number;

  @ApiProperty()
  @IsDate()
  @Transform(({ value }) => {
    if (isDateString(value)) {
      return new Date(value);
    }
    return value;
  })
  openDate: Date;

  @ApiProperty()
  @IsDate()
  @Transform(({ value }) => {
    if (isDateString(value)) {
      return new Date(value);
    }
    return value;
  })
  closeDate: Date;

  @ApiProperty()
  @IsBoolean()
  @Transform(({ value }) => {
    if (isBooleanString(value)) {
      return value === 'true';
    }
    return value;
  })
  published: boolean;
}
