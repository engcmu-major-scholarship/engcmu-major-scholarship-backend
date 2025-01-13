export type FileFields<T> = {
  [K in keyof T]: Express.Multer.File[];
};
