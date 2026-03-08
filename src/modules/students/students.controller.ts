import {
  Controller,
  Get,
  Put,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { StudentsService } from './students.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Role } from '../../common/enums';
import { User } from '../users/entities/user.entity';
import { UpdateStudentProfileDto } from './dto/update-student-profile.dto';

@ApiTags('Students')
@ApiBearerAuth('JWT-auth')
@Controller('students')
@UseGuards(JwtAuthGuard, RolesGuard)
export class StudentsController {
  constructor(private studentsService: StudentsService) {}

  @Get('profile')
  @Roles(Role.STUDENT)
  @ApiOperation({ 
    summary: 'Obtener mi perfil de estudiante',
    description: 'Requiere token JWT de un usuario con rol STUDENT. Si el perfil no existe, retorna null. Primero debe crear el perfil con PUT /students/profile.',
  })
  @ApiResponse({ status: 200, description: 'Perfil del estudiante o null si no existe' })
  @ApiResponse({ status: 401, description: 'No autorizado - Token inválido o expirado' })
  @ApiResponse({ status: 403, description: 'Prohibido - El usuario no tiene rol STUDENT' })
  async getProfile(@CurrentUser() user: User) {
    let profile = await this.studentsService.getProfile(user.id);
    if (!profile) {
      profile = await this.studentsService.createOrUpdateProfile(user.id, {});
    }
    return profile;
  }

  @Put('profile')
  @Roles(Role.STUDENT)
  @ApiOperation({ 
    summary: 'Crear o actualizar mi perfil de estudiante',
    description: 'Crea el perfil si no existe, o lo actualiza si ya existe. Requiere token JWT de usuario con rol STUDENT.',
  })
  @ApiResponse({ status: 200, description: 'Perfil creado/actualizado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  async updateProfile(
    @CurrentUser() user: User,
    @Body() dto: UpdateStudentProfileDto,
  ) {
    return this.studentsService.createOrUpdateProfile(user.id, dto);
  }

  @Get(':id')
  @Roles(Role.ADMIN)
  async getStudentById(@Param('id') id: string) {
    return this.studentsService.getProfileById(id);
  }
}
