import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Student } from './student.entity';
import { Scholarship } from './scholarship.entity';

@Entity()
export class Application extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Student, { onDelete: 'RESTRICT' })
  @JoinColumn()
  student: Student;

  @Column()
  year: number;

  @Column()
  semester: number;

  @ManyToOne(() => Scholarship, { onDelete: 'RESTRICT' })
  @JoinColumn()
  scholarship: Scholarship;

  @Column({ nullable: true, default: null })
  requestAmount: number;

  @Column()
  applicationDocument: string;

  @Column({ nullable: true, default: null })
  submissionTime: Date;

  @Column({ nullable: true, default: null })
  adminApprovalTime: Date;

  @Column({ nullable: true, default: null })
  approvalComment: string;

  @CreateDateColumn()
  createdAt: Date;
}
