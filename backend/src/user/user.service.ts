import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { roomDTO } from "./dto/user.dto";
import { async } from "rxjs";

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async Leaderboard() {
    const users = await this.prismaService.user.findMany({
      orderBy: {
        elo: "desc",
      },
      select: {
        username: true,
        displayname: true,
        elo: true,
        gamesPlayed: true,
        wins: true,
        winrate: true,
      },
    });
    return users;
  }

  async blockUser(reqUser, toBlockUser: string) {
    try {
      await this.unfriendUser(reqUser, toBlockUser);
      await this.addUserToBlocking(reqUser, toBlockUser);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async unfriendUser(reqUser, toUnfriendUser: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        username: reqUser.username,
      },
    });

    const unfriendUser = await this.prismaService.user.findUnique({
      where: {
        username: toUnfriendUser,
      },
    });

    if (!user || !unfriendUser) {
      throw new HttpException("User not found", 404);
    }

    await this.prismaService.user.update({
      where: {
        username: user.username,
      },
      data: {
        friends: {
          disconnect: {
            username: unfriendUser.username,
          },
        },
      },
    });

    await this.prismaService.user.update({
      where: {
        username: unfriendUser.username,
      },
      data: {
        friends: {
          disconnect: {
            username: user.username,
          },
        },
      },
    });

    await this.prismaService.user.update({
      where: {
        username: unfriendUser.username,
      },
      data: {
        requested: {
          disconnect: {
            username: user.username,
          },
        },
      },
    });
    await this.prismaService.user.update({
      where: {
        username: unfriendUser.username,
      },
      data: {
        requestedBy: {
          disconnect: {
            username: user.username,
          },
        },
      },
    });
  }

  async addUserToBlocking(reqUser, toBlockUser: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        username: reqUser.username,
      },
    });

    const updatedUser = await this.prismaService.user.update({
      where: {
        username: user.username,
      },
      data: {
        blocks: {
          connect: {
            username: toBlockUser,
          },
        },
      },
    });
  }

  async unblockUser(reqUser, toUnblockUser: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        username: reqUser.username,
      },
    });

    const updatedUser = await this.prismaService.user.update({
      where: {
        username: user.username,
      },
      data: {
        blocks: {
          disconnect: {
            username: toUnblockUser,
          },
        },
      },
    });
  }

  async AddAdmin(reqUser, body:roomDTO) {
    const user = await this.prismaService.user.findUnique({
      where: {
        username: reqUser.username,
      },
    });

    return await this.prismaService.chatRoom.update({
      where: {
        roomName: body.roomname,
      },
      data: {
        admins: {push: body.username,},
        },
      },);
  }

  async RemoveAdmin(reqUser, body:roomDTO) {
    const user = await this.prismaService.user.findUnique({
      where: {
        username: reqUser.username,
      },
    });
  
    const chatRoom = await this.prismaService.chatRoom.findUnique({
      where: {
        roomName: body.roomname,
      },
    });
  
    // Filter out the specified admin from the admins array
    const updatedAdmins = chatRoom.admins.filter(admin => admin !== body.username);
  
    // Update the chatRoom with the modified admins array
    return await this.prismaService.chatRoom.update({
      where: {
        roomName: body.roomname,
      },
      data: {
        admins: updatedAdmins,
      },
    });
  }

  async muteUser(reqUser, body:roomDTO) {
    const user = await this.prismaService.user.findUnique({
      where: {
        username: reqUser.username,
      },
    });

    return await this.prismaService.chatRoom.update({
      where: {
        roomName: body.roomname,
      },
      data: {
        mutedUsers: {push: body.username,},
        },
      },);
  }

  async unmuteUser(reqUser, body:roomDTO) {
    const user = await this.prismaService.user.findUnique({
      where: {
        username: reqUser.username,
      },
    });
  
    const chatRoom = await this.prismaService.chatRoom.findUnique({
      where: {
        roomName: body.roomname,
      },
    });
  
    // Filter out the specified admin from the admins array
    const updatedmuted = chatRoom.mutedUsers.filter(muted => muted !== body.username);
  
    // Update the chatRoom with the modified admins array
    return await this.prismaService.chatRoom.update({
      where: {
        roomName: body.roomname,
      },
      data: {
        admins: updatedmuted,
      },
    });
  }

  async getChatRooms(reqUser) {
    const rooms = await this.prismaService.chatRoom.findMany({
      where: {status: {in: ['public', 'protected']}},
      include: {
        users:true,
        messages:true,
      }
    });
    return rooms;
  }

  async getChatRoom(reqUser, name: string) {
    const room = await this.prismaService.chatRoom.findUnique({
      where: {roomName: name},
      include: {
        users:true,
        messages:true,
      }
    })
    if (room?.status == 'private') 
      throw new UnauthorizedException({}, '');
    return room;
  }

  
}
