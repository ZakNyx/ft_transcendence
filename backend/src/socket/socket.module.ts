import { Module } from "@nestjs/common";
import { SocketEvent } from "./socketEvent";
import { jwtWebSocketStrategy } from "src/strategies/jwtWebSocket.strategy";
import { PrismaService } from "src/prisma/prisma.service";

@Module({
    providers: [SocketEvent, PrismaService, jwtWebSocketStrategy]
})

export class SocketModule {

}