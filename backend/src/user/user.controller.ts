import { Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from './user.service';

@Controller('user')
@UseGuards(AuthGuard('jwt'))
export class UserController {
  constructor(private userService: UserService) {}

  @Get('leaderboard')
  async Leaderboard() {
    return this.userService.Leaderboard();
  }

  
  @Post('block/:username')
  async blockUser(@Req() req, @Param('username') username: string) {
    return this.userService.blockUser(req.user, username);
  }

  @Post('unblock/:username')
  async unblockUser(@Req() req, @Param('username') username: string) {
    return this.userService.unblockUser(req.user, username);
  }

  @Post('unfriend/:username')
  async unfriendUser(@Req() req, @Param('username') username: string) {
    return this.userService.unfriendUser(req.user, username);
  }
}
