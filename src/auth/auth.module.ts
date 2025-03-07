import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { HttpModule } from '@nestjs/axios';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/models/user.entity';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './roles.guard';
import { Student } from 'src/models/student.entity';
import { Advisor } from 'src/models/advisor.entity';
import { Admin } from 'src/models/admin.entity';

@Module({
  imports: [
    HttpModule,
    ConfigModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '3h' },
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([User, Student, Advisor, Admin]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AuthModule {}
