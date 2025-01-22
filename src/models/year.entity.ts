import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Semester } from './semester';

@Entity()
export class Year extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  year: number;

  @OneToMany(() => Semester, (semester) => semester.year)
  semesters: Semester[];
}
