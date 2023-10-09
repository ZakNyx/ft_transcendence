import React, { useContext } from 'react';
import { DataContext } from './data_context/data-context'; // Ensure correct import path
import classes from './FriendCard.module.css';

interface User {
  conversationId: number;
  name: string;
}

interface FriendCardProps {
  user: User;
}

function FriendCard(props: FriendCardProps) {
  const dataContextVar = useContext(DataContext);

  function setConversation_() {
    if (dataContextVar) {
      dataContextVar.setConversation(props.user.conversationId);
    }
  }

  return (
    <button className={classes.friendButton} onClick={setConversation_}>
      <img className={classes.profileImg} src="https://i.pinimg.com/474x/ec/e2/b0/ece2b0f541d47e4078aef33ffd22777e.jpg" alt="profile"></img>
      <div className={classes.profileInfo}>
        <div>{props.user.name}</div>
        <div>online</div>
      </div>
    </button>
  );
}

export default FriendCard;
