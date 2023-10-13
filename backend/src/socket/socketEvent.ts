import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { Ball, Client, Room} from './classes'
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface GameData {
    gameId: number;
    player1: { playerID: string; score: string };
    player2: { playerID: string; score: string };
  }

@WebSocketGateway({
    namespace: "Game",
    cors: {
        origin: '*',
    },
})


@Injectable()
export class SocketEvent  {
    @WebSocketServer()
    server: Server;

    SocketsByUser: Map<string, string>;
    RoomNum: number;
    connectedCli: number;
    Rooms: Room[];
    private prisma: PrismaClient;

    constructor(
        private readonly jwtService: JwtService,
        private readonly prismaService: PrismaService,
    ) {
        // Initialize the objects here
        this.RoomNum = 0;
        this.connectedCli = 0;
        this.Rooms = [];
        this.SocketsByUser = new Map<string, string>();
        this.prisma = new PrismaClient();
    }
    
    getPrismaClient() {
        return this.prisma;
    }

    createGameRecord(client1: string, client2: string) {
        return prisma.game.create({
            data: {
                player1: client1, player2: client2, score1: "", score2: "", ingame: false
            },
        });
    }

    async updateGameResult(gameId: number, player1Score: string, player2Score: string) {
        // Access the Prisma client directly from this.prisma
        const prisma = this.prisma;

        // Update the game record in the database
        const updatedGame = await prisma.game.update({
            where: { id: gameId },
            data: {
                score1: player1Score,
                score2: player2Score,
            },
        });

        return updatedGame;
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

    IfClientInGame = (client) => {
        console.log('Im here')
        let i: number = 0;
        for (i; i <= this.RoomNum; i++) {
            if (this.Rooms[i].client1.id === client.id || this.Rooms[i].client2.id === client.id) {
                if (this.Rooms[i].client1.inGame || this.Rooms[i].client2.inGame)
                    console.log('ta sir f7alk rak deja in game a chamchoun');
            }
        }
    }

    //Connection
    handleConnection = (client: Socket) => {
        try{
            console.log(`client connected id : ${client.id}`);
            const token: string = client.handshake.headers.authorization.slice(7);
            if (!token)
                throw new UnauthorizedException();
            const userObj = this.jwtService.verify(token);
            if (this.SocketsByUser.has(token))
            {
                if (this.SocketsByUser.get(token) !== client.id){
                    this.SocketsByUser.set(token, client.id);
                }
            }
            else {
                this.SocketsByUser.set(token, client.id);
            }
            if (this.connectedCli % 2 === 0) {
                client.join(`${this.RoomNum}`);
                const newRoom = new Room(this.RoomNum);
                console.log(`new Room is created! ${newRoom.num}`);
                newRoom.client1 = new Client(1); // Initialize client1
                newRoom.ball = new Ball();
                newRoom.client1.id = client.id;
                newRoom.client1.token = token;
                newRoom.client1.username = userObj.username;
                newRoom.client1.socket = client;
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
                        return ;
                    }
                    currentRoom.client2 = new Client(2); // Initialize client2
                    currentRoom.client2.id = client.id;
                    currentRoom.client2.socket = client;
                    currentRoom.client2.username = userObj.username;
                    this.server.emit('joined', this.RoomNum);
                    this.createGameRecord(currentRoom.client1.username, currentRoom.client2.username)
                    .then((newgame) => {
                        const gameData: GameData = {
                            gameId: newgame.id,
                            player1: { playerID: currentRoom.client1.username, score: newgame.score1.toString() },
                            player2: { playerID: currentRoom.client2.username, score: newgame.score2.toString() },
                        }
                        this.server.to(`${currentRoom.client1.id}`).emit('gameStarted', gameData);
                        this.server.to(`${currentRoom.client2.id}`).emit('gameStarted', gameData);
                    })
                    this.connectedCli++;
                }
            }
            if (this.Rooms[this.RoomNum].client2) {
                this.Rooms[this.RoomNum].IsFull = true;
                this.BallReset(this.Rooms[this.RoomNum]);
                this.server.to(`${this.Rooms[this.RoomNum].client1.id}`).emit('gameStarted');
                this.server.to(`${this.Rooms[this.RoomNum].client2.id}`).emit('gameStarted');
                // this.createGameRecord(this.Rooms[this.RoomNum].client1.username, this.Rooms[this.RoomNum].client2.username)
                //     .then((newGame) => {
                //         const gameData: GameData = {
                //             gameId: newGame.id,
                //             player1: { playerID: this.Rooms[this.RoomNum].client1.username, score: newGame.score1.toString() },
                //             player2: { playerID: this.Rooms[this.RoomNum].client2.username, score: newGame.score2.toString() },
                //         };
                //         this.server.to(`${this.Rooms[this.RoomNum].client1.id}`).emit('gameStarted', gameData);
                //         this.server.to(`${this.Rooms[this.RoomNum].client2.id}`).emit('gameStarted', gameData);
                //     })
                this.RoomNum++;
            }
        }
        catch (err) {
            console.log(`Error: ${err}`);
        }
    }


    //Disconnection
    handleDisconnection = (client: Socket) => {
        console.log(`Client Disconnected: ${client.id}`);
        const token: string = client.handshake.headers.authorization;
        this.Rooms.forEach( (item) => {
            delete item.client1.window;
            delete item.client2.window;
            delete item.client1;
            delete item.client2;
            delete item.game;
        })
        delete this.Rooms;
        if (this.SocketsByUser.has(token))
            this.SocketsByUser.delete(token);
    }

    BallMovements = async (room: Room, clientId: string, gamedata: GameData) => {
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
                this.BallReset(room);
                room.client2.score++;
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
                room.client1.inGame = false;
                room.client1.inGame = false;
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
                this.updateGameResult(gamedata.gameId, room.client1.score.toString(), room.client2.score.toString());
                const game = await this.prismaService.game.findUnique({
                    where: {
                        id : gamedata.gameId,
                    }
                })
                console.log(game);
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

    @SubscribeMessage('demand')
    handleBallDemand(@ConnectedSocket() client: Socket, @MessageBody() data: {_room: number, gamedata: GameData}) {
        const {_room, gamedata} = data;
        try {
            const token = client.handshake.headers.authorization.slice(7);
            if (this.Rooms[_room].IsFull) {
                this.Rooms[_room].client1.inGame = true;
                this.Rooms[_room].client2.inGame = true;
                this.Rooms[_room].game.IsStarted = true;
            }

            if (this.SocketsByUser.has(token)) {
                if (this.SocketsByUser.get(token) === client.id){
                    this.BallMovements(this.Rooms[_room], client.id, gamedata);
                    // this.createGameRecord(this.Rooms[_room].client1.username, this.Rooms[_room].client2.username)
                    // .then((newGame) => {
                    //     const gameData: GameData = {
                    //         gameId: newGame.id,
                    //         player1: {playerID: this.Rooms[_room].client1.username, score: newGame.score1.toString()},
                    //         player2: {playerID: this.Rooms[_room].client2.username, score: newGame.score2.toString()},
                    //     };
                    //     this.server.to(`${this.Rooms[_room].client1.id}`).emit('gameStarted', gameData);
                    //     this.server.to(`${this.Rooms[_room].client2.id}`).emit('gameStarted', gameData);
                    // })
                }
            }

        }
        catch (err) {
            console.log(`Error: ${err}`);
        }
    }

    @SubscribeMessage('gameEnded')
    handleGameEnded(@ConnectedSocket() client: Socket, @MessageBody() _room: number) {
        const token: string = client.handshake.headers.authorization.slice(7);
        if (this.SocketsByUser.has(token)) {
            if (this.SocketsByUser.get(token) === client.id) {

                // this.updateGameResult(data.gameData.gameId, data.gameData.player1.score, data.gameData.player2.score)
            }
        }
    }

    @SubscribeMessage('leaveQueue')
    handleleavequeue(@ConnectedSocket() client: Socket, @MessageBody() room: number) {
        console.log('client leaves the room');
        if (this.Rooms[room] && (this.Rooms[room].client1.id === client.id) && !this.Rooms[room].client1.inGame){
            this.Rooms[room].client1.socket.leave(`${room}`);
            if (this.SocketsByUser.has(this.Rooms[room].client1.token))
                this.SocketsByUser.delete(this.Rooms[room].client1.token);

        }
    }

    @SubscribeMessage('PaddleMovement')
    handlePaddleMovement(@ConnectedSocket() client: Socket, @MessageBody() data: { x: number, room: number }) {
        const {x, room} = data;
        const token = client.handshake.headers.authorization.slice(7);
        if (this.SocketsByUser.has(token)) {
            if (this.SocketsByUser.get(token) === client.id)
                this.MoveEverthing(x, this.Rooms[room], client.id);
        }
    }
    
}
