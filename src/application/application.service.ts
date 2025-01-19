import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Application } from 'src/models/application.entity';
import { Config } from 'src/models/config.entity';
import {
  Repository,
  Not,
  IsNull,
  LessThan,
  LessThanOrEqual,
  MoreThanOrEqual,
} from 'typeorm';
import { CreateApplicationDto } from './dto/create-application.dto';
import { CreateApplicationFilesDto } from './dto/create-application-files.dto';
import { S3Service } from 'src/s3/s3.service';
import { Student } from 'src/models/student.entity';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { UpdateApplicationFilesDto } from './dto/update-application-file.dto';
import { Admin } from 'src/models/admin.entity';

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
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
  ) {}

  async create(
    createApplicationDto: CreateApplicationDto,
    file: CreateApplicationFilesDto,
    userId: string,
  ) {
    const appDockey = userId + '_' + Date.now();
    this.s3Service.uploadFile(
      'major-scholar-app-doc',
      appDockey,
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

  async update(
    id: number,
    updateApplicationDto: UpdateApplicationDto,
    file: UpdateApplicationFilesDto,
    userId: string,
  ) {
    const application = await this.applicationRepository.findOne({
      where: {
        student: {
          user: {
            id: userId,
          },
        },
      },
    });

    if (
      !application ||
      application.id !== id ||
      application.adminApprovalTime
    ) {
      throw new NotFoundException('Application not found');
    }

    let appDockey: string = undefined;
    if (file.doc) {
      await this.s3Service.deleteFile(
        'major-scholar-app-doc',
        application.applicationDocument,
      );
      appDockey = userId + '_' + Date.now();
      this.s3Service.uploadFile(
        'major-scholar-app-doc',
        appDockey,
        file.doc[0].buffer,
        file.doc[0].mimetype,
      );
    }

    await this.applicationRepository.update(id, {
      scholarship: {
        id: updateApplicationDto.scholarId,
      },
      requestAmount: updateApplicationDto.budget,
      applicationDocument: appDockey,
    });
  }

  async findOne(id: number, userId: string) {
    if (await this.adminRepository.existsBy({ user: { id: userId } })) {
      const application = await this.applicationRepository.findOne({
        where: {
          id,
        },
        relations: {
          scholarship: true,
        },
      });
      return {
        scholarId: application.scholarship.id,
        budget: application.requestAmount,
        doc: application.applicationDocument,
      };
    } else {
      const application = await this.applicationRepository.findOne({
        where: {
          id,
          student: {
            user: {
              id: userId,
            },
          },
        },
        relations: {
          scholarship: true,
        },
      });

      if (!application) {
        throw new NotFoundException('Application not found');
      }

      return {
        scholarId: application.scholarship.id,
        budget: application.requestAmount,
        doc: application.applicationDocument,
      };
    }
  }

  async findCurrentYear(userId: string) {
    const now = new Date();
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
        scholarship: {
          openDate: LessThanOrEqual(now),
          closeDate: MoreThanOrEqual(now),
        },
      },
      relations: { scholarship: true, semester: { year: true } },
    });

    return applicationCurrentYear.map((application) => ({
      appId: application.id,
      scholarName: application.scholarship.name,
      year: application.semester.year.year,
      semester: application.semester.semester,
      submissionTime: application.submissionTime,
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
        adminApprovalTime: IsNull(),
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

  async findApplicationHistory(userId: string) {
    const config = await this.configRepository.findOneOrFail({
      where: {
        id: 1,
      },
      relations: {
        applySemester: {
          year: true,
        },
      },
    });

    const applications = await this.applicationRepository.find({
      where: [
        {
          student: {
            user: {
              id: userId,
            },
          },
          semester: {
            year: {
              year: LessThan(config.applySemester.year.year),
            },
          },
        },
        {
          student: {
            user: {
              id: userId,
            },
          },
          semester: {
            year: config.applySemester.year,
            semester: LessThan(config.applySemester.semester),
          },
        },
      ],
      relations: {
        scholarship: true,
        semester: { year: true },
      },
    });

    return applications.map((app) => ({
      scholarName: app.scholarship.name,
      budget: app.requestAmount,
      year: app.semester.year.year,
      semester: app.semester.semester,
      submissionTime: app.submissionTime,
      adminApprovalTime: app.adminApprovalTime,
    }));
  }

  async findApplicationHistoryByStudentId(stuId: string) {
    const config = await this.configRepository.findOneOrFail({
      where: {
        id: 1,
      },
      relations: {
        applySemester: {
          year: true,
        },
      },
    });

    const application = await this.applicationRepository.find({
      where: [
        {
          student: {
            id: stuId,
          },
          semester: {
            year: {
              year: LessThan(config.applySemester.year.year),
            },
          },
          adminApprovalTime: Not(IsNull()),
        },
        {
          student: {
            id: stuId,
          },
          semester: {
            year: config.applySemester.year,
            semester: LessThan(config.applySemester.semester),
          },
          adminApprovalTime: Not(IsNull()),
        },
      ],
    });

    return application.map((app) => ({
      scholarName: app.scholarship.name,
      budget: app.scholarship.amount,
      year: app.semester.year.year,
      semester: app.semester.semester,
    }));
  }
}
