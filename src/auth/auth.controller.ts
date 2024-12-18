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
import { JwtAuthGuard } from './jwt-auth.guard';
import { SigninDTO } from './dtos/signin.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  async googleSignin(@Body() body: SigninDTO) {
    return this.authService.googleSignin(body.accessToken);
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
