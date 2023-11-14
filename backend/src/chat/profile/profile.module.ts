import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  providers: [ProfileService],
  controllers: [ProfileController],
  imports: [PrismaModule],
})
export class ProfileModule {}
