import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Scholarship {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  detail_document: string;

  @Column()
  application_document: string;
}
