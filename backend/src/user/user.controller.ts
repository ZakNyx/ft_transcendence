import { Body, Controller, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from './user.service';
import { userDTO } from './dto/user.dto';

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
}
