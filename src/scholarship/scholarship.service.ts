import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateScholarshipDto } from './dto/create-scholarship.dto';
import { UpdateScholarshipDto } from './dto/update-scholarship.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Scholarship } from 'src/models/scholarship.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ScholarshipService {
  constructor(
    @InjectRepository(Scholarship)
    private readonly scholarshipRepository: Repository<Scholarship>,
  ) { }

  create(createScholarshipDto: CreateScholarshipDto) {
    try {
      const newScholarship = this.scholarshipRepository.create({
        name: createScholarshipDto.name,
        description: createScholarshipDto.description,
        requirements: createScholarshipDto.requirement,
        amount: createScholarshipDto.defaultBudget,
        detailDocument: createScholarshipDto.scholarDoc,
        applicationDocument: createScholarshipDto.appDoc,
        published: createScholarshipDto.published,
      });
      return this.scholarshipRepository.save(newScholarship);
    } catch (error) {
      throw new InternalServerErrorException('Error in creating scholarship');
    }
  }

  findAll() {
    return `This action returns all scholarship`;
  }

  findOne(id: number) {
    return `This action returns a #${id} scholarship`;
  }

  update(id: number, updateScholarshipDto: UpdateScholarshipDto) {
    return `This action updates a #${id} scholarship`;
  }

  remove(id: number) {
    return `This action removes a #${id} scholarship`;
  }
}
