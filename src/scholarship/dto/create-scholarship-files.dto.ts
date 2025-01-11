export class CreateScholarshipFilesDto {
  scholarDoc: Express.Multer.File[];
  appDoc: Express.Multer.File[];
  [k: string]: Express.Multer.File[];
}
