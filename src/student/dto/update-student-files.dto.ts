import { PartialType } from '@nestjs/swagger';
import { CreateStudentFilesDto } from './create-student-files.dto';

export class UpdateStudentFilesDto extends PartialType(CreateStudentFilesDto) {}
