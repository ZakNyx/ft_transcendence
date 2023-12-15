import { Module } from "@nestjs/common";
import { SocketEvent } from "./socketEvent";
import { jwtWebSocketStrategy } from "src/strategies/jwtWebSocket.strategy";
import { PrismaService } from "src/prisma/prisma.service";
import { InvitedEvent } from "./invitedGame";

@Module({
    providers: [SocketEvent, PrismaService, jwtWebSocketStrategy, InvitedEvent]
})

export class SocketModule {

}