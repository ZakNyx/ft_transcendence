import { useState } from "react";
import { Link } from "react-router-dom";

const Result = (props: any) => {
  console.log(`check result: ${props.result}`);
  return (
    <div className={`${
      props.result === "won" ? "text-green-700" : "text-red-700"
    } text-center text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold`}>
      You {props.result}
    </div>
  );
};


const IsGameFinished = (props: any) => {
  const [isSent, setIsSent] = useState<boolean>(false);

  if (!isSent) {
    props.socket.emit('gameEnded', {_room: props.roomId}); 
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
      <dialog open className="bg-transparent ">
        <Result result={props.result}/>
        <IsGameFinished socket={props.socket} roomId={props.roomId} />
        <div className="dark:bg-[#1A1C26] bg-[#EEEEFF] mt-5 p-2 flex items-center justify-center hover:bg-[#6F37CF] dark:hover:bg-[#6F37CF] hover:text-black dark:text-white text-[#8F8F8F] rounded-md transition-all" >
          <Link to="/home">
            Back to Home
          </Link>
        </div>
      </dialog>
    </div>
  )
}
