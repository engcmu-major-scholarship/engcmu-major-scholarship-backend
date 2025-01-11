import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Scholarship extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column()
  requirement: string;

  @Column({ nullable: true, default: null })
  amount: number | null;

  @Column()
  openDate: Date;

  @Column()
  closeDate: Date;

  @Column()
  detailDocument: string;

  @Column()
  applicationDocument: string;

  @Column()
  published: boolean;
}
