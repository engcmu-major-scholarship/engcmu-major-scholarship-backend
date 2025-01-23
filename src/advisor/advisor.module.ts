import { Module } from '@nestjs/common';
import { AdvisorService } from './advisor.service';
import { AdvisorController } from './advisor.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Advisor } from 'src/models/advisor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Advisor])],
  controllers: [AdvisorController],
  providers: [AdvisorService],
})
export class AdvisorModule {}
