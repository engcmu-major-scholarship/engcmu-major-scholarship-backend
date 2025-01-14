import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SigninDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  authorizationCode: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  redirectUri: string;
}
