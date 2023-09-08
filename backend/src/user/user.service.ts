import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async getMe(userMe) {
    const user = await this.prismaService.user.findUnique({
      where: { username: userMe.username },
    });

    if (!user) {
      throw new HttpException('User not found', 404);
    }

    return {user};
  }

  async getUser(username: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        username,
      },
    });

    if (!user) {
      throw new HttpException('User not found', 404);
    }

    return user;
  }
}
