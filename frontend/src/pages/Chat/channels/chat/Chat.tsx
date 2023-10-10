import React, { FC, useState } from 'react';
import NewChannel from '../newChannel/NewChannel';
import ProfileModal from '../profileModal/ProfileModal';
import classes from './Chat.module.css'
import ChatHeader from './ChatHeader';
import MessageCard from './MessageCard';

interface ChatProps {
  channel: string;
}

const Chat: FC<ChatProps> = (props) => {
  const [backdrop, setBackdrop] = useState<boolean>(false);

  function OpenCloseModal() {
    if (backdrop === false)
      setBackdrop(true);
    else
      setBackdrop(false);
  }

  const [messagelist, setMessageList] = useState<string[]>([]);
  const [CurentMessage, setCurentMessage] = useState<string>("");

  function Message() {
    if (CurentMessage !== "") {
      setMessageList((list) => [...list, CurentMessage])
      setCurentMessage("")
    }
  }

  return (
    <div className={classes.chatCard}>
      <ChatHeader toggle={OpenCloseModal} channel={props.channel} />
      <div className={classes.chatContent} >
        <div className={classes.chatMessages}>
          {messagelist.map((message) => (
            <MessageCard message={message} />
          ))}
        </div>
        <div className={classes.chatFooter}>
          <input value={CurentMessage} placeholder="  Hey..." type="text" onChange={(event) => {
            setCurentMessage(event.target.value);
          }} onKeyPress={(event) => {
            if (event.key === "Enter") {
              Message();
            };
          }} />
          <button onClick={Message}>&#9658;</button>
        </div>
        {backdrop ? <ProfileModal OpenClose={OpenCloseModal} /> : null}
      </div>
    </div>
  );
}

export default Chat;