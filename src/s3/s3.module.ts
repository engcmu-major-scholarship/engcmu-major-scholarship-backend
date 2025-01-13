import { DynamicModule, Module } from '@nestjs/common';
import { S3CoreModule } from './s3.core-module';
import { S3_ASYNC_OPTIONS_TYPE, S3_OPTIONS_TYPE } from './s3.module-definition';

@Module({})
export class S3Module {
  static forRoot(options: typeof S3_OPTIONS_TYPE): DynamicModule {
    return {
      imports: [S3CoreModule.forRoot(options)],
      module: S3Module,
      exports: [S3CoreModule],
    };
  }

  static forRootAsync(options: typeof S3_ASYNC_OPTIONS_TYPE): DynamicModule {
    return {
      imports: [S3CoreModule.forRootAsync(options)],
      module: S3Module,
      exports: [S3CoreModule],
    };
  }
}
