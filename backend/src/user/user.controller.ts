import { Body, Controller, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from './user.service';
import { roomDTO, userDTO } from './dto/user.dto';

@Controller('user')
@UseGuards(AuthGuard('jwt'))
export class UserController {
  constructor(private userService: UserService) {}

  @Get('leaderboard')
  async Leaderboard() {
    return this.userService.Leaderboard();
  }

  @Put('block')
  async blockUser(@Req() req, @Body() user: userDTO) {
    return this.userService.blockUser(req.user, user.username);
  }

  @Put('unblock')
  async unblockUser(@Req() req, @Body() user: userDTO) {
    return this.userService.unblockUser(req.user, user.username);
  }

  @Put('unfriend')
  async unfriendUser(@Req() req, @Body() user: userDTO) {
    return this.userService.unfriendUser(req.user, user.username);
  }

  @Put('AddAdmin')
  async AddAdmin(@Req() req, @Body() body: roomDTO) {
    return this.userService.AddAdmin(req.user, body);
  }

  @Put('RemoveAdmin')
  async RemoveAdmin(@Req() req, @Body() body: roomDTO) {
    return this.userService.RemoveAdmin(req.user, body);
  }

  @Put('mute')
  async muteUser(@Req() req, @Body() body: roomDTO) {
    return this.userService.muteUser(req.user, body);
  }

  @Put('unmute')
  async unmuteUser(@Req() req, @Body() body: roomDTO) {
    return this.userService.unmuteUser(req.user, body);
  }

  @Get('chatRooms')
  async getChatRooms(@Req() req) {
    return this.userService.getChatRooms(req.user);
  }

  @Get('chatRoom/:name')
  async getChatRoom(@Req() req, @Param('name') name: string) {
    return this.userService.getChatRoom(req.user, name);
  }
}
