import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ApplicationService } from './application.service';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/auth/types/Role';
import { User } from 'src/decorators/user.decorator';
import { TokenPayload } from 'src/auth/types/TokenPayload';
import { FileFieldsByTypeInterceptor } from 'src/utils/Interceptor/FileFieldsByType.Interceptor';
import { CreateApplicationFilesDto } from './dto/create-application-files.dto';
import { CreateApplicationDto } from './dto/create-application.dto';
import { ParseFileFieldsPipe } from 'src/utils/Pipe/ParseFileFields.Pipe';
import {
  ApiBearerAuth,
  ApiBody,
  ApiBodyOptions,
  ApiConsumes,
} from '@nestjs/swagger';
import { UpdateApplicationFilesDto } from './dto/update-application-file.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';

const apiBodyOptions: ApiBodyOptions = {
  schema: {
    type: 'object',
    properties: {
      scholarId: { type: 'number' },
      budget: { type: 'number', nullable: true },
      doc: { type: 'string', format: 'binary' },
    },
  },
};

@Controller('application')
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody(apiBodyOptions)
  @Roles(Role.STUDENT)
  @Post()
  @UseInterceptors(
    FileFieldsByTypeInterceptor<CreateApplicationFilesDto>({
      doc: { maxCount: 1 },
    }),
  )
  create(
    @Body() createApplicationDto: CreateApplicationDto,
    @UploadedFiles(
      new ParseFileFieldsPipe<CreateApplicationFilesDto>({
        doc: { type: 'application/pdf', required: true, itemCount: 1 },
      }),
    )
    file: CreateApplicationFilesDto,
    @User() user: TokenPayload,
  ) {
    return this.applicationService.create(createApplicationDto, file, user.sub);
  }

  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody(apiBodyOptions)
  @Roles(Role.STUDENT)
  @Patch(':id')
  @UseInterceptors(
    FileFieldsByTypeInterceptor<UpdateApplicationFilesDto>({
      doc: { maxCount: 1 },
    }),
  )
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() createApplicationDto: UpdateApplicationDto,
    @UploadedFiles(
      new ParseFileFieldsPipe<UpdateApplicationFilesDto>({
        doc: { type: 'application/pdf', itemCount: 1 },
      }),
    )
    file: UpdateApplicationFilesDto,
    @User() user: TokenPayload,
  ) {
    return this.applicationService.update(
      id,
      createApplicationDto,
      file,
      user.sub,
    );
  }

  @ApiBearerAuth()
  @Roles(Role.ADMIN, Role.STUDENT)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @User() user: TokenPayload) {
    return this.applicationService.findOne(id, user.sub);
  }

  @ApiBearerAuth()
  @Roles(Role.STUDENT)
  @Get('current-year')
  getCurrentYear(@User() user: TokenPayload) {
    return this.applicationService.findCurrentYear(user.sub);
  }

  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @Get('consider/:year/:semester')
  getConsiderByYearSemester(
    @Param('year', ParseIntPipe) year: number,
    @Param('semester', ParseIntPipe) semester: number,
  ) {
    return this.applicationService.findByYearSemester(year, semester);
  }

  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @Get('recipient/:year/:semester')
  getRecipientByYearSemester(
    @Param('year', ParseIntPipe) year: number,
    @Param('semester', ParseIntPipe) semester: number,
  ) {
    return this.applicationService.findRecipientByYearSemester(year, semester);
  }

  @ApiBearerAuth()
  @Roles(Role.STUDENT)
  @Get('history')
  getApplicationHistory(@User() user: TokenPayload) {
    return this.applicationService.findApplicationHistory(user.sub);
  }

  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @Get('history/:studentId')
  getApplicationHistoryByStudentID(@Param('studentId') stuId: string) {
    return this.applicationService.findApplicationHistoryByStudentId(stuId);
  }
}
