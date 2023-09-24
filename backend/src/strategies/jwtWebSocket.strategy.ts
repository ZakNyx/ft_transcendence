import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class jwtWebSocketStrategy extends PassportStrategy(
  Strategy,
  "websocket-jwt",
) {
  constructor(
    private readonly config: ConfigService,
    private prismaService: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: any) => {
          return req.handshake.headers.authorization.slice(7);
        },
      ]),
      secretOrKey: config.get("JWT_SECRET"),
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
