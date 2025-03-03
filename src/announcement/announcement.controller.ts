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
import { AnnouncementService } from './announcement.service';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiBodyOptions,
  ApiConsumes,
} from '@nestjs/swagger';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/auth/types/Role';
import { FileFieldsByTypeInterceptor } from 'src/utils/interceptor/file-fields-by-type.interceptor';
import { CreateAnnouncementFilesDto } from './dto/create-announcement-files.dto';
import { ParseFileFieldsPipe } from 'src/utils/pipe/parse-file-fields.pipe';
import { Public } from 'src/decorators/public.decorator';
import { UpdateAnnouncementFilesDto } from './dto/update-announcement-files.dto';

const apiBodyOptions: ApiBodyOptions = {
  schema: {
    type: 'object',
    properties: {
      name: { type: 'string' },
      description: { type: 'string' },
      doc: { type: 'string', format: 'binary' },
      published: { type: 'boolean' },
    },
  },
};

@Controller('announcement')
export class AnnouncementController {
  constructor(private readonly announcementService: AnnouncementService) {}

  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody(apiBodyOptions)
  @Roles(Role.ADMIN)
  @Post()
  @UseInterceptors(
    FileFieldsByTypeInterceptor<CreateAnnouncementFilesDto>({
      doc: { maxCount: 1 },
    }),
  )
  create(
    @Body() createAnnouncementDto: CreateAnnouncementDto,
    @UploadedFiles(
      new ParseFileFieldsPipe<CreateAnnouncementFilesDto>({
        doc: {
          type: 'application/pdf',
          itemCount: 1,
        },
      }),
    )
    files: CreateAnnouncementFilesDto,
  ) {
    return this.announcementService.create(createAnnouncementDto, files);
  }

  @Public()
  @Get()
  findAllPublic() {
    return this.announcementService.findAllPublic();
  }

  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @Get('admin')
  findAllAdmin() {
    return this.announcementService.findAllAdmin();
  }

  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @Get('admin/:id')
  findOneAdmin(@Param('id', ParseIntPipe) id: number) {
    return this.announcementService.findOneAdmin(id);
  }

  @Public()
  @Get(':id')
  findOnePublic(@Param('id', ParseIntPipe) id: number) {
    return this.announcementService.findOnePublic(id);
  }

  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody(apiBodyOptions)
  @Roles(Role.ADMIN)
  @Patch(':id')
  @UseInterceptors(
    FileFieldsByTypeInterceptor<UpdateAnnouncementFilesDto>({
      doc: { maxCount: 1 },
    }),
  )
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAnnouncementDto: UpdateAnnouncementDto,
    @UploadedFiles(
      new ParseFileFieldsPipe<UpdateAnnouncementFilesDto>({
        doc: {
          type: 'application/pdf',
          itemCount: 1,
        },
      }),
    )
    files: UpdateAnnouncementFilesDto,
  ) {
    return this.announcementService.update(id, updateAnnouncementDto, files);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.announcementService.remove(+id);
  }
}
