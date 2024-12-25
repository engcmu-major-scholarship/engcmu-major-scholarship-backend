import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { GoogleUserInfo } from './types/GoogleUserInfo';
import { Repository } from 'typeorm';
import { User } from 'src/models/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { TokenPayload } from './types/TokenPayload';
import { SignupDTO } from './dtos/signup.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly httpService: HttpService,
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async googleSignin(token: string) {
    const googleUserInfo = await this.getGoogleUserInfo(token);
    const user = await this.usersRepository.findOne({
      where: {
        google_account: googleUserInfo.email,
      },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.jwtService.sign({
      sub: user.id,
      googleAccount: user.google_account,
      roles: [],
    } as TokenPayload);
  }

  async googleSignup(data: SignupDTO) {
    const googleUserInfo = await this.getGoogleUserInfo(data.accessToken);
    const user = this.usersRepository.create({
      citizen_id: data.citizenId,
      google_account: googleUserInfo.email,
      contact_email: data.email,
      first_name: data.firstName,
      last_name: data.lastName,
      phone_number: data.phoneNumber,
    });
    const newUser = await this.usersRepository.save(user);
    return this.jwtService.sign({
      sub: newUser.id,
      googleAccount: newUser.google_account,
      roles: [],
    } as TokenPayload);
  }

  async getGoogleUserInfo(token: string) {
    try {
      return (
        await this.httpService.axiosRef.get<GoogleUserInfo>(
          'https://www.googleapis.com/oauth2/v1/userinfo',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )
      ).data;
    } catch {
      throw new BadRequestException('Invalid access token');
    }
  }
}
