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
import { InformationService } from './information.service';
import { CreateInformationDto } from './dto/create-information.dto';
import { UpdateInformationDto } from './dto/update-information.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiBodyOptions,
  ApiConsumes,
} from '@nestjs/swagger';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/auth/types/Role';
import { FileFieldsByTypeInterceptor } from 'src/utils/interceptor/file-fields-by-type.interceptor';
import { CreateInformationFilesDto } from './dto/create-information-files.dto';
import { ParseFileFieldsPipe } from 'src/utils/pipe/parse-file-fields.pipe';
import { UpdateInformationFilesDto } from './dto/update-information-files.dto';

const apiBodyOptions: ApiBodyOptions = {
  schema: {
    type: 'object',
    properties: {
      name: { type: 'string' },
      description: { type: 'string' },
      informationDoc: { type: 'string', format: 'binary' },
      published: { type: 'boolean' },
    },
  },
};

@Controller('information')
export class InformationController {
  constructor(private readonly informationService: InformationService) {}

  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody(apiBodyOptions)
  @Roles(Role.ADMIN)
  @Post()
  @UseInterceptors(
    FileFieldsByTypeInterceptor<CreateInformationFilesDto>({
      informationDoc: { maxCount: 1 },
    }),
  )
  create(
    @Body() createInformationDto: CreateInformationDto,
    @UploadedFiles(
      new ParseFileFieldsPipe<CreateInformationFilesDto>({
        informationDoc: {
          type: 'application/pdf',
          required: true,
          itemCount: 1,
        },
      }),
    )
    files: CreateInformationFilesDto,
  ) {
    return this.informationService.create(createInformationDto, files);
  }

  @Get()
  findAll() {
    return this.informationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.informationService.findOne(+id);
  }

  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody(apiBodyOptions)
  @Roles(Role.ADMIN)
  @Patch(':id')
  @UseInterceptors(
    FileFieldsByTypeInterceptor<CreateInformationFilesDto>({
      informationDoc: { maxCount: 1 },
    }),
  )
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateInformationDto: UpdateInformationDto,
    @UploadedFiles(
      new ParseFileFieldsPipe<UpdateInformationFilesDto>({
        informationDoc: {
          type: 'application/pdf',
          itemCount: 1,
        },
      }),
    )
    files: UpdateInformationFilesDto,
  ) {
    return this.informationService.update(+id, updateInformationDto, files);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.informationService.remove(+id);
  }
}
