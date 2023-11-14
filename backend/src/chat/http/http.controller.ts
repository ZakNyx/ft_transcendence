import {
  Controller,
  Get,
  UseGuards,
  Req,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Res,
  Query,
  Param,
  ParseIntPipe,
  UseFilters,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { HttpService } from './http.service';
import { AuthGuard } from '@nestjs/passport';
import { AllExceptionFilter } from './exception.filter';

@UseFilters(new AllExceptionFilter())
@UseGuards(AuthGuard('jwt'))
@Controller('chat')
export class HttpController {
  constructor(private httpService: HttpService) {}

  @Get('groups')
  async fetchRooms(@Query() body: { userId: string }) {
    const userId = body.userId;
    return await this.httpService.fetchRooms(userId);
  }

  @Get('groups/:id')
  async fetchRoomContent(
    @Param('id', ParseIntPipe) roomId: number,
    @Query() body: { userId: string },
  ) {
    const userId = body.userId;
    return await this.httpService.fetchRoomContent(roomId, userId);
  }

  @Get('groupsList')
  async fetchRoomsToJoin(@Query() body: { userId: string }) {
    const userId = body.userId;
    return await this.httpService.fetchRoomsToJoin(userId);
  }

  @Get('bannedUsers/:id')
  async fetchBannedUsers(
    @Param('id', ParseIntPipe) roomId: number,
    @Query() body: { userId: string },
  ) {
    const userId = body.userId;
    return await this.httpService.fetchBannedUsers(roomId, userId);
  }

  @Get('dms')
  async fetchDMs(@Query() body: { userId: string }) {
    const userId = body.userId;
    return await this.httpService.fetchDMs(userId);
  }

  @Get('dms/:id')
  async fetchDMContent(
    @Param('id', ParseIntPipe) dmId: number,
    @Query() body: { userId: string },
  ) {
    const userId = body.userId;
    return await this.httpService.fetchDMContent(dmId, userId);
  }

  @Get('addPeople')
  async addPeopleFetch(@Query() body: { userId: string }) {
    const userId = body.userId;
    return await this.httpService.addPeopleFetch(userId);
  }

  @Get('invToRoom/:id')
  async fetchRoomSuggestions(
    @Param('id', ParseIntPipe) roomId: number,
    @Query() body: { userId: string },
  ) {
    const userId = body.userId;
    return await this.httpService.fetchRoomSuggestions(roomId, userId);
  }

  @Get('roomSettings/:id')
  async fetchRoomDashboard(
    @Param('id', ParseIntPipe) roomId: number,
    @Query() body: { userId: string },
  ) {
    const userId = body.userId;
    return await this.httpService.fetchRoomDashboard(roomId, userId);
  }
}