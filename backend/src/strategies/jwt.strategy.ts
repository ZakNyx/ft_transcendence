import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class jwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly config: ConfigService,
    private prismaService: PrismaService,
  ) {
    super({
      jwtFromRequest: (req: Request) => {
        return req.cookies['token'];
      },
      secretOrKey: config.get('JWT_SECRET'),
    });
  }

  async validate(payload: { username: string; email: string }) {
    const user = await this.prismaService.user.findUnique({
      where: {
        username: payload.username,
        email: payload.email,
      },
    });
    if (user) {
      return user;
    }
  }
}
