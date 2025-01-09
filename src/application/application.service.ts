import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Application } from 'src/models/application.entity';
import { Repository, Not, IsNull, LessThan } from 'typeorm';

@Injectable()
export class ApplicationService {
  constructor(
    @InjectRepository(Application)
    private readonly applicationRepository: Repository<Application>,
  ) {}

  async findCurrentYear(userID: string) {
    if (!userID) {
      throw new BadRequestException('User ID must be provided');
    }

    try {
      const currentYear = new Date().getFullYear() + 543;

      const applicationCurrentYear = await this.applicationRepository
        .createQueryBuilder('application')
        .select([
          'scholarship.name',
          'application.year',
          'application.semester',
          'application.adminApprovalTime',
        ])
        .innerJoin('application.scholarship', 'scholarship')
        .innerJoin('application.student', 'student')
        .where('student.userID = :userID', { userID })
        .andWhere('application.year = :currentYear', {
          currentYear: currentYear,
        })
        .getMany();

      if (applicationCurrentYear.length === 0) {
        throw new NotFoundException(
          'No applications found for the current year',
        );
      }

      return applicationCurrentYear;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        'Error for finding by current year.',
      );
    }
  }

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
