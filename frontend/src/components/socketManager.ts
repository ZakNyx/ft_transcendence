import io, { Socket } from "socket.io-client";
import { backendUrl } from "../pages/Chat/userContext";

class WebSocket {

    private socket: Socket | null = null;
    connect(): any {
        if (!this.socket) {
            this.socket = io(
                `ws://${backendUrl}`,
                {
                    transportOptions: {
                    polling: {
                        extraHeaders: {
                            // Authorization: `Bearer ${Cookies.get("Token")}`,
                            Authorization: document.cookie.slice(6),
                        }
                    }
                }}
            );
            // this.socket.connect();
            // console.log('socket connect .............');
		    this.socket.emit("connected");
        }
        return this.socket;
    }

    disconnect(): void {
        // console.log('disconnect .... ')
        this.socket?.disconnect();
        this.socket = null;
    }

    getSocket(): Socket | null {
        return this.socket;
    }
}

const webSocket= new WebSocket();
export default webSocket;
