import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Advisor } from './advisor.entity';

@Entity()
export class Student {
  @PrimaryColumn()
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @OneToOne(() => User, { onDelete: 'RESTRICT', eager: true })
  @JoinColumn()
  user: User;

  @ManyToOne(() => Advisor, { onDelete: 'RESTRICT', eager: true })
  @JoinColumn()
  advisor: Advisor;

  @Column({ nullable: true })
  studentIdCard: string;

  @Column({ nullable: true })
  bookBank: string;
}
