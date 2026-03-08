import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ApplicationStatus } from '../../../common/enums';

export class UpdateApplicationStatusDto {
  @ApiProperty({
    example: 'APPROVED',
    description: 'Nuevo estado de la postulación',
    enum: ['PENDING', 'APPROVED', 'REJECTED'],
  })
  @IsEnum(ApplicationStatus)
  status: ApplicationStatus;

  @ApiPropertyOptional({
    example: 'Candidato aprobado. Cumple con todos los requisitos.',
    description: 'Notas del administrador sobre la decisión',
  })
  @IsOptional()
  @IsString()
  adminNotes?: string;
}
