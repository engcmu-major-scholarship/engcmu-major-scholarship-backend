import { PartialType } from '@nestjs/swagger';
import { CreateInformationFilesDto } from './create-information-files.dto';

export class UpdateInformationFilesDto extends PartialType(
  CreateInformationFilesDto,
) {}
