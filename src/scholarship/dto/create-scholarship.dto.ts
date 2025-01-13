import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDate,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreateScholarshipDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsString()
  requirement: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @IsPositive()
  defaultBudget?: number;

  @ApiProperty()
  @IsDate()
  openDate: Date;

  @ApiProperty()
  @IsDate()
  closeDate: Date;

  @ApiProperty()
  @IsBoolean()
  published: boolean;
}
