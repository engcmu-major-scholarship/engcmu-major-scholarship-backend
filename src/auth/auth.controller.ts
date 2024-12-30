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
import { JwtAuthGuard } from './jwt-auth.guard';
import { SigninDTO } from './dtos/signin.dto';
import { Public } from 'src/decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('signin')
  async signin(@Body() body: SigninDTO) {
    const token = await this.authService.requestToken(
      body.authorizationCode,
      body.redirectUri,
    );
    return this.authService.signin(token);
  }

  @UseGuards(JwtAuthGuard)
  @Get('resolve-token')
  async resolveToken(@Request() req: ExpressRequest) {
    return req['user'];
  }
}
