import { Controller, Get, Body, Patch, Param, Delete } from '@nestjs/common';
import { SettingService } from './setting.service';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { Public } from 'src/decorators/public.decorator';

@Controller('setting')
export class SettingController {
  constructor(private readonly settingService: SettingService) {}

  @Public()
  @Get('current-year-semester')
  findCurrentYearSemester() {
    return this.settingService.findCurrentYearSemester();
  }

  @Get()
  find() {
    return this.settingService.find();
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSettingDto: UpdateSettingDto) {
    return this.settingService.update(+id, updateSettingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.settingService.remove(+id);
  }
}
