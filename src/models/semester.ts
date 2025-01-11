import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Year } from './year.entity';

@Entity()
@Unique(['year', 'semester'])
export class Semester extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Year)
  @JoinColumn()
  year: Year;

  @Column()
  semester: number;
}
