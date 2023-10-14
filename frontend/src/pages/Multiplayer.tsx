import { useEffect, useState, useRef, MutableRefObject } from "react";
import { Socket, io } from "socket.io-client";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, RoundedBox, Sphere } from "@react-three/drei";
import { DoubleSide } from "three";
import EndGame from "./EndGame";
import RotatingButton from "./RotatingButton";
import NavBar from "../components/Navbar";
import { NavLink } from "react-router-dom";
import ScoreBar from "../components/ScoreBar";

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

  console.log(`check gameData: ${props.gamedata}`);
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
    props.socket.emit("demand", props.room);
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

const CallEverything = (props: any) => {
  return (
    <>
      <PlayerPaddle socket={props.socket} roomId={props.roomId} paddlecolor={props.paddlecolor} gamedata={props.gameData}/>
      <OpponentPlayerPaddle socket={props.socket} paddlecolor={props.paddlecolor} />
      <DrawBall socket={props.socket} room={props.roomId} ballcolor={props.ballcolor} />
    </>
  );
};

const InGame = () => {
  return (
    <div className="background-image h-screen no-scroll">
      <NavBar />
      <div className="App background-image h-screen flex flex-col items-center justify-center">
        You are already in game, go finish it first.
      </div>
    </div>
  );
}

const leaveQueue = (props: any) => {
  if (props.socket) {
    props.socket.emit('leaveQueue', props.roomId);
  }
}

const RotatedCircle: React.FC<any> = (props) => {
  const [isInGame] = useState<boolean>(props.inGame);

  useEffect(() => {
    if (!isInGame) {
      console.log('rak ba9i la3b a tabi');
    } else {
      leaveQueue(props);
    }
  }, [isInGame]);

    return (
      <div className="h-screen flex flex-col items-center justify-center overflow-hidden">
        <RotatingButton />
        <div className="mt-4">
          <NavLink to="/home">
            <button onClick={() => leaveQueue(props)} className="bg-red-500 hover:bg-red-600 py-2 px-4 rounded-lg transition text-white">
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

  const [result, setResult] = useState<string>("");
  const [paddleColor, setPaddleColor] = useState<string>("rgb(255, 255, 255)");
  const [ballColor, setBallColor] = useState<string>("red");

  const [RoomNumber, setRoomNumber] = useState<number>(-1);
  const [token, setToken] = useState<string | null>(null);

  const [myScore, setmyScore] = useState<number>(0);
  const [enemyScore, setenemyScore] = useState<number>(0);

  const [gameData, setGameData] = useState<{}>({});

  const paddle: any = useRef();
  const ball: any = useRef();

  const tokenCookie: string | undefined = document.cookie
    .split("; ")
    .find((cookie) => cookie.startsWith("token="));

  if (tokenCookie && !token) {
    setToken(tokenCookie.split("=")[1]);
  }

  if (!socket && token) {
    setSocket(
      io("http://localhost:3000/Game", {
        extraHeaders: {
          Authorization: `Bearer ${token}`,
        },
      }),
    );
    setIsConnected(true);
  }


  useEffect(() => {
    if (socket) {
      socket.on("joined", (RoomId: number) => {
        console.log("joined event received!");
        setRoomNumber(RoomId);
      });

      socket.on("gameStarted", (data) => {
        console.log("game started :)");
        setGameData(data);
        setInGame(true);
        setIsGameStarted(true);
      });

      socket.on('InGame', () => {
        setStillInGame(true);
      })

      socket.on("gameEnded", () => {
        console.log("game ended nod tga3ad");
        setIsGameEnded(true);
        setStillInGame(false);
      });

      socket.on("won", () => {
        setResult("won");
      });

      socket.on("lost", () => {
        setResult("lost");
      });

      socket.on("Score", (data: { p1: number; p2: number }) => {
        const { p1, p2 } = data;
        setmyScore(p1);
        setenemyScore(p2);
      });
    }

    return () => {
      if (socket) {
        socket.off("joined");
        socket.off("gameStarted");
        socket.off("gameEnded");
        socket.off("won");
        socket.off("lost");
      }
    };
  }, [RoomNumber, IsGameStarted, socket]);

  if (isConnected && IsGameStarted && !IsGameEnded) {
    return (
      <div className="background-image">
        <NavBar />
        <ScoreBar
          score={myScore}
          enemy_score={enemyScore}
          you="you"
          opps="enemy"
        />
        <div>
          <label className="dark:text-white" htmlFor="paddle color">
            paddle color:
          </label>
          <label className="dark:text-blue" htmlFor="paddle color">
            paddle color:
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
        <div>
          <label className="dark:text-white" htmlFor="ball color">
            ball color
          </label>
          <label className="dark:text-blue" htmlFor="ball color">
            ball color
          </label>
          <input
            className="bg-transparent"
            name="ball color"
            ref={ball}
            type="color"
            onChange={() => {
              setBallColor(ball.current.value);
            }}
          ></input>
        </div>
        <div className="flex flex-col App min-h-screen w-screen h-screen justify-center items-center">
          <Canvas camera={{ position: [0.0005, 15, 0] }}>
            <OrbitControls enableRotate={false} enableZoom={false} />
            <PlayArea />
            <CallEverything
              socket={socket}
              roomId={RoomNumber}
              paddlecolor={paddleColor}
              ballcolor={ballColor}
            />
          </Canvas>
        </div>
      </div>
    );
  }
  else if (isConnected && StillInGame) {
    return (
      <div className="background-image h-screen no-scroll">
        <NavBar />
        <div className="App background-image h-screen flex flex-col items-center justify-center">
          You are already in game, go finish it first.
        </div>
      </div>
    );
  }
  else if (isConnected && IsGameStarted && IsGameEnded && !StillInGame) {
    return <EndGame result={result} socket={socket} gamedata={gameData} roomId={RoomNumber} />;
  }
  else if (isConnected && !IsGameStarted) {
    return (
        <div className="background-image h-screen no-scroll">
          <NavBar />
          <div className="App background-image h-screen flex flex-col items-center justify-center">
            <RotatedCircle socket={socket} roomId={RoomNumber} inGame={InGame}/>
          </div>
        </div>
      );
  }
}
