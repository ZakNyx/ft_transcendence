import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsGateway } from './notifications.gateway';
import { PrismaService } from 'src/prisma/prisma.service';
import { jwtWebSocketStrategy } from 'src/strategies/jwtWebSocket.strategy';

@Module({
  providers: [NotificationsGateway, NotificationsService, PrismaService, jwtWebSocketStrategy],
})
export class NotificationsModule {
}
