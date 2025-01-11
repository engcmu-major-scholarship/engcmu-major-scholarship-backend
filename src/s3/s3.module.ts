import { Module } from '@nestjs/common';
import { S3Service } from './s3.service';
import { S3ConfigurableModuleClass } from './s3.module-definition';

@Module({
  providers: [S3Service],
  exports: [S3Service],
})
export class S3Module extends S3ConfigurableModuleClass {}
