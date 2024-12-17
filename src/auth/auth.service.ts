import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { GoogleUserInfo } from './types/GoogleUserInfo';
import { Repository } from 'typeorm';
import { Users } from 'src/models/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { TokenPayload } from './types/TokenPayload';
import { Role } from './types/Role';

@Injectable()
export class AuthService {
  constructor(
    private readonly httpService: HttpService,
    private readonly jwtService: JwtService,
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
  ) {}

  async validateUser(token: string) {
    const googleUserInfo = await this.getGoogleUserInfo(token);
    const user = await this.usersRepository.findOne({
      where: {
        google_account: googleUserInfo.email,
      },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return {
      sub: user.user_id,
      googleAccount: user.google_account,
      roles: [Role.STUDENT],
    } as TokenPayload;
  }

  async googleSignin(user: TokenPayload) {
    return this.jwtService.sign(user);
  }

  async googleSignup(token: string, citizenId: string) {
    const googleUserInfo = await this.getGoogleUserInfo(token);
    const user = this.usersRepository.create({
      google_account: googleUserInfo.email,
      citizen_id: citizenId,
    });
    const newUser = await this.usersRepository.save(user);
    return this.jwtService.sign({
      sub: newUser.user_id,
      googleAccount: newUser.google_account,
      roles: [Role.STUDENT],
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
