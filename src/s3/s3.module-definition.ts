import { S3ClientConfig } from '@aws-sdk/client-s3';
import { ConfigurableModuleBuilder } from '@nestjs/common';

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<S3ClientConfig>()
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
