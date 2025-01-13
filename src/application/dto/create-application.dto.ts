import { IsNumber, IsOptional, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateApplicationDto {
  @ApiProperty()
  @IsNumber()
  @IsPositive()
  scholarId: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @IsPositive()
  budget?: number;
}
