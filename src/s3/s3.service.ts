import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
  S3ClientConfig,
} from '@aws-sdk/client-s3';
import { Inject, Injectable } from '@nestjs/common';
import { S3_MODULE_OPTIONS_TOKEN } from './s3.module-definition';
import { MetadataBearer } from '@aws-sdk/types';
import { Readable } from 'stream';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class S3Service {
  private static s3: S3Client;

  constructor(
    @Inject(S3_MODULE_OPTIONS_TOKEN)
    options: S3ClientConfig,
  ) {
    S3Service.s3 = new S3Client(options);
  }

  async uploadFile(
    bucket: string,
    key: string,
    body: Buffer | Readable,
    contentType: string,
  ): Promise<MetadataBearer> {
    return await S3Service.s3.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: body,
        ContentType: contentType,
      }),
    );
  }

  async getFileUrl(
    bucket: string,
    key: string,
    expiresIn = 3600,
  ): Promise<string> {
    return await getSignedUrl(
      S3Service.s3,
      new GetObjectCommand({ Bucket: bucket, Key: key }),
      { expiresIn },
    );
  }

  async deleteFile(bucket: string, key: string): Promise<MetadataBearer> {
    return await S3Service.s3.send(
      new DeleteObjectCommand({
        Bucket: bucket,
        Key: key,
      }),
    );
  }
}
