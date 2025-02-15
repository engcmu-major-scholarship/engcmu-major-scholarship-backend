import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Information extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column()
  openDate: Date;

  @Column()
  closeDate: Date;

  @Column()
  PDFDocument: string;

  @Column()
  published: boolean;
}
