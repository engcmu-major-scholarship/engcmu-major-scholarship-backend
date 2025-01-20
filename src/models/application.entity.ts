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
import { Semester } from './semester';

@Entity()
export class Application extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Student, { onDelete: 'RESTRICT' })
  @JoinColumn()
  student: Student;

  @ManyToOne(() => Semester, { onDelete: 'RESTRICT' })
  @JoinColumn()
  semester: Semester;

  @ManyToOne(() => Scholarship, { onDelete: 'RESTRICT' })
  @JoinColumn()
  scholarship: Scholarship;

  @Column({ nullable: true, default: null })
  requestAmount: number | null;

  @Column({ nullable: true, default: null })
  grantedAmount: number | null;

  @Column()
  applicationDocument: string;

  @Column({ nullable: true, default: null })
  adminApprovalTime: Date | null;

  @Column({ nullable: true, default: null })
  approvalComment: string | null;

  @CreateDateColumn()
  createdAt: Date;
}
