import { S3ClientConfig } from '@aws-sdk/client-s3';
import { ConfigurableModuleBuilder } from '@nestjs/common';

export const {
  ConfigurableModuleClass: S3ConfigurableModuleClass,
  MODULE_OPTIONS_TOKEN: S3_MODULE_OPTIONS_TOKEN,
  ASYNC_OPTIONS_TYPE: S3_ASYNC_OPTIONS_TYPE,
  OPTIONS_TYPE: S3_OPTIONS_TYPE,
} = new ConfigurableModuleBuilder<S3ClientConfig>({
  moduleName: 'S3',
})
  .setClassMethodName('forRoot')
  .setExtras(
    {
      isGlobal: false,
    },
    (definition, extras) => ({
      ...definition,
      global: extras.isGlobal,
    }),
  )
  .build();
