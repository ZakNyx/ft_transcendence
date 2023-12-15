// game.controller.ts
import { Controller, Get, Param } from '@nestjs/common';
import { GameService } from './game.service';

@Controller('games')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Get(':id')
  async getGameById(@Param('id') id: number) {
    return this.gameService.getGameById(id);
  }

  @Get('user/:username')
  async getUserGamesByUsername(@Param('username') username: string) {
    return this.gameService.getUserGamesByUsername(username);
  }
}
