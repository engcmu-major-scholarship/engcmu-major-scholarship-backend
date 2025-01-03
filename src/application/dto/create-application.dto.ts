import { IsIn, IsNumber, IsOptional, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateApplicationDto {
  @ApiProperty()
  @IsNumber()
  @IsPositive()
  scholarId: number;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  year: number;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  @IsIn([1, 2, 3], {
    message: 'Semester must be one of the following: 1 to 3',
  })
  semester: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  budget?: number;

  @ApiProperty()
  @IsOptional()
  doc: string;
}
