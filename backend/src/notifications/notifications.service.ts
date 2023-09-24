import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "../prisma/prisma.service";
import { notificationBodyDTO } from "./dto/notifications.dto";
import { Socket } from "socket.io";

@Injectable()
export class NotificationsService {
  constructor(private readonly prismaService: PrismaService) {}

  async sendNotification(
    notifBody: notificationBodyDTO,
    reqUser,
    socketsByUser: Map<string, Socket[]>,
  ) {
    const sender = await this.prismaService.user.findUnique({
      where: {
        username: reqUser.username,
      },
    });

    const reciever = await this.prismaService.user.findUnique({
      where: {
        username: notifBody.reciever,
      },
    });

    const notification = await this.prismaService.notification.create({
      data: {
        sender: sender.username,
        reciever: reciever.username,
        data: notifBody.data,
        type: notifBody.type,
      },
    });

    if (socketsByUser.has(notifBody.reciever)) {
		for (let i=0; i<socketsByUser.get(reciever.username).length; i++) {
			socketsByUser.get(reciever.username)[i].emit("notification", notification);
		}
    }
  }
}
