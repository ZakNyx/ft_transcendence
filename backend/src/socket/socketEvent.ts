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

    async createGameRecord(client1: string, client2: string) {

        return await prisma.game.create({
            data: {
                player1: client1, player2: client2, score1: "", score2: "", ingame: false, users: {
                    connect: [{username: client1}, {username: client2}]
                
                }
            },
            
        });
    }

    async updateGameResult(gameId: number, player1Score: string, player2Score: string) {
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

    IfClientInQueue = (Client: Socket, PreviousId: string, token: string) => {
        for (let i: number = 0; i <= this.RoomNum; i++) {
            if (this.Rooms[i]) {
                if (this.Rooms[i].client1 && this.Rooms[i].client1.id === PreviousId
                    && this.Rooms[i].client1.inQueue) {
                    this.SocketsByUser.set(token, Client.id);
                    this.Rooms[i].client1.socket.leave(`${i}`);
                    Client.join(`${i}`);
                    this.Rooms[i].client1.id = Client.id;
                    this.Rooms[i].client1.socket = Client;
                    Client.emit('joined', i);
                }
                if (this.Rooms[i].client2 && this.Rooms[i].client2.id === PreviousId) {
                    this.SocketsByUser.set(token, Client.id);
                }
            }
        }
    }

    //Connection
    handleConnection = (client: Socket) => {
        try{
            const token: string = client.handshake.headers.authorization.slice(7);
            if (!token)
                throw new UnauthorizedException();
            if (this.SocketsByUser.has(token))
            {
                //need to check if the client is in queue before.
                this.IfClientInQueue(client, this.SocketsByUser.get(token), token)
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
            if (this.connectedCli % 2 === 0) {
                client.join(`${this.RoomNum}`);
                const newRoom = new Room(this.RoomNum);
                newRoom.client1 = new Client(1); // Initialize client1
                newRoom.ball = new Ball();
                newRoom.client1.id = client.id;
                newRoom.client1.token = token;
                newRoom.client1.username = userObj.username;
                newRoom.client1.socket = client;
                this.Rooms.push(newRoom);
                this.server.to(`${newRoom.client1.id}`).emit('joined', this.RoomNum);
                this.connectedCli++;
            }
            else {
                if (!this.Rooms[this.RoomNum])
                    return;
                client.join(`${this.RoomNum}`);
                const currentRoom = this.Rooms[this.RoomNum];
                if (currentRoom && currentRoom.client1) {
                    if (currentRoom.client1.token === token){
                        client.leave(`${this.RoomNum}`);
                        currentRoom.client1.id = client.id;
                        return ;
                    }
                    currentRoom.client2 = new Client(2); // Initialize client2
                    currentRoom.client2.id = client.id;
                    currentRoom.client2.socket = client;
                    currentRoom.client2.username = userObj.username;
                    this.server.to(`${currentRoom.client2.id}`).emit('joined', this.RoomNum);
                    this.createGameRecord(currentRoom.client1.username, currentRoom.client2.username)
                    .then((newgame) => {
                        const gameData: GameData = {
                            gameId: newgame.id,
                            player1: { playerID: currentRoom.client1.username, score: newgame.score1.toString() },
                            player2: { playerID: currentRoom.client2.username, score: newgame.score2.toString() },
                        }
                        this.server.to(`${currentRoom.client1.id}`).emit('gameStarted', {gamedata: gameData, OppName: currentRoom.client2.username});
                        this.server.to(`${currentRoom.client2.id}`).emit('gameStarted', {gamedata: gameData, OppName: currentRoom.client1.username});
                        currentRoom.isDatabaseUpdated = false;
                    })
                    this.connectedCli++;
                    this.Rooms[this.RoomNum].IsFull = true;
                    this.BallReset(this.Rooms[this.RoomNum]);
                    this.RoomNum++;
                }
            }
        }
        catch (err) {
            console.log(`Error123: ${err}`);
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

    BallMovements = async (room: Room, clientId: string, gamedata: GameData) => {
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
                if (!room.client1.inGame && !room.client2.inGame && room.isDatabaseUpdated) {
                    this.IfGameIsFinish(room, gamedata);
                    if (this.SocketsByUser.has(room.client1.token)) {
                        this.SocketsByUser.delete(room.client1.token);
                    }
                    if (this.SocketsByUser.has(room.client2.token)) {
                        this.SocketsByUser.delete(room.client2.token);
                    }
                }
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

    updatingInGameValue = async (client1: string, client2: string) => {
        await this.prismaService.user.update({
            where: {
                username: client1,
            },
            data: {
                status: 'INGAME',
            },
        })
        await this.prismaService.user.update({
            where: {
                username: client2,
            },
            data: {
                status: 'INGAME',
            },
        })
    }

    @SubscribeMessage('demand')
    handleBallDemand(@ConnectedSocket() client: Socket,  @MessageBody() data: {_room: number, gamedata: GameData}) {
        try {
            const {_room, gamedata} = data;
            const token = client.handshake.headers.authorization.slice(7);
            const userObj = this.jwtService.verify(token); 
            if (this.Rooms[_room] && this.Rooms[_room].IsFull) {
                if (this.Rooms[_room].setVars === false) {
                    this.Rooms[_room].setVars = true;
                    this.Rooms[_room].client1.inGame = true;
                    this.Rooms[_room].client1.inQueue = false;
                    this.Rooms[_room].client2.inGame = true;
                    this.Rooms[_room].client2.inQueue = false;
                    this.Rooms[_room].game.IsStarted = true;
                    this.updatingInGameValue(this.Rooms[_room].client1.username, this.Rooms[_room].client2.username);
                }
                if (this.SocketsByUser.has(token)) {
                    if ((this.SocketsByUser.get(token) === client.id) && (_room < this.RoomNum &&
                    (this.Rooms[_room].client1.username === userObj.username
                    || this.Rooms[_room].client2.username === userObj.username))) {
                        this.BallMovements(this.Rooms[_room], client.id, gamedata);
                    }
                }
            }

        }
        catch (err) {
            console.log(`Error: ${err}`);
        }
    }

    IfGameIsFinish = async (room: Room, gamedata: GameData) => {
        if (room.client1.inGame || room.client2.inGame)
            return ;
        else if (!room.client1.inGame && !room.client2.inGame) {
            this.updateGameResult(gamedata.gameId, room.client1.score.toString(), room.client2.score.toString());
            await this.prismaService.game.findUnique({
                where: {
                    id: gamedata.gameId,
                }
            })

            await this.prismaService.user.update({
                where: {
                    username: room.winner,
                },
                data: {
                    wins: {
                        increment: 1,
                    },
                    elo: {
                        increment: 10,
                    },
                    gamesPlayed: {
                        increment: 1,
                    },
                    status: 'ONLINE',
                }
            })
            const user = await prisma.user.findUnique({
                where: {
                    username: room.loser,
                }
            });
            if (user) {
                const data = {
                    loses: {
                        increment: 1,
                    },
                    gamesPlayed: {
                        increment: 1,
                    },
                    elo: undefined,
                    status: undefined,
                };
    
                if (user.elo >= 10) {
                    data.elo = {
                        decrement: 10,
                    };
                }
                data.status = 'ONLINE'
                await prisma.user.update({
                    where: {
                        username: room.loser,
                    },
                    data,
                });
                room.isDatabaseUpdated = false;
            }
        }
    }

    @SubscribeMessage('leaveAndStillInGame')
    handleLeaveGame(@ConnectedSocket() client: Socket, @MessageBody() data: {_room: number}) {

        if (data?._room !== undefined) {
            const {_room} = data;
            const token: string = client.handshake.headers.authorization.slice(7);
            const userObj = this.jwtService.verify(token); 
            if (this.SocketsByUser.has(token)) {
                if (this.SocketsByUser.get(token) === client.id) {
                    if (userObj.username === this.Rooms[_room].client1.username){
                        this.Rooms[_room].client1.leave = true;
                        this.Rooms[_room].client1.inQueue = false;
                    }
                    if (userObj.username === this.Rooms[_room].client2.username) {
                        this.Rooms[_room].client2.leave = true;
                        this.Rooms[_room].client2.inQueue = false;
                    }
                    if (this.Rooms[_room].client1.leave && this.Rooms[_room].client2.leave){
                        this.Rooms[_room].game.IsFinish = true;
                        this.Rooms[_room].client1.inGame = false;
                        this.Rooms[_room].client2.inGame = false;
                        this.Rooms[_room].game.IsStarted = false;
                    }
                }
            }
        }
    }

    @SubscribeMessage('InQueue')
    handleInQueue(@ConnectedSocket() client: Socket, @MessageBody() roomId: number) {
        const token: string = client.handshake.headers.authorization.slice(7);
        if (this.SocketsByUser.has(token)) {
            if (this.Rooms[roomId]) {

                if (this.Rooms[roomId].client1 && this.Rooms[roomId].client1.id === this.SocketsByUser.get(token)) {
                    this.Rooms[roomId].client1.inQueue = true;
                }
                if (this.Rooms[roomId].client2 && this.Rooms[roomId].client2.id === this.SocketsByUser.get(token)) {
                    this.Rooms[roomId].client2.inQueue = true;
                }
            }
        }
    }

    @SubscribeMessage('leaveQueue')
    handleleavequeue(@ConnectedSocket() client: Socket, @MessageBody() room: number) {
        if (this.Rooms[room] && !this.Rooms[room].client1.inGame) {
            if (this.Rooms[room].client1.id === client.id) {
                this.Rooms[room].client1.inQueue = false;
                if (this.Rooms[room].client2) this.Rooms[room].client2.inQueue = false;
                if (this.SocketsByUser.has(this.Rooms[room].client1.token))
                    this.SocketsByUser.delete(this.Rooms[room].client1.token);
                this.Rooms[room].client1.socket.leave(`${room}`);
                this.connectedCli--;
                this.RoomNum++;
            }
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
