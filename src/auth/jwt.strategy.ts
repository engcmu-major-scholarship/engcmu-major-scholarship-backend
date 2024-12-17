import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TokenPayload } from './types/TokenPayload';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/models/users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: TokenPayload) {
    if (
      !(await this.usersRepository.exists({ where: { user_id: payload.sub } }))
    ) {
      return;
    }
    return {
      sub: payload.sub,
      googleAccount: payload.googleAccount,
      roles: payload.roles,
    } as TokenPayload;
  }
}
