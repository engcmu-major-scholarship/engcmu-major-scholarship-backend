import { Injectable } from '@nestjs/common';
import { Not, IsNull, LessThan, In } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Application } from 'src/models/application.entity';

@Injectable()
export class ApplicationService {
  constructor(
    @InjectRepository(Application)
    private readonly applicationRepository: Repository<Application>,
  ) {}

  async findByYear(year: number, semester: number) {
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

    const studentIds = applications.map((app) => app.student.id);

    const previousApplications = await this.applicationRepository.find({
      where: {
        student: { id: In(studentIds) },
        year: LessThan(year),
      },
      relations: {
        student: true,
      },
      select: { student: { id: true } },
    });

    const previousStudentIds = new Set(
      previousApplications.map((app) => app.student.id),
    );

    return applications.map((app) => ({
      studentId: app.student.id,
      firstName: app.student.firstName,
      lastName: app.student.lastName,
      scholarName: app.scholarship.name,
      isFirstTime: !previousStudentIds.has(app.student.id),
    }));
  }

  async findApprovedStudentByScholar(scholarId: number) {
    const applications = await this.applicationRepository.find({
      where: {
        scholarship: { id: scholarId },
        adminApprovalTime: Not(IsNull()),
      },
      relations: { student: true },
      select: {
        id: true,
        student: { id: true, firstName: true, lastName: true },
      },
    });

    return applications.map((app) => ({
      studentId: app.student.id,
      firstName: app.student.firstName,
      lastName: app.student.lastName,
    }));
  }
}
