import { Injectable } from '@nestjs/common';
import { Not, IsNull, LessThan } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Application } from 'src/models/application.entity';

@Injectable()
export class ApplicationService {
  constructor(
    @InjectRepository(Application)
    private readonly applicationRepository: Repository<Application>,
  ) {}

  async findByYearSemester(year: number, semester: number) {
    const applications = await this.applicationRepository.find({
      where: { year, semester },
      relations: {
        student: true,
        scholarship: true,
      },
      select: {
        id: true,
        student: { id: true, firstName: true, lastName: true },
        scholarship: { name: true },
      },
    });

    return Promise.all(
      applications.map(async (app) => ({
        appId: app.id,
        studentId: app.student.id,
        firstName: app.student.firstName,
        lastName: app.student.lastName,
        scholarName: app.scholarship.name,
        requestAmount: app.requestAmount,
        isFirstTime: !(await this.applicationRepository.existsBy([
          {
            student: app.student,
            year: LessThan(year),
          },
          {
            student: app.student,
            year: year,
            semester: LessThan(semester),
          },
        ])),
      })),
    );
  }

  async findRecipientByYearSemester(year: number, semester: number) {
    const applications = await this.applicationRepository.find({
      where: {
        year,
        semester,
        adminApprovalTime: Not(IsNull()),
      },
      relations: {
        student: true,
        scholarship: true,
      },
      select: {
        id: true,
        student: { id: true, firstName: true, lastName: true },
        scholarship: { name: true },
      },
    });

    return applications.map((app) => ({
      studentId: app.student.id,
      firstName: app.student.firstName,
      lastName: app.student.lastName,
      scholarName: app.scholarship.name,
      requestAmount: app.requestAmount,
    }));
  }
}
