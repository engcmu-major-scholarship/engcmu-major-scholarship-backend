import { FileFields } from 'src/utils/Types/FileFields';

export class CreateScholarshipFilesDto extends FileFields {
  scholarDoc: Express.Multer.File[];
  appDoc: Express.Multer.File[];
}
