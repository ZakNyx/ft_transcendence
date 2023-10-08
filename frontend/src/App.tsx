import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useContext, lazy, Suspense, useEffect, useState } from "react";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/Home";
import Profile from "./pages/Profile";
import Error404 from "./pages/Error404";
import Settings from "./pages/Settings";
import Leaderboard from "./pages/Leaderboard";
import Error401 from "./pages/Error401";
import Game from "./pages/Pong";
import Multiplayer from "./pages/Multiplayer";
import { ChatConversation, ChatList, NewChat } from "./pages/Chat/Chat";
import { currentUserType } from "./pages/Chat/userContext";
import { UserContext } from "./pages/Chat/userContext";
import { AddMemberGruop, CreatGroup, GroupSettingGruop, JoinGruop } from "./pages/Chat/Groups";



function App() {
	const [reload, setReload] = useState(false)
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/game/singleplayer" element={<Game />} />
        <Route path="/game/multiplayer" element={<Multiplayer />} />
        
        <Route path="/chat" element={<ChatList />} >
					<Route path="/chat/" element={<NewChat />} />
					<Route path="/chat/users" element={<ChatList isGroup={false} reload={reload}/>} />
					<Route path="/chat/groups/:userId" element={<ChatConversation isGroup={true} reload={reload} /> } />
					<Route path="/chat/users/:userId" element={<ChatConversation isGroup={false} reload={reload} /> } />
					<Route path="/chat/creatgroup" element={<CreatGroup />} />
					<Route path="/chat/joingoup" element={<JoinGruop reload={reload}/>} />					
          <Route path="/chat/group/addmember/:id" element={<AddMemberGruop reload={reload}/>} />
					<Route path="/chat/group/setting/:id" element={<GroupSettingGruop reload={reload}/>} />
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
