import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Param,
  Query,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ApplicationsService } from './applications.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Role, ApplicationStatus } from '../../common/enums';
import { User } from '../users/entities/user.entity';
import { UpdateApplicationStatusDto } from './dto/update-application-status.dto';
import { UpdateApplicationNotesDto } from './dto/update-application-notes.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';

@ApiTags('Applications')
@ApiBearerAuth('JWT-auth')
@Controller('applications')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ApplicationsController {
  constructor(private applicationsService: ApplicationsService) {}

  @Post(':vacancyId')
  @Roles(Role.STUDENT)
  async apply(
    @CurrentUser() user: User,
    @Param('vacancyId') vacancyId: string,
  ) {
    return this.applicationsService.apply(user.id, vacancyId);
  }

  @Get('my')
  @Roles(Role.STUDENT)
  @ApiOperation({ 
    summary: 'Obtener mis postulaciones (Estudiante)',
    description: 'Lista todas las postulaciones del estudiante autenticado.',
  })
  async getMyApplications(@CurrentUser() user: User) {
    return this.applicationsService.getMyApplications(user.id);
  }

  @Get('company/received')
  @Roles(Role.COMPANY)
  @ApiOperation({ 
    summary: 'Obtener postulaciones recibidas (Empresa)',
    description: 'Lista todas las postulaciones a las vacantes de la empresa autenticada.',
  })
  async getCompanyApplications(@CurrentUser() user: User) {
    return this.applicationsService.getCompanyApplications(user.id);
  }
}

// Admin controller for applications
@ApiTags('Applications')
@ApiBearerAuth('JWT-auth')
@Controller('admin/applications')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AdminApplicationsController {
  constructor(private applicationsService: ApplicationsService) {}

  @Get()
  async findAll(
    @Query() pagination: PaginationDto,
    @Query('status') status?: ApplicationStatus,
  ) {
    return this.applicationsService.findAllAdmin(pagination, status);
  }

  @Get('vacancies-with-applications')
  async getVacanciesWithApplications() {
    return this.applicationsService.getVacanciesWithApplications();
  }

  @Get('vacancy/:vacancyId')
  async getByVacancy(@Param('vacancyId') vacancyId: string) {
    return this.applicationsService.getApplicationsByVacancy(vacancyId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.applicationsService.findOne(id);
  }

  @Patch(':id/status')
  @ApiOperation({ 
    summary: 'Actualizar estado de postulación',
    description: 'Permite al admin cambiar el estado de una postulación (pending, accepted, rejected).',
  })
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateApplicationStatusDto,
  ) {
    return this.applicationsService.updateStatus(id, dto);
  }

  @Patch(':id/notes')
  @ApiOperation({ 
    summary: 'Actualizar notas de postulación',
    description: 'Permite al admin agregar o actualizar notas sobre una postulación.',
  })
  async updateNotes(
    @Param('id') id: string,
    @Body() dto: UpdateApplicationNotesDto,
  ) {
    return this.applicationsService.updateNotes(id, dto.adminNotes || '');
  }
}
