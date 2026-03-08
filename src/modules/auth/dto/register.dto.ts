import { IsEmail, IsString, MinLength, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../../common/enums';

export class RegisterDto {
  @ApiProperty({
    example: 'estudiante@ejemplo.com',
    description: 'Email del usuario',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'Password123!',
    description: 'Contraseña (mínimo 6 caracteres)',
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    example: 'student',
    description: 'Rol del usuario',
    enum: ['student', 'company'],
  })
  @IsEnum(Role, { message: 'Role must be company or student' })
  role: Role;
}
