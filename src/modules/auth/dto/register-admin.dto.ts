import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterAdminDto {
  @ApiProperty({
    example: 'admin@hunting.com',
    description: 'Email del administrador',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'temporal',
    description: 'Contraseña del administrador (mínimo 6 caracteres)',
  })
  @IsString()
  @MinLength(6)
  password: string;
}
