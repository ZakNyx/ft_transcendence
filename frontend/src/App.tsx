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
import { AddMemberGruop, CreatGroup, GroupSettingGruop, JoinGruop } from "./pages/Chat/Groups";
import Channels from "./pages/Chat/channels/Channels";
import Friends from "./pages/Chat/friends/Friends";
import { DataContextProvider } from "./pages/Chat/friends/data_context/data-context";
import SetColor from "./pages/SetColors";
import { DataChannelProvider } from "./pages/Chat/channels/data_context/data-context";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/game" element={<SetColor  />} />
        <Route path="/game/singleplayer/:paddleColor/:ballColor/:difficulty" element={<Game />} />
        <Route path="/game/multiplayer" element={<Multiplayer />} />
				<Route >
          <Route path="/chat" element={<DataContextProvider><Friends /></DataContextProvider>} />
          <Route path="/Chat/Channels" element={<DataChannelProvider><Channels /></DataChannelProvider>} />
        </Route>
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

