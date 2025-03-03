import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, IsBoolean } from 'class-validator';
import { FormDataTransformer } from 'src/utils/transformer/form-data.transformer';

export class CreateAnnouncementDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsBoolean()
  @Transform(FormDataTransformer)
  published: boolean;
}
