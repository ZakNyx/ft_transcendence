import { useEffect, useRef, useState } from "react";
import * as THREE from 'three'
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, RoundedBox, Sphere } from "@react-three/drei";
import NavBar from "../components/Navbar";

let direction: number;
let speed: number;
let xval: number;
let xdir: number;
let move: boolean;

interface GameSettings {
  paddleColor: string;
  ballColor: string;
  difficulty: string;
}

function init() {
  direction = 1;
  speed = 0.2;
  xval = 0;
  xdir = 1;
  move = false;
}

init();

const PlayArea = () => {
  return (
    <mesh rotation-x={Math.PI * -0.5}>
      <planeGeometry args={[15, 20]} />
      <meshBasicMaterial color="rgb(0, 0, 0)" side={THREE.DoubleSide} />
    </mesh>
  );
};

function GameObjects(props: any) {
  const refPlayer: any = useRef();
  const refCpu: any = useRef();
  const refBall: any = useRef();
  const [playerX, setPlayerX] = useState<number>(0);
  const [cpuX, setCpuX] = useState<number>(0);
  const [ballX, setBallX] = useState<number>(0);

  useFrame(({ mouse }) => {

    //player management
    if (refPlayer.current) {
      refPlayer.current.position.x = ((1 - mouse.y) * 15 - 15);
      setPlayerX(((1 - mouse.y) * 15 - 15))
      if (refPlayer.current.position.x < -6 || refPlayer.current.position.x > 6) {
        if (refPlayer.current.position.x < -6) {
          refPlayer.current.position.x = -6;
          setPlayerX(-6)
        }
        if (refPlayer.current.position.x > 6) {
          refPlayer.current.position.x = 6;
          setPlayerX(6)
        }
      }
    }

    //cpu management
    if (refCpu.current) {
      setCpuX(refCpu.current.position.x);
      if (move) {
        if (ballX > refCpu.current.position.x && refCpu.current.position.x < 6)
          refCpu.current.position.x += Number(props.difficulty);
        if (ballX < refCpu.current.position.x && refCpu.current.position.x > -6)
          refCpu.current.position.x -= Number(props.difficulty);
      }
    }

    //ball management
    if (refBall.current && !props.pause) {
      //ball collision with player
      if (refBall.current.position.z > 8.5) {
        if (Math.abs(refBall.current.position.x - playerX) < 1.5) {
          direction = -1;
          xdir = 1;
          xval = (refBall.current.position.x - playerX) / 10
          move = true;
        }
      }

      //ball collision with cpu
      if (refBall.current.position.z < -8.5) {
        if (Math.abs(refBall.current.position.x - cpuX) < 1.5) {
          direction = 1;
          xdir = 1;
          xval = (refBall.current.position.x - cpuX) / 10;
          move = false;
        }
      }

      //ball collision with a wall
      if ((refBall.current.position.x > 7) || (refBall.current.position.x < -7)) xdir *= -1;

      //ball movement
      refBall.current.position.z += direction * speed;
      refBall.current.position.x += xval * xdir;
      setBallX(refBall.current.position.x);

      //ball passes boundaries
      if (refBall.current.position.z > 9.3 || refBall.current.position.z < -9.3) {
        refBall.current.position.x = 0;
        refBall.current.position.z = 0;
        init()
      }
    }
  });

  return (
    <>
      <mesh>
        <RoundedBox ref={refPlayer} args={[3, 0.3, 0.3]} radius={0.05} position={[0, 0.3, 9.3]}>
          <meshBasicMaterial color={props.color} />
        </RoundedBox>
      </mesh>
      <mesh>
        <RoundedBox ref={refCpu} args={[3, 0.3, 0.3]} radius={0.05} position={[0, 0.3, -9.3]}>
          <meshBasicMaterial color={props.color} />
        </RoundedBox>
      </mesh>
      <Sphere ref={refBall} args={[0.3, 20, 20]} position={[0, 1, 0]}>
        <meshBasicMaterial color={props.ballColor} />
      </Sphere>
    </>
  );
}

const CallEverything = (props: any) => {
  const [pause, setPause] = useState<boolean>(false);

  return (
    //background-image removed
    <div className="flex flex-col App h-screen overflow-y-scroll">
      {/* <NavBar /> */}
      <div
        className="h-[80%] w-full"
        onMouseLeave={() => setPause(true)}
        onMouseEnter={() => setPause(false)}
      >
        <Canvas camera={{ position: props.cameraPosition }}>
          <OrbitControls enableRotate={true} enableZoom={true} />
          <PlayArea />
          <GameObjects
            color={props.paddleColor}
            ballColor={props.ballColor}
            difficulty={props.difficulty}
            pause={pause}
          />
        </Canvas>
      </div>
    </div>
  );
};

const  SettingVars = (props: any) => {

  const paddleColorRef: React.RefObject<HTMLInputElement> =
    useRef<HTMLInputElement>(null);
  const ballColorRef: React.RefObject<HTMLInputElement> =
    useRef<HTMLInputElement>(null);
  const levelRef: React.RefObject<HTMLSelectElement> =
    useRef<HTMLSelectElement>(null);


  const [paddleColor, setPaddleColor] = useState<string>(props.paddleColor);
  const [ballColor, setBallColor] = useState<string>(props.ballColor);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>(props.difficulty);

  const handlePaddleColorChange = () => {
    if (paddleColorRef.current) {
      setPaddleColor(paddleColorRef.current.value);
    }
  };

  const handleBallColorChange = () => {
    if (ballColorRef.current) { 
      setBallColor(ballColorRef.current.value);
    }
  };

  const handleDifficultyChange = () => {
    if (levelRef.current) {
      setSelectedDifficulty(levelRef.current.value);
    }
  };

  const handleSaveChanges = () => {
    props.onSettingsChange(paddleColor, ballColor, selectedDifficulty);
  };

  return (
    //background-image removed
    <div className="flex flex-col App min-h-screen w-screen h-screen bg-npc-gra">
      {/* <NavBar /> */}
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
            ref={levelRef}
            name="difficulty"
            id="difficulty"
            onChange={handleDifficultyChange}
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
            ref={paddleColorRef}
            type="color"
            onChange={handlePaddleColorChange}
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
            ref={ballColorRef}
            type="color"
            onChange={handleBallColorChange}
          ></input>
        </div>
        <div className="col-span-3 flex justify-center items-center mt-4">
          <button 
            onClick={handleSaveChanges}
            className="p-1 bg-npc-purple hover:bg-purple-hover rounded-lg hover:translate-y-[-3px] text-white font-montserrat transition-all">
            Save changes
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Game() {
  const [cameraPosition] = useState<number[] | any>([0.001, 20, 0]);
  const [isGameStarted, setIsGameStarted] = useState<boolean>(false);

  const [settings, setSettings] = useState<GameSettings>({
    paddleColor: "rgb(255, 255, 255)",
    ballColor: "red",
    difficulty: "0.1",
  });

  const handleSettingsChange = (paddleColor: string, ballColor: string, difficulty: string) => {
    setSettings({ paddleColor, ballColor, difficulty });
    setIsGameStarted(true);
  };

  if (!isGameStarted) {
    return (
      <div>
        <SettingVars
          paddleColor={settings.paddleColor}
          ballColor={settings.ballColor}
          difficulty={settings.difficulty}
          onSettingsChange={handleSettingsChange}
        />
      </div>
    );
  }
  if (isGameStarted) {
    return (
      <div>
        <CallEverything
          cameraPosition={cameraPosition}
          paddleColor={settings.paddleColor}
          ballColor={settings.ballColor}
          difficulty={settings.difficulty}
        />
      </div>
    )
  }
}
