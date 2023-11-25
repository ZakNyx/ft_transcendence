import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { roomDTO } from "./dto/user.dto";
import * as bcrypt from "bcrypt";

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}
//asdfasdfasddfasddf
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
        picture: true,
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

  // ban users
  async banUser(user, roomName, emails) {
    const room = await this.prismaService.chatRoom.findFirst({
      where: { roomName: roomName },
    });
    if (room.bannedUsers.indexOf(user.email) < 0) {
      return await this.prismaService.chatRoom.update({
        where: { id: room.id },
        data: {
          bannedUsers: {
            push: emails,
          },
        },
      });
    }
    console.log('ban ', room);
    return room;
  }

   // set admin to other users in my room
   async AddAdmin(param) {
    // const member = await this.getUserWithUsername(param.username)
    const room = await this.prismaService.chatRoom.findFirst({
      where: { roomName: param.roomName },
    });
    // if (room?.admins.indexOf(member.email) < 0)
    // {
    return await this.prismaService.chatRoom.update({
      where: { id: room.id },
      data: {
        admins: { push: param.email },
      },
      include: { users: true, messages: true },
    });
    // }
    // return room
  }

  async RemoveAdmin(reqUser, body: roomDTO) {
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
    const updatedAdmins = chatRoom.admins.filter(
      (admin) => admin !== body.username,
    );

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

  async muteUser(reqUser, body: roomDTO) {
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
        mutedUsers: { push: body.username },
      },
    });
  }

  async unmuteUser(reqUser, body: roomDTO) {
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
    const updatedmuted = chatRoom.mutedUsers.filter(
      (muted) => muted !== body.username,
    );

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
      where: { status: { in: ["public", "protected"] } },
      include: {
        users: true,
        messages: true,
      },
    });
    return rooms;
  }

  async getChatRoom(reqUser, name: string) {
    const room = await this.prismaService.chatRoom.findUnique({
      where: { roomName: name },
      include: {
        users: true,
        messages: true,
      },
    });
    if (room?.status == "private") throw new UnauthorizedException({}, "");
    return room;
  }

   // create room {2 users => n users}
   async creatRoom(user, Body) {
    let { roomName, status, password } = Body;
    if (!password) password = '';
    const room = await this.prismaService.chatRoom.findFirst({
      where: { roomName: roomName },
    });
    if (!room) {
      try {
        let hash = await bcrypt.hash(password, 10);
        let room = await this.prismaService.chatRoom.create({
          data: {
            roomName: roomName,
            timeCreate: new Date(Date.now()),
            users: {
              connect: { id: user.id },
            },
            status: status,
            password: hash,
            isDm: Body.isDm,
          },
          include: { users: true, messages: true },
        });
        await this.AddAdmin({ email: [user.email], roomName: Body.roomName });
        return { found: false, room };
      } catch (error) {
      } finally {
        this.prismaService.$disconnect();
      }
    }
    // return {'exist': true, room};
    return { found: true, room };
  }

  // add user to specific room
  async addUserToRoom(user, name) {
    let newRoom: any;
    let room = await this.prismaService.chatRoom.findFirst({
      where: { roomName: name },
    });
    if (!(await this.avoidDuplicate(user, name))) {
      newRoom = await this.prismaService.chatRoom.update({
        where: { id: room.id },
        data: {
          users: {
            connect: {
              id: user.id,
            },
          },
        },
        include: { users: true, messages: true },
      });
    }
    return newRoom;
  }

  // delete user from current room
  async deleteUserFromRoom(user, name) {
    const room = await this.prismaService.chatRoom.findFirst({
      where: { roomName: name },
      include: { users: true },
    });
    try {
      const update = await this.prismaService.chatRoom.update({
        where: { id: room.id },
        data: {
          users: {
            disconnect: {
              id: user.id,
            },
          },
        },
        include: { users: true },
      });
      let neW: any;
      if (update.users.length == 0) {
        await this.prismaService.message.deleteMany({
          where: { roomId: update.id },
        });
        neW = await this.prismaService.chatRoom.delete({
          where: { id: update.id },
        });
      }
      console.log("nw", update.users);
      return update;
    } catch (error) {
      throw new UnauthorizedException({}, "");
    }
  }

  // check user is has already joined
  async avoidDuplicate(user, name) {
    const chatRoom = await this.prismaService.chatRoom.findFirst({
      where: {
        roomName: name,
      },
      include: { users: true },
    });
    return chatRoom.users.find((userId) => userId.id == user.id);
  }

  // add data in message table
  async addDataInMessageTable(data, id, user) {
    const dataTime = new Date();
    let date = ("0" + dataTime.getDate()).slice(-2);
    let month = ("0" + (dataTime.getMonth() + 1)).slice(-2);
    const time =
      dataTime.getFullYear() +
      "-" +
      month +
      "-" +
      date +
      " " +
      " " +
      dataTime.getHours() +
      ":" +
      dataTime.getMinutes();
    const userFind = await this.prismaService.user.findUnique({
      where: { email: user.email },
    });
    // const message = await this.prismaService.message.create({
    //   data: {
    //     data: data,
    //     time: time,
    //     roomId: id,
    //     userId: userFind.id,
    //   },
    // });
    // return message;
  }

  //add data in Room { messages}
  async putDataInDatabase(name, data, req) {
    const room = await this.prismaService.chatRoom.findFirst({
      where: { roomName: name },
    });
    let message: any = await this.addDataInMessageTable(
      data,
      room.id,
      req.user,
    );
    await this.prismaService.chatRoom.update({
      where: {
        id: room.id,
      },
      data: {
        messages: {
          connect: { id: message.id },
        },
      },
    });
    let sender = await this.prismaService.user.findUnique({
      where: { id: message.userId },
    });
    message.sender = sender;
    return message;
  }

  //check user  if have order to join the rrom
  async joiningTheRoom(param) {
    const { roomName, password } = param;
    const room = await this.prismaService.chatRoom.findFirst({
      where: { roomName: roomName },
    });
    if (room.status === "protected") {
      if (!(await bcrypt.compare(password, room.password))) return undefined;
    }
    if (room.status === "private") return undefined;
    return true;
  }

  //get user with username
  async getUserWithUsername(name) {
    return await this.prismaService.user.findFirst({
      where: { username: name },
    });
  }

  //change password of protected room
  async changePasswordOfProtectedRoom(param) {
    const { roomName, password } = param;
    console.log(param);
    const room = await this.prismaService.chatRoom.findFirst({
      where: { roomName: roomName },
    });
    let hash = await bcrypt.hash(password, 10);
    if (room) {
      return await this.prismaService.chatRoom.update({
        where: {
          id: room.id,
        },
        data: {
          password: hash,
        },
      });
    }
    throw new NotFoundException({}, "room not found");
  }

  // delete pass from protected room
  async deletePasswordOfProtectedRoom(param) {
    const { roomName } = param;
    const room = await this.prismaService.chatRoom.findFirst({
      where: { roomName: roomName },
    });
    if (room) {
      return await this.prismaService.chatRoom.update({
        where: {
          id: room.id,
        },
        data: {
          status: "public",
        },
      });
    }
    throw new NotFoundException({}, "room not found");
  }
}
// id       Int      @id @default(autoincrement())

// data     String
// time     String
// roomId   Int
// userId   Int

// user     User     @relation(fields: [userId], references: [id])
// roomData ChatRoom @relation(fields: [roomId], references: [id])