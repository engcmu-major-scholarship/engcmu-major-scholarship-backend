import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Scholarship extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column()
  requirements: string;

  @Column({ nullable: true, default: null })
  amount: number;

  @Column()
  detailDocument: string;

  @Column()
  applicationDocument: string;

  @Column()
  published: boolean;
}
