import { IsOptional, IsString } from 'class-validator';

export class ApplicationApprove {
  @IsOptional()
  @IsString()
  comment: string | null;
}
