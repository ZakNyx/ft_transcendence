import { Socket } from "socket.io";

export class Game {
    IsFinish: boolean;
    Winner: number;
    WinReq: number;
    IsStarted: boolean;
    showingWinScreen: boolean
    constructor() {
        this.showingWinScreen = false;
        this.IsFinish = false;
        this.IsStarted = false;
        this.Winner = 0;
        this.WinReq = 5;
    }
}

export class Ball{
    x: number;
    z: number;
    speed: number;
    radius: number;
    xdirection: number;
    xval: number;
    zdirection: number;
    IsBallEdge: Boolean;
    move: Boolean;

    constructor() {
        this.x = 400;
        this.z = 300;
        this.radius = 10;
        this.zdirection = 1;
        this.xdirection = 1;
        this.xval = 0;
        this.speed = 0.1;
        this.IsBallEdge = false;
        this.move = false;
    }
}

export class Win {
    height: number;
    width: number;
    constructor() {
        this.height = 600;
        this.width = 800;
    }
}

export class Client {
    window: Win;
    inGame: boolean;
    number: number;
    x: number;
    y: number;
    winner: boolean;
    score: number;
    paddleSpeed: number;
    height: number;
    thickness: number;
    socket: Socket;
    id: string;
    token: string;
    constructor(num: number) {
        this.number = num;
        this.score = 0;
        this.winner = false;
        this.inGame = false;
        this.paddleSpeed = 35;
        this.x = 0;
        this.y = 250;
        this.height = 100;
        this.thickness = 13;
        this.id = "";
        this.token = "";
        this.window = new Win();
    }
}

export class Room {
    num: number;
    ball: Ball;
    IsFull: boolean;
    client1: Client;
    client2: Client;
    game: Game;
    constructor(Rnum: number) {
        this.num = Rnum;
        this.IsFull = false;
        this.game = new Game();
        this.client1 = null;
        this.client2 = null;
        this.ball = null;
    }
}