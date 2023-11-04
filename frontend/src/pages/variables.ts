import { useState } from "react";
import { Socket, io } from "socket.io-client";

let myGameOppName: any = null;
let isSent: boolean = false;
let isReceived: boolean = false;
let sock: Socket | null = null;
let notifToken: string;
let isSocketSet: boolean = false;

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
        setToken(tokenCookie.split("=")[1]);
        notifToken = tokenCookie.split("=")[1];
    }

    if (!socket && token && !isSocketSet) {
        setSocket(
            io("http://localhost:3000/Invited", {
                extraHeaders: {
                    Authorization: `Bearer ${token}`,
                },
            }),
        );
    }

    if (socket && !isSocketSet) {
        console.log('checking socket if it initialize again');
        sock = socket;
        isSocketSet = true;
    }
}

export { myGameOppName };
export { isReceived };
export { isSent };
export { sock };
export { notifToken };