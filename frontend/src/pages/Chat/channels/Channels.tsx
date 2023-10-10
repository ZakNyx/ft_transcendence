import React, { useContext, useState } from 'react';
import Chat from './chat/Chat';
import ChannelCard from './ChannelCard';
import classes from './Channels.module.css';
import DataChannel from './data_context/data-context';
import NewChannel from './newChannel/NewChannel';
import { NavLink } from 'react-router-dom';
import NavBar from '../../../components/Navbar';
import dm from "../../../../public/images/dm.svg";
import group from "../../../../public/images/group.svg";
import Friends from '../friends/Friends';

interface Channel {
  channelId: number;
}

interface ChannelsProps {
  toggle: () => void;
}

const Channels: React.FC<ChannelsProps> = (props) => {
  const [backdrop, setBackdrop] = useState<boolean>(false);

  function OpenCloseModal() {
    setBackdrop((prevBackdrop) => !prevBackdrop);
  }

  const dataChannelVar = useContext<DataChannel>(DataChannel);

  return (
    <div className='background-image min-h-screen'>
      <NavBar />
    <div className={classes.mainCard}>
      <div className={classes.channelList}>
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
        <button onClick={OpenCloseModal} className={classes.createChannel}>
          <i className="fa-solid fa-circle-plus"></i>
          <div className={classes.text}>Create Channel</div>
        </button>
        {dataChannelVar.data.map((channel: Channel) => (
          <ChannelCard key={channel.channelId} channel={channel} />
        ))}
      </div>
      <Chat toggle={props.toggle} channel={dataChannelVar.selectedConversation} />
      {backdrop ? <NewChannel OpenClose={OpenCloseModal} /> : null}
    </div>
    </div>
  );
};

export default Channels;
