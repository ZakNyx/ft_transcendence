import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { async } from 'rxjs';
import { roomDTO } from '../dto/chatDto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Socket } from 'socket.io';
import { RoomMember, Room, User, DM, Message } from '@prisma/client';

@Injectable()
export class HttpService {
  constructor(private prismaService: PrismaService) {}
  
  async checkBlocked(userId: string, blockedUserId: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        username: userId,
      },
    });
    return user.blockedUsers.includes(blockedUserId);
  }

  compareMessages(a: Message, b: Message): number {

    const dateA = new Date(a.sentAt);
    const dateB = new Date(b.sentAt);
    if (dateA < dateB) {
      return -1;
    } else if (dateA > dateB) {
      return 1;
    } else {
      return 0;
    }
  }

  compareMessagesComplex(a: [Message, string], b: [Message, string]): number {
    const messageA = a[0];
    const messageB = b[0];

    const dateA = new Date(messageA.sentAt);
    const dateB = new Date(messageB.sentAt);
    if (dateA < dateB) {
      return -1;
    } else if (dateA > dateB) {
      return 1;
    } else {
      return 0;
    }
  }

  async fetchRooms(userId: string) {
    const rooms = await this.prismaService.room.findMany({
      where: {
        RoomMembers: {
          some: {
            memberId: userId,
          },
        },
      },
      include: {
        msgs: true,
      },
      orderBy: {
        lastUpdate: 'desc',
      },
    });
    const asyncOperations = rooms.map(async (room) => {
      room.msgs = await Promise.all(room.msgs.map(async (msg) => {
        const res = await this.checkBlocked(userId, msg.senderId);
        return !res ? msg : null;
      }));
      room.msgs = room.msgs.filter((msg) => msg !== null);
      room.msgs.sort(this.compareMessages);
      return room
    });
    await Promise.all(asyncOperations);
    return rooms;
  }

  async fetchRoomContent(roomId: number, userId: string) {
    let customArray: [Message, string][] = [];
    let muted: boolean = false;
    let accessCheck: boolean = false;
    const user = await this.prismaService.user.findUnique({
      where: {
        username: userId,
      },
      select: {
        image: true,
        rooms: true,
      },
    });
    user.rooms.map((roomMember : RoomMember) => {
      if (roomMember.RoomId == roomId) {
        accessCheck = true;
      }
    })
    if (!accessCheck) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
    const room = await this.prismaService.room.findUnique({
      where: {
        id: roomId,
      },
      include: {
        msgs: true,
      },
    });
    const asyncOperations = room.msgs.map(async (msg) => {
      if (!(await this.checkBlocked(userId, msg.senderId))) {
        const sender = await this.prismaService.user.findUnique({
          where: {
            username: msg.senderId,
          },
        });
        customArray.push([msg, sender.image]);
      }
    });
    for (let i = 0; i < user.rooms.length; i++) {
      if (user.rooms[i].RoomId == roomId && user.rooms[i].muted == true)
        muted = true;
    }
    await Promise.all(asyncOperations);
    customArray.sort(this.compareMessagesComplex);
    return {
      msgs: customArray,
      roomName: room.RoomName,
      roomImage: room.image,
      roomId: room.id,
      userImage: user.image,
      muted: muted,
    };
  }

  async fetchRoomsToJoin(userId: string) {
    const rooms = await this.prismaService.room.findMany({
      where: {
        NOT: {
          RoomMembers: {
            some: {
              memberId: userId,
            },
          },
        },
      },
      select: {
        id: true,
        image: true,
        RoomName: true,
        visibility: true,
        password: true,
        bannedUsers: true,
      },
    });
    const filteredRooms = rooms.filter((room: Room) => {
      if (room.visibility != 'private' && !room.bannedUsers.includes(userId))
        return room;
    });
    return filteredRooms;
  }

  async fetchDMs(userId: string) {
    const dms = await this.prismaService.dM.findMany({
      where: {
        participants: {
          some: {
            // The type of userId is Login not database userId
            username: userId,
          },
        },
        OR: [
          {
            msg: {
              some: {}, // not empty
            },
          },
          {
            NOT: {
              msg: {
                some: {},
              },
            },
            AND: {
              // The type of creatorId is Login not database userId
              creatorId: userId,
            },
          },
        ],
      },
      include: {
        participants: {
          where: {
            NOT: {
              // The type of userId is Login not database userId
              username: userId,
            },
          },
          select: {
            userId: true,
            username: true,
            image: true,
            blockedUsers: true,
          },
        },
        msg: true,
      },
      orderBy: {
        lastUpdate: 'desc',
      },
    });

    // console.log("dms: ",dms)
    
    const currentUser = await this.prismaService.user.findUnique({
      where: {
        username: userId,
      },
    });

    let customArray: [number, Message[], User[]][] = [];
    dms.forEach((dm: { participants: User[]; msg: Message[] } & DM) => {
      if (
        !dm.participants[0].blockedUsers.includes(userId) &&
        !currentUser.blockedUsers.includes(dm.participants[0].userId)
      ) {
        dm.msg.sort(this.compareMessages)
        customArray.push([dm.id, dm.msg, dm.participants]);
      }
    });
    // console.log("customarray: ", customArray)
    return customArray;
  }

  async fetchDMContent(dmId: number, userId: string) {
    
    const currentUser = await this.prismaService.user.findUnique({
      where: {
        username: userId,
      },
      include: {
        dms: true,
      }
    });

    let accessCheck: boolean = false;
    currentUser.dms.map((dm: DM) => {
      if (dm.id == dmId) {
        accessCheck = true;
      }
    })

    if (!accessCheck) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    const dm = await this.prismaService.dM.findUnique({
      where: {
        id: dmId,
      },
      include: {
        participants: {
          where: {
            NOT: {
              username: userId,
            },
          },
          select: {
            userId: true,
            displayname: true,
            image: true,
          },
        },
        msg: true,
      },
    });

    const ownImage = await this.prismaService.user.findUnique({
      where: {
        username: userId,
      },
      select: {
        image: true,
      },
    });

    dm.msg.sort(this.compareMessages);
    return { dm: dm, image: ownImage };
  }

  async  addPeopleFetch(userId: string) {

    const currentUser = await this.prismaService.user.findUnique({
      where: {
        username: userId,
      },
      include: {
        dms: true,
        blocks: true,
        blockedBy: true,
      },
    });

    currentUser.blocks.map((key: any) => {
      console.log('key : ', key.username);
    });

    const blockedUserIds = currentUser.blockedUsers.map(
      (blockedUser) => blockedUser,
    );

    const dmIds = currentUser.dms.map((dm) => dm.id);

    const users = await this.prismaService.user.findMany({
      where: {
        NOT: {
          username: {
            in: blockedUserIds,
          },
        },
        AND: [
          {
            NOT: {
              dms: {
                some: {
                  id: {
                    in: dmIds,
                  },
                },
              },
            },
          },
        ],
        username: {
          not: userId,
        },
      },
    });

    const filteredUsers = users.filter((user) => {
      if (!user.blockedUsers.includes(userId)) {
        return user;
      }
    });

    return filteredUsers;
  }

  async fetchRoomSuggestions(roomId: number, userId: string) {
    const currentUser = await this.prismaService.user.findUnique({
      where: {
        username: userId,
      },
      include: {
        rooms: true,
      }
    });
    let accessCheck: boolean = false;
    currentUser.rooms.map((roomMember : RoomMember) => {
      if (roomMember.RoomId == roomId) {
        accessCheck = true;
      }
    })
    if (!accessCheck) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
    const subjectRoom = await this.prismaService.room.findUnique({
      where: {
        id: roomId,
      },
      select: {
        bannedUsers: true,
      },
    });

    const users = await this.prismaService.user.findMany({
      where: {
        OR: [
          {
            NOT: {
              rooms: {
                some: {
                  RoomId: roomId,
                },
              },
            },
          },
          {
            rooms: {
              none: {},
            },
          },
        ],
        AND: [
          {
            NOT: {
              username: {
                in: currentUser.blockedUsers,
              },
            },
          },
          {
            NOT: {
              username: {
                in: subjectRoom.bannedUsers,
              },
            },
          },
        ],
      },
    });

    const nonBlockedUsers = users.filter((user: User) => {
      return !user.blockedUsers.includes(userId)
    })
    const filteredUsers = nonBlockedUsers.filter((user) => {
      if (currentUser.roomInvites.length == 0)
        return true;
      for (let i = 0; i < currentUser.roomInvites.length; i++) {
        if (
          // I changed user.userId to user.username
          currentUser.roomInvites[i][0] == user.username &&
          currentUser.roomInvites[i][1] == roomId
        ) {
          return false;
        }
      }
    });
    return filteredUsers;
  }

  sortMembers(
    members: ({ rooms: RoomMember[] } & User)[],
    room: { RoomMembers: RoomMember[] } & Room,
  ) {
    let sortedMembers: ({ rooms: RoomMember[] } & User)[] = [];
    let owner: { rooms: RoomMember[] } & User;
    let admins: ({ rooms: RoomMember[] } & User)[] = [];
    let users: ({ rooms: RoomMember[] } & User)[] = [];

    members.forEach((member) => {
      if (member.rooms[0].role == 'OWNER') owner = member;
      if (member.rooms[0].role == 'ADMIN') admins.push(member);
      if (member.rooms[0].role == 'USER') users.push(member);
    });
    sortedMembers.push(owner, ...admins, ...users);
    return sortedMembers;
  }

  async fetchRoomDashboard(roomId: number, userId: string) {
    const currentUser = await this.prismaService.user.findUnique({
      where: {
        username: userId,
      },
      include: {
        rooms: true,
      }
    });
    let accessCheck: boolean = false;
    currentUser.rooms.map((roomMember : RoomMember) => {
      if (roomMember.RoomId == roomId) {
        accessCheck = true;
      }
    })
    if (!accessCheck) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
    const room = await this.prismaService.room.findUnique({
      where: {
        id: roomId,
      },
      include: {
        RoomMembers: true,
      },
    });
    const members = await this.prismaService.user.findMany({
      where: {
        rooms: {
          some: {
            RoomId: roomId,
          },
        },
      },
      include: {
        rooms: {
          where: {
            RoomId: roomId,
          },
        },
      },
    });
    const fetcher = await this.prismaService.user.findUnique({
      where: {
        username: userId,
      },
      include: {
        rooms: true,
      },
    });
    let roomMemberId: number;
    for (let i = 0; i < fetcher.rooms.length; i++) {
      if (fetcher.rooms[i].RoomId == roomId) roomMemberId = fetcher.rooms[i].id;
    }
    const roomMember = await this.prismaService.roomMember.findUnique({
      where: {
        id: roomMemberId,
      },
      select: {
        role: true,
      },
    });
    return {
      room: room,
      participants: this.sortMembers(members, room),
      role: roomMember.role,
    };
  }

  async fetchBannedUsers(roomId: number, userId: string) {
    let accessCheck: boolean = false;
    const user = await this.prismaService.user.findUnique({
      where: {
        username: userId,
      },
      select: {
        rooms: true,
      }
    })
    user.rooms.map((roomMember : RoomMember) => {
      if (roomMember.RoomId == roomId && (roomMember.role == 'OWNER' || roomMember.role == 'ADMIN')) {
        accessCheck = true;
      }
    })
    if (!accessCheck) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
    const room = await this.prismaService.room.findUnique({
      where: {
        id: roomId,
      },
    });
    const members = await this.prismaService.user.findMany({
      where: {
        username : {
          in: room.bannedUsers,
        },
      },
      select: {
        userId: true,
        username: true,
        image: true,
      },
    });
    return members;
    
  }
}
