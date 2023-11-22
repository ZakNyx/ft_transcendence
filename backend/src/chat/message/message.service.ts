import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { messageDTO } from '../dto/chatDto';
import { dmDTO } from '../dto/chatDto';
import { roomDTO } from '../dto/chatDto';
import { roomInviteDTO } from '../dto/chatDto';
import { friendRequestDTO } from '../dto/chatDto';
import { roomJoinDTO } from '../dto/chatDto';
import { actionDTO } from '../dto/chatDto';
import { Socket, Server } from 'socket.io';
import { DM, Message, RoomMember, Notification } from '@prisma/client';
import { WebSocketServer } from '@nestjs/websockets';
import { User } from '@prisma/client';
import * as cron from 'node-cron';
import * as bcrypt from 'bcrypt';


interface notifInfo {
  senderId: string;
  receiverId: string;
  type: string;
  roomId?: number;
  matchId?: number;
}

@Injectable()
export class MessageService {
  constructor(private prismaService: PrismaService) {}

  private dmCronState: string = 'off';
  private muteCronState: string = 'off';
  private roomInvCronState: string = 'off';
  async createMessage(payload: messageDTO, server: Server) {
    console.log('sendInfo ===> ',payload)
    const message = await this.prismaService.message.create({
      data: {
        sentAt: payload.sentAt,
        messageContent: payload.messageContent,
        dmId: payload.dmId !== undefined ? payload.dmId : null,
        roomId: payload.dmId === undefined ? payload.roomId : null,
        senderId: payload.senderId
      },
    });
    if (payload.dmId) {
      await this.prismaService.dM.update({
        where: {
          id: payload.dmId,
        },
        data: {
          msg: {
            connect: {
              id: message.id,
            },
          },
          lastUpdate: new Date(),
        },
      });
    } else {
      await this.prismaService.room.update({
        where: {
          id: payload.roomId,
        },
        data: {
          msgs: {
            connect: {
              id: message.id,
            },
          },
          lastUpdate: new Date(),
        },
      });
    }
    await this.prismaService.user.update({
      where: {
        username: payload.senderId,
      },
      data: {
        messages: {
          connect: {
            id: message.id,
          },
        },
      },
    });
    //server vs client emit
    if (payload.dmId)
      server
        .to(payload.dmId.toString().concat('dm'))
        .emit('createdMessage', message);
    else {
      server
        .to(payload.roomId.toString().concat('room'))
        .emit('createdMessage', message);
    }
  }

  async createDm(client: Socket, payload: dmDTO, mapy: Map<string, Socket>) {
    console.log(`payload.receiverName : ${payload.receiverName}`);
    console.log(`payload.senderId : ${payload.senderId}`);
    const user = await this.prismaService.user.findUnique({
      where: {
        username: payload.receiverName,
      },
    });

    const dm = await this.prismaService.dM.create({
      data: {
        creatorId: payload.senderId,
        participants: {
          connect: [{ username: payload.senderId }, { username: user.username }],
        },
      },
    });

    client.emit('createdDm', dm.id);
    if (mapy.get(user.userId)) mapy.get(user.userId).emit('createdDm', dm.id);
    client.join(dm.id.toString().concat('dm'));
    if (mapy.get(user.userId))
      mapy.get(user.userId).join(dm.id.toString().concat('dm'));
    if (this.dmCronState == 'off') {
      this.dmCronState = 'on';  
      cron.schedule('*/5 * * * *', async () => {
        const dms = await this.prismaService.dM.findMany({
          include: {
            msg: true,
            participants: true,
          },
        });
        dms.forEach(
          async (dm: { participants: User[]; msg: Message[] } & DM) => {
            if (dm.msg.length == 0) {
              await this.prismaService.dM.delete({
                where: {
                  id: dm.id,
                },
              });
              if (mapy.get(dm.participants[0].userId)) {
                mapy.get(dm.participants[0].userId).emit('dmDeleted');
                mapy
                  .get(dm.participants[0].userId)
                  .leave(dm.id.toString().concat('dm'));
              }
              if (mapy.get(dm.participants[1].userId)) {
                mapy.get(dm.participants[1].userId).emit('dmDeleted');
                mapy
                  .get(dm.participants[1].userId)
                  .leave(dm.id.toString().concat('dm'));
              }
            }
          },
        );
      });
    }
  }

  async createRoom(
    client: Socket,
    server: Server,
    payload: roomDTO,
    mapy: Map<string, Socket>,
  ) {
    const user = await this.prismaService.user.findUnique({
      where: {
        userId: payload.ownerId,
      },
    });
    const saltRounds: number = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(payload.password, salt);
    const room = await this.prismaService.room.create({
      data: {
        image: payload.image ? payload.image : '',
        RoomName: payload.roomName,
        visibility: payload.visibility,
        password: payload.password ? hash : null,
      },
    });
    const roomMember = await this.prismaService.roomMember.create({
      data: {
        RoomId: room.id,
        memberId: user.userId,
        role: 'OWNER',
        joinTime: payload.joinTime,
      },
    });
    await this.prismaService.room.update({
      where: {
        id: room.id,
      },
      data: {
        RoomMembers: {
          connect: {
            id: roomMember.id,
          },
        },
      },
    });
    await this.prismaService.user.update({
      where: {
        userId: payload.ownerId,
      },
      data: {
        rooms: {
          connect: {
            id: roomMember.id,
          },
        },
      },
    });
    server.emit('createdRoom', room);
    client.join(room.id.toString().concat('room'));
    await this.achievementsProcessing(payload.ownerId, 'Pioneer');
  }

  async changePassword(info: [number, string]) {    
    const saltRounds: number = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(info[1], salt);
    await this.prismaService.room.update({
      where: {
        id: info[0],
      },
      data: {
        password: hash,
      },
    });
  }

  // async getUserNotifications(notifiedUser: string) {
  //   const user = await this.prismaService.user.findUnique({
  //     where: {
  //       userId: notifiedUser,
  //     },
  //     include: {
  //       participantNotifs: {
  //         orderBy: {
  //           createdAt: 'asc',
  //         },
  //       },
  //     },
  //   });
  //   return user.participantNotifs;
  // }

  // async notifProcessing(
  //   mapy: Map<string, Socket>,
  //   subject: string,
  //   notifInfo: notifInfo,
  // ) {
  //   const notifications = await this.getUserNotifications(subject);
  //   if (notifications.length < 100) {
  //     const notif = await this.prismaService.notification.create({
  //       data: notifInfo,
  //     });
  //     await this.prismaService.user.update({
  //       where: {
  //         userId: subject,
  //       },
  //       data: {
  //         participantNotifs: {
  //           connect: {
  //             id: notif.id,
  //           },
  //         },
  //       },
  //     });
  //     if (mapy.get(subject)) mapy.get(subject).emit('notifSent', notif);
  //   } else {
  //     const oldestNotification = notifications[0];
  //     const notif = await this.prismaService.notification.update({
  //       where: {
  //         id: oldestNotification.id,
  //       },
  //       data: notifInfo,
  //     });
  //     if (mapy.get(subject)) mapy.get(subject).emit('notifSent', notif);
  //   }
  // }

  // async sendRoomInvite(
  //   client: Socket,
  //   server: Server,
  //   payload: roomInviteDTO,
  //   mapy: Map<string, Socket>,
  // ) {
  //   let info: notifInfo;
  //   const roomToJoin = await this.prismaService.room.findUnique({
  //     where: {
  //       id: payload.roomId,
  //     },
  //     select: {
  //       RoomMembers: true,
  //       bannedUsers: true,
  //     },
  //   });
  //   if (roomToJoin.bannedUsers.includes(payload.invitee)) {
  //     client.emit('joinedChatRoom', 'failure | banned');
  //     return;
  //   }
  //   const inviteeCheck = await this.prismaService.user.findUnique({
  //     where: {
  //       userId: payload.invitee,
  //     },
  //     include: {
  //       rooms: true,
  //     },
  //   });
  //   inviteeCheck.rooms.forEach((roomMember: RoomMember) => {
  //     if (roomMember.RoomId == payload.roomId) {
  //       client.emit('joinedChatRoom', 'failure | joined');
  //       return;
  //     }
  //   });
  //   info = {
  //     receiverId: payload.invitee,
  //     senderId: payload.senderId,
  //     type: 'roomInvite',
  //     roomId: payload.roomId,
  //   };
  //   this.notifProcessing(mapy, payload.invitee, info);

  //   await this.prismaService.user.update({
  //     where: {
  //       userId: payload.senderId,
  //     },
  //     data: {
  //       roomInvites: {
  //         push: {
  //           userId: payload.invitee,
  //           roomId: payload.roomId,
  //           date: Date(),
  //         },
  //       },
  //     },
  //   });

  //   if (this.roomInvCronState == 'off') {
  //     this.roomInvCronState = 'on';
  //     cron.schedule('* * * * *', async () => {
  //       const candidates = await this.prismaService.user.findMany({
  //         where: {
  //           roomInvites: {
  //             isEmpty: false,
  //           },
  //         },
  //         select: {
  //           roomInvites: true,
  //           userId: true,
  //         },
  //       });
  //       let filteredInvites: JsonValue[];
  //       await Promise.all(
  //         candidates.map(
  //           async (candidate: { userId: string; roomInvites: JsonValue[] }) => {
  //             filteredInvites = candidate.roomInvites.filter((inv: any) => {
  //               const date = new Date(inv[2]);
  //               const newDate = new Date();
  //               const dateDiff =
  //                 (newDate.getTime() - date.getTime()) / (1000 * 60 * 60);
  //               return dateDiff < 24;
  //             });
  //             await this.prismaService.user.update({
  //               where: {
  //                 userId: candidate.userId,
  //               },
  //               data: {
  //                 roomInvites: filteredInvites,
  //               },
  //             });
  //             server.emit('RoomInviteReset');
  //           },
  //         ),
  //       );
  //     });
  //   }
  // }

  async achievementsProcessing(userId: string, achievement: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        userId: userId,
      },
      select: {
        achievements: true,
      },
    });
    if (user.achievements.includes(achievement)) return;
    await this.prismaService.user.update({
      where: {
        userId: userId,
      },
      data: {
        achievements: {
          push: achievement,
        },
      },
    });
  }

  // async roomInviteApproval(
  //   client: Socket,
  //   server: Server,
  //   payload: roomInviteDTO,
  //   mapy: Map<string, Socket>,
  // ) {
  //   const roomToJoin = await this.prismaService.room.findUnique({
  //     where: {
  //       id: payload.roomId,
  //     },
  //     select: {
  //       RoomMembers: true,
  //       bannedUsers: true,
  //     },
  //   });
  //   if (roomToJoin.bannedUsers.includes(payload.invitee)) {
  //     client.emit('joinedChatRoom', 'failure | banned');
  //     return;
  //   }
  //   const inviteeCheck = await this.prismaService.user.findUnique({
  //     where: {
  //       userId: payload.invitee,
  //     },
  //     include: {
  //       rooms: true,
  //     },
  //   });
  //   inviteeCheck.rooms.forEach((roomMember: RoomMember) => {
  //     if (roomMember.RoomId == payload.roomId) {
  //       client.emit('joinedChatRoom', 'failure | joined');
  //       return;
  //     }
  //   });
  //   client.join(payload.roomId.toString().concat('room'));
  //   //change notif state
  //   await this.prismaService.notification.update({
  //     where: {
  //       id: payload.notifId,
  //     },
  //     data: {
  //       read: true,
  //       interactedWith: true,
  //     },
  //   });
  //   const invitee = await this.prismaService.user.findUnique({
  //     where: {
  //       userId: payload.invitee,
  //     },
  //   });
  //   const roomMember = await this.prismaService.roomMember.create({
  //     data: {
  //       RoomId: payload.roomId,
  //       memberId: invitee.userId,
  //       role: 'USER',
  //       joinTime: Date(),
  //       inviterId: payload.senderId,
  //     },
  //   });
  //   const room = await this.prismaService.room.update({
  //     where: {
  //       id: payload.roomId,
  //     },
  //     data: {
  //       RoomMembers: {
  //         connect: {
  //           id: roomMember.id,
  //         },
  //       },
  //     },
  //   });
  //   //update the invitee
  //   await this.prismaService.user.update({
  //     where: {
  //       userId: payload.invitee,
  //     },
  //     data: {
  //       rooms: {
  //         connect: {
  //           id: roomMember.id,
  //         },
  //       },
  //     },
  //   });
  //   server.to(room.id.toString().concat('room')).emit('joinedChatRoom', room);
  //   await this.achievementsProcessing(payload.invitee, 'Extrovert');
  //   //client.emit('joinedChatRoom', room); //emit room to invitee

  //   const sender = await this.prismaService.user.findUnique({
  //     where: {
  //       userId: payload.senderId,
  //     },
  //   });
  //   let info: notifInfo;

  //   info = {
  //     receiverId: payload.invitee,
  //     senderId: payload.senderId,
  //     type: 'roomInviteApproved',
  //   };
  //   this.notifProcessing(mapy, sender.userId, info);
  //   const updatedRoomInvites = sender.roomInvites.filter((element: any) => {
  //     return element.userId != invitee.userId;
  //   });
  //   await this.prismaService.user.update({
  //     where: {
  //       id: sender.id,
  //     },
  //     data: {
  //       roomInvites: updatedRoomInvites,
  //     },
  //   });
  // }

  // async roomInviteRejection(payload: roomInviteDTO, mapy: Map<string, Socket>) {
  //   //change notif state
  //   await this.prismaService.notification.update({
  //     where: {
  //       id: payload.notifId,
  //     },
  //     data: {
  //       read: true,
  //       interactedWith: true,
  //     },
  //   });

  //   const sender = await this.prismaService.user.findUnique({
  //     where: {
  //       userId: payload.senderId,
  //     },
  //   });
  //   let info: notifInfo;

  //   info = {
  //     receiverId: payload.invitee,
  //     senderId: payload.senderId,
  //     type: 'roomInviteRejected',
  //   };
  //   this.notifProcessing(mapy, sender.userId, info);

  //   const invitee = await this.prismaService.user.findUnique({
  //     where: {
  //       userId: payload.invitee,
  //     },
  //   });
  //   const updatedRoomInvites = sender.roomInvites.filter((element: any) => {
  //     return element.userId != invitee.userId;
  //   });
  //   await this.prismaService.user.update({
  //     where: {
  //       id: sender.id,
  //     },
  //     data: {
  //       roomInvites: updatedRoomInvites,
  //     },
  //   });
  // }

  // async notifClicked(payload: roomInviteDTO) {
  //   await this.prismaService.notification.update({
  //     where: {
  //       id: payload.notifId,
  //     },
  //     data: {
  //       read: true,
  //     },
  //   });
  // }

  async getRoomMemberId(payload: actionDTO) {
    let roomMemberId: number;
    const subject = await this.prismaService.user.findUnique({
      where: {
        userId: payload.subjectId,
      },
      include: {
        rooms: true,
      },
    });
    for (let i = 0; i < subject.rooms.length; i++) {
      if (subject.rooms[i].RoomId == payload.roomId)
        roomMemberId = subject.rooms[i].id;
    }
    return { roomMemberId, subject };
  }

  async promoteUser(
    server: Server,
    payload: actionDTO,
    mapy: Map<string, Socket>,
  ) {
    const data = await this.getRoomMemberId(payload);

    await this.prismaService.roomMember.update({
      where: {
        id: data.roomMemberId,
      },
      data: {
        role: 'ADMIN',
      },
    });
    let info: notifInfo;

    info = {
      receiverId: payload.subjectId,
      senderId: payload.userId,
      type: 'promotion',
    };
    // this.notifProcessing(mapy, data.subject.userId, info);
    server.to(payload.roomId.toString().concat('room')).emit('promoted');
    await this.achievementsProcessing(
      payload.subjectId,
      "Who's the boss now, huh?",
    );
    // client.emit('promoted');
    // if (mapy.get(data.subject.userId))
    //   mapy.get(data.subject.userId).emit('promoted');
  }

  async demoteUser(
    server: Server,
    payload: actionDTO,
    mapy: Map<string, Socket>,
  ) {
    const data = await this.getRoomMemberId(payload);

    await this.prismaService.roomMember.update({
      where: {
        id: data.roomMemberId,
      },
      data: {
        role: 'USER',
      },
    });

    let info: notifInfo;

    info = {
      receiverId: payload.subjectId,
      senderId: payload.userId,
      type: 'demotion',
    };
    // this.notifProcessing(mapy, data.subject.userId, info);
    server.to(payload.roomId.toString().concat('room')).emit('demoted');
    // client.emit('demoted');
    // if (mapy.get(data.subject.userId))
    //   mapy.get(data.subject.userId).emit('demoted');
  }

  async muteUser(
    server: Server,
    payload: actionDTO,
    mapy: Map<string, Socket>,
  ) {
    const data = await this.getRoomMemberId(payload);

    let muteExpiration: Date = new Date();
    muteExpiration.setMinutes(muteExpiration.getMinutes() + 5);
    await this.prismaService.roomMember.update({
      where: {
        id: data.roomMemberId,
      },
      data: {
        muted: true,
        muteExpiration: muteExpiration,
      },
    });

    let info: notifInfo;

    info = {
      receiverId: payload.subjectId,
      senderId: payload.userId,
      type: 'mute',
    };
    // this.notifProcessing(mapy, data.subject.userId, info);
    server.to(payload.roomId.toString().concat('room')).emit('muted');
    await this.achievementsProcessing(
      payload.subjectId,
      'Can you please shut up?',
    );
    // client.emit('muted');
    // if (mapy.get(data.subject.userId))
    //   mapy.get(data.subject.userId).emit('muted');

    //Unmute cron job gets launched once when a user gets muted, and starts running continuously
    if (this.muteCronState == 'off') {
      this.muteCronState = 'on';
      cron.schedule('* * * * * *', async () => {
        const mutedUsers = await this.prismaService.user.findMany({
          where: {
            rooms: {
              some: {
                muted: true,
                muteExpiration: {
                  lte: new Date(),
                },
              },
            },
          },
          include: {
            rooms: true,
          },
        });
        await Promise.all(
          mutedUsers.map(async (user: { rooms: RoomMember[] } & User) => {
            for (let i = 0; i < user.rooms.length; i++) {
              if (user.rooms[i].muted == true) {
                await this.prismaService.roomMember.update({
                  where: {
                    id: user.rooms[i].id,
                  },
                  data: {
                    muted: false,
                    muteExpiration: null,
                  },
                });
                info = {
                  receiverId: user.userId,
                  senderId: 'system',
                  type: 'unmute',
                };
                // this.notifProcessing(mapy, user.userId, info);
                server
                  .to(String(user.rooms[i].RoomId).concat('room'))
                  .emit('unmuted');
                // client.emit('unmuted');
                // mapy.get(user.userId).emit('unmuted');
              }
            }
          }),
        );
      });
    }
  }

  async unmuteUser(
    server: Server,
    payload: actionDTO,
    mapy: Map<string, Socket>,
  ) {
    const data = await this.getRoomMemberId(payload);

    await this.prismaService.roomMember.update({
      where: {
        id: data.roomMemberId,
      },
      data: {
        muted: false,
      },
    });

    let info: notifInfo;

    info = {
      receiverId: payload.subjectId,
      senderId: payload.userId,
      type: 'unmute',
    };
    // this.notifProcessing(mapy, data.subject.userId, info);
    server.to(payload.roomId.toString().concat('room')).emit('unmuted');
    // client.emit('unmuted');
    // if (mapy.get(data.subject.userId))
    //   mapy.get(data.subject.userId).emit('unmuted');
  }

  async kickUser(
    server: Server,
    payload: actionDTO,
    mapy: Map<string, Socket>,
  ) {
    const data = await this.getRoomMemberId(payload);

    await this.prismaService.roomMember.delete({
      where: {
        id: data.roomMemberId,
      },
    });

    let info: notifInfo;

    info = {
      receiverId: payload.subjectId,
      senderId: payload.userId,
      type: 'kick',
    };
    // this.notifProcessing(mapy, data.subject.userId, info);
    server
      .to(payload.roomId.toString().concat('room'))
      .emit('kicked', data.subject.userId);
    if (mapy.get(data.subject.userId))
      mapy
        .get(data.subject.userId)
        .leave(payload.roomId.toString().concat('room'));
    // client.emit('kicked');
    // if (mapy.get(data.subject.userId))
    //   mapy.get(data.subject.userId).emit('kicked');
  }

  async banUser(server: Server, payload: actionDTO, mapy: Map<string, Socket>) {
    const data = await this.getRoomMemberId(payload);
    await this.prismaService.roomMember.delete({
      where: {
        id: data.roomMemberId,
      },
    });

    await this.prismaService.room.update({
      where: {
        id: payload.roomId,
      },
      data: {
        bannedUsers: {
          push: data.subject.userId,
        },
      },
    });

    let info: notifInfo;

    info = {
      receiverId: payload.subjectId,
      senderId: payload.userId,
      type: 'ban',
    };
    // this.notifProcessing(mapy, data.subject.userId, info);
    server
      .to(payload.roomId.toString().concat('room'))
      .emit('banned', data.subject.userId);
    if (mapy.get(data.subject.userId))
      mapy
        .get(data.subject.userId)
        .leave(payload.roomId.toString().concat('room'));
    // client.emit('banned');
    // if (mapy.get(data.subject.userId))
    //   mapy.get(data.subject.userId).emit('banned');
  }

  async unbanUser(
    client: Socket,
    server: Server,
    payload: actionDTO,
    mapy: Map<string, Socket>,
  ) {
    const subject = await this.prismaService.user.findUnique({
      where: {
        userId: payload.subjectId,
      },
    });
    const room = await this.prismaService.room.findUnique({
      where: {
        id: payload.roomId,
      },
      select: {
        bannedUsers: true,
      },
    });

    const updatedBannedUsers = room.bannedUsers.filter(
      (userId) => userId != subject.userId,
    );
    await this.prismaService.room.update({
      where: {
        id: payload.roomId,
      },
      data: {
        bannedUsers: updatedBannedUsers,
      },
    });

    let info: notifInfo;

    info = {
      receiverId: payload.subjectId,
      senderId: payload.userId,
      type: 'unban',
    };
    // this.notifProcessing(mapy, subject.userId, info);
    server.to(payload.roomId.toString().concat('room')).emit('unbanned');
    if (mapy.get(subject.userId)) mapy.get(subject.userId).emit('unbanned');
  }

  async OwnershipTransfer(
    server: Server,
    payload: actionDTO,
    mapy: Map<string, Socket>,
  ) {
    const data = await this.getRoomMemberId(payload);
    await this.prismaService.roomMember.update({
      where: {
        id: data.roomMemberId,
      },
      data: {
        role: 'OWNER',
      },
    });
    const owner = await this.prismaService.user.findUnique({
      where: {
        userId: payload.userId,
      },
      include: {
        rooms: true,
      },
    });
    let roomMemberId: number;
    for (let i = 0; i < owner.rooms.length; i++) {
      if (owner.rooms[i].RoomId == payload.roomId)
        roomMemberId = owner.rooms[i].id;
    }
    await this.prismaService.roomMember.update({
      where: {
        id: roomMemberId,
      },
      data: {
        role: 'USER',
      },
    });

    let info: notifInfo;

    info = {
      receiverId: payload.subjectId,
      senderId: payload.userId,
      type: 'ownership transfer',
    };
    // this.notifProcessing(mapy, data.subject.userId, info);
    server.to(payload.roomId.toString().concat('room')).emit('ownership');
    // client.emit('ownership');
    // if (mapy.get(data.subject.userId))
    //   mapy.get(data.subject.userId).emit('ownership');
  }

  async blockUser(
    client: Socket,
    blockedUserId: string,
    mapy: Map<string, Socket>,
  ) {
    let blocker: string;
    for (let entry of mapy.entries()) {
      if (entry[1] == client) blocker = entry[0];
    }
    const blockingUser = await this.prismaService.user.findUnique({
      where: {
        userId: blocker,
      },
      select: {
        friend: true,
      },
    });
    const updatedfriend1 = blockingUser.friend.filter((element: any) => {
      return element.userId != blockedUserId;
    });
    const blockedUser = await this.prismaService.user.findUnique({
      where: {
        userId: blockedUserId,
      },
      select: {
        friend: true,
      },
    });
    const updatedfriend2 = blockedUser.friend.filter((element: any) => {
      return element.userId != blocker;
    });
    await this.prismaService.user.update({
      where: {
        userId: blocker,
      },
      data: {
        blockedUsers: {
          push: blockedUserId,
        },
        friend: updatedfriend1,
      },
    });
    await this.prismaService.user.update({
      where: {
        userId: blockedUserId,
      },
      data: {
        friend: updatedfriend2,
      },
    });
    client.emit('blocked');
    if (mapy.get(blockedUserId)) mapy.get(blockedUserId).emit('blocked');
  }

  async unblockUser(
    client: Socket,
    unblockedUserId: string,
    mapy: Map<string, Socket>,
  ) {
    let blocker: string;
    for (let entry of mapy.entries()) {
      if (entry[1] == client) blocker = entry[0];
    }
    const user = await this.prismaService.user.findUnique({
      where: {
        userId: blocker,
      },
    });
    const updatedBlockedUsers = user.blockedUsers.filter((userId: string) => {
      return userId != unblockedUserId;
    });
    await this.prismaService.user.update({
      where: {
        userId: blocker,
      },
      data: {
        blockedUsers: updatedBlockedUsers,
      },
    });
    client.emit('unblocked');
    if (mapy.get(unblockedUserId)) mapy.get(unblockedUserId).emit('unblocked');
  }

  // async sendFriendRequest(
  //   client: Socket,
  //   befriendedUserId: number,
  //   mapy: Map<string, Socket>,
  // ) {
  //   let issuerId: string;
  //   for (let entry of mapy.entries()) {
  //     if (entry[1] == client) issuerId = entry[0];
  //   }
  //   //send notif to subject
  //   const notifSender = await this.prismaService.user.findUnique({
  //     where: {
  //       userId: issuerId,
  //     },
  //   });
  //   const befriendedUser = await this.prismaService.user.findUnique({
  //     where: {
  //       id: befriendedUserId,
  //     },
  //   });
  //   let info: notifInfo;

  //   info = {
  //     receiverId: befriendedUser.userId,
  //     senderId: notifSender.userId,
  //     type: 'friendRequest',
  //   };
  //   this.notifProcessing(mapy, befriendedUser.userId, info);
  //   //modify issuer's friendlist
  //   await this.prismaService.user.update({
  //     where: {
  //       userId: issuerId,
  //     },
  //     data: {
  //       friend: {
  //         push: {
  //           userId: befriendedUser.userId,
  //           state: 'pending',
  //           date: Date(),
  //         },
  //       },
  //     },
  //   });
  // }

  // async friendRequestApproval(
  //   payload: friendRequestDTO,
  //   mapy: Map<string, Socket>,
  // ) {
    
  //   //modify the befriendedUser's notif
  //   await this.prismaService.notification.update({
  //     where: {
  //       id: payload.notifId,
  //     },
  //     data: {
  //       read: true,
  //       interactedWith: true,
  //     },
  //   });
    
  //   await this.prismaService.user.update({
  //     where: {
  //       userId: payload.befriendedUserId,
  //     },
  //     data: {
  //       friend: {
  //         push: { userId: payload.issuerId, state: 'approved', date: Date() },
  //       },
  //     },
  //   });

  //   const issuer = await this.prismaService.user.findUnique({
  //     where: { userId: payload.issuerId },
  //   });
  //   const updatedfriend = issuer.friend.map((element: any) => {
  //     if (element.userId === payload.befriendedUserId) {
  //       return { userId: payload.issuerId, state: 'approved', date: Date() };
  //     }
  //     return element;
  //   });

  //   await this.prismaService.user.update({
  //     where: {
  //       userId: payload.issuerId,
  //     },
  //     data: {
  //       friend: updatedfriend,
  //     },
  //   });

  //   let info: notifInfo;

  //   info = {
  //     receiverId: payload.issuerId,
  //     senderId: payload.befriendedUserId,
  //     type: 'friendRequestApproved',
  //   };
  //   this.notifProcessing(mapy, issuer.userId, info);
  // }

  // async friendRequestRejection(
  //   payload: friendRequestDTO,
  //   mapy: Map<string, Socket>,
  // ) {
  //   //modify the befriendedUser's notif
  //   await this.prismaService.notification.update({
  //     where: {
  //       id: payload.notifId,
  //     },
  //     data: {
  //       read: true,
  //       interactedWith: true,
  //     },
  //   });
  //   const issuer = await this.prismaService.user.findUnique({
  //     where: {
  //       userId: payload.issuerId,
  //     },
  //   });
  //   const updatedfriend = issuer.friend.filter((element: any) => {
  //     return element.userId != payload.befriendedUserId;
  //   });
  //   await this.prismaService.user.update({
  //     where: {
  //       userId: payload.issuerId,
  //     },
  //     data: {
  //       friend: updatedfriend,
  //     },
  //   });
  //   let info: notifInfo;

  //   info = {
  //     receiverId: payload.issuerId,
  //     senderId: payload.befriendedUserId,
  //     type: 'friendRequestRejected',
  //   };
  //   this.notifProcessing(mapy, issuer.userId, info);
  // }

  //friend notification
  // async friendRequest(
  //   clientId: string,
  //   server: Server,
  //   body: any,
  //   mapy: Map<string, Socket>,
  //   client: Socket,
  // ) {
  //   const receiver = await this.prismaService.user.findFirst({
  //     where: {
  //       userId: body.id,
  //     },
  //     select: {
  //       status: true,
  //     },
  //   });

  //   if (receiver.status !== 'ONLINE') {
  //     client.emit('notifFailed');
  //     return;
  //   }

  //   const notif = await this.prismaService.notification.create({
  //     data: {
  //       senderId: clientId,
  //       type: 'friendRequest',
  //       participant: {
  //         connect: {
  //           userId: body.id,
  //         },
  //       },
  //     },
  //   });

  //   server.to(mapy.get(body.id).id).emit('gotNotif');
  // }

  // async friendRequestAccept(
  //   clientId: string,
  //   server: Server,
  //   body: any,
  //   mapy: Map<string, Socket>,
  //   client: Socket,
  // ) {
  //   await this.prismaService.user.update({
  //     where: {
  //       userId: clientId,
  //     },
  //     data: {
  //       friend: {
  //         push: {
  //           userId: body.senderId,
  //           state: 'approved',
  //           date: Date(),
  //         },
  //       },
  //     },
  //   });

  //   await this.prismaService.user.update({
  //     where: {
  //       userId: body.senderId,
  //     },
  //     data: {
  //       friend: {
  //         push: {
  //           userId: clientId,
  //           state: 'approved',
  //           date: Date(),
  //         },
  //       },
  //     },
  //   });
    
  //   server.emit('friendrequest');

  //   await this.prismaService.notification.deleteMany({
  //     where: {
  //       reciever: clientId,
  //       senderId: body.senderId,
  //       type: body.type,
  //     },
  //   });

  //   client.emit('deleteNotif');
  // }

  // async friendRequestDecline(
  //   clientId: string,
  //   server: Server,
  //   body: any,
  //   mapy: Map<string, Socket>,
  //   client: Socket,
  // ) {
  //   await this.prismaService.notification.deleteMany({
  //     where: {
  //       reciever: clientId,
  //       senderId: body.senderId,
  //     },
  //   });

  //   client.emit('deleteNotif');
  // }

  async roomJoinLogic(client: Socket, server: Server, payload: roomJoinDTO) {
    const joiner = await this.prismaService.user.findUnique({
      where: {
        userId: payload.userId,
      },
    });
    const roomMember = await this.prismaService.roomMember.create({
      data: {
        RoomId: payload.roomId,
        memberId: joiner.userId,
        role: 'USER',
        joinTime: payload.joinDate,
      },
    });
    await this.prismaService.room.update({
      where: {
        id: payload.roomId,
      },
      data: {
        RoomMembers: {
          connect: {
            id: roomMember.id,
          },
        },
      },
    });
    await this.prismaService.user.update({
      where: {
        userId: joiner.userId,
      },
      data: {
        rooms: {
          connect: {
            id: roomMember.id,
          },
        },
      },
    });
    // if the above operations fail, make sure the socket leaves this room
    client.join(payload.roomId.toString().concat('room'));
    server
      .to(payload.roomId.toString().concat('room'))
      .emit('joinedChatRoom', 'success');
    await this.achievementsProcessing(payload.userId, 'Extrovert');
    // client.emit('joinedChatRoom', 'success');
  }

  async roomJoin(server: Server, client: Socket, payload: roomJoinDTO) {
    const roomToJoin = await this.prismaService.room.findUnique({
      where: {
        id: payload.roomId,
      },
      select: {
        password: true,
        bannedUsers: true,
      },
    });
    if (roomToJoin.bannedUsers.includes(payload.userId)) {
      client.emit('joinedChatRoom', 'failure | banned');
      return;
    }

    if (payload.visibility == 'public') {
      this.roomJoinLogic(client, server, payload);
    } else {
      if (await bcrypt.compare(payload.password, roomToJoin.password)) {
        this.roomJoinLogic(client, server, payload);
      } else {
        client.emit('joinedChatRoom', 'failure');
      }
    }
  }

  async roomExit(
    client: Socket,
    server: Server,
    roomId: number,
    mapy: Map<string, Socket>,
  ) {
    let userId: string;

    for (let entry of mapy.entries()) {
      if (entry[1] == client) userId = entry[0];
    }
    await this.prismaService.user.findUnique({
      where: {
        userId: userId,
      },
    });
    const room = await this.prismaService.room.findUnique({
      where: {
        id: roomId,
      },
      include: {
        RoomMembers: true,
      },
    });
    let roomMemberId: number;
    for (let i = 0; i < room.RoomMembers.length; i++) {
      if (room.RoomMembers[i].memberId == userId)
        roomMemberId = room.RoomMembers[i].id;
    }
    await this.prismaService.roomMember.findUnique({
      where: {
        id: roomMemberId,
      },
    });

    await this.prismaService.roomMember.delete({
      where: {
        id: roomMemberId,
      },
    });
    server.to(roomId.toString().concat('room')).emit('leftRoom', userId);
    client.leave(roomId.toString().concat('room'));
    //client.emit("leftRoom", userId);
  }

  async fetchState(client: Socket, userid: string) {

    // console.log('checking userid before findUnique : ', userid);
    // if (userid) {

      const user = await this.prismaService.user.findUnique({
        where: {
          username: userid,
        },
        include: {
          dms: true,
          rooms: true,
          // participantNotifs: true,
        },
      });
      if (user) {
        if (user.dms) {
          user.dms.forEach((dm) => {
            client.join(dm.id.toString().concat('dm'));
          });
        }
        if (user.rooms) {
          user.rooms.forEach((room) => {
            client.join(room.RoomId.toString().concat('room'));
          });
        }
      }
    // }
  }
}
