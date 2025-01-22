import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from 'src/models/student.entity';
import { S3Service } from 'src/s3/s3.service';
import { Repository } from 'typeorm';

@Injectable()
export class StudentService {
  constructor(
    private readonly s3Service: S3Service,
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
  ) {}

  async getStudent(userId: string) {
    const student = await this.studentRepository.findOne({
      where: {
        user: {
          id: userId,
        },
      },
      relations: {
        advisor: true,
      },
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    return {
      id: student.id,
      firstName: student.firstName,
      lastName: student.lastName,
      advisorId: student.advisor?.id,
      studentIdCard: student.studentIdCard
        ? await this.s3Service.getFileUrl(
            'major-scholar-student-id',
            student.studentIdCard,
          )
        : null,
      bookBank: student.bookBank
        ? await this.s3Service.getFileUrl(
            'major-scholar-student-book-bank',
            student.bookBank,
          )
        : null,
    };
  }
}
