import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/Home";
import Profile from "./pages/Profile";
import Error404 from "./pages/Error404";
import Settings from "./pages/Settings";
import Leaderboard from "./pages/Leaderboard";
import Error401 from "./pages/Error401";
import Game from "./pages/Pong";
import Multiplayer from "./pages/Multiplayer";
import { useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";

function App() {
  // const   [socket, setSocket] = useState<Socket | null>(null);
  // const   [isConnected, setIsConnected] = useState<boolean>(false);
  // const   [token, setToken] = useState<string | null>(null);

  // const   tokenCookie = document.cookie.split("; ").find((cookie) => cookie.startsWith("token="));

  // if (tokenCookie && !token)
  //   setToken(tokenCookie.split("=")[1]);

  // useEffect(() => {
  //     if (!socket && token) {
  //       setSocket(io("http://localhost:3000/", {
  //         extraHeaders: {
  //           Authorization: token,
  //       },
  //       }));
  //       setIsConnected(true);
  //     }
  // }, [socket, isConnected]);


  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/game/singleplayer" element={<Game  />} />
        <Route path="/game/multiplayer" element={<Multiplayer />} />
        <Route path="/profile/:username" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/Error401" element={<Error401 />} />
        <Route path="*" element={<Error404 />} />
      </Routes>
    </Router>
  );
}

export default App;
