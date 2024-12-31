import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Not, IsNull } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Application } from 'src/models/application.entity';

@Injectable()
export class ApplicationService {
  constructor(
    @InjectRepository(Application)
    private readonly applicationRepository: Repository<Application>,
  ) { }

  async findbyYear(year: number) {
    try {
      const applications = await this.applicationRepository.find({
        where: { year },
        relations: ['student', 'scholarship'],
        select: {
          id: true,
          student: { id: true, firstName: true, lastName: true },
          scholarship: { name: true },
        }
      });

      if (!applications.length) {
        throw new NotFoundException('No application found for this year');
      }

      return applications.map((app) => ({
        student_id: app.student.id,
        firstname: app.student.firstName,
        lastname: app.student.lastName,
        scholar_name: app.scholarship.name,
      }));

      // Optimized Query
      // return await this.applicationRepository
      //   .createQueryBuilder('application')
      //   .innerJoinAndSelect('application.student', 'student')
      //   .innerJoinAndSelect('application.scholarship', 'scholarship')
      //   .select([
      //     'application.studentId AS student_id',
      //     'student.firstName AS firstname',
      //     'student.lastName AS lastname',
      //     'scholarship.name AS scholar_name',
      //   ])
      //   .where('application.year = :year', { year })
      //   .getRawMany();

    } catch (error) {
      if (error instanceof NotFoundException) { throw error; }
      throw new InternalServerErrorException('Error in finding application by year');
    }
  }

  async findApprovedStudentByScholar(scholarId: number) {
    try {
      const applications = await this.applicationRepository.find({
        where: { scholarship: { id: scholarId }, adminApprovalTime: Not(IsNull()) },
        relations: ['student'],
        select: {
          id: true,
          student: { id: true, firstName: true, lastName: true },
        }
      });

      if (!applications.length) {
        throw new NotFoundException('No approved students found for this scholarship');
      }

      return applications.map((app) => ({
        student_id: app.student.id,
        firstname: app.student.firstName,
        lastname: app.student.lastName,
      }));

      // Optimized Query
      // return await this.applicationRepository
      //   .createQueryBuilder('application')
      //   .innerJoinAndSelect('application.student', 'student')
      //   .select([
      //     'application.studentId AS student_id',
      //     'student.firstName AS firstname',
      //     'student.lastName AS lastname',
      //   ])
      //   .where('application.scholarshipId = :scholarId', { scholarId })
      //   .andWhere('application.adminApprovalTime IS NOT NULL')
      //   .getRawMany();

    } catch (error) {
      if (error instanceof NotFoundException) { throw error; }
      throw new InternalServerErrorException('Error in finding approved student for scholarship');
    }
  }
}

