import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApplicationService } from './application.service';
import { Role } from 'src/auth/types/Role';
import { Roles } from 'src/decorators/roles.decorator';

@Controller('application')
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  @Roles(Role.ADMIN)
  @Get('consider/:year/:semester')
  getConsiderByYearSemester(
    @Param('year', ParseIntPipe) year: number,
    @Param('semester', ParseIntPipe) semester: number,
  ) {
    return this.applicationService.findByYearSemester(year, semester);
  }

  @Roles(Role.ADMIN)
  @Get('recipient/:year/:semester')
  getRecipientByYearSemester(
    @Param('year', ParseIntPipe) year: number,
    @Param('semester', ParseIntPipe) semester: number,
  ) {
    return this.applicationService.findRecipientByYearSemester(year, semester);
  }
}
