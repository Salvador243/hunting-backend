import { IsString, IsOptional, IsEmail } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCompanyContactDto {
  @ApiProperty({
    example: 'María López',
    description: 'Nombre del contacto',
  })
  @IsString()
  contactName: string;

  @ApiPropertyOptional({
    example: '3398765432',
    description: 'Teléfono del contacto',
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({
    example: 'maria.lopez@techsolutions.com',
    description: 'Email del contacto',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    example: 'Gerente de Recursos Humanos',
    description: 'Puesto o cargo del contacto',
  })
  @IsOptional()
  @IsString()
  position?: string;
}
