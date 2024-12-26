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
        googleAccount: googleUserInfo.email,
      },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.jwtService.sign({
      sub: user.id,
      googleAccount: user.googleAccount,
      roles: [],
    } as TokenPayload);
  }

  async googleSignup(data: SignupDTO) {
    const googleUserInfo = await this.getGoogleUserInfo(data.accessToken);
    const user = this.usersRepository.create({
      citizenID: data.citizenId,
      googleAccount: googleUserInfo.email,
      contactEmail: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      phoneNumber: data.phoneNumber,
    });
    const newUser = await this.usersRepository.save(user);
    return this.jwtService.sign({
      sub: newUser.id,
      googleAccount: newUser.googleAccount,
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
