import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Information } from 'src/models/information.entity';
import { S3Service } from 'src/s3/s3.service';
import { Repository } from 'typeorm';

@Injectable()
export class InformationService {
  constructor(
    private readonly s3Service: S3Service,
    @InjectRepository(Information)
    private readonly informationRepository: Repository<Information>,
  ) {}

  async findOnePublic(id: number) {
    const information = await this.informationRepository.findOneBy({
      id,
      published: true,
    });

    if (!information) {
      throw new NotFoundException('Information not found');
    }

    return {
      name: information.name,
      description: information.description,
      openDate: information.openDate,
      closeDate: information.closeDate,
      published: information.published,
      docLink: await this.s3Service.getFileUrl(
        'major-scholar-info-doc',
        information.PDFDocument,
      ),
    };
  }

  async findAllPublic() {
    const informations = await this.informationRepository.findBy({
      published: true,
    });

    return informations.map((information) => ({
      id: information.id,
      name: information.name,
      description: information.description,
    }));
  }
}
