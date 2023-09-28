import io from "socket.io-client";


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