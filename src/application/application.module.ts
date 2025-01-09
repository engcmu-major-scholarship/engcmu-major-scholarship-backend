import { Module } from '@nestjs/common';
import { ApplicationController } from './application.controller';
import { ApplicationService } from './application.service';
import { Application } from 'src/models/application.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Scholarship } from 'src/models/scholarship.entity';
import { Student } from 'src/models/student.entity';
import { Config } from 'src/models/config.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Application, Scholarship, Student, Config]),
  ],
  controllers: [ApplicationController],
  providers: [ApplicationService],
})
export class ApplicationModule {}
