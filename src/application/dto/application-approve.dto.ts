import { IsOptional, IsString } from 'class-validator';

export class ApplicationApproveDto {
  @IsOptional()
  @IsString()
  comment: string | null;
}
