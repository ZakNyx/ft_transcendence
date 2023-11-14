import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ProfileService } from './profile.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { PrismaService } from 'src/prisma/prisma.service';
import { request } from 'http';
import { PrismaClient } from '@prisma/client';
import * as path from 'path';
import * as fs from 'fs';

@Controller('profile')
export class ProfileController extends PrismaClient {
  constructor(private readonly profile: ProfileService) {
    super();
  }

  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @Get()
  async Search(@Query('name') name: string, @Req() request: Request) {
    return await this.profile.search(name, request['user'].userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('leaderboard')
  async getLeaderboard() {
    return this.profile.getLeaderBoard();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('friends')
  async getFriends(@Req() request: any) {
    return await this.profile.getFriendsList(request.user.userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('BlockedUsers')
  async getBlockedUsers(@Req() request: any) {
    return await this.profile.getBlockedUsers(request.user.userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './files',
        filename: (req, file, callback) => {
          const fileName =
            Date.now() +
            '-' +
            Math.round(Math.random() * 1e9) +
            extname(file.originalname);
          callback(null, fileName);
        },
      }),
    }),
  )
  async handleupload(
    @UploadedFile() file: Express.Multer.File,
    @Req() request: Request,
  ) {
    let user = await this.user.update({
      where: {
        userId: request['user'].userId,
      },
      data: {
        image:
          'http://localhost:3003/profile/images/' +
          file.path.replace('files/', ''),
      },
    });
  }
  @UseGuards(AuthGuard('jwt'))
  @Get('images/:imageName')
  giveImage(@Param('imageName') imageName: string, @Res() response: any) {
    const path = './files/' + imageName;
    if (!fs.existsSync(path)) throw new NotFoundException();
    return response.sendFile('./files/' + imageName, { root: './' });
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('setusername')
  async updateUsername(@Req() request: any, @Body() username: any) {
    // console.log(username.username);
    const updatedUser = await this.user.update({
      where: {
        userId: request.user.userId,
      },
      data: {
        username: username.username,
      },
    });
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('notif')
  async getNotif(@Req() request: any) {
    return await this.profile.userNotif(request.user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('usernames')
  async getAllUsernames() {
    return this.profile.getAllUsernames();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('achievements')
  async getAchievements(@Req() request: any) {
    return this.profile.getAchievements(request.user.userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('achievementsProfile')
  async getProfileAchievements(@Query('id') id: string, @Req() request: any) {
    return this.profile.getAchievements(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('chatUserProfile')
  async chatUserProfile(@Query('id') id: string, @Req() request: any) {
    return this.profile.getChatData(id);
  }
}
                 