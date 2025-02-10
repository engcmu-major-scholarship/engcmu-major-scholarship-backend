import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateInformationDto } from './dto/create-information.dto';
import { UpdateInformationDto } from './dto/update-information.dto';
import { S3Service } from 'src/s3/s3.service';
import { Information } from 'src/models/information.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateInformationFilesDto } from './dto/create-information-files.dto';
import { UpdateInformationFilesDto } from './dto/update-information-files.dto';
import { isNotEmptyObject } from 'class-validator';

@Injectable()
export class InformationService {
  constructor(
    private readonly s3Service: S3Service,
    @InjectRepository(Information)
    private readonly informationRepository: Repository<Information>,
  ) {}

  async create(
    createInformationDto: CreateInformationDto,
    files: CreateInformationFilesDto,
  ) {
    if (
      await this.informationRepository.existsBy({
        name: createInformationDto.name,
      })
    ) {
      throw new UnprocessableEntityException('Information already exists');
    }

    const informationDocKey = createInformationDto.name;

    const information = this.informationRepository.create({
      name: createInformationDto.name,
      description: createInformationDto.description,
      detailDocument: informationDocKey,
      published: createInformationDto.published,
    });
    await this.informationRepository.save(information);

    await this.s3Service.uploadFile(
      'major-scholar-information-doc',
      informationDocKey,
      files.informationDoc[0].buffer,
      files.informationDoc[0].mimetype,
    );
  }

  findAll() {
    return `This action returns all information`;
  }

  findOne(id: number) {
    return `This action returns a #${id} information`;
  }

  async update(
    id: number,
    updateInformationDto: UpdateInformationDto,
    files: UpdateInformationFilesDto,
  ) {
    const information = await this.informationRepository.findOneBy({
      id,
    });

    if (!information) {
      throw new NotFoundException('Information not found');
    }

    const informationDocKey = information.detailDocument;
    if (isNotEmptyObject(updateInformationDto)) {
      await this.informationRepository.update(id, {
        name: updateInformationDto.name,
        description: updateInformationDto.description,
        published: updateInformationDto.published,
      });
    } else {
      if (!files) throw new UnprocessableEntityException('No data to update');
    }

    if (files.informationDoc) {
      await this.s3Service.uploadFile(
        'major-scholar-information-doc',
        informationDocKey,
        files.informationDoc[0].buffer,
        files.informationDoc[0].mimetype,
      );
    }
  }

  remove(id: number) {
    return `This action removes a #${id} information`;
  }
}
