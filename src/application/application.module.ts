import { Module } from '@nestjs/common';
import { ApplicationController } from './application.controller';
import { ApplicationService } from './application.service';
import { Application } from 'src/models/application.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Scholarship } from 'src/models/scholarship.entity';
import { Student } from 'src/models/student.entity';
import { Config } from 'src/models/config.entity';
import { S3Module } from 'src/s3/s3.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Application, Scholarship, Student, Config]),
    S3Module,
  ],
  controllers: [ApplicationController],
  providers: [ApplicationService],
})
export class ApplicationModule {}
