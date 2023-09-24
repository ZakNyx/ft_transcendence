import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
} from "@nestjs/websockets";
import { NotificationsService } from "./notifications.service";
import { JwtService } from "@nestjs/jwt";
import { Socket } from "socket.io";
import { PrismaService } from "src/prisma/prisma.service";
import { Req, UnauthorizedException, UseGuards } from "@nestjs/common";
import { jwtStrategy } from "src/strategies/jwt.strategy";
import { AuthGuard } from "@nestjs/passport";
import { notificationBodyDTO } from "./dto/notifications.dto";

@WebSocketGateway({ namespace: "notifications", cors: { origin: "*" } })
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  socketsByUser: Map<string, Socket[]>;
  constructor(
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
    private readonly notificationsService: NotificationsService,
  ) {
    this.socketsByUser = new Map<string, Socket[]>();
  }

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.headers.authorization.slice(7);
      const userObj = this.jwtService.verify(token);
      if (this.socketsByUser.has(userObj.username)) {
        this.socketsByUser.get(userObj.username).push(client);
      } else {
        this.socketsByUser.set(userObj.username, [client]);
      }
      const user = await this.prismaService.user.update({
        where: {
          username: userObj.username,
        },
        data: {
          status: "ONLINE",
        },
      });
    } catch (err) {
      throw new UnauthorizedException();
    }
  }

  async handleDisconnect(client: Socket) {
    try {
      const token = client.handshake.headers.authorization.slice(7);
      const userObj = this.jwtService.verify(token);
      const user = await this.prismaService.user.update({
        where: {
          username: userObj.username,
        },
        data: {
          status: "OFFLINE",
        },
      });
      this.socketsByUser.delete(user.username);
    } catch (err) {
      throw new UnauthorizedException();
    }
  }

  @SubscribeMessage("sendNotification")
  @UseGuards(AuthGuard("jwtWebSocket"))
  async sendNotification(@MessageBody() body: notificationBodyDTO, @Req() req) {
    return await this.notificationsService.sendNotification(
      body,
      req.user,
      this.socketsByUser,
    );
  }
}
