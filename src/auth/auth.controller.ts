import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { SigninDTO } from './dto/signin.dto';
import { Public } from 'src/decorators/public.decorator';
import { User } from 'src/decorators/user.decorator';
import { TokenPayload } from './types/TokenPayload';

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
  async resolveToken(@User() user: TokenPayload) {
    return user;
  }
}
