import { Injectable } from '@nestjs/common';
import { CreateSettingDto } from './dto/create-setting.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Config } from 'src/models/config.entity';
import { Semester } from 'src/models/semester';
import { Year } from 'src/models/year.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SettingService {
  constructor(
    @InjectRepository(Config)
    private readonly configRepository: Repository<Config>,
    @InjectRepository(Semester)
    private readonly semesterRepository: Repository<Semester>,
    @InjectRepository(Year)
    private readonly yearRepository: Repository<Year>,
  ) {}

  async findCurrentYearSemester() {
    const config = await this.configRepository.findOneOrFail({
      where: {
        id: 1,
      },
      relations: {
        applySemester: { year: true },
      },
    });

    return {
      year: config.applySemester.year.year,
      semester: config.applySemester.semester,
    };
  }

  create(createSettingDto: CreateSettingDto) {
    return 'This action adds a new setting';
  }

  find() {
    return `This action returns all setting`;
  }

  findOne(id: number) {
    return `This action returns a #${id} setting`;
  }

  update(id: number, updateSettingDto: UpdateSettingDto) {
    return `This action updates a #${id} setting`;
  }

  remove(id: number) {
    return `This action removes a #${id} setting`;
  }
}
