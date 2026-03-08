import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateApplicationNotesDto {
  @ApiProperty({
    example: 'Candidato con excelente perfil, recomendado para entrevista.',
    description: 'Notas del administrador sobre la postulación',
  })
  @IsString()
  @IsOptional()
  adminNotes?: string;
}
