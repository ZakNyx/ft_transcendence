import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { Ball, Client, Room} from './classes'

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})

export class SocketEvent  {
    @WebSocketServer()
    server: Server;

    RoomNum: number;
    connectedCli: number;
    Rooms: Room[];

    constructor() {
        // Initialize the objects here
        this.RoomNum = 0;
        this.connectedCli = 0;
        this.Rooms = [];
    }

    BallReset = (room: Room) => {
        room.ball.speedX = -room.ball.speedX;
        if (room.client1) {
            room.ball.x = room.client1.window.width / 2;
            room.ball.y = room.client1.window.height / 2;
        }
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
        if (this.connectedCli % 2 === 0) {
            client.join(`${this.RoomNum}`);
            const newRoom = new Room(this.RoomNum);
            console.log(`new Room is created! ${newRoom.num}`);
            newRoom.client1 = new Client(1); // Initialize client1
            newRoom.ball = new Ball();
            newRoom.client1.id = client.id;
            this.Rooms.push(newRoom);
            this.server.emit('joined', this.RoomNum);
            this.connectedCli++;
        }
        else {
            client.join(`${this.RoomNum}`);
            const currentRoom = this.Rooms[this.RoomNum];
            if (currentRoom) {
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
    }

    BallMovements = (room: Room, clientId: string) => {
        // Trying to move the ball, with each room separated.
        if (room.IsFull && room.game.IsStarted) {

            room.ball.x += room.ball.speedX;
            room.ball.y += room.ball.speedY;

            //If the ball touch the right side of the screen
            if (room.ball.x > (room.client2.window.width - room.client2.thickness - 15)) {
                if (room.ball.y > room.client2.y && room.ball.y < room.client2.y + room.client2.height) {
                    room.ball.speedX = -room.ball.speedX;
                    const deltaY = room.ball.y - (room.client2.y + room.client2.height / 2);
                    room.ball.speedY = deltaY * 0.001;
                }
                else if (room.ball.x > room.client2.window.width - 7) {
                    this.BallReset(room);
                    room.client1.score++;
                }
            }

            //If the ball touch left side of the screen
            if (room.ball.x < (room.client1.thickness + 15)) {
                if (room.ball.y > room.client1.y && room.ball.y < room.client1.y + room.client1.height) {
                    room.ball.speedX = -room.ball.speedX;
                    const deltaY = room.ball.y - (room.client1.y + room.client1.height / 2);
                    room.ball.speedY = deltaY * 0.001;
                }
                else if (room.ball.x < 7) {
                    this.BallReset(room);
                    room.client2.score++;
                }
            }
            // If the ball touch the ceilling
            if (room.ball.y > room.client1.window.height - 10)
                room.ball.speedY = -room.ball.speedY;
            // If the ball touch the floor
            if (room.ball.y < 10)
                room.ball.speedY = -room.ball.speedY;

            // Resending Ball Coords to clients
            if (clientId === room.client1.id)
                this.server.to(`${room.client1.id}`).emit('BallCoords', { x: room.ball.x, y: room.ball.y })
            if (clientId === room.client2.id)
                this.server.to(`${room.client2.id}`).emit('BallCoords', { x: room.ball.x, y: room.ball.y })
        }
    }

    @SubscribeMessage('demand')
    handleBallDemand(@ConnectedSocket() client: Socket, @MessageBody() _room: number) {
        // console.log('here in demand');
        if (this.Rooms[_room].IsFull)
            this.Rooms[_room].game.IsStarted = true;
        this.BallMovements(this.Rooms[_room], client.id);
    }

    @SubscribeMessage('PaddleMovement')
    handlePaddleMovement(@ConnectedSocket() client: Socket, @MessageBody() data: { x: number, room: number }) {
        const {x, room} = data;
        this.MoveEverthing(x, this.Rooms[room], client.id);
    }
    
}
