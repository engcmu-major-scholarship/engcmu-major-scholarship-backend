import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Application } from 'src/models/application.entity';
import { Config } from 'src/models/config.entity';
import { Repository, Not, IsNull, LessThan } from 'typeorm';

@Injectable()
export class ApplicationService {
  constructor(
    @InjectRepository(Application)
    private readonly applicationRepository: Repository<Application>,
    @InjectRepository(Config)
    private readonly configRepository: Repository<Config>,
  ) {}

  async findCurrentYear(userId: string) {
    const config = await this.configRepository.findOneByOrFail({
      id: 1,
    });

    const applicationCurrentYear = await this.applicationRepository.find({
      where: {
        semester: {
          semester: config.applySemester,
          year: {
            year: config.applyYear,
          },
        },
        student: {
          user: {
            id: userId,
          },
        },
      },
      relations: { scholarship: true, semester: { year: true } },
      select: {
        semester: {
          semester: true,
          year: { year: true },
        },
        adminApprovalTime: true,
        scholarship: { name: true },
      },
    });

    return applicationCurrentYear.map((app) => ({
      scholarName: app.scholarship.name,
      year: app.semester.year.year,
      semester: app.semester.semester,
      adminApproveTime: app.adminApprovalTime,
    }));
  }

  async findByYearSemester(year: number, semester: number) {
    const applications = await this.applicationRepository.find({
      where: {
        semester: {
          semester,
          year: { year },
        },
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
            semester: {
              year: {
                year: LessThan(year),
              },
            },
          },
          {
            student: app.student,
            semester: {
              year: {
                year,
              },
              semester: LessThan(semester),
            },
          },
        ])),
      })),
    );
  }

  async findRecipientByYearSemester(year: number, semester: number) {
    const applications = await this.applicationRepository.find({
      where: {
        semester: {
          semester,
          year: { year },
        },
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
