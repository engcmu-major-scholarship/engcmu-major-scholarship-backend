import { Controller, Get } from '@nestjs/common';
import { StudentService } from './student.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/auth/types/Role';
import { User } from 'src/decorators/user.decorator';
import { TokenPayload } from 'src/auth/types/TokenPayload';

@Controller('student')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @ApiBearerAuth()
  @Roles(Role.STUDENT)
  @Get()
  getStudent(@User() user: TokenPayload) {
    return this.studentService.getStudent(user.sub);
  }
}
