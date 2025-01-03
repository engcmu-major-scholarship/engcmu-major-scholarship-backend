import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

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
  defaultBudget?: number;

  @ApiProperty()
  @IsBoolean()
  published: boolean;
}
