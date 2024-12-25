import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  user_id: string;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column({ unique: true })
  citizen_id: string;

  @Column({ unique: true })
  google_account: string;

  @Column()
  contact_email: string;

  @Column()
  phone_number: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
