import {
  BaseEntity,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Semester } from './semester';

@Entity()
export class Config extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Semester)
  @JoinColumn()
  applySemester: Semester;
}
