// game.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class GameService {
  constructor(private prisma: PrismaService) {}

  async getGameById(id: number) {
    return this.prisma.game.findUnique({
      where: { id },
    });
  }

  // async getUserGames(userid: number) {
  //   return this.prisma.game.findMany({
  //     where: {
  //       users: {
  //         some: {
  //           id: userid,
  //         }
  //       }

  //     },

  //     include: {
  //       users: true,
  //     },

  //   })
  // }


  async getUserGamesByUsername(username: string) {
    const games = await this.prisma.game.findMany({
      where: {
        OR: [
          {
            player1: username,
          },
          {
            player2: username,
          },
        ]
      },

      orderBy: {
        createdAt: 'desc',
    },

      include: {
        users: true,
      },

    })
    return games;

  }
}
