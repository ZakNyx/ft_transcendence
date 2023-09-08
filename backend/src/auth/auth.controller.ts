import { Body, Controller, Get, Post, Put, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { twoFacUserDTO, twoFacVerifyDTO, validate2faDTO } from './dto/auth.dto';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get()
  @UseGuards(AuthGuard('42'))
  async signin(@Req() req) {}

  @Get('auth/redirect')
  @UseGuards(AuthGuard('42'))
  async signinRedired(@Req() req, @Res({ passthrough: true }) res) {
    const user = await this.authService.signup(req.user);
    const token = await this.authService.asignJwtToken(user.username, user.email);
    console.log(token);
    res.cookie('token', token);
    res.redirect('http://localhost:5173/home');
  }

  @Post('2fa')
  @UseGuards(AuthGuard('jwt'))
  add2fa(@Body() user: twoFacUserDTO) {
    return this.authService.add2fa(user);
  }

  @Put('2fa/verify')
  @UseGuards(AuthGuard('jwt'))
  verify2fa(@Body() body: twoFacVerifyDTO) {
    return this.authService.verify2fa(body);
  }

  @Put('2fa/validate')
  @UseGuards(AuthGuard('jwt'))
  validate2fa(@Body() body: validate2faDTO) {
    return this.authService.validate2fa(body);
  }

  @Put('2fa/disable')
  @UseGuards(AuthGuard('jwt'))
  disable2fa(@Body() body: twoFacVerifyDTO) {
    return this.authService.disable2fa(body);
  }

  @Post('logout')
  @UseGuards(AuthGuard('jwt'))
  logout() {}
}
