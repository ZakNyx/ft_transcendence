import { FC, useState } from 'react';
import ProfileModal from './profileModal/ProfileModal';
import classes from './Chat.module.css';
import ChatHeader from './ChatHeader';
import MessageCard from './MessageCard';

interface User {
  nam: string;
}

interface ChatProps {
  user: User;
}

const Chat: FC<ChatProps> = (props) => {
  const [backdrop, setBackdrop] = useState<boolean>(false);
  console.log(props.user)

  function OpenCloseModal() {
    if (backdrop === false) {
      setBackdrop(true);
    } else {
      setBackdrop(false);
    }
  }

  const [messagelist, setMessageList] = useState<string[]>([]);
  const [currentMessage, setCurrentMessage] = useState<string>("");

  function Message() {
    if (currentMessage !== "") {
      setMessageList((list) => [...list, currentMessage]);
      setCurrentMessage("");
    }
  }

  return (
    <div className={classes.chatCard}>
      <ChatHeader user={props.user} toggle={OpenCloseModal} />
      <div className={classes.chatContent}>
        <div className={classes.chatMessages}>
          {messagelist.map((message, index) => (
            <MessageCard key={index} message={message} />
          ))}
        </div>
        <div className={classes.chatFooter}>
          <input
            value={currentMessage}
            placeholder="  Hey..."
            type="text"
            onChange={(event) => {
              setCurrentMessage(event.target.value);
            }}
            onKeyPress={(event) => {
              if (event.key === "Enter") {
                Message();
              }
            }}
          />
          <button onClick={Message}>&#9658;</button>
        </div>
        {backdrop ? <ProfileModal OpenClose={OpenCloseModal} /> : null}
      </div>
    </div>
  );
};

export default Chat;