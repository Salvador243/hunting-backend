import { JwtModuleOptions } from '@nestjs/jwt';

export const jwtConfig = (): JwtModuleOptions => ({
  secret: process.env.JWT_SECRET || 'default-secret',
  signOptions: {
    expiresIn: (process.env.JWT_EXPIRES_IN || '15m') as any,
  },
});
