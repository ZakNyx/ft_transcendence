import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Req,
  Res,
  Param,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ProfileService } from './profile.service';
import { SearchNameNameDTO, updateNameDTO, updatePictureDTO } from './dto/profile.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import multer from 'multer';
import * as mimeTypes from 'mime-types';

@Controller('profile')
@UseGuards(AuthGuard('jwt'))
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get('SearchName/:search')
  async SearchName(@Param('search') search: string, @Req() req) {
    return await this.profileService.searchName(search, req.user);
  }


  @Get('me')
  async ProfileMe(@Req() req)
  {
    return await this.profileService.ProfileMe(req.user);
  }

  @Get('friends')
  getMyFriends(@Req() req) {
    return this.profileService.getMyFriends(req.user);
  }

  @Get('requests')
  getMyRequests(@Req() req) {
    return this.profileService.getMyRequests(req.user);
  }

  @Get('blocks')
  getMyBlocks(@Req() req) {
    return this.profileService.getMyBlocks(req.user);
  }

  @Get(':username')
  async getProfile(@Param('username') username: string, @Req() req){
    return await this.profileService.getProfile(username, req.user);
  }

  @Get('ProfilePicture/me')
  async ProfilePictureMe(@Res() res, @Req() req) {
    return await this.profileService.profilePictureMe(req.user, res);
  }


  @Get('ProfilePicture/:username')
  async ProfilePicture(@Res() res, @Param('username') username: string) {
    return await this.profileService.profilePicture(username, res);
  }

  @Put('updateName')
  async updateName(@Body() body: updateNameDTO, @Req() req) {
    return await this.profileService.updateName(body, req);
  }

  @Post('updatePicture')
  @UseInterceptors(
    FileInterceptor('updatePicture', {
      storage: multer.diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const user = req['user'];
          const extention = mimeTypes.extension(file.mimetype);
          const filename = user['username'] + '.' + extention;
          return callback(null, filename);
        },
      }),
      fileFilter: (req, file, callback) => {
        const allowedMimes = ['image/jpeg', 'image/png', 'image/jpg'];
        if (!allowedMimes.includes(file.mimetype)) {
          return callback(new BadRequestException('File type not allowed'), false);
        }
        if (file.size > 1024 * 1024) {
          // 1MB in bytes
          return callback(new BadRequestException('File size exceeds 1MB limit'), false);
        }
        callback(null, true);
      },
    }),
  )
  async updatePicture(@UploadedFile() file, @Req() req) {
    return await this.profileService.updatePicture(file.path, req, file.mimetype);
  }

  @Delete('deleteName')
  async deleteName(@Req() req) {
    return await this.profileService.deleteName(req);
  }

  @Delete('deletePicture')
  async deletePicture(@Req() req) {
    return await this.profileService.deletePicture(req);
  }
}
