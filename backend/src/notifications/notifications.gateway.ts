import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { NotificationsService } from "./notifications.service";
import { JwtService } from "@nestjs/jwt";
import { Socket } from "socket.io";
import { PrismaService } from "src/prisma/prisma.service";
import { Req, UnauthorizedException, UseGuards } from "@nestjs/common";
import { jwtStrategy } from "src/strategies/jwt.strategy";
import { AuthGuard } from "@nestjs/passport";
import {
  cancelNotificationDTO,
  notificationBodyDTO,
  replyToFriendRequestDTO,
} from "./dto/notifications.dto";

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

  @WebSocketServer()
  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.headers.authorization.slice(7);
      // console.log(client.id);
      if (!token){
        throw new UnauthorizedException();
      }
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
      client.emit('unauthorized', 'Unauthorized'); // Send unauthorized message
      client.disconnect(true);
    }
  }

  async handleDisconnect(client: Socket) {
    try {
      const token = client.handshake.headers.authorization.slice(7);
      if (!token){
        throw new UnauthorizedException();
      }
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
      client.emit('unauthorized', 'Unauthorized'); // Send unauthorized message
      client.disconnect(true);
    }
  }

  @SubscribeMessage("sendNotification")
  @UseGuards(AuthGuard("websocket-jwt"))
  async sendNotification(@MessageBody() body: notificationBodyDTO, @Req() req) {
    return await this.notificationsService.sendNotification(
      body,
      req.user,
      this.socketsByUser,
    );
  }

  @SubscribeMessage("cancelNotification")
  @UseGuards(AuthGuard("websocket-jwt"))
  async cancelNotification(@MessageBody() body: cancelNotificationDTO, @Req() req){
    return await this.notificationsService.cancelNotification(
      body,
      req.user,
      this.socketsByUser,
    );
  }


  @SubscribeMessage("getNotifications")
  @UseGuards(AuthGuard("websocket-jwt"))
  async getNotifications(@Req() req) {
    return await this.notificationsService.getNotifications(req.user);
  }

  @SubscribeMessage("replyToFriendRequest")
  @UseGuards(AuthGuard("websocket-jwt"))
  async replyToFriendRequest(
    @MessageBody() body: replyToFriendRequestDTO,
  ) {
    return await this.notificationsService.replyToFriendRequest(
      body,
      this.socketsByUser,
    );
  }
}
