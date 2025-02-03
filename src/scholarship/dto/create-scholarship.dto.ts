import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { FormDataTransformer } from 'src/utils/transformer/form-data.transformer';

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
  @Transform(FormDataTransformer)
  defaultBudget: number | null;

  @ApiProperty()
  @IsDate()
  @Transform(FormDataTransformer)
  openDate: Date;

  @ApiProperty()
  @IsDate()
  @Transform(FormDataTransformer)
  closeDate: Date;

  @ApiProperty()
  @IsBoolean()
  @Transform(FormDataTransformer)
  published: boolean;
}
