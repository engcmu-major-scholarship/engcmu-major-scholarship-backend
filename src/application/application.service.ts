import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Application } from 'src/models/application.entity';
import { Config } from 'src/models/config.entity';
import { Repository, Not, IsNull, LessThan } from 'typeorm';
import { CreateApplicationDto } from './dto/create-application.dto';
import { CreateApplicationFileDto } from './dto/create-application-file.dto';
import { S3Service } from 'src/s3/s3.service';
import { Student } from 'src/models/student.entity';

@Injectable()
export class ApplicationService {
  constructor(
    private readonly s3Service: S3Service,
    @InjectRepository(Application)
    private readonly applicationRepository: Repository<Application>,
    @InjectRepository(Config)
    private readonly configRepository: Repository<Config>,
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
  ) {}

  async create(
    createApplicationDto: CreateApplicationDto,
    file: CreateApplicationFileDto,
    userId: string,
  ) {
    const appDockey = userId;
    this.s3Service.uploadFile(
      'major-scholar-app-doc',
      userId,
      file.doc[0].buffer,
      file.doc[0].mimetype,
    );
    const config = await this.configRepository.findOneOrFail({
      where: {
        id: 1,
      },
      relations: {
        applySemester: true,
      },
    });

    const student = await this.studentRepository.findOneByOrFail({
      user: {
        id: userId,
      },
    });

    const application = this.applicationRepository.create({
      student: student,
      semester: config.applySemester,
      scholarship: {
        id: createApplicationDto.scholarId,
      },
      requestAmount: createApplicationDto.budget,
      applicationDocument: appDockey,
    });
    await this.applicationRepository.save(application);
  }

  async findCurrentYear(userId: string) {
    const config = await this.configRepository.findOneByOrFail({
      id: 1,
    });

    const applicationCurrentYear = await this.applicationRepository.find({
      where: {
        semester: config.applySemester,
        student: {
          user: {
            id: userId,
          },
        },
      },
      relations: { scholarship: true, semester: { year: true } },
    });

    return applicationCurrentYear.map((application) => ({
      scholarName: application.scholarship.name,
      year: application.semester.year.year,
      semester: application.semester.semester,
      adminApproveTime: application.adminApprovalTime,
    }));
  }

  async findByYearSemester(year: number, semester: number) {
    const applications = await this.applicationRepository.find({
      where: {
        semester: {
          semester,
          year: { year },
        },
        submissionTime: Not(IsNull()),
      },
      relations: {
        student: true,
        scholarship: true,
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
    });

    return applications.map((app) => ({
      appId: app.id,
      studentId: app.student.id,
      firstName: app.student.firstName,
      lastName: app.student.lastName,
      scholarName: app.scholarship.name,
      requestAmount: app.requestAmount,
    }));
  }
}
