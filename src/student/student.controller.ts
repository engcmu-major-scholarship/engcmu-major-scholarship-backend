import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { StudentService } from './student.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiBodyOptions,
  ApiConsumes,
} from '@nestjs/swagger';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/auth/types/Role';
import { User } from 'src/decorators/user.decorator';
import { TokenPayload } from 'src/auth/types/TokenPayload';
import { FileFieldsByTypeInterceptor } from 'src/utils/interceptor/file-fields-by-type.interceptor';
import { UpdateStudentDto } from './dto/update-student.dto';
import { UpdateStudentFilesDto } from './dto/update-student-files.dto';
import { ParseFileFieldsPipe } from 'src/utils/pipe/parse-file-fields.pipe';

const apiBodyOptions: ApiBodyOptions = {
  schema: {
    type: 'object',
    properties: {
      advisorId: { type: 'number' },
      studentIdCard: { type: 'string', format: 'binary' },
      bookBank: { type: 'string', format: 'binary' },
    },
  },
};

@Controller('student')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @ApiBearerAuth()
  @Roles(Role.STUDENT)
  @Get()
  getStudent(@User() user: TokenPayload) {
    return this.studentService.getStudent(user.sub);
  }

  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody(apiBodyOptions)
  @Roles(Role.STUDENT)
  @Patch()
  @UseInterceptors(
    FileFieldsByTypeInterceptor<UpdateStudentFilesDto>({
      studentIdCard: { maxCount: 1 },
      bookBank: { maxCount: 1 },
    }),
  )
  updateStudent(
    @Body() updateStudentDto: UpdateStudentDto,
    @UploadedFiles(
      new ParseFileFieldsPipe<UpdateStudentFilesDto>({
        studentIdCard: { type: /^image\/.+$/gm, itemCount: 1 },
        bookBank: { type: /^image\/.+$/gm, itemCount: 1 },
      }),
    )
    files: UpdateStudentFilesDto,
    @User() user: TokenPayload,
  ) {
    return this.studentService.updateStudent(updateStudentDto, files, user.sub);
  }

  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @Get('/:studentId')
  getApproveStudentDoc(@Param('studentId') studentId: string) {
    return this.studentService.GetApproveStudentDoc(studentId);
  }
}
