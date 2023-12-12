import { useEffect, useState, useRef, MutableRefObject } from "react";
import { Socket, io } from "socket.io-client";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, RoundedBox, Sphere } from "@react-three/drei";
import { DoubleSide } from "three";
import EndGame from "./EndGame";
import RotatingButton from "./RotatingButton";
import { NavLink, useNavigate } from "react-router-dom";
import ScoreBar from "../components/ScoreBar";
import { setGameId, setMyGameOppName } from "./variables";

interface GameSettings {
  paddleColor: string;
  ballColor: string;
}

let isleavingQueueWithButton: boolean = false;

interface GameData {
  gameId: number;
  player1: { playerID: string; score: string };
  player2: { playerID: string; score: string };
}

const PlayArea = () => {
  return (
    <mesh rotation-x={Math.PI * -0.5}>
      <planeGeometry args={[15, 20]} />
      <meshBasicMaterial color="rgb(0, 0, 0)" side={DoubleSide} />
    </mesh>
  );
};

const PlayerPaddle = (props: any) => {
  const refPlayer = useRef<MutableRefObject<undefined> | any>();

  useFrame(({ mouse }) => {
    if (refPlayer.current) {
      refPlayer.current.position.x = (1 - mouse.y) * 15 - 15;
      if (
        refPlayer.current.position.x < -6 ||
        refPlayer.current.position.x > 6
      ) {
        if (refPlayer.current.position.x < -6)
          refPlayer.current.position.x = -6;
        if (refPlayer.current.position.x > 6) refPlayer.current.position.x = 6;
      }
      props.socket.emit("PaddleMovement", {
        x: refPlayer.current.position.x,
        room: props.roomId,
      });
    }
  });
  return (
    <mesh>
      <RoundedBox
        ref={refPlayer}
        args={[3, 0.5, 0.5]}
        radius={0.2}
        position={[0, 0.3, 9.3]}
      >
        <meshBasicMaterial color={props.paddlecolor} />
      </RoundedBox>
    </mesh>
  );
};

const DrawBall = (props: any) => {
  const [ball, setBall] = useState([0, 0]);

  useFrame(() => {
    props.socket.emit("demand", {
      _room: props.room,
      gamedata: props.gamedata,
    });
  });

  useEffect(() => {
    //need to listen here for event to setBall coords
    props.socket.on(
      "DrawBall",
      (data: { x: number; z: number; pos: number }) => {
        const { x, z, pos } = data;
        if (pos === 1) setBall([x, z]);
        else setBall([x, -z]);
      },
    );
    return () => {
      props.socket.off("DrawBall");
    };
  }, [props.socket]);

  return (
    <>
      <Sphere args={[0.3, 10, 10]} position={[ball[0], 0, ball[1]]}>
        <meshBasicMaterial color={props.ballcolor} />
      </Sphere>
    </>
  );
};

const OpponentPlayerPaddle = (props: any) => {
  const [position, setPosition] = useState<number>(0);

  useEffect(() => {
    props.socket.on("OppenentPaddlePosition", (position: number) => {
      setPosition(position);
    });
  }, [position]);

  return (
    <mesh>
      <RoundedBox
        args={[3, 0.5, 0.5]}
        radius={0.2}
        position={[position, 0.3, -9.3]}
      >
        <meshBasicMaterial color={props.paddlecolor} />
      </RoundedBox>
    </mesh>
  );
};

const SettingVars = (props: any) => {
  const paddleColorRef: React.RefObject<HTMLInputElement> =
    useRef<HTMLInputElement>(null);
  const ballColorRef: React.RefObject<HTMLInputElement> =
    useRef<HTMLInputElement>(null);

  const [paddleColor, setPaddleColor] = useState<string>(props.paddleColor);
  const [ballColor, setBallColor] = useState<string>(props.ballColor);

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

  const handleSaveChanges = () => {
    props.onSettingsChange(paddleColor, ballColor);
  };

  return (
    //background-image removed
    <div className="flex flex-col App min-h-screen w-screen h-screen bg-npc-gra">
      <div className="m-auto justify-between grid grid-cols-3 gap-4 bg-npc-gray p-8 rounded-xl">
        <div className="col-span-3 text-gray-200 font-montserrat font-semibold mb-1">
          Game's Settings
        </div>
        <div className="col-span-3 h-0.5 bg-gray-200 mb-6 "></div>
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
            className="p-1 bg-npc-purple hover:bg-purple-hover rounded-lg hover:translate-y-[-3px] text-white font-montserrat transition-all"
          >
            Save changes
          </button>
        </div>
      </div>
    </div>
  );
};

const CallEverything = (props: any) => {
  return (
    <>
      <PlayerPaddle
        socket={props.socket}
        roomId={props.roomId}
        paddlecolor={props.paddlecolor}
        gamedata={props.gameData}
      />
      <OpponentPlayerPaddle
        socket={props.socket}
        paddlecolor={props.paddlecolor}
      />
      <DrawBall
        socket={props.socket}
        room={props.roomId}
        ballcolor={props.ballcolor}
        gamedata={props.gamedata}
      />
    </>
  );
};

const leaveQueue = (props: any) => {
  if (props.socket) {
    props.socket.emit('leaveQueue', props.roomId);
  }
  // const navigate = useNavigate();
  // navigate('/home');
}

const RotatedCircle: React.FC<any> = (props) => {
  props.socket.emit("InQueue", props.roomId);

  return (
    <div className="h-screen flex flex-col items-center justify-center overflow-hidden">
      <RotatingButton />
      <div className="mt-4">
        <NavLink to="/home">
          <button
            onClick={() => leaveQueue(props)}
            className="bg-red-500 hover:bg-red-600 py-2 px-4 rounded-lg transition text-white"
          >
            Leave the queue
          </button>
        </NavLink>
      </div>
    </div>
  );
};

export default function Multiplayer() {
  const [socket, setSocket] = useState<Socket | null>(null);

  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [IsGameStarted, setIsGameStarted] = useState<boolean>(false);
  const [IsGameEnded, setIsGameEnded] = useState<boolean>(false);
  const [InGame, setInGame] = useState<boolean>(false);
  const [StillInGame, setStillInGame] = useState<boolean>(false);
  const [changeSettings, setChangeSettings] = useState<boolean>(false);
  const [oppUsername, setOppUsername] = useState<string>("");
  const [settings, setSettings] = useState<GameSettings>({
    paddleColor: "rgb(255, 255, 255)",
    ballColor: "red",
  });

  const [result, setResult] = useState<string>("");

  const [RoomNumber, setRoomNumber] = useState<number>(0);
  const [token, setToken] = useState<string | null>(null);

  const [myScore, setmyScore] = useState<number>(0);
  const [enemyScore, setenemyScore] = useState<number>(0);

  const [gameData, setGameData] = useState<GameData | null>(null);

  const tokenCookie: string | undefined = document.cookie
    .split("; ")
    .find((cookie) => cookie.startsWith("token="));

  if (tokenCookie && !token) {
    setToken(tokenCookie.split("=")[1]);
  }

  if (!socket && token && changeSettings) {
    setSocket(
      io("http://localhost:3000/Game", {
        extraHeaders: {
          Authorization: `Bearer ${token}`,
        },
      }),
    );
    setIsConnected(true);
  }

  const handleSettingsChange = (paddleColor: string, ballColor: string) => {
    setSettings({ paddleColor, ballColor });
    setChangeSettings(true);
  };

  useEffect(() => {
    if (socket) {
      socket.on("joined", (RoomId: number) => {
        setRoomNumber(RoomId);
      });

      socket.on("gameStarted", (data: {gamedata: GameData, OppName: string}) => {
        const {gamedata, OppName} = data;
        setGameId(gamedata.gameId);
        setGameData(gamedata);
        setOppUsername(OppName);
        setMyGameOppName(OppName);
        setInGame(true);
        setIsGameStarted(true);
      });

      socket.on("InGame", () => {
        setStillInGame(true);
      })

      socket.on("PlayWithYourself", () => {
        navigate('/home');
      })

      socket.on("gameEnded", () => {
        socket.disconnect();
        setIsGameEnded(true);
        setStillInGame(false);
      });

      socket.on("won", () => {
        setResult("won");
      });

      socket.on("lost", () => {
        setResult("lost");
      });

      socket.on(
        "Score",
        (data: { p1: number; p2: number; oppName: string }) => {
          const { p1, p2, oppName } = data;
          setmyScore(p1);
          setenemyScore(p2);
          setOppUsername(oppName);
        },
      );
    }

    return () => {
      if (socket) {
        if (InGame) {
          socket.emit('leaveAndStillInGame', {_room: RoomNumber});
        }
        socket.off("joined");
        socket.off("gameStarted");
        socket.off("gameEnded");
        socket.off("won");
        socket.off("lost");
      }
    };
  }, [RoomNumber, IsGameStarted, socket, isleavingQueueWithButton]);

  if (!changeSettings) {
    return (
      <div>
        <SettingVars
          paddleColor={settings.paddleColor}
          ballColor={settings.ballColor}
          onSettingsChange={handleSettingsChange}
        />
      </div>
    );
  } else {
    if (isConnected && IsGameStarted && !IsGameEnded) {
      return (
        <div className="flex flex-col items-center justify-center h-screen mt-12">
          <ScoreBar
            score={myScore}
            enemy_score={enemyScore}
            you="you"
            opps={oppUsername}
          />
          <div className="flex flex-col App min-h-screen w-screen h-screen justify-center items-center mb-6">
            <Canvas camera={{ position: [0.0005, 15, 0] }}>
              <OrbitControls enableRotate={false} enableZoom={true} />
              <PlayArea />
              <CallEverything
                socket={socket}
                roomId={RoomNumber}
                paddlecolor={settings.paddleColor}
                ballcolor={settings.ballColor}
                gamedata={gameData}
              />
            </Canvas>
          </div>
        </div>
      );
    } else if (isConnected && StillInGame) {
      return (
        <div className="h-screen no-scroll">
          <div className="App h-screen flex flex-col items-center justify-center">
            <h2>You are already in queue or game, go finish it first.</h2>
          </div>
        </div>
      );
    }
    else if (isConnected && IsGameStarted && IsGameEnded && !StillInGame) {
      return <EndGame result={result} socket={socket} gamedata={gameData} roomId={RoomNumber} />;
    }
    else if (isConnected && !IsGameStarted) {
      return (
        <div className="h-screen no-scroll">
          <div className="App h-screen flex flex-col items-center justify-center">
            <RotatedCircle
              socket={socket}
              roomId={RoomNumber}
              inGame={InGame}
              isGameStarted={IsGameStarted}
            />
          </div>
        </div>
      );
    }
  }
}
