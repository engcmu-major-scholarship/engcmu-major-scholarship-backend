import {
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

  @OneToOne(() => User, { onDelete: 'RESTRICT', eager: true })
  @JoinColumn()
  user: User;

  @ManyToOne(() => Advisor, { onDelete: 'RESTRICT', eager: true })
  @JoinColumn()
  advisor: Advisor;
}
