import { IsNumber, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateApplicationDto {
  @ApiProperty()
  @IsNumber()
  @IsPositive()
  scholarId: number;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  budget: number | null;
}
