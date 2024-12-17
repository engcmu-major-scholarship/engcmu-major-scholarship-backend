import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from './auth.service';
import { TokenPayload } from './types/TokenPayload';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'accessToken',
      passwordField: 'accessToken',
    });
  }

  async validate(username: string): Promise<TokenPayload> {
    return await this.authService.validateUser(username);
  }
}
