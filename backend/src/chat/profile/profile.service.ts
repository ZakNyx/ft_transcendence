import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class ProfileService {
  constructor(private prisma: PrismaService) {}

  async userNotif(reqUser) {
    const notifs = await this.prisma.notification.findMany({
      where: {
        reciever: reqUser.userId,
      },
    });
    return notifs;
  }

  async search(name: string, userId: string) {
    const searcher = await this.prisma.user.findUnique({
      where: {
        userId: userId,
      },
      select: {
        blockedUsers: true,
      },
    });
    // console.log('searcher: ', searcher);
    let users = await this.prisma.user.findMany({
      where: {
        username: {
          startsWith: name,
        },
        userId: {
          notIn: searcher.blockedUsers,
          not: userId,
        },
      },
    });
    users = users.filter((user: User) => !user.blockedUsers.includes(userId));
    if (!users) {
      throw new HttpException('User Not found!', HttpStatus.NOT_FOUND);
    }
    return { users };
  }

  async getBlockedUsers(userId: string) {
    const searcher = await this.prisma.user.findUnique({
      where: {
        userId: userId,
      },
      select: {
        blockedUsers: true,
      },
    });
    const users = await this.prisma.user.findMany({
      where: {
        userId: {
          in: searcher.blockedUsers,
        },
      },
    });
    return users;
  }

  async getLeaderBoard() {
    return await this.prisma.user.findMany({
      select: {
        id: true,
        userId: true,
        username: true,
        wins: true,
        loses: true,
        image: true,
      },
    });
  }

  async getFriendsList(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        userId: userId,
      },
    });
    const friendArray: any[] = user.friend.filter(
      (item: any) => item.state === 'approved',
    );
    const friendIDs = friendArray.map((friendObject: any) => {
      return String(friendObject.userId);
    });
    const friend = await this.prisma.user.findMany({
      where: {
        userId: {
          in: friendIDs,
        },
      },
    });
    return friend;
  }

  async getAchievements(userId: string) {
    return await this.prisma.user.findUnique({
      where: {
        userId: userId,
      },
      select: {
        achievements: true,
      },
    });
  }

  async getAllUsernames() {
    return await this.prisma.user.findMany({
      select: {
        username: true,
      },
    });
  }

  async getChatData(userId : string) {
    return await this.prisma.user.findUnique({
      where: {
        userId: userId,
      },
    });
  }
}
