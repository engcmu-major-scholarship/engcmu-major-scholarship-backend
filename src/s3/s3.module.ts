import { DynamicModule, Module } from '@nestjs/common';
import { S3CoreModule } from './s3.core-module';
import {
  S3_ASYNC_OPTIONS_TYPE,
  S3_MODULE_OPTIONS_TOKEN,
  S3_OPTIONS_TYPE,
} from './s3.module-definition';
import { S3Service } from './s3.service';
import { S3_SERVICE_TOKEN } from './s3.constants';

@Module({
  imports: [S3CoreModule],
  providers: [
    {
      provide: S3Service,
      useExisting: S3_SERVICE_TOKEN,
    },
  ],
  exports: [S3CoreModule, S3Service],
})
export class S3Module {
  static forRoot(options: typeof S3_OPTIONS_TYPE): DynamicModule {
    return {
      module: S3CoreModule,
      global: options.isGlobal,
      providers: [
        {
          provide: S3_MODULE_OPTIONS_TOKEN,
          useValue: options,
        },
      ],
      exports: [S3CoreModule],
    };
  }

  static forRootAsync(options: typeof S3_ASYNC_OPTIONS_TYPE): DynamicModule {
    return {
      imports: options.imports,
      module: S3CoreModule,
      global: options.isGlobal,
      providers: [
        {
          provide: S3_MODULE_OPTIONS_TOKEN,
          useFactory: options.useFactory,
          inject: options.inject,
        },
      ],
      exports: [S3CoreModule],
    };
  }
}
