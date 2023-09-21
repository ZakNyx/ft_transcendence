import { Injectable } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ChatService {
  constructor(private prismaService: PrismaService) {
  }
  create(createChatDto: CreateChatDto) {
    return 'This action adds a new chat';
  }

  async findAll(roomId:number) {
    const messages = await this.prismaService.message.findMany({
      where: {

      },
      include: {
        user: true,
      }
    });
  }

}
