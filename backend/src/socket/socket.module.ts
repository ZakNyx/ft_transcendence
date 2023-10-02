import { Module } from "@nestjs/common";
import { SocketEvent } from "./socketEvent";

@Module({
    providers: [SocketEvent]
})

export class SocketModule {

}