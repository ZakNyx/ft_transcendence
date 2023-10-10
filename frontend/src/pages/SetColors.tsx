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
      <div className="flex flex-col App background-image min-h-screen w-screen h-screen">
        <NavBar />
        <div className=" m-auto justify-between grid grid-cols-3 gap-4">
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
        </div>
        <NavLink to="/game/singleplayer">
          <div className="m-4 bg-yellow-500 hover:bg-yellow-600 ">
            Save changes
          </div>
        </NavLink>
      </div>
    );
}
