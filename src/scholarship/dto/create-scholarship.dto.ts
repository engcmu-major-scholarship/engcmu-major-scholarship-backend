import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';
import { FormDataTransformer } from 'src/utils/Tranformer/FormData.Tranformer';

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
