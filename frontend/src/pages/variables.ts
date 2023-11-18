import { useState } from "react";
import { Socket, io } from "socket.io-client";

let myGameOppName: any = null;
let isSent: boolean = false;
let isReceived: boolean = false;
let sock: Socket | null = null;
let notifToken: string;
let isSocketSet: boolean = false;
let RoomId: number = 0;
let GameId: number = 0;
let Playerusername: string;

export function setGameId(newValue: number) {
    GameId = newValue;
}

export function setUsername(newValue: string) {
    Playerusername = newValue;
}

export function setRoomId(newValue: number) {
    RoomId = newValue;
}

export function setMyGameOppName(newValue: any){
    myGameOppName = newValue;
}

export function setIsSent(newValue: boolean) {
    isSent = newValue;
}

export function setIsReceived(newValue: boolean) {
    isReceived = newValue;
}

export  function InitSocket() {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [token, setToken] = useState<string | null>(null);

    const tokenCookie: string | undefined = document.cookie
        .split("; ")
        .find((cookie) => cookie.startsWith("token="));

        if (tokenCookie && !token) {
            notifToken = tokenCookie.split("=")[1];
            setToken(notifToken);
        }
    
        if (!socket && token && !isSocketSet) {
            const test: any = io("http://localhost:3000/Invited", {
                extraHeaders: {
                    Authorization: `Bearer ${token}`,
                },
            });

            test.on('connect', () => {
                sock = test;
                console.log(`checking sock.id in variables: ${sock?.id}`);
                setSocket(test);
            })

            // test.on('joined', (roomNumber: number) => {
            //     console.log('joined event received!');
            //     setRoomId(roomNumber);
            // })
            isSocketSet = true;
        }
}

export { myGameOppName };
export { isReceived };
export { isSent };
export { sock };
export { notifToken };
export { RoomId };
export { GameId };
export { Playerusername };