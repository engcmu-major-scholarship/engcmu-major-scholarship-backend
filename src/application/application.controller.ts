import { Body, Controller, Get, Param, Post, Request } from '@nestjs/common';
import { ApplicationService } from './application.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { Role } from 'src/auth/types/Role';
import { Roles } from 'src/decorators/roles.decorator';
import { Request as ExpressRequest } from 'express';

@Controller('application')
export class ApplicationController {
    constructor(private readonly applicationService: ApplicationService) { }

    /** Prem tesk
     * Get application info for input year
     * Get application info for input id for shcolarship
     */
    @Roles(Role.ADMIN)
    @Get(':year')
    findbyYear(@Param('year') year: string) {
        return this.applicationService.findbyYear(+year);
    }

    @Roles(Role.ADMIN)
    @Get('scholarship/:scholarId')
    findApprovedStudent(@Param('scholarId') scholarId: string) {
        return this.applicationService.findApprovedStudentByScholar(+scholarId);
    }

    /** Mockup path
     * register scholarship
     * register application
     */

    @Roles(Role.STUDENT)
    @Post()
    create(@Body() createApplicationDto: CreateApplicationDto, @Request() req: ExpressRequest) {
        return this.applicationService.create(createApplicationDto, req['user']);
    }
}
