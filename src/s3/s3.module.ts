import { Module } from '@nestjs/common';
import { S3Service } from './s3.service';
import {
  S3_MODULE_OPTIONS_TOKEN,
  S3ConfigurableModuleClass,
} from './s3.module-definition';
import { ConfigModule, ConfigService } from '@nestjs/config';

// TODO: Fix this module to use configuration from app module
@Module({
  imports: [ConfigModule],
  providers: [
    S3Service,
    {
      provide: S3_MODULE_OPTIONS_TOKEN,
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
    },
  ],
  exports: [S3Service],
})
export class S3Module extends S3ConfigurableModuleClass {}
