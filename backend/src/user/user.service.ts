import {
  HttpException,
  Injectable,
  InternalServerErrorException,
} from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

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
}
