import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { Ball, Client, Room} from './classes'
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";
import { PrismaClient } from "@prisma/client";

@WebSocketGateway({
    namespace: "Invited",
    cors: {
        origin: '*',
    },
})


@Injectable()
export class InvitedEvent  {
    @WebSocketServer()
    server: Server;

    SocketsByUser: Map<string, string>;
    connectedPlayers: Map<string, Socket>;
    RoomNum: number;
    isInvitationAccepted: boolean;
    isInvitationDeclined: boolean;
    connectedCli: number;
    Rooms: Room[];
    private prisma: PrismaClient;
    // isDatabaseUpdated: boolean;

    constructor(
        private readonly jwtService: JwtService,
        private readonly prismaService: PrismaService,
    ) {
        // Initialize the objects here
        this.RoomNum = 0;
        this.connectedCli = 0;
        this.Rooms = [];
        this.SocketsByUser = new Map<string, string>();
        this.connectedPlayers = new Map<string, Socket>();
        this.prisma = new PrismaClient();
        this.isInvitationAccepted = false;
        this.isInvitationDeclined = false;
    }
    
    getPrismaClient() {
        return this.prisma;
    }

    BallReset = (room: Room) => {
        room.ball.move = false;
        room.ball.zdirection = 1;
        room.ball.speed = 0.1;
        room.ball.xval = 0;
        room.ball.xdirection = 1;
        room.ball.x = 0;
        room.ball.z = 0;
    }

    //Moving the players paddle
    MovePaddles = (x: number, room: Room, clientId: string) => {
        /*            client1          */
        if (room.client1.id === clientId) {
            room.client1.x = x;
            this.server.to(`${room.client2.id}`).emit('OppenentPaddlePosition', room.client1.x);
        }

        /*            client2          */
        if (room.client2.id === clientId) {
            room.client2.x = x;
            this.server.to(`${room.client1.id}`).emit('OppenentPaddlePosition', room.client2.x);
        }
    }

    //Moving the players paddle
    MoveEverthing = (x: number, room: Room, clientId: string) => {
        if (room && room.IsFull) {
            this.MovePaddles(x, room, clientId);
        }
    }

    IfClientInGame = (clientId: string): boolean => {
        let i: number = 0;
        for (i; i < this.RoomNum; i++) {
            if (this.Rooms[i].client1.id === clientId) {

                if (this.Rooms[i].client1.inGame) {
                    return true;
                }
            }
            if (this.Rooms[i].client2.id === clientId) {
                if (this.Rooms[i].client2.inGame) {
                    return true;
                }
            }
        }
        return false;
    }

    //Connection
    handleConnection = (client: Socket) => {
        try{
            if (!client.handshake.headers.authorization)
                return ;
            const token: string = client.handshake.headers.authorization.slice(7);
            if (!token)
                throw new UnauthorizedException();
            if (this.SocketsByUser.has(token))
            {
                if (this.IfClientInGame(this.SocketsByUser.get(token))) {
                    this.server.to(client.id).emit('InGame');
                    return ;
                }
                if (this.SocketsByUser.get(token) !== client.id){
                    this.SocketsByUser.set(token, client.id);
                }
            }
            else {
                this.SocketsByUser.set(token, client.id);
            }
            const userObj = this.jwtService.verify(token);
            if (this.connectedPlayers.has(userObj.username)) {
                if (this.connectedPlayers.get(userObj.username).id !== client.id) {
                    this.connectedPlayers.set(userObj.username, client);
                }
            }
            else {
                this.connectedPlayers.set(userObj.username, client);
            }
        }
        catch (err) {
        }
    }

    //Disconnection
    handleDisconnection = (client: Socket) => {
        const token: string = client.handshake.headers.authorization.slice(7);
        this.Rooms.forEach( (item) => {
            if (item.client1.id === client.id) {
                delete item.client1.window;
                delete item.client1;
                item.client1 = null;
            }
            if (item.client2.id === client.id) {
                delete item.client2.window;
                delete item.client2;
                delete item.game;
                item.client2 = null;
                item.game = null;
            }
        })
        if (this.SocketsByUser.has(token))
            this.SocketsByUser.delete(token);
    }

    BallMovements = async (room: Room, clientId: string) => {
        // Trying to move the ball, for each room separate.
        if (room.IsFull && room.game.IsStarted && !room.game.IsFinish) {
            //change the ball SpeedX and ball SpeedY
            room.ball.z += room.ball.zdirection * room.ball.speed;
            room.ball.x += room.ball.xdirection * room.ball.xval;

            //If the ball touch the right side of the screen
            if(room.ball.z < -8.5) {
                if (Math.abs(room.ball.x - room.client2.x) < 1.5) {
                    room.ball.zdirection = 1;
                    room.ball.xdirection = 1;
                    room.ball.xval = (room.ball.x - room.client2.x) / 10;
                    room.ball.move = false;
                }
            }

            //If the ball touch left side of the screen
            if (room.ball.z > 8.5) {
                if (Math.abs(room.ball.x - room.client1.x) < 1.5) {
                    room.ball.zdirection = -1;
                    room.ball.xdirection = 1;
                    room.ball.xval = (room.ball.x - room.client1.x) / 10;
                    room.ball.move = true;
                }
            }

            // If the ball touch the ceilling or the floor
            if ((room.ball.x > 7) || (room.ball.x < -7))
                room.ball.xdirection *= -1;

            //If the ball passes boundaries
            if (room.ball.z > 9.3){
                this.BallReset(room);
                room.client2.score++;
                this.server.to(`${room.client1.id}`).emit('Score', {p1: room.client1.score, p2: room.client2.score, oppName: room.client2.username})
                this.server.to(`${room.client2.id}`).emit('Score', {p1: room.client2.score, p2: room.client1.score, oppName: room.client1.username})
            }
            if (room.ball.z < -9.3) {
                room.client1.score++;
                this.BallReset(room);
                this.server.to(`${room.client1.id}`).emit('Score', {p1: room.client1.score, p2: room.client2.score, oppName: room.client2.username})
                this.server.to(`${room.client2.id}`).emit('Score', {p1: room.client2.score, p2: room.client1.score, oppName: room.client1.username})
            }
            if (room.client1.score === room.game.WinReq || room.client2.score === room.game.WinReq) {
                room.game.IsFinish = true;
                room.client1.inGame = false;
                room.client2.inGame = false;
                room.isDatabaseUpdated = true;
                if (room.client1.score === room.game.WinReq) {
                    this.server.to(`${room.client1.id}`).emit('won');
                    this.server.to(`${room.client2.id}`).emit('lost');
                }
                else {
                    this.server.to(`${room.client1.id}`).emit('lost');
                    this.server.to(`${room.client2.id}`).emit('won');
                }
                this.server.to(`${room.client1.id}`).emit('gameEnded');
                this.server.to(`${room.client2.id}`).emit('gameEnded');
                if (room.client1.score > room.client2.score) {
                    room.winner = room.client1.username;
                    room.loser = room.client2.username;

                }
                else {
                    room.winner = room.client2.username;
                    room.loser = room.client1.username;
                }
                // if (!room.client1.inGame && !room.client2.inGame && room.isDatabaseUpdated) {
                //     this.IfGameIsFinish(room, gamedata);
                // }
            }

            // Resending Ball Coords to clients
            if (clientId === room.client1.id && !room.game.IsFinish){
                this.server.to(`${clientId}`).emit('DrawBall', { x: room.ball.x, z: room.ball.z, pos: 1 });
            }
            if (clientId === room.client2.id && !room.game.IsFinish) {
                this.server.to(`${clientId}`).emit('DrawBall', { x: room.ball.x, z: room.ball.z, pos: 2 });
            }
        }
    }

    @SubscribeMessage('sendInvitationToServer')
    handleInvitationToServer(@ConnectedSocket() client: Socket, @MessageBody() oppUsername: string) {
        const token: string = client.handshake.headers.authorization.slice(7);
        const userObj = this.jwtService.verify(token);
        if (this.connectedPlayers.has(oppUsername)) {
            this.server.to(`${this.connectedPlayers.get(oppUsername).id}`).emit('sendInvitationToOpp', userObj.username);
        }
    }

    AfterIvitationAccepted = (client1: Socket, client2: Socket) => {
        // if (this.connectedCli % 2 === 0) {
            const token: string = client1.handshake.headers.authorization.slice(7);
            const userObj = this.jwtService.verify(token);
            client1.join(`${this.RoomNum}`);
            const newRoom = new Room(this.RoomNum);
            newRoom.client1 = new Client(1); // Initialize client1
            newRoom.ball = new Ball();
            newRoom.client1.id = client1.id;
            newRoom.client1.token = token;
            newRoom.client1.username = userObj.username;
            newRoom.client1.socket = client1;
            this.Rooms.push(newRoom);
            this.server.to(`${newRoom.client1.id}`).emit('joined', this.RoomNum);
            this.connectedCli++;
        // }
        // else {
        //     if (!this.Rooms[this.RoomNum])
        //         return;
            client2.join(`${this.RoomNum}`);
            const currentRoom = this.Rooms[this.RoomNum];
            // if (currentRoom && currentRoom.client1) {
                const token2: string = client2.handshake.headers.authorization.slice(7);
                const userObj2 = this.jwtService.verify(token2);
                // if (currentRoom.client1.token === token){
                //     client2.leave(`${this.RoomNum}`);
                //     currentRoom.client1.id = client2.id;
                //     return ;
                // }
                currentRoom.client2 = new Client(2); // Initialize client2
                currentRoom.client2.id = client2.id;
                currentRoom.client2.socket = client2;
                currentRoom.client2.token = token2;
                currentRoom.client2.username = userObj2.username;
                this.server.to(`${currentRoom.client2.id}`).emit('joined', this.RoomNum);
                this.connectedCli++;
                this.Rooms[this.RoomNum].IsFull = true;
                this.BallReset(this.Rooms[this.RoomNum]);
                this.RoomNum++;
            // }
        // }
        // if (this.Rooms[this.RoomNum].client2) {
        // }
    }

    @SubscribeMessage('AcceptingInvitation')
    handleAccepting(@ConnectedSocket() client: Socket, @MessageBody() data: { acceptation: boolean, OppName: string}) {
        const   {acceptation, OppName} = data;
        if (acceptation){
            this.isInvitationAccepted = true;
            this.server.to(`${client.id}`).emit('IsGameAccepted');
            this.server.to(`${this.connectedPlayers.get(OppName).id}`).emit('IsGameAccepted');
            this.AfterIvitationAccepted(client, this.connectedPlayers.get(OppName));
        }
        if (!acceptation) {
            //if the opponent declined, client1 need to leave the room
            this.isInvitationDeclined = true;
            this.server.to(`${this.connectedPlayers.get(OppName).id}`).emit('IsGameDeclined');
        }
    }

    @SubscribeMessage('demand')
    handleBallDemand(@ConnectedSocket() client: Socket,  @MessageBody() _room: number) {
        try {
            
            const token = client.handshake.headers.authorization.slice(7);
            const userObj = this.jwtService.verify(token); 
            if (this.Rooms[_room] &&  this.Rooms[_room].IsFull) {
                if (this.Rooms[_room].setVars === false) {
                    this.Rooms[_room].setVars = true;
                    this.Rooms[_room].client1.inGame = true;
                    this.Rooms[_room].client2.inGame = true;
                    this.Rooms[_room].game.IsStarted = true;
                }
                if (this.SocketsByUser.has(token)) {
                    if ((this.SocketsByUser.get(token) === client.id) && (_room < this.RoomNum &&
                    (this.Rooms[_room].client1.username === userObj.username
                    || this.Rooms[_room].client2.username === userObj.username))) {
                        this.BallMovements(this.Rooms[_room], client.id);
                    }
                }
            }

        }
        catch (err) {
            console.log(`Error: ${err}`);
        }
    }

    @SubscribeMessage('PaddleMovement')
    handlePaddleMovement(@ConnectedSocket() client: Socket, @MessageBody() data: { x: number, room: number }) {
        const {x, room} = data;
        const token = client.handshake.headers.authorization.slice(7);
        if (this.SocketsByUser.has(token)) {
            if (this.SocketsByUser.get(token) === client.id) {
                this.MoveEverthing(x, this.Rooms[room], client.id);
            }
        }
    }

    @SubscribeMessage('InvitedCompCalled')
    handleInvitedCompCalled(@ConnectedSocket() client: Socket){
        // const token: string = client.handshake.headers.authorization.slice(7);
        // if (this.SocketsByUser.has(token)) {

        // }
        if (this.Rooms[this.RoomNum - 1]) {
            if (this.Rooms[this.RoomNum - 1].client1 || this.Rooms[this.RoomNum - 1].client2) {
                if (this.Rooms[this.RoomNum - 1].client1.id === client.id) {
                    this.server.to(`${client.id}`).emit('gameStarted', {
                        roomId: this.RoomNum - 1,
                        OppName: this.Rooms[this.RoomNum - 1].client2.username
                    });
                }
                else if (this.Rooms[this.RoomNum - 1].client2 
                    && this.Rooms[this.RoomNum - 1].client2.id === client.id) {
                        this.server.to(`${client.id}`).emit('gameStarted', {
                            roomId: this.RoomNum - 1,
                            OppName: this.Rooms[this.RoomNum - 1].client1.username
                        }); 
                }
            }
            // if () this.Rooms[this.RoomNum - 1].client2.id === client.id; 
        }
    }
}
