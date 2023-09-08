import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from './user.service';

@Controller('user')
@UseGuards(AuthGuard('jwt'))
export class UserController {
  constructor(private userService: UserService) {}

  @Get('me')
  getMe(@Req() req) {
    return this.userService.getMe(req.user);
  }

  @Get(':username')
  getUser(@Param('username') username: string) {
    return this.userService.getUser(username);
  }
  
}
