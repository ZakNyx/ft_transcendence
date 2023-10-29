import { useState } from "react";
import { Link } from "react-router-dom";

const Result = (props:any) => {
  console.log(`check result: ${props.result}`);
  return(
    <div className={`${props.result === "won" ?"text-green-400" : "text-red-400"} text-center`}>
      you {props.result}
    </div>
  )
}

const IsGameFinished = (props: any) => {
  const [isSent, setIsSent] = useState<boolean>(false);

  if (!isSent) {
    props.socket.emit('gameEnded', {_room: props.roomId, gamedata: props.gamedata}); 
    setIsSent(true);
  }
  return (
    <>
    </>
  )
}

export default function EndGame(props:any) {
  //background-image removed
  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <dialog open className="bg-transparent">
        <Result result={props.result}/>
        <IsGameFinished socket={props.socket} gamedata={props.gamedata} roomId={props.roomId} />
        <div className="dark:bg-[#1A1C26] bg-[#EEEEFF] h-[40px] w-[150px] flex items-center justify-center hover:bg-[#6F37CF] dark:hover:bg-[#6F37CF] hover:text-white dark:text-white text-[#8F8F8F] rounded-md" >
          <Link to="/home">
            back to home
          </Link>
        </div>
      </dialog>
    </div>
  )
}
