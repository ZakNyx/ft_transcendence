import { Module } from '@nestjs/common';
import { HttpService } from './http.service';
import { HttpController } from './http.controller';
import { PrismaService } from 'src/prisma/prisma.service';


@Module({
  controllers: [HttpController],
  providers: [HttpService, PrismaService],
})
export class HttpModule {}
