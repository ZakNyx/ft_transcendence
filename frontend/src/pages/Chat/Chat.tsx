import { Socket } from 'socket.io-client';
import GroupsComponent from './Groups.tsx';
import DMComponent from './People.tsx';
import { Outlet } from 'react-router-dom';


interface PropsType {
  userId: string;
  socket: Socket
}

const Chat = (props: PropsType) => {
  const userId = props.userId;

  return (
    <div
      className="chat lg:ml-[2px] lg:mr-[2px] lg:mb-[10px] lg:h-full lg:w-full lg:flex lg:100vh lg:gap-[0px] 
    ml-[2px] mr-[2px] mb-[10px] h-full w-full flex justify-around 100vh gap-[0px] mt-[20px]"
    >
      <div
        className=" lg:ml-[20px] lg:mr-[-10px] lg:my-[15px] lg:h-full lg:w-[30%] lg:flex-wrap lg:items-start
      ml-[20px] mr-[-10px] my-[15px] h-full w-[50%] flex-wrap items-start"
      >
        < GroupsComponent userId={userId} socket={props.socket} />
        < DMComponent userId={userId} socket={props.socket} />
      </div>
      <Outlet />
    </div>
  );
};

export default Chat;