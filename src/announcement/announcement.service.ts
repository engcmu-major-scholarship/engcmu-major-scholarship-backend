import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';
import { CreateAnnouncementFilesDto } from './dto/create-announcement-files.dto';
import { S3Service } from 'src/s3/s3.service';
import { Announcement } from 'src/models/announcement.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateAnnouncementFilesDto } from './dto/update-announcement-files.dto';
import { isNotEmptyObject } from 'class-validator';

@Injectable()
export class AnnouncementService {
  constructor(
    private readonly s3Service: S3Service,
    @InjectRepository(Announcement)
    private readonly announcementRepository: Repository<Announcement>,
  ) {}

  async create(
    createAnnouncementDto: CreateAnnouncementDto,
    files: CreateAnnouncementFilesDto,
  ) {
    if (
      await this.announcementRepository.existsBy({
        name: createAnnouncementDto.name,
      })
    ) {
      throw new UnprocessableEntityException('Announcement already exists');
    }

    const announcementDocKey =
      files.doc && files.doc[0] ? createAnnouncementDto.name : null;

    const announcement = this.announcementRepository.create({
      name: createAnnouncementDto.name,
      description: createAnnouncementDto.description,
      PDFDocument: announcementDocKey,
      published: createAnnouncementDto.published,
    });
    await this.announcementRepository.save(announcement);

    if (files.doc && files.doc[0]) {
      await this.s3Service.uploadFile(
        'major-scholar-announcement-doc',
        announcementDocKey,
        files.doc[0].buffer,
        files.doc[0].mimetype,
      );
    }
  }

  async findAllPublic() {
    const announcements = await this.announcementRepository.findBy({
      published: true,
    });

    return announcements.map((announcement) => ({
      id: announcement.id,
      name: announcement.name,
      description: announcement.description,
    }));
  }

  async findOnePublic(id: number) {
    const announcement = await this.announcementRepository.findOneBy({
      id,
      published: true,
    });

    if (!announcement) {
      throw new NotFoundException('Announcement not found');
    }

    return {
      name: announcement.name,
      description: announcement.description,
      docLink: announcement.PDFDocument
        ? await this.s3Service.getFileUrl(
            'major-scholar-announcement-doc',
            announcement.PDFDocument,
          )
        : null,
      published: announcement.published,
    };
  }

  async findAllAdmin() {
    const announcements = await this.announcementRepository.find();
    return announcements.map((announcement) => ({
      id: announcement.id,
      name: announcement.name,
      description: announcement.description,
    }));
  }

  async findOneAdmin(id: number) {
    const announcement = await this.announcementRepository.findOneBy({
      id,
    });

    if (!announcement) {
      throw new NotFoundException('Announcement not found');
    }

    return {
      name: announcement.name,
      description: announcement.description,
      docLink: announcement.PDFDocument
        ? await this.s3Service.getFileUrl(
            'major-scholar-announcement-doc',
            announcement.PDFDocument,
          )
        : null,
      published: announcement.published,
    };
  }

  async update(
    id: number,
    updateAnnouncementDto: UpdateAnnouncementDto,
    files: UpdateAnnouncementFilesDto,
  ) {
    const announcement = await this.announcementRepository.findOneBy({
      id,
    });

    if (!announcement) {
      throw new NotFoundException('Announcement not found');
    }

    const announcementDocKey = announcement.PDFDocument; // FIXME: Posible bug by overwriting file when change name
    if (isNotEmptyObject(updateAnnouncementDto)) {
      await this.announcementRepository.update(id, {
        name: updateAnnouncementDto.name,
        description: updateAnnouncementDto.description,
        published: updateAnnouncementDto.published,
      });
    } else {
      if (!files) throw new UnprocessableEntityException('No data to update');
    }

    if (files.doc) {
      await this.s3Service.uploadFile(
        'major-scholar-announcement-doc',
        announcementDocKey,
        files.doc[0].buffer,
        files.doc[0].mimetype,
      );
    }
  }

  remove(id: number) {
    return `This action removes a #${id} announcement`;
  }
}
