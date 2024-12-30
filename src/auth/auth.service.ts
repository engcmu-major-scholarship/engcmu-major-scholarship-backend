import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CMUAccountInfo } from './types/CMUAccountInfo';
import { Repository } from 'typeorm';
import { User } from 'src/models/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { TokenPayload } from './types/TokenPayload';
import { CMUAccountType } from './types/CMUAccountType';
import { Role } from './types/Role';
import { Student } from 'src/models/student.entity';
import { Advisor } from 'src/models/advisor.entity';
import { Admin } from 'src/models/admin.entity';
import { RequestToken } from './types/RequestToken';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Student)
    private readonly studentsRepository: Repository<Student>,
    @InjectRepository(Advisor)
    private readonly advisorsRepository: Repository<Advisor>,
    @InjectRepository(Admin)
    private readonly adminsRepository: Repository<Admin>,
  ) {}

  async signin(token: string) {
    const cmuAccountInfo = await this.getCMUAccountInfo(token);
    const user = await this.usersRepository.findOneBy({
      CMUAccount: cmuAccountInfo.cmuitaccount,
    });
    if (!user) {
      return this.signup(token);
    }

    const roles = [];
    if (await this.studentsRepository.existsBy({ user: { id: user.id } })) {
      roles.push(Role.STUDENT);
    }

    if (await this.advisorsRepository.existsBy({ user: { id: user.id } })) {
      roles.push(Role.ADVISOR);
    }

    if (await this.adminsRepository.existsBy({ user: { id: user.id } })) {
      roles.push(Role.ADMIN);
    }

    return this.jwtService.sign({
      sub: user.id,
      CMUAccount: user.CMUAccount,
      roles: roles,
    } as TokenPayload);
  }

  async signup(token: string) {
    const cmuAccountInfo = await this.getCMUAccountInfo(token);

    if (cmuAccountInfo.organization_code !== '06') {
      throw new UnauthorizedException('Unauthorized organization');
    }

    const newUser = this.usersRepository.create({
      CMUAccount: cmuAccountInfo.cmuitaccount,
    });
    await this.usersRepository.save(newUser);

    const roles = [];

    if (cmuAccountInfo.itaccounttype_id === CMUAccountType.STUDENT_ACCOUNT) {
      roles.push(Role.STUDENT);
      const newStudent = this.studentsRepository.create({
        id: cmuAccountInfo.student_id,
        firstName: cmuAccountInfo.firstname_TH,
        lastName: cmuAccountInfo.lastname_TH,
        user: newUser,
      });
      await this.studentsRepository.save(newStudent);
    } else if (
      cmuAccountInfo.itaccounttype_id === CMUAccountType.NON_MIS_EMPLOYEE
    ) {
      roles.push(Role.ADVISOR);
      const newAdvisor = this.advisorsRepository.create({
        user: newUser,
        name: `${cmuAccountInfo.prename_TH} ${cmuAccountInfo.firstname_TH} ${cmuAccountInfo.lastname_TH}`,
      });
      await this.advisorsRepository.save(newAdvisor);
    } else if (
      cmuAccountInfo.itaccounttype_id === CMUAccountType.MANAGER_ACCOUNT ||
      cmuAccountInfo.itaccounttype_id === CMUAccountType.MIS_EMPLOYEE
    ) {
      roles.push(Role.ADMIN);
      const newAdmin = this.adminsRepository.create({
        user: newUser,
      });
      await this.adminsRepository.save(newAdmin);
    }

    return this.jwtService.sign({
      sub: newUser.id,
      CMUAccount: newUser.CMUAccount,
      roles: roles,
    } as TokenPayload);
  }

  async requestToken(code: string, redirectUri: string) {
    try {
      return (
        await this.httpService.axiosRef.post<RequestToken>(
          `https://login.microsoftonline.com/${this.configService.get('CMU_MS_TENANT_ID')}/oauth2/v2.0/token`,
          {
            client_id: this.configService.get('CMU_ENTRA_CLIENT_ID'),
            client_secret: this.configService.get('CMU_ENTRA_CLIENT_SECRET'),
            code: code,
            scope: 'api://cmu/.default',
            redirect_uri: redirectUri,
            grant_type: 'authorization_code',
          },
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          },
        )
      ).data.access_token;
    } catch {
      throw new BadRequestException('Invalid authorization code');
    }
  }

  async getCMUAccountInfo(token: string) {
    try {
      return (
        await this.httpService.axiosRef.get<CMUAccountInfo>(
          'https://api.cmu.ac.th/mis/cmuaccount/prod/v3/me/basicinfo',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )
      ).data;
    } catch {
      throw new BadRequestException('Invalid access token');
    }
  }
}
