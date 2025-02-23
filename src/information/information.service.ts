import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Information } from 'src/models/information.entity';
import { Repository } from 'typeorm';

@Injectable()
export class InformationService {
  constructor(
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
      docLink: information.PDFDocument,
      published: information.published,
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
