import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Application } from 'src/models/application.entity';
import { Config } from 'src/models/config.entity';
import { Repository, Not, IsNull, LessThan, ILike } from 'typeorm';
import { CreateApplicationDto } from './dto/create-application.dto';
import { CreateApplicationFilesDto } from './dto/create-application-files.dto';
import { S3Service } from 'src/s3/s3.service';
import { Student } from 'src/models/student.entity';
import { Role } from 'src/auth/types/Role';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { UpdateApplicationFilesDto } from './dto/update-application-files.dto';
import { Scholarship } from 'src/models/scholarship.entity';
import { isNotEmptyObject } from 'class-validator';
import { Degree } from 'src/auth/types/Degree';

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
    @InjectRepository(Scholarship)
    private readonly scholarshipRepository: Repository<Scholarship>,
  ) {}

  async create(
    createApplicationDto: CreateApplicationDto,
    file: CreateApplicationFilesDto,
    userId: string,
  ) {
    const appDockey = userId + '_' + Date.now();
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

    const scholarship = await this.scholarshipRepository.findOneByOrFail({
      id: createApplicationDto.scholarId,
    });

    const requestAmount = scholarship.amount
      ? null
      : createApplicationDto.budget;

    const application = this.applicationRepository.create({
      student: student,
      semester: config.applySemester,
      scholarship: scholarship,
      requestAmount: requestAmount,
      applicationDocument: appDockey,
    });
    await this.applicationRepository.save(application);

    await this.s3Service.uploadFile(
      'major-scholar-app-doc',
      appDockey,
      file.doc[0].buffer,
      file.doc[0].mimetype,
    );
  }

  async update(
    id: number,
    updateApplicationDto: UpdateApplicationDto,
    file: UpdateApplicationFilesDto,
    userId: string,
  ) {
    const appDockey = userId + '_' + Date.now();
    const application = await this.applicationRepository.findOne({
      where: {
        id,
        student: {
          user: {
            id: userId,
          },
        },
        submissionTime: IsNull(),
      },
      relations: {
        scholarship: true,
      },
    });

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    const scholarship = await this.scholarshipRepository.findOneByOrFail({
      id: updateApplicationDto.scholarId ?? application.scholarship.id,
    });

    const requestAmount = scholarship.amount
      ? null
      : updateApplicationDto.budget;

    if (file.doc) {
      application.applicationDocument = appDockey;
      await this.s3Service.uploadFile(
        'major-scholar-app-doc',
        appDockey,
        file.doc[0].buffer,
        file.doc[0].mimetype,
      );
    }

    if (isNotEmptyObject(updateApplicationDto)) {
      await this.applicationRepository.update(id, {
        scholarship: scholarship,
        requestAmount: requestAmount,
        applicationDocument: application.applicationDocument,
      });
    } else {
      if (!file) throw new UnprocessableEntityException('No data to update');
    }
  }

  async submit(id: number, userId: string) {
    const application = await this.applicationRepository.findOne({
      where: {
        id,
        student: {
          user: {
            id: userId,
          },
        },
        submissionTime: IsNull(),
      },
    });

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    const now = new Date();
    now.setHours(7, 0, 0, 0);

    await this.applicationRepository.update(id, {
      submissionTime: now,
    });
  }

  async findOne(id: number, userId: string, roles: Role[]) {
    if (roles.includes(Role.ADMIN)) {
      const application = await this.applicationRepository.findOne({
        where: {
          id,
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
        doc: await this.s3Service.getFileUrl(
          'major-scholar-app-doc',
          application.applicationDocument,
        ),
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
        doc: await this.s3Service.getFileUrl(
          'major-scholar-app-doc',
          application.applicationDocument,
        ),
      };
    }
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

    const degreeMap: Record<string, Degree> = {
      '1': Degree.BACHELOR,
      '3': Degree.MASTER,
      '5': Degree.DOCTOR,
    };

    return applications.map((app) => ({
      appId: app.id,
      studentId: app.student.id,
      firstName: app.student.firstName,
      lastName: app.student.lastName,
      scholarName: app.scholarship.name,
      requestAmount: app.requestAmount,
      degress: degreeMap[app.student.id.charAt(4)],
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

  async findStudentFromSearch(search: string) {
    try {
      if (!search || search.trim() === '') {
        throw new BadRequestException('Search cannot be empty.');
      }
      const studentList = await this.applicationRepository.find({
        where: [
          {
            student: {
              id: ILike(`%${search}%`),
            },
          },
          {
            student: {
              firstName: ILike(`%${search}%`),
            },
          },
          {
            student: {
              lastName: ILike(`%${search}%`),
            },
          },
        ],
        relations: {
          student: true,
        },
      });

      return studentList.map((list) => ({
        StudentId: list.student.id,
        firstname: list.student.firstName,
        lastname: list.student.lastName,
      }));
    } catch (error) {
      throw new NotFoundException(`No found for : ${search}`);
    }
  }
}
