import io, { Socket } from "socket.io-client";
import { backendUrl } from "../pages/Chat/userContext";

let socketInstance: any | null = null;

export const initializeSocket = (token: string) => {
  if (!socketInstance) {
    // Create the socket instance with the token
    socketInstance = io(`http://localhost:3000/notifications`, {
      extraHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return socketInstance;
};

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
