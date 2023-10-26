import React, { useContext } from 'react';
import Chat from './chat/Chat';
import { DataContext } from './data_context/data-context';
import FriendCard from './FriendCard';
import classes from './Friends.module.css';
import { NavLink } from 'react-router-dom';
import NavBar from '../../../components/Navbar';
import dm from "../../../../public/images/dm.svg";
import group from "../../../../public/images/group.svg";

function Friends() {
  const dataContextVar = useContext(DataContext);
  console.log(dataContextVar);

  return (
    <div className='background-image min-h-screen'>
      <NavBar />
      <div className={`${classes.mainCard} background-image min-h-screen`}>
        <div className={classes.friendList}>
        <div className="flex">
          <NavLink to="/Chat">
            <button className="mr-4 relative bg-npc-purple hover:bg-purple-hover hover:translate-y-[-6px] transition-all shadow-but active:bg-purple-active hover:cursor-pointer text-black font-[Roboto] font-bold text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl sm:p-3 xl:p-4 rounded-lg flex items-center">
              <img src={dm} alt="Joystick" className="mr-3 w-8 h-8" />
              Private dm
            </button>
          </NavLink>
          
          <NavLink to="/chat/channels">
            <button className="relative bg-npc-purple hover:bg-purple-hover hover:translate-y-[-6px] transition-all shadow-but active:bg-purple-active hover:cursor-pointer text-black font-[Roboto] font-bold text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl sm:p-3 xl:p-4 rounded-lg flex items-center">
              <img src={group} alt="Joystick" className="mr-3 w-8 h-8" />
              Channels
            </button>
          </NavLink>
        </div>
        <input type="text" /* value="" */ placeholder="  Search..." />
        {dataContextVar?.data.map((user) => (
          <FriendCard key={user.conversationId} user={user} />
            ))}
        </div>
        {dataContextVar?.selectedConversation && <Chat user={dataContextVar.selectedConversation} />}
      </div>
    </div>
  );
}

export default Friends;
