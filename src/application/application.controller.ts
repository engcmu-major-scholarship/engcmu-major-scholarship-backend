import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApplicationService } from './application.service';
import { Role } from 'src/auth/types/Role';
import { Roles } from 'src/decorators/roles.decorator';

@Controller('application')
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  @Roles(Role.ADMIN)
  @Get(':year/:semester')
  findbyYear(
    @Param('year', ParseIntPipe) year: number,
    @Param('semester', ParseIntPipe) semester: number,
  ) {
    return this.applicationService.findByYear(year, semester);
  }

  @Roles(Role.ADMIN)
  @Get('scholarship/:scholarId')
  findApprovedStudent(@Param('scholarId', ParseIntPipe) scholarId: number) {
    return this.applicationService.findApprovedStudentByScholar(scholarId);
  }
}
