import {
  BaseEntity,
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

  @Column({ nullable: true })
  studentIdCard: string | null;

  @Column({ nullable: true })
  bookBank: string | null;
}
