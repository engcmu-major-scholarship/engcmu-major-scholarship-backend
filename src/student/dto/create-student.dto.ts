import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber } from 'class-validator';
import { FormDataTransformer } from 'src/utils/Tranformer/FormData.Tranformer';

export class CreateStudentDto {
  @ApiProperty()
  @IsNumber()
  @Transform(FormDataTransformer)
  advisorId: number;
}
