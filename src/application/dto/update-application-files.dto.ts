import { PartialType } from '@nestjs/swagger';
import { CreateApplicationFilesDto } from './create-application-files.dto';

export class UpdateApplicationFilesDto extends PartialType(
  CreateApplicationFilesDto,
) {}
