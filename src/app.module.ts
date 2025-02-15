import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { S3Module } from './s3/s3.module';
import { ScholarshipModule } from './scholarship/scholarship.module';
import { ApplicationModule } from './application/application.module';
import { SettingModule } from './setting/setting.module';
import { StudentModule } from './student/student.module';
import { AdvisorModule } from './advisor/advisor.module';
import { InformationModule } from './information/information.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        synchronize: true,
        autoLoadEntities: true,
        timezone: 'Z',
      }),
    }),
    S3Module.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        endpoint: configService.get<string>('S3_ENDPOINT'),
        region: configService.get<string>('S3_REGION'),
        credentials: {
          accessKeyId: configService.get<string>('S3_ACCESS_KEY_ID'),
          secretAccessKey: configService.get<string>('S3_SECRET_ACCESS_KEY'),
        },
        forcePathStyle: true,
      }),
    }),
    AuthModule,
    ScholarshipModule,
    ApplicationModule,
    SettingModule,
    StudentModule,
    AdvisorModule,
    InformationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
