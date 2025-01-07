import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Application } from './application.entity';

@Entity()
export class Disbursement extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Application, { onDelete: 'RESTRICT' })
  @JoinColumn()
  application: Application;

  @Column()
  disbursementDocument: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
