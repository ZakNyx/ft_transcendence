import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "../prisma/prisma.service";
import {
  notificationBodyDTO,
  replyToFriendRequestDTO,
} from "./dto/notifications.dto";
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

    await this.prismaService.user.update({
      where: {
        username: reqUser.username,
      },
      data: {
        requested: {
          connect: {
            username: reciever.username,
          },
        },
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
      for (let i = 0; i < socketsByUser.get(reciever.username).length; i++) {
        socketsByUser
          .get(reciever.username)
          [i].emit("notification", notification);
      }
    }
  }

  async getNotifications(reqUser) {
    const notifications = await this.prismaService.notification.findMany({
      where: {
        reciever: reqUser.username,
      },
    });

    return notifications;
  }

  async replyToFriendRequest(
    body: replyToFriendRequestDTO,
    socketsByUser: Map<string, Socket[]>,
  ) {
    if (body.status == "accept") {
      const notification = await this.acceptRequest(body);
      this.acceptRequest(body);
      const acceptation = {
        title: notification.type,
        reicever: notification.reciever,
        status: "accepted",
      };
      for (
        let i = 0;
        i < socketsByUser.get(notification.reciever).length;
        i++
      ) {
        socketsByUser
          .get(notification.sender)
          [i].emit("receive_notification", acceptation);
      }
    } else if (body.status == "reject") this.deleteRequest(body);
  }

  async deleteRequest(body: replyToFriendRequestDTO) {
    const notif = await this.prismaService.notification.findFirst({
      where: {
        id: body.id,
      },
    });

    await this.prismaService.user.update({
      where: {
        username: notif.sender,
      },
      data: {
        requested: {
          disconnect: {
            username: notif.reciever,
          },
        },
      },
    });

    await this.prismaService.notification.deleteMany({
      where: {
        sender: notif.sender,
        reciever: notif.reciever,
        type: notif.type,
      },
    });
  }

  async acceptRequest(body: replyToFriendRequestDTO) {
    const notification = await this.prismaService.notification.findUnique({
      where: {
        id: body.id
      },
    });

    await this.prismaService.user.update({
      where:{
        username: notification.sender,
      },
      data :{
        friends:{
          connect :{
            username:notification.reciever,
          }
        },
        requested: {
          disconnect:{
            username : notification.reciever,
          }
        }
      }
    });

    await this.prismaService.user.update({
      where:{
        username: notification.reciever,
      },
      data :{
        friends:{
          connect :{
            username:notification.sender,
          }
        },
      }
    });
    return notification;
  }
}
