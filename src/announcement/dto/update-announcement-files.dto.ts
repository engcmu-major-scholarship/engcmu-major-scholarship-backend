import { PartialType } from '@nestjs/swagger';
import { CreateAnnouncementFilesDto } from './create-announcement-files.dto';

export class UpdateAnnouncementFilesDto extends PartialType(
  CreateAnnouncementFilesDto,
) {}
