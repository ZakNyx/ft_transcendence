import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthStrategy } from '../strategies/42.strategy';
import { PrismaService } from '../prisma/prisma.service';
import { jwtStrategy } from '../strategies/jwt.strategy';
import { JwtModule, JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: 'super-secret',
      signOptions: { expiresIn: '1w' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthStrategy, PrismaService, jwtStrategy, JwtService],
})
export class AuthModule {}
