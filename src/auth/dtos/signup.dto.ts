import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, ValidateBy } from 'class-validator';

export class SignupDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  accessToken: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @ValidateBy({
    name: 'thaiIdCheck',
    validator: {
      validate: (value: string) => {
        if (value.length !== 13) {
          return false;
        }
        let sum = 0;
        for (let i = 0; i < 12; i++) {
          sum += parseInt(value.charAt(i), 10) * (13 - i);
        }
        sum = (11 - (sum % 11)) % 10;
        if (sum !== parseInt(value.charAt(12), 10)) {
          return false;
        }
        return true;
      },
    },
  })
  citizenId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;
}
