import { Column, Entity, OneToOne, PrimaryColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Student {
  @PrimaryColumn()
  id: string;

  @Column()
  @OneToOne(() => User, { onDelete: 'RESTRICT', eager: true })
  user_id: string;

  @OneToOne(() => User, (user) => user.id)
  user: User;
}
