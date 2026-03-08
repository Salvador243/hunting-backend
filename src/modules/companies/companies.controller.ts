import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { CompaniesService } from './companies.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Role } from '../../common/enums';
import { User } from '../users/entities/user.entity';
import { CreateCompanyProfileDto } from './dto/create-company-profile.dto';
import { UpdateCompanyProfileDto } from './dto/update-company-profile.dto';
import { CreateCompanyContactDto } from './dto/create-company-contact.dto';
import { UpdateCompanyContactDto } from './dto/update-company-contact.dto';

@ApiTags('Companies')
@ApiBearerAuth('JWT-auth')
@Controller('companies')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CompaniesController {
  constructor(private companiesService: CompaniesService) {}

  @Get('profile')
  @Roles(Role.COMPANY)
  @ApiOperation({ 
    summary: 'Obtener mi perfil de empresa',
    description: 'Requiere token JWT de un usuario con rol COMPANY. Si el perfil no existe, retorna un mensaje indicando que debe crearlo primero.',
  })
  @ApiResponse({ status: 200, description: 'Perfil de la empresa o mensaje si no existe' })
  @ApiResponse({ status: 401, description: 'No autorizado - Token inválido o expirado' })
  @ApiResponse({ status: 403, description: 'Prohibido - El usuario no tiene rol COMPANY' })
  async getProfile(@CurrentUser() user: User) {
    let profile = await this.companiesService.getProfile(user.id);
    if (!profile) {
      profile = await this.companiesService.createOrUpdateProfile(user.id, {});
    }
    return profile;
  }

  @Put('profile')
  @Roles(Role.COMPANY)
  @ApiOperation({ 
    summary: 'Crear o actualizar mi perfil de empresa',
    description: 'Crea el perfil si no existe, o lo actualiza si ya existe. Requiere token JWT de usuario con rol COMPANY.',
  })
  @ApiResponse({ status: 200, description: 'Perfil creado/actualizado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  async updateProfile(
    @CurrentUser() user: User,
    @Body() dto: UpdateCompanyProfileDto,
  ) {
    return this.companiesService.createOrUpdateProfile(user.id, dto);
  }

  @Get('contacts')
  @Roles(Role.COMPANY)
  @ApiOperation({ 
    summary: 'Obtener mis contactos',
    description: 'Lista todos los contactos de la empresa autenticada.',
  })
  @ApiResponse({ status: 200, description: 'Lista de contactos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 404, description: 'Perfil de empresa no encontrado' })
  async getContacts(@CurrentUser() user: User) {
    return this.companiesService.getContacts(user.id);
  }

  @Get(':id')
  async getCompanyById(@Param('id') id: string) {
    return this.companiesService.getProfileById(id);
  }

  @Post('contacts')
  @Roles(Role.COMPANY)
  @ApiOperation({ 
    summary: 'Crear contacto',
    description: 'Agrega un nuevo contacto a la empresa.',
  })
  @ApiResponse({ status: 201, description: 'Contacto creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async addContact(
    @CurrentUser() user: User,
    @Body() dto: CreateCompanyContactDto,
  ) {
    return this.companiesService.addContact(user.id, dto);
  }

  @Put('contacts/:id')
  @Roles(Role.COMPANY)
  async updateContact(
    @CurrentUser() user: User,
    @Param('id') contactId: string,
    @Body() dto: UpdateCompanyContactDto,
  ) {
    return this.companiesService.updateContact(user.id, contactId, dto);
  }

  @Delete('contacts/:id')
  @Roles(Role.COMPANY)
  async deleteContact(
    @CurrentUser() user: User,
    @Param('id') contactId: string,
  ) {
    await this.companiesService.deleteContact(user.id, contactId);
    return { message: 'Contact deleted successfully' };
  }
}
