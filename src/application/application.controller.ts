import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ApplicationService } from './application.service';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/auth/types/Role';
import { User } from 'src/decorators/user.decorator';
import { TokenPayload } from 'src/auth/types/TokenPayload';
import { FileFieldsInterceptorByType } from 'src/utils/Interceptor/FileFieldsInterceptorByType';
import { CreateApplicationFileDto } from './dto/create-application-file.dto';
import { CreateApplicationDto } from './dto/create-application.dto';
import { ParseFileFieldsPipe } from 'src/utils/Pipe/ParseFileFieldsPipe';

@Controller('application')
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  @Roles(Role.STUDENT)
  @Post()
  @UseInterceptors(
    FileFieldsInterceptorByType<CreateApplicationFileDto>({
      doc: { maxCount: 1 },
    }),
  )
  create(
    @Body() createApplicationDto: CreateApplicationDto,
    @UploadedFiles(
      new ParseFileFieldsPipe<CreateApplicationFileDto>({
        doc: { type: 'application/pdf', required: true, itemCount: 1 },
      }),
    )
    file: CreateApplicationFileDto,
    @User() user: TokenPayload,
  ) {
    return this.applicationService.create(createApplicationDto, file, user.sub);
  }

  @Roles(Role.STUDENT)
  @Get('current-year')
  getCurrentYear(@User() user: TokenPayload) {
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
