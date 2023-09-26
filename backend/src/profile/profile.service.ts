import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { SearchNameNameDTO, updateNameDTO } from "./dto/profile.dto";
import * as fs from "fs/promises";
import axios from "axios";

@Injectable()
export class ProfileService {
  constructor(private readonly prismaService: PrismaService) {}

  async searchName(body: string, reqUser) {
    const user = await this.prismaService.user.findUnique({
      where: {
        username: reqUser.username,
      },
      include: {
        friends: true,
        blocks: true,
        blockedBy: true,
        requested: true,
      },
    });

    let users: any = await this.prismaService.user.findMany({
      where: {
        displayname: {
          contains: body,
        },
      },
      select: {
        displayname: true,
        username: true,
      },
    });

    let index = users.findIndex((user) => user.username == user.username);
    if (index != -1) users = users.splice(index, index);
    users.map((obj: any) => {
      let status = this.checkUserStatus(user, obj);
      if (status == "blocked") {
        users.findIndex((user) => user.username == user.username);
        users = users.splice(index, index);
      }
    });
    return users;
  }

  async ProfileMe(reqUser) {
    const user = await this.prismaService.user.findUnique({
      where: {
        username: reqUser.username,
      },
      include: {
        friends: true,
        requested: true,
      },
    });
    return user;
  }

  async getProfile(username: string, reqUser) {
    let user = await this.prismaService.user.findUnique({
      where: {
        username: reqUser.username,
      },
      include: {
        friends: true,
        blocks: true,
        blockedBy: true,
        requested: true,
      },
    });
    let targetUser: any = await this.prismaService.user.findUnique({
      where: {
        username: username,
      },
      include: {
        friends: true,
        requested: true,
      },
    });

    if (!user) {
      throw new HttpException("user not found", 404);
    }
    let status = this.checkUserStatus(reqUser, user);

    if (status == "blocked") {
      throw new UnauthorizedException("no access");
    }

    targetUser.profilestatus = status;
    if (status !== "me") {
      delete targetUser.requested;
    }
    return targetUser;
  }

  async profilePictureMe(requser, res) {
    try {
      const user = await this.prismaService.user.findUnique({
        where: {
          username: requser.username,
        },
      });
      if (user.picture) {
        const imageBuffer = await fs.readFile(user.picture);
        res.setHeader("Content-Type", user.pictureMimetype);
        res.send(imageBuffer);
      } else {
        const url_image = await axios.get(user.imageUrl, {
          responseType: "arraybuffer",
        });
        const imageBuffer = Buffer.from(url_image.data, "binary");
        res.setHeader("Content-Type", "image/jpg");
        res.send(imageBuffer);
      }
    } catch (error) {
      res.status(500).send("could not upload the image");
    }
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
        res.setHeader("Content-Type", user.pictureMimetype);
        res.send(imageBuffer);
      } else {
        const url_image = await axios.get(user.imageUrl, {
          responseType: "arraybuffer",
        });
        const imageBuffer = Buffer.from(url_image.data, "binary");
        res.setHeader("Content-Type", "image/jpg");
        res.send(imageBuffer);
      }
    } catch (error) {
      res.status(500).send("could not upload the image");
    }
  }

  async updateName(body: updateNameDTO, req) {
    const user = await this.prismaService.user.findUnique({
      where: {
        displayname: body.name,
      },
    });
    if (user) {
      throw new HttpException("name taken", 400);
    }
    const updateUser = await this.prismaService.user.update({
      where: {
        username: req.user.username,
      },
      data: {
        displayname: body.name,
      },
    });
    return { message: "Name updated successfully" };
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
      try {
        await fs.unlink(req.user.picture);
      } catch (error) {}
    }
    const updateUser = await this.prismaService.user.update({
      where: {
        username: req.user.username,
      },
      data: {
        picture: "./uploads/default.png",
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

  private checkUserStatus(user, targetUser) {
    if (user.blocked.find((obj) => obj.username == targetUser.username))
      return "blocked";
    else if (user.blockedBy.find((obj) => obj.username == targetUser.username))
      return "blocked";
    else if (user.friends.find((obj) => obj.username == targetUser.username))
      return "friend";
    else if (user.requested.find((obj) => obj.username == targetUser.username))
      return "requested";
    else if (user.username == targetUser.username) return "me";
    else return "notFriend";
  }
}
