import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Advisor } from './advisor.entity';
import { Application } from './application.entity';

@Entity()
export class Student extends BaseEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @OneToOne(() => User, { onDelete: 'RESTRICT' })
  @JoinColumn()
  user: User;

  @ManyToOne(() => Advisor, { onDelete: 'RESTRICT' })
  @JoinColumn()
  advisor: Advisor;

  @Column({ nullable: true, default: null })
  studentIdCard: string | null;

  @Column({ nullable: true, default: null })
  bookBank: string | null;

  @OneToMany(() => Application, (application) => application.student)
  application: Application[];
}
