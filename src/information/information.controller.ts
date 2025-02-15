import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { InformationService } from './information.service';
import { Public } from 'src/decorators/public.decorator';

@Controller('information')
export class InformationController {
  constructor(private readonly informationService: InformationService) {}

  @Public()
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.informationService.findOnePublic(id);
  }

  @Public()
  @Get()
  findAll() {
    return this.informationService.findAllPublic();
  }
}
