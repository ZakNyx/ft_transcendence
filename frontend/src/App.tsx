import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { Socket, io } from "socket.io-client";
import  { jwtDecode } from 'jwt-decode';
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/Home";
import Profile from "./pages/Profile";
import Error404 from "./pages/Error404";
import Settings from "./pages/Settings";
import Leaderboard from "./pages/Leaderboard";
import Error401 from "./pages/Error401";
import Game from "./pages/Pong";
import Multiplayer from "./pages/Multiplayer";
import Invited from "./pages/Invited";
import NavBar from "./components/Navbar";

import Chat from "./pages/Chat/Chat";
import DefaultChatComp from "./pages/Chat/DefaultChatComp";
import CreateRoom from "./pages/Chat/CreateRoom";
import JoinRoom from "./pages/Chat/JoinRoom";
import AddPeople from "./pages/Chat/AddPeople";
import DMConv from "./pages/Chat/DMConv";
import GroupConv from "./pages/Chat/GroupConv";
import InvToRoom from "./pages/Chat/InvToRoom";
import RoomSettings from "./pages/Chat/RoomSettings";
import BannedList from "./pages/Chat/BannedList";

export interface Token {
  sub: string;
  email: string;
}

function App() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string>("");


  useEffect(() => {
    let newToken: string | null = null;
    const tokenCookie: string | undefined = document.cookie
      .split("; ")
      .find((cookie) => cookie.startsWith("token="));
    if (tokenCookie && !token) {
      newToken = tokenCookie.split("=")[1];
      setToken(newToken);
      if (newToken && !socket) {
        const decode: Token = jwtDecode(newToken);
        console.log('check token in App : ', newToken);
        //Debug 2 : Verify user Id type
        setUserId(decode["username"]);
        // alert("In App.tsx " + decode["username"])
          const newSocket: Socket = io("http://localhost:3000/Chat", {
            extraHeaders: {
              Authorization: `Bearer ${newToken}`,
            },
          });
          
          newSocket.on("connect", () => {
            console.log("Socket connected");
          });
      
          newSocket.on("disconnect", () => {
            console.log("Socket disconnected");
          });
      
          setSocket(newSocket);
      }
    }
    if (socket) console.log("socket in App.tsx : ", socket);
  }, [token, socket, userId]);

    // I get the path and checks if matches the euh LoginPage and returns either true or false ~
  const currentRoute = window.location.pathname;
  const isLoginPage = currentRoute === "/";


    return (
      <div className="background-image min-h-screen overflow-hidden">
        <Router>
          {!isLoginPage && <NavBar />}
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/game/invited" element={<Invited />} />
            <Route path="/game/singleplayer" element={<Game />} />
            <Route path="/game/multiplayer" element={<Multiplayer />} />
            <Route
              path="chat"
              element={<Chat userId={userId} socket={socket} />}
            >
              <Route index element={<DefaultChatComp />} />
              <Route
                path="createRoom"
                element={<CreateRoom socket={socket} userId={userId} />}
              />
              <Route
                path="joinRoom"
                element={<JoinRoom userId={userId} socket={socket} />}
              />
              <Route
                path="addPeople"
                element={<AddPeople socket={socket} userId={userId} />}
              />
              <Route
                path="dmConv"
                element={<DMConv socket={socket} userId={userId} />}
              />
              <Route
                path="groupConv"
                element={<GroupConv userId={userId} socket={socket} />}
              />
              <Route
                path="invToRoom"
                element={<InvToRoom socket={socket} userId={userId} />}
              />
              <Route
                path="roomSettings"
                element={<RoomSettings socket={socket} userId={userId} />}
              />
              <Route
                path="bannedUsers"
                element={<BannedList socket={socket} userId={userId} />}
              />
            </Route>
            <Route path="/profile/:username" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/Error401" element={<Error401 />} />
            <Route path="*" element={<Error404 />} />
          </Routes>
        </Router>
      </div>
    );
  // }
}

export default App;
