import { IsString, IsOptional, IsUrl, ValidateIf } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCompanyProfileDto {
  @ApiPropertyOptional({
    example: 'TechSolutions SA de CV',
    description: 'Nombre de la empresa',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    example: '/uploads/logos/logo-empresa.png',
    description: 'URL del logo de la empresa',
  })
  @IsOptional()
  @IsString()
  logo?: string;

  @ApiPropertyOptional({
    example: 'Empresa líder en desarrollo de software y soluciones tecnológicas innovadoras.',
    description: 'Descripción de la empresa',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    example: 'Tecnología de la Información',
    description: 'Industria o sector de la empresa',
  })
  @IsOptional()
  @IsString()
  industry?: string;

  @ApiPropertyOptional({
    example: 'Jalisco',
    description: 'Estado donde se ubica la empresa',
  })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiPropertyOptional({
    example: 'Guadalajara',
    description: 'Ciudad donde se ubica la empresa',
  })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({
    example: 'Zapopan',
    description: 'Municipio donde se ubica la empresa',
  })
  @IsOptional()
  @IsString()
  municipality?: string;

  @ApiPropertyOptional({
    example: 'https://www.techsolutions.com',
    description: 'Sitio web de la empresa',
  })
  @IsOptional()
  @ValidateIf((o) => o.website && o.website.length > 0)
  @IsUrl({}, { message: 'website must be a valid URL' })
  website?: string;
}
