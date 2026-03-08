import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { VacanciesService } from './vacancies.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Role } from '../../common/enums';
import { User } from '../users/entities/user.entity';
import { CreateVacancyDto } from './dto/create-vacancy.dto';
import { UpdateVacancyDto } from './dto/update-vacancy.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';

@ApiTags('Vacancies')
@Controller('vacancies')
export class VacanciesController {
  constructor(private vacanciesService: VacanciesService) {}

  // Public endpoints
  @Get()
  async findAllOpen(@Query() pagination: PaginationDto) {
    return this.vacanciesService.findAllOpen(pagination);
  }

  // Company endpoints - MUST be before :id route
  @Get('my')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.COMPANY)
  @ApiOperation({ summary: 'Obtener mis vacantes' })
  @ApiBearerAuth('JWT-auth')
  async findMyVacancies(@CurrentUser() user: User) {
    return this.vacanciesService.findMyVacancies(user.id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.vacanciesService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.COMPANY)
  async create(@CurrentUser() user: User, @Body() dto: CreateVacancyDto) {
    return this.vacanciesService.create(user.id, dto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.COMPANY)
  async update(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() dto: UpdateVacancyDto,
  ) {
    return this.vacanciesService.update(user.id, id, dto);
  }

  @Patch(':id/close')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.COMPANY)
  async close(@CurrentUser() user: User, @Param('id') id: string) {
    return this.vacanciesService.close(user.id, id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.COMPANY)
  async softDelete(@CurrentUser() user: User, @Param('id') id: string) {
    await this.vacanciesService.softDelete(user.id, id);
    return { message: 'Vacancy deleted successfully' };
  }
}

// Admin controller for vacancies
@ApiTags('Vacancies')
@ApiBearerAuth('JWT-auth')
@Controller('admin/vacancies')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AdminVacanciesController {
  constructor(private vacanciesService: VacanciesService) {}

  @Get()
  async findAll(@Query() pagination: PaginationDto) {
    return this.vacanciesService.findAllAdmin(pagination);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.vacanciesService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateVacancyDto) {
    return this.vacanciesService.adminUpdate(id, dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.vacanciesService.adminDelete(id);
    return { message: 'Vacancy deleted successfully' };
  }
}
