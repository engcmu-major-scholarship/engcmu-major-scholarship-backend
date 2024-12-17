import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request as ExpressRequest } from 'express';
import { SignupDTO } from './dtos/signup.dto';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { TokenPayload } from './types/TokenPayload';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('signin')
  async googleSignin(@Request() req: ExpressRequest) {
    return this.authService.googleSignin(req['user'] as TokenPayload);
  }

  @Post('signup')
  async googleSignup(@Body() body: SignupDTO) {
    return this.authService.googleSignup(body.accessToken, body.citizenId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('resolve-token')
  async resolveToken(@Request() req: ExpressRequest) {
    return req['user'];
  }
}
