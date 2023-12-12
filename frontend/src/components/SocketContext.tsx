import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface SocketContextProps {
  socket: Socket | undefined;
}

const SocketContext = createContext<SocketContextProps>({
  socket: undefined,
});

export const useSocket = () => {
  return useContext(SocketContext);
};

interface SocketProviderProps {
  children: React.ReactNode; // Accept multiple children
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket>();

  useEffect(() => {
    const tokenCookie = document.cookie.split('; ').find(cookie => cookie.startsWith('token='));
    const token = tokenCookie?.split('=')[1];

    if (token) {
      const testSocket = io('http://localhost:3000/Chat', {
        extraHeaders: {
          Authorization: `${token}`,
        },
      });

      testSocket.on('connect', () => {
        setSocket(testSocket);
      });

      return () => {
        testSocket.disconnect(); // Disconnect socket on component unmount
      };
    }
  }, []);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketContext;
