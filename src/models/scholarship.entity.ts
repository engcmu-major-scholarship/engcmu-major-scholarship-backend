import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Scholarship {
  @PrimaryGeneratedColumn()
  scholarship_id: number;
}
