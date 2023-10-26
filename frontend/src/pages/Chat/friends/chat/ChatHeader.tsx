import { FC, useState } from 'react';
import classes from './ChatHeader.module.css';
import { NavLink } from 'react-router-dom';
import { Socket, io } from 'socket.io-client';
import { sock } from '../../../../components/Navbar';


interface User {
  name: string;
}


interface GameInvitationProps {
  OpenClose: () => void;
}

const GameInvitation: FC<GameInvitationProps> = (props) => {
  const [user, setUser] = useState<User  | null>(null);
  return (
    <div>
      <div className={classes.backdrop}></div>
      <div className={classes.card}>
        <div className={classes.cardContent}>
          <h1>GAME INVITATION</h1>
          <div className={classes.choices}>
            <NavLink to="/game/invited">
              <button id={classes.check} className={classes.buttons} onClick={props.OpenClose}>
                <i className="fa-solid fa-check"></i>
              </button>
            </NavLink>
            <button id={classes.cross} className={classes.buttons} onClick={props.OpenClose}>
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface ChatHeaderProps {
  toggle: () => void;
  user: User;
}

const ChatHeader: FC<ChatHeaderProps> = (props) => {
  const [backdrop1, setBackdrop1] = useState<boolean>(false);
  const [backdrop2, setBackdrop2] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false); 

  const OpenCloseModal1 = () => {
    setBackdrop1(!backdrop1);
  };

  const OpenCloseModal2 = () => {
    setBackdrop2(!backdrop2);
  };

  const notifsocket : Socket | null = sock;
  if (notifsocket) console.log(`check notif socket id : ${notifsocket.id}`);
  
  const tokenCookie: string | undefined = document.cookie
    .split("; ")
    .find((cookie) => cookie.startsWith("token="));

  if (tokenCookie && !token) {
    setToken(tokenCookie.split("=")[1]);
  }

  if (!socket && token) {
    setSocket(
      io("http://localhost:3000/Invited", {
        extraHeaders: {
          Authorization: `Bearer ${token}`,
        },
      }),
    );
    setIsConnected(true);
  }

  if (socket) {
    socket.emit('test', notifsocket?.id)
  }

  return (
    <div className={classes.chatWrapper}>
      <button className={classes.chatHeader} onClick={props.toggle}>
        <img src="https://i.pinimg.com/474x/ec/e2/b0/ece2b0f541d47e4078aef33ffd22777e.jpg" alt="user"></img>
        <div className={classes.info}>
          <div>{props.user.name}</div>
          <div>Online </div>
        </div>
      </button>
      <button onClick={OpenCloseModal1} className={classes.buttonSetting}>
        <i className="fa-solid fa-ellipsis-vertical"></i>
      </button>
      {backdrop1 ? (
        <div className={classes.userHandler}>
          <button onClick={() => { OpenCloseModal2(); OpenCloseModal1();}} className={classes.buttonInvitation}>
            Game Invitation
          </button>
          <button onClick={OpenCloseModal1} className={classes.buttonUnfriend}>
            Unfriend
          </button>
          <button onClick={OpenCloseModal1} className={classes.buttonBlock}>
            Block
          </button>
        </div>
      ) : null}
      {backdrop2 ? <GameInvitation OpenClose={OpenCloseModal2} /> : null}
    </div>
  );
};

export default ChatHeader;
