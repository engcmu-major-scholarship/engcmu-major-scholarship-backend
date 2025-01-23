import { Controller, Get } from '@nestjs/common';
import { AdvisorService } from './advisor.service';
import { Public } from 'src/decorators/public.decorator';

@Controller('advisor')
export class AdvisorController {
  constructor(private readonly advisorService: AdvisorService) {}

  @Public()
  @Get()
  async getAdvisors() {
    return await this.advisorService.getAdvisors();
  }
}
