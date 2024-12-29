import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Application } from './application.entity';

@Entity()
export class Disbursement {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Application, { onDelete: 'RESTRICT', eager: true })
  @JoinColumn()
  application: Application;

  @Column()
  disbursementDocument: string;
}
