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
import Channels from "./pages/Chat/channels/Channels";
import Friends from "./pages/Chat/friends/Friends";
import { DataContextProvider } from "./pages/Chat/friends/data_context/data-context";
import { DataChannelProvider } from "./pages/Chat/channels/data_context/data-context";
import Invited from "./pages/Invited";
import NavBar from "./components/Navbar";

function App() {
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
    </div>
  );
}

export default App;
