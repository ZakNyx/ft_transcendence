import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import Cookies from "js-cookie";
// import * as jwtDecode from "jwt-decode"
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
import user_data from "./utilities/data_fetching";

export interface Token {
  sub: string;
  email: string;
}

function App() {
  const [socket, setSocket] = useState<any>(null);
  // const [enabled2FA, setEnabled2FA] = useState<any>();
  // const [validated2FA, setValidated2FA] = useState<any>();
  // const [firstTime, setFirstTime] = useState<any>();
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string>("");


  useEffect(() => {
    const tokenCookie: string | undefined = document.cookie
      .split("; ")
      .find((cookie) => cookie.startsWith("token="));
    if (tokenCookie && !token) {
      setToken(tokenCookie.split("=")[1]);
      if (token) {
        const decode: Token = jwtDecode(token);
        setUserId(decode.sub);
        if (socket === null)
          setSocket(
            io("http://localhost:3000/Chat", {
              auth: { token: token },
            }),
          );
      }
    }
  }, [token, socket, userId]);
      // This expression is not callable. Type 'typeof import("frontend/node_modules/jwt-decode/build/esm/index")' has no call signatures.
    // useEffect(() => {
    //   user_data().then((data: any) => {
    //     // setEnabled2FA(data.user.otp_enabled)
    //     // setValidated2FA(data.user.otp_validated)
    //     setFirstTime(data.user.FirstTime);
    //   });
    // }, []);

    return (
      <div className="background-image min-h-screen">
        <Router>
          <NavBar />
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
