import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { RegisterAdminDto } from './dto/register-admin.dto';
import { User } from '../users/entities/user.entity';
import { Role } from '../../common/enums';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await this.usersService.validatePassword(user, password))) {
      return user;
    }
    return null;
  }

  async register(registerDto: RegisterDto) {
    if (registerDto.role === Role.ADMIN) {
      throw new UnauthorizedException('Cannot register as admin');
    }

    const user = await this.usersService.create(registerDto);
    return this.generateTokens(user);
  }

  async login(user: User) {
    return this.generateTokens(user);
  }

  async refreshToken(user: User) {
    return this.generateTokens(user);
  }

  async registerAdmin(registerAdminDto: RegisterAdminDto) {
    const user = await this.usersService.create({
      ...registerAdminDto,
      role: Role.ADMIN,
    });
    return this.generateTokens(user);
  }

  private generateTokens(user: User) {
    const payload = { sub: user.id, email: user.email, role: user.role };

    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(payload, {
        secret: process.env.JWT_REFRESH_SECRET || 'default-refresh-secret',
        expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
      } as any),
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }
}
