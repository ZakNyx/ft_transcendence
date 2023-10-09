import { Link } from "react-router-dom";

function Result(props:any)
{
  return(
    <div className={`${props.result === "won" ?"text-green-400" : "text-red-400"} text-center`}>
      you {props.result}
    </div>
  )
}

export default function EndGame(props:any) {
  return (
    <div className="background-image w-screen h-screen flex items-center justify-center">
      <dialog open className="bg-transparent">
        <Result result={props.result}/>
        <div className="dark:bg-[#1A1C26] bg-[#EEEEFF] h-[40px] w-[150px] flex items-center justify-center hover:bg-[#6F37CF] dark:hover:bg-[#6F37CF] hover:text-white dark:text-white text-[#8F8F8F] rounded-md" >
          <Link to="/home">
            back to home
          </Link>
        </div>
      </dialog>
    </div>
  )
}
