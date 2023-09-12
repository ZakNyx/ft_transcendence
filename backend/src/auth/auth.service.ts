import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { imageLink } from '../strategies/42.strategy';
import { JwtService } from '@nestjs/jwt';
import { twoFacUserDTO, twoFacVerifyDTO, validate2faDTO } from './dto/auth.dto';
import { generateSecretRandomBase32 } from './lib/secret-base32';
import { ConfigService } from '@nestjs/config';
import * as OTPAuth from 'otpauth';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  //adding newuser
  async signup(newUser) {
    //first we check if the user already exists
    let check = await this.prismaService.user.findUnique({
      where: {
        email: newUser.email,
      },
    });
    //if not we create a new one
    if (!check) {
      let user = await this.prismaService.user.create({
        data: {
          username: newUser.username,
          displayname: newUser.username,
          email: newUser.email,
          image_url: imageLink,
          picture:null,
          wins: 0,
          loses: 0,
          elo: 0,
        },
      });
      return user;
    }

    return check;
  }

  async asignJwtToken(username: string, email: string) {
    const token = await this.jwtService.signAsync({ username, email });
    return token;
  }

  async add2fa(userId: twoFacUserDTO) {
    const user = await this.prismaService.user.findUnique({
      where: {
        username: userId.username,
      },
    });

    if (!user) {
      throw new HttpException('User not found', 404);
    }
    const secret = generateSecretRandomBase32();

    const totp = new OTPAuth.TOTP({
      issuer: this.configService.get('ISSUER'),
      label: this.configService.get('LABEL'),
      algorithm: 'SHA1',
      digits: 6,
      period: 30,
      secret: secret,
    });

    const uri = totp.toString();

    const updateuser = await this.prismaService.user.update({
      where: { username: userId.username },
      data: {
        secret_2fa: secret,
        secret_authutl: uri,
      },
    });

    return { uri, secret };
  }

  async verify2fa(body: twoFacVerifyDTO) {
    const user = await this.prismaService.user.findUnique({
      where: {
        username: body.username,
      },
    });

    if (!user) {
      throw new HttpException('User not found', 404);
    }

    const totp = new OTPAuth.TOTP({
      issuer: this.configService.get('ISSUER'),
      label: this.configService.get('LABEL'),
      algorithm: 'SHA1',
      digits: 6,
      period: 30,
      secret: user.secret_2fa,
    });

    const delta = totp.validate({
      token: body.token,
    });

    if (delta === null) {
      throw new HttpException('Invalid token', 400);
    }

    const updatedUser = this.prismaService.user.update({
      where: {
        username: body.username,
      },
      data: {
        status_2fa: true,
      },
    });
    return {
      message: '2fa enabled successfully',
    };
  }

  async validate2fa(body: validate2faDTO) {
    const user = await this.prismaService.user.findUnique({
      where: {
        username: body.username,
      },
    });

    if (!user) {
      throw new HttpException('User not found', 404);
    }

    const totp = new OTPAuth.TOTP({
      issuer: this.configService.get('ISSUER'),
      label: this.configService.get('LABEL'),
      algorithm: 'SHA1',
      digits: 6,
      period: 30,
      secret: user.secret_2fa,
    });

    const delta = totp.validate({
      token: body.token,
    });

    if (delta === null) {
      throw new HttpException('Invalid token', 400);
    }

    const updatedUser = this.prismaService.user.update({
      where: {
        username: body.username,
      },
      data: {
        validated: true,
      },
    });

    return {
      message: '2fa validated successfully',
    };
  }

  async disable2fa(body: twoFacVerifyDTO) {
    const user = await this.prismaService.user.findUnique({
      where: {
        username: body.username,
      },
    });

    if (!user) {
      throw new HttpException('User not found', 404);
    }

    const totp = new OTPAuth.TOTP({
      issuer: this.configService.get('ISSUER'),
      label: this.configService.get('LABEL'),
      algorithm: 'SHA1',
      digits: 6,
      period: 30,
      secret: user.secret_2fa,
    });

    const delta = totp.validate({
      token: body.token,
    });

    if (delta === null) {
      throw new HttpException('Invalid token', 400);
    }

    const updatedUser = this.prismaService.user.update({
      where: {
        username: body.username,
      },
      data: {
        status_2fa: false,
        validated: false,
      },
    });
    return {
      message: '2fa disabled successfully',
    };
  }

  async logout() {}
}