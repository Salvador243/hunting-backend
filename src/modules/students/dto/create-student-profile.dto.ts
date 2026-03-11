import { IsString, IsOptional, IsEnum, IsBoolean, IsUrl, ValidateIf } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  StudyPlan,
  AcademicStatus,
  StudySchedule,
  InsuranceType,
} from '../../../common/enums';

export class CreateStudentProfileDto {
  @ApiPropertyOptional({
    example: 'Juan',
    description: 'Nombre del estudiante',
  })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiPropertyOptional({
    example: 'Pérez',
    description: 'Apellido del estudiante',
  })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiPropertyOptional({
    example: '/uploads/photos/foto-perfil.jpg',
    description: 'URL de la foto de perfil',
  })
  @IsOptional()
  @IsString()
  photo?: string;

  @ApiPropertyOptional({
    example: '3312345678',
    description: 'Teléfono de contacto',
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({
    example: 'México',
    description: 'País de residencia',
  })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional({
    example: 'Jalisco',
    description: 'Estado de residencia',
  })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiPropertyOptional({
    example: 'Guadalajara',
    description: 'Ciudad de residencia',
  })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({
    example: 'Zapopan',
    description: 'Municipio de residencia',
  })
  @IsOptional()
  @IsString()
  municipality?: string;

  @ApiPropertyOptional({
    example: 'Estudiante apasionado por la tecnología y el desarrollo de software. Busco oportunidades para aplicar mis conocimientos.',
    description: 'Descripción personal del estudiante',
  })
  @IsOptional()
  @IsString()
  about?: string;

  @ApiPropertyOptional({
    example: '/uploads/cv/curriculum-vitae.pdf',
    description: 'URL del CV en PDF',
  })
  @IsOptional()
  @IsString()
  cvUrl?: string;

  @ApiPropertyOptional({
    example: 'Universidad de Guadalajara',
    description: 'Universidad donde estudia',
  })
  @IsOptional()
  @IsString()
  university?: string;

  @ApiPropertyOptional({
    example: 'Ingeniería en Sistemas Computacionales',
    description: 'Carrera que estudia',
  })
  @IsOptional()
  @IsString()
  career?: string;

  @ApiPropertyOptional({
    example: 'SEMESTRAL',
    description: 'Plan de estudio',
    enum: StudyPlan,
  })
  @IsOptional()
  @IsEnum(StudyPlan)
  studyPlan?: StudyPlan;

  @ApiPropertyOptional({
    example: 'ESTUDIANTE',
    description: 'Status académico',
    enum: AcademicStatus,
  })
  @IsOptional()
  @IsEnum(AcademicStatus)
  academicStatus?: AcademicStatus;

  @ApiPropertyOptional({
    example: 'MATUTINO',
    description: 'Horario de estudio',
    enum: StudySchedule,
  })
  @IsOptional()
  @IsEnum(StudySchedule)
  studySchedule?: StudySchedule;

  @ApiPropertyOptional({
    example: 'https://www.linkedin.com/in/juan-perez',
    description: 'URL del perfil de LinkedIn',
  })
  @IsOptional()
  @IsUrl()
  linkedinUrl?: string;

  @ApiPropertyOptional({
    example: true,
    description: '¿Cuenta con seguro médico?',
  })
  @IsOptional()
  @IsBoolean()
  hasMedicalInsurance?: boolean;

  @ApiPropertyOptional({
    example: 'SEGURO_FACULTATIVO_IMSS',
    description: 'Tipo de seguro médico',
    enum: InsuranceType,
  })
  @IsOptional()
  @ValidateIf((o) => o.hasMedicalInsurance === true)
  @IsEnum(InsuranceType)
  insuranceType?: InsuranceType;

  @ApiPropertyOptional({
    example: '/uploads/documents/comprobante-estudios.pdf',
    description: 'URL del comprobante de estudios',
  })
  @IsOptional()
  @IsString()
  studyProofUrl?: string;

  @ApiPropertyOptional({
    example: '/uploads/documents/titulo.pdf',
    description: 'URL del título o certificado',
  })
  @IsOptional()
  @IsString()
  degreeUrl?: string;

  @ApiPropertyOptional({
    example: '/uploads/documents/certificaciones.pdf',
    description: 'URL de certificaciones',
  })
  @IsOptional()
  @IsString()
  certificationsUrl?: string;
}
