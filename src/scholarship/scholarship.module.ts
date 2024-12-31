import { Module } from '@nestjs/common';
import { ScholarshipService } from './scholarship.service';
import { ScholarshipController } from './scholarship.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Scholarship } from 'src/models/scholarship.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Scholarship])],
  controllers: [ScholarshipController],
  providers: [ScholarshipService],
})
export class ScholarshipModule { }
