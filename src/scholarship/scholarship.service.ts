import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateScholarshipDto } from './dto/create-scholarship.dto';
import { UpdateScholarshipDto } from './dto/update-scholarship.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Scholarship } from 'src/models/scholarship.entity';
import { Repository } from 'typeorm';
import { S3Service } from 'src/s3/s3.service';
import { CreateScholarshipFilesDto } from './dto/create-scholarship-files.dto';
import { UpdateScholarshipFilesDto } from './dto/update-scholarship-files.dto';

@Injectable()
export class ScholarshipService {
  constructor(
    private readonly s3Service: S3Service,
    @InjectRepository(Scholarship)
    private readonly scholarshipRepository: Repository<Scholarship>,
  ) {}

  async create(
    createScholarshipDto: CreateScholarshipDto,
    files: CreateScholarshipFilesDto,
  ) {
    if (
      await this.scholarshipRepository.existsBy({
        name: createScholarshipDto.name,
      })
    ) {
      throw new UnprocessableEntityException('Scholarship already exists');
    }

    const scholarDocKey = createScholarshipDto.name;
    this.s3Service.uploadFile(
      'major-scholar-scholar-doc',
      scholarDocKey,
      files.scholarDoc[0].buffer,
      files.scholarDoc[0].mimetype,
    );
    const scholarAppDocKey = createScholarshipDto.name;
    this.s3Service.uploadFile(
      'major-scholar-app-doc-template',
      scholarAppDocKey,
      files.appDoc[0].buffer,
      files.appDoc[0].mimetype,
    );

    const scholarship = this.scholarshipRepository.create({
      name: createScholarshipDto.name,
      description: createScholarshipDto.description,
      requirement: createScholarshipDto.requirement,
      amount: createScholarshipDto.defaultBudget,
      openDate: createScholarshipDto.openDate,
      closeDate: createScholarshipDto.closeDate,
      detailDocument: scholarDocKey,
      applicationDocument: scholarDocKey,
      published: createScholarshipDto.published,
    });
    await this.scholarshipRepository.save(scholarship);
  }

  async findAll() {
    const scholarships = await this.scholarshipRepository.findBy({
      published: true,
    });
    return scholarships.map((scholarship) => ({
      id: scholarship.id,
      name: scholarship.name,
      description: scholarship.description,
    }));
  }

  async findOne(id: number) {
    const scholarship = await this.scholarshipRepository.findOneBy({
      id,
      published: true,
    });

    if (!scholarship) {
      throw new NotFoundException('Scholarship not found');
    }

    return {
      name: scholarship.name,
      description: scholarship.description,
      requirement: scholarship.requirement,
      defaultBudget: scholarship.amount,
      openDate: scholarship.openDate,
      closeDate: scholarship.closeDate,
      docLink: await this.s3Service.getFileUrl(
        'major-scholar-scholar-doc',
        scholarship.detailDocument,
      ),
      appDocLink: await this.s3Service.getFileUrl(
        'major-scholar-app-doc',
        scholarship.applicationDocument,
      ),
    };
  }

  async update(
    id: number,
    updateScholarshipDto: UpdateScholarshipDto,
    files: UpdateScholarshipFilesDto,
  ) {
    const scholarship = await this.scholarshipRepository.findOneBy({
      id,
    });

    if (!scholarship) {
      throw new NotFoundException('Scholarship not found');
    }

    if (files.scholarDoc) {
      const scholarDocKey = scholarship.detailDocument;
      this.s3Service.uploadFile(
        'major-scholar-scholar-doc',
        scholarDocKey,
        files.scholarDoc[0].buffer,
        files.scholarDoc[0].mimetype,
      );
    }
    if (files.appDoc) {
      const scholarAppDocKey = scholarship.applicationDocument;
      this.s3Service.uploadFile(
        'major-scholar-app-doc',
        scholarAppDocKey,
        files.appDoc[0].buffer,
        files.appDoc[0].mimetype,
      );
    }

    await this.scholarshipRepository.update(id, updateScholarshipDto);
  }

  remove(id: number) {
    return `This action removes a #${id} scholarship`;
  }
}
