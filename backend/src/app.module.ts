import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { ProfileModule } from './profile/profile.module';
import { NotificationsModule } from './notifications/notifications.module';
import { SocketModule } from './socket/socket.module'
import { HttpModule } from './chat/http/http.module';
import { MessageModule } from './chat/message/message.module';



@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    PrismaModule,
    UserModule,
    ProfileModule,
    NotificationsModule,
    SocketModule,
    HttpModule,
    MessageModule,
    ProfileModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AppModule {}
