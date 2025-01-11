import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApplicationService } from './application.service';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/auth/types/Role';
import { User } from 'src/decorators/user.decorator';
import { TokenPayload } from 'src/auth/types/TokenPayload';

@Controller('application')
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  @Roles(Role.STUDENT)
  @Get('current-year')
  findCurrentYear(@User() user: TokenPayload) {
    return this.applicationService.findCurrentYear(user.sub);
  }

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
