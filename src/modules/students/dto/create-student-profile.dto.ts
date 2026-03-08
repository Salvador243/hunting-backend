import { IsString, IsOptional, IsInt, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

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
    example: 8,
    description: 'Semestre actual (1-12)',
    minimum: 1,
    maximum: 12,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(12)
  semester?: number;
}
