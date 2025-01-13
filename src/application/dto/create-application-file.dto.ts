import { FileFields } from 'src/utils/Types/FileFields';

export class CreateApplicationFileDto extends FileFields {
  doc: Express.Multer.File[];
}
