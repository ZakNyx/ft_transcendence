import { useState, useRef } from "react";
import NavBar from "../components/Navbar";
import { NavLink } from "react-router-dom";

export default function SetColor() {
  const [paddleColor, setPaddleColor] = useState<string>("rgb(255, 255, 255)");
  const [ballColor, setBallColor] = useState<string>("red");
  const [difficulty, setDifficulty] = useState<string>("0.1");

  const paddle: any = useRef();
  const ball: any = useRef();
  const level: any = useRef();

  return (
    <div className="flex flex-col App background-image min-h-screen w-screen h-screen bg-npc-gra">
      <NavBar />
      <div className="m-auto justify-between grid grid-cols-3 gap-4 bg-npc-gray p-8 rounded-xl">
        <div className="col-span-3 text-gray-200 font-montserrat font-semibold mb-1">
          Game's Settings
        </div>
        <div className="col-span-3 h-0.5 bg-gray-200 mb-6 "></div> 
        <div className="flex flex-col md:flex-row items-center mb-4 md:mb-0">
          <label
            className="dark:text-white pr-2 font-semibold"
            htmlFor="difficulty"
          >
            Difficulty:
          </label>
          <select
            ref={level}
            name="difficulty"
            id="difficulty"
            onChange={() => {
              setDifficulty(level.current.value);
            }}
          >
            <option value="0.07">Easy</option>
            <option value="0.1">Medium</option>
            <option value="0.2">Hard</option>
          </select>
        </div>
        <div className="flex flex-col md:flex-row items-center mb-4 md:mb-0">
          <label
            className="dark:text-white pr-2 font-semibold"
            htmlFor="paddle color"
          >
            Paddle's Color:
          </label>
          <input
            className="bg-transparent"
            name="paddle color"
            ref={paddle}
            type="color"
            onChange={() => {
              setPaddleColor(paddle.current.value);
            }}
          ></input>
        </div>
        <div className="flex flex-col md:flex-row items-center mb-4 md:mb-0">
          <label
            className="dark:text-white pr-2 font-semibold"
            htmlFor="ball color"
          >
            Ball's Color:
          </label>
          <input
            className="bg-transparent rounded-lg"
            name="ball color"
            ref={ball}
            type="color"
            onChange={() => {
              setBallColor(ball.current.value);
            }}
          ></input>
        </div>
        <div className="col-span-3 flex justify-center items-center mt-4">
          <NavLink to="/game/singleplayer">
            <button className="p-1 bg-npc-purple hover:bg-purple-hover rounded-lg hover:translate-y-[-3px] text-white font-montserrat transition-all">
              Save changes
            </button>
          </NavLink>
        </div>
      </div>
    </div>
  );
}
