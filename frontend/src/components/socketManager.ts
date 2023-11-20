import io, { Socket } from "socket.io-client";

let socketInstance: any | null = null;
let chatSocketInstance: any | null = null;

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

export const initializeChatSocket = (token: string) => {
  if (!chatSocketInstance) {
    // Create the socket instance with the token
    chatSocketInstance = io(`http://localhost:3000/Chat`, {
      extraHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return chatSocketInstance;
};

