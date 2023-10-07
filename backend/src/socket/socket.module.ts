import { Module } from "@nestjs/common";
import { SocketEvent } from "./socketEvent";
import { JwtModule } from "@nestjs/jwt";

@Module({
    providers: [SocketEvent],
    imports: [
        JwtModule.register({
            secret: 'As3ab_kod123',
        })
    ]
})

export class SocketModule {

}