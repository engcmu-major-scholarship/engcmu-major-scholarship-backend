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
  detailDocument: string;

  @Column()
  applicationDocument: string;
}
