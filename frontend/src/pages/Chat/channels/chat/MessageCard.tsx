import React, { FC } from 'react';
import classes from './MessageCard.module.css';

interface MessageCardProps {
  message: string;
}

const MessageCard: FC<MessageCardProps> = (props) => {
  return (
    <div className={classes.messageCard}>
      <img src="https://i.pinimg.com/474x/ec/e2/b0/ece2b0f541d47e4078aef33ffd22777e.jpg" />

      <div className={classes.info}>
        <div className={classes.nameDate}>
          <div>abihe</div>
          <div style={{ color: "gray" }}> — today at 12:44</div>
        </div>
        {/* pay attention to the max width of the message */}
        <div>{props.message}</div>
      </div>
    </div>
  );
}

export default MessageCard;