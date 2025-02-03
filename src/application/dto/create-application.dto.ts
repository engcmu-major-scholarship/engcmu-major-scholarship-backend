import { IsNumber, IsOptional, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { FormDataTransformer } from 'src/utils/transformer/form-data.transformer';

export class CreateApplicationDto {
  @ApiProperty()
  @IsPositive()
  @IsNumber()
  @Transform(FormDataTransformer)
  scholarId: number;

  @ApiProperty()
  @IsPositive()
  @IsNumber()
  @IsOptional()
  @Transform(FormDataTransformer)
  budget: number | null;
}
