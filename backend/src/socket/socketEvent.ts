import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { Ball, Client, Room} from './classes'
import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})


export class SocketEvent  {
    @WebSocketServer()
    server: Server;

    SocketsByUser: Map<string, string>;
    RoomNum: number;
    connectedCli: number;
    Rooms: Room[];

    constructor() {
        // Initialize the objects here
        this.RoomNum = 0;
        this.connectedCli = 0;
        this.Rooms = [];
        this.SocketsByUser = new Map<string, string>();
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
        if (room.IsFull) {
            this.MovePaddles(x, room, clientId);
        }
    }

    //Connection
    handleConnection = (client: Socket) => {
        console.log(`client connected id : ${client.id}`);
        const token: string = client.handshake.headers.authorization;
        if (this.SocketsByUser.has(token))
        {
            if (this.SocketsByUser.get(token) !== client.id){
                this.SocketsByUser.set(token, client.id);
            }
        }
        else
            this.SocketsByUser.set(token, client.id);
        if (this.connectedCli % 2 === 0) {
            client.join(`${this.RoomNum}`);
            const newRoom = new Room(this.RoomNum);
            console.log(`new Room is created! ${newRoom.num}`);
            newRoom.client1 = new Client(1); // Initialize client1
            newRoom.ball = new Ball();
            newRoom.client1.id = client.id;
            newRoom.client1.token = token;
            this.Rooms.push(newRoom);
            this.server.emit('joined', this.RoomNum);
            this.connectedCli++;
        }
        else {
            client.join(`${this.RoomNum}`);
            const currentRoom = this.Rooms[this.RoomNum];
            if (currentRoom) {
                if (currentRoom.client1.token === token){
                    console.log("wach baghi tal3ab m3a rassak wach nta howa l mfarbal")
                    client.leave(`${this.RoomNum}`);
                    currentRoom.client1.id = client.id;
                    // this.connectedCli--;
                    return ;
                }
                currentRoom.client2 = new Client(2); // Initialize client2
                currentRoom.client2.id = client.id;
                this.server.emit('joined', this.RoomNum);
                this.connectedCli++;
            }
        }
        if (this.Rooms[this.RoomNum].client2) {
            this.Rooms[this.RoomNum].IsFull = true;
            this.server.to(`${this.Rooms[this.RoomNum].client1.id}`).emit('gameStarted');
            this.server.to(`${this.Rooms[this.RoomNum].client2.id}`).emit('gameStarted');
            this.RoomNum++;
        }
    }


    //Disconnection
    handleDisconnection = (client: Socket) => {
        console.log(`Client Disconnected: ${client.id}`);
        this.Rooms.forEach( (item) => {
            delete item.client1.window;
            delete item.client2.window;
            delete item.client1;
            delete item.client2;
            delete item.game;
        })
        delete this.Rooms;
    }

    BallMovements = (room: Room, clientId: string) => {
        // Trying to move the ball, for each room separate.
        if (room.IsFull && room.game.IsStarted) {

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
                room.client2.score++;
                this.BallReset(room);
                this.server.to(`${room.client1.id}`).emit('Score', {p1: room.client1.score, p2: room.client2.score})
                this.server.to(`${room.client2.id}`).emit('Score', {p1: room.client2.score, p2: room.client1.score})
            }
            if (room.ball.z < -9.3) {
                room.client1.score++;
                this.BallReset(room);
                this.server.to(`${room.client1.id}`).emit('Score', {p1: room.client1.score, p2: room.client2.score})
                this.server.to(`${room.client2.id}`).emit('Score', {p1: room.client2.score, p2: room.client1.score})
            }
            if (room.client1.score === room.game.WinReq || room.client2.score === room.game.WinReq) {
                room.game.IsFinish = true;
                this.server.to(`${room.client1.id}`).emit('gameEnded');
                this.server.to(`${room.client2.id}`).emit('gameEnded');
                if (room.client1.score === room.game.WinReq) {
                    this.server.to(`${room.client1.id}`).emit('won');
                    this.server.to(`${room.client2.id}`).emit('lost');
                }
                else {
                    this.server.to(`${room.client1.id}`).emit('lost');
                    this.server.to(`${room.client2.id}`).emit('won');
                }
            }

            // Resending Ball Coords to clients
            if (clientId === room.client1.id && !room.game.IsFinish)
                this.server.to(`${clientId}`).emit('DrawBall', { x: room.ball.x, z: room.ball.z, pos: 1 });
            if (clientId === room.client2.id && !room.game.IsFinish)
                this.server.to(`${clientId}`).emit('DrawBall', { x: room.ball.x, z: room.ball.z, pos: 2 });
        }
    }

    @SubscribeMessage('demand')
    handleBallDemand(@ConnectedSocket() client: Socket, @MessageBody() _room: number) {

        const token = client.handshake.headers.authorization;
        if (this.Rooms[_room].IsFull)
        this.Rooms[_room].game.IsStarted = true;
        if (this.SocketsByUser.has(token)) {
            if (this.SocketsByUser.get(token) === client.id)
                this.BallMovements(this.Rooms[_room], client.id);
        }
    }

    @SubscribeMessage('leaveQueue')
    handleleavequeue(@ConnectedSocket() client: Socket, @MessageBody() room: number) {
        console.log('client leaves the room');
        if (this.Rooms[room] && (this.Rooms[room].client1.id === client.id)){
            client.leave(`${room}`);
            this.Rooms[room].client1;
        }
    }

    @SubscribeMessage('PaddleMovement')
    handlePaddleMovement(@ConnectedSocket() client: Socket, @MessageBody() data: { x: number, room: number }) {
        const {x, room} = data;
        const token = client.handshake.headers.authorization;
        if (this.SocketsByUser.has(token)) {
            if (this.SocketsByUser.get(token) === client.id)
                this.MoveEverthing(x, this.Rooms[room], client.id);
        }
    }
    
}
