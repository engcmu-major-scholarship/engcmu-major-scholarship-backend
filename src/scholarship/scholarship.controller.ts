import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { ScholarshipService } from './scholarship.service';
import { CreateScholarshipDto } from './dto/create-scholarship.dto';
import { UpdateScholarshipDto } from './dto/update-scholarship.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { CreateScholarshipFilesDto } from './dto/create-scholarship-files.dto';
import { Public } from 'src/decorators/public.decorator';
import { ParseFileFieldsPipe } from 'src/utils/Pipe/ParseFileFieldsPipe';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/auth/types/Role';

@Controller('scholarship')
export class ScholarshipController {
  constructor(private readonly scholarshipService: ScholarshipService) {}

  @Roles(Role.ADMIN)
  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'scholarDoc', maxCount: 1 },
      { name: 'appDoc', maxCount: 1 },
    ]),
  )
  create(
    @Body() createScholarshipDto: CreateScholarshipDto,
    @UploadedFiles(
      new ParseFileFieldsPipe<CreateScholarshipFilesDto>({
        scholarDoc: { type: 'application/pdf' },
        appDoc: { type: 'application/pdf' },
      }),
    )
    files: CreateScholarshipFilesDto,
  ) {
    return this.scholarshipService.create(createScholarshipDto, files);
  }

  @Public()
  @Get()
  findAll() {
    return this.scholarshipService.findAll();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.scholarshipService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateScholarshipDto: UpdateScholarshipDto,
  ) {
    return this.scholarshipService.update(+id, updateScholarshipDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.scholarshipService.remove(+id);
  }
}
