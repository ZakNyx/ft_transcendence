import React, { useContext } from 'react';
import classes from './ChannelCard.module.css';
import DataChannel from './data_context/data-context';

interface Channel {
  channelId: number;
  // Define your channel properties here
}

interface ChannelCardProps {
  channel: Channel;
}

const ChannelCard: React.FC<ChannelCardProps> = (props) => {
  const dataChannelVar = useContext(DataChannel);

  function setConversation_() {
    dataChannelVar.setConversation(props.channel.conversationId);
  }

  return (
    <button className={classes.channelButton} onClick={setConversation_}>
      <img className={classes.channelImg} src="https://i.pinimg.com/474x/ec/e2/b0/ece2b0f541d47e4078aef33ffd22777e.jpg" alt="Channel" />
      <div className={classes.channelInfo}>
        <div>{props.channel.name}</div>
      </div>
    </button>
  );
};

export default ChannelCard;
