import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SearchNameNameDTO, updateNameDTO } from './dto/profile.dto';
import * as fs from 'fs/promises';
import axios from 'axios';

@Injectable()
export class ProfileService {
  constructor(private readonly prismaService: PrismaService) {}

  async searchName(body: string) {
    const users = await this.prismaService.user.findMany({
      where: {
        username: {
          contains: body,
        },
      },
      select: {
        username: true,
      },
    });
    console.log(users);
    return users;
  }

  async ProfileMe(reqUser){
    const user = await this.prismaService.user.findUnique({
      where: {
        username: reqUser.username,
      },
    });
    console.log(user);
    return user;
  }

  
  async profilePicture(username, res) {
    try {
      const user = await this.prismaService.user.findUnique({
        where: {
          username: username,
        },
      });
      if (user.picture) {
        const imageBuffer = await fs.readFile(user.picture);
        res.setHeader('Content-Type', user.pictureMimetype);
        res.send(imageBuffer);
      } else {
        const url_image = await axios.get(user.imageUrl , { responseType: 'arraybuffer' });
        const imageBuffer = Buffer.from(url_image.data, 'binary');
        res.setHeader('Content-Type', 'image/jpg');
        res.send(imageBuffer);
      }
    } catch (error) {
      res.status(500).send('could not upload the image');
    }
  }

  async updateName(body: updateNameDTO, req) {
    const user = await this.prismaService.user.findUnique({
      where: {
        displayname: body.name,
      },
    });
    if (user) {
      return new HttpException('name taken', 400);
    }
    const updateUser = await this.prismaService.user.update({
      where: {
        username: req.user.username,
      },
      data: {
        displayname: body.name,
      },
    });
    return { message: 'Name updated successfully' };
  }

  async updatePicture(filepath, req, mimetype) {
    const updateUser = await this.prismaService.user.update({
      where: {
        username: req.user.username,
      },
      data: {
        picture: filepath,
        pictureStatus: true,
        pictureMimetype: mimetype,
      },
    });
  }

  async deletePicture(req) {
    const user = await this.prismaService.user.findUnique({
      where: {
        username: req.user.username,
      },
    });
    if (user.pictureStatus === true) {
      await fs.unlink(req.user.picture);
    }
    const updateUser = await this.prismaService.user.update({
      where: {
        username: req.user.username,
      },
      data: {
        picture: './uploads/default.png',
        pictureStatus: false,
      },
    });
  }

  async deleteName(req) {
    const updateUser = await this.prismaService.user.update({
      where: {
        username: req.user.username,
      },
      data: {
        displayname: null,
      },
    });
  }
}
