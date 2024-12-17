import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SigninDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  accessToken: string;
}
