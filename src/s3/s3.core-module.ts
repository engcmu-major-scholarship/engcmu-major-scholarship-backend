import { Global, Module } from '@nestjs/common';
import { S3Service } from './s3.service';
import { S3_SERVICE_TOKEN } from './s3.constants';
import { S3_MODULE_OPTIONS_TOKEN } from './s3.module-definition';

@Global()
@Module({
  providers: [
    {
      provide: S3_SERVICE_TOKEN,
      useClass: S3Service,
    },
  ],
  exports: [S3_SERVICE_TOKEN, S3_MODULE_OPTIONS_TOKEN],
})
export class S3CoreModule {}
