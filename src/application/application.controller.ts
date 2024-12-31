import { Controller, Get, Param } from '@nestjs/common';
import { ApplicationService } from './application.service';
import { Role } from 'src/auth/types/Role';
import { Roles } from 'src/decorators/roles.decorator';

@Controller('application')
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) { }

  @Roles(Role.ADMIN)
  @Get(':year')
  findbyYear(@Param('year') year: string) {
    return this.applicationService.findbyYear(+year);
  }

  @Roles(Role.ADMIN)
  @Get('scholarship/:scholarId')
  findApprovedStudent(@Param('scholarId') scholarId: string) {
    return this.applicationService.findApprovedStudentByScholar(+scholarId);
  }
}
