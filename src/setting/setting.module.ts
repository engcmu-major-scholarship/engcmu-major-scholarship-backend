import { Module } from '@nestjs/common';
import { SettingService } from './setting.service';
import { SettingController } from './setting.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Config } from 'src/models/config.entity';
import { Semester } from 'src/models/semester';
import { Year } from 'src/models/year.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Config, Semester, Year])],
  controllers: [SettingController],
  providers: [SettingService],
})
export class SettingModule {}
