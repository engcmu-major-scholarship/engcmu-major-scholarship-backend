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
  ParseIntPipe,
} from '@nestjs/common';
import { ScholarshipService } from './scholarship.service';
import { CreateScholarshipDto } from './dto/create-scholarship.dto';
import { UpdateScholarshipDto } from './dto/update-scholarship.dto';
import { CreateScholarshipFilesDto } from './dto/create-scholarship-files.dto';
import { Public } from 'src/decorators/public.decorator';
import { ParseFileFieldsPipe } from 'src/utils/pipe/parse-file-fields.pipe';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/auth/types/Role';
import { FileFieldsByTypeInterceptor } from 'src/utils/interceptor/file-fields-by-type.interceptor';
import { UpdateScholarshipFilesDto } from './dto/update-scholarship-files.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiBodyOptions,
  ApiConsumes,
} from '@nestjs/swagger';

const apiBodyOptions: ApiBodyOptions = {
  schema: {
    type: 'object',
    properties: {
      name: { type: 'string' },
      description: { type: 'string' },
      requirement: { type: 'string' },
      defaultBudget: { type: 'number', nullable: true },
      openDate: { type: 'string', format: 'date-time' },
      closeDate: { type: 'string', format: 'date-time' },
      published: { type: 'boolean' },
      scholarDoc: { type: 'string', format: 'binary' },
      appDoc: { type: 'string', format: 'binary' },
    },
  },
};

@Controller('scholarship')
export class ScholarshipController {
  constructor(private readonly scholarshipService: ScholarshipService) {}

  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody(apiBodyOptions)
  @Roles(Role.ADMIN)
  @Post()
  @UseInterceptors(
    FileFieldsByTypeInterceptor<CreateScholarshipFilesDto>({
      scholarDoc: { maxCount: 1 },
      appDoc: { maxCount: 1 },
    }),
  )
  create(
    @Body() createScholarshipDto: CreateScholarshipDto,
    @UploadedFiles(
      new ParseFileFieldsPipe<CreateScholarshipFilesDto>({
        scholarDoc: { type: 'application/pdf', required: true, itemCount: 1 },
        appDoc: { type: 'application/pdf', required: true, itemCount: 1 },
      }),
    )
    files: CreateScholarshipFilesDto,
  ) {
    return this.scholarshipService.create(createScholarshipDto, files);
  }

  @Public()
  @Get()
  findAll() {
    return this.scholarshipService.findAllPublic();
  }

  @Public()
  @Get('applyable')
  findApplyable() {
    return this.scholarshipService.findApplyable();
  }

  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @Get('admin')
  findAllAdmin() {
    return this.scholarshipService.findAllAdmin();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.scholarshipService.findOnePublic(id);
  }

  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @Get('admin/:id')
  findOneAdmin(@Param('id', ParseIntPipe) id: number) {
    return this.scholarshipService.findOneAdmin(id);
  }

  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody(apiBodyOptions)
  @Roles(Role.ADMIN)
  @Patch(':id')
  @UseInterceptors(
    FileFieldsByTypeInterceptor<UpdateScholarshipFilesDto>({
      scholarDoc: { maxCount: 1 },
      appDoc: { maxCount: 1 },
    }),
  )
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateScholarshipDto: UpdateScholarshipDto,
    @UploadedFiles(
      new ParseFileFieldsPipe<UpdateScholarshipFilesDto>({
        scholarDoc: { type: 'application/pdf', itemCount: 1 },
        appDoc: { type: 'application/pdf', itemCount: 1 },
      }),
    )
    files: UpdateScholarshipFilesDto,
  ) {
    return this.scholarshipService.update(id, updateScholarshipDto, files);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.scholarshipService.remove(id);
  }
}
