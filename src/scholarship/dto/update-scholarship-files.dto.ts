import { PartialType } from '@nestjs/swagger';
import { CreateScholarshipFilesDto } from './create-scholarship-files.dto';

export class UpdateScholarshipFilesDto extends PartialType(
  CreateScholarshipFilesDto,
) {}
