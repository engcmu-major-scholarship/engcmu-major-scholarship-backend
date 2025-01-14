import {
  IsNumber,
  isNumberString,
  IsOptional,
  IsPositive,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateApplicationDto {
  @ApiProperty()
  @IsPositive()
  @IsNumber()
  @Transform(({ value }) => {
    if (isNumberString(value)) {
      return parseInt(value, 10);
    }
    return value;
  })
  scholarId: number;

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
  budget: number | null;
}
