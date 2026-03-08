import {
  IsString,
  IsOptional,
  IsBoolean,
  IsEnum,
  IsDateString,
  ValidateIf,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DurationType, Modality } from '../../../common/enums';

export class CreateVacancyDto {
  @ApiProperty({
    example: 'Desarrollador Frontend Jr',
    description: 'Título de la vacante',
  })
  @IsString()
  title: string;

  @ApiProperty({
    example: 'Buscamos desarrollador frontend con conocimientos en React para unirse a nuestro equipo. Trabajarás en proyectos innovadores y tendrás oportunidad de aprender nuevas tecnologías.',
    description: 'Descripción detallada de la vacante',
  })
  @IsString()
  description: string;

  @ApiProperty({
    example: 'React, JavaScript, HTML, CSS, Git, Trabajo en equipo',
    description: 'Requisitos y habilidades necesarias',
  })
  @IsString()
  requirements: string;

  @ApiPropertyOptional({
    example: 'Horario flexible, capacitación continua, ambiente laboral agradable, oportunidad de crecimiento',
    description: 'Beneficios que ofrece la vacante',
  })
  @IsOptional()
  @IsString()
  benefits?: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Indica si la vacante ofrece salario',
  })
  @IsOptional()
  @IsBoolean()
  hasSalary?: boolean;

  @ApiPropertyOptional({
    example: '$8,000 - $12,000 MXN',
    description: 'Rango salarial ofrecido',
  })
  @IsOptional()
  @IsString()
  salaryRange?: string;

  @ApiPropertyOptional({
    example: 'HIBRIDO',
    description: 'Modalidad de trabajo',
    enum: ['PRESENCIAL', 'REMOTO', 'HIBRIDO'],
  })
  @IsOptional()
  @IsEnum(Modality)
  modality?: Modality;

  @ApiPropertyOptional({
    example: 'Lunes a Viernes 9:00 - 18:00',
    description: 'Horario de trabajo',
  })
  @IsOptional()
  @IsString()
  schedule?: string;

  @ApiPropertyOptional({
    example: 'TEMPORAL',
    description: 'Tipo de duración del contrato',
    enum: ['TEMPORAL', 'INDEFINIDO'],
  })
  @IsOptional()
  @IsEnum(DurationType)
  durationType?: DurationType;

  @ApiPropertyOptional({
    example: '2026-03-01',
    description: 'Fecha de inicio de la práctica (formato: YYYY-MM-DD)',
  })
  @IsOptional()
  @ValidateIf((o) => o.startDate && o.startDate.length > 0)
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({
    example: '2026-09-01',
    description: 'Fecha de fin de la práctica (formato: YYYY-MM-DD)',
  })
  @IsOptional()
  @ValidateIf((o) => o.endDate && o.endDate.length > 0)
  @IsDateString()
  endDate?: string;
}
