import { useEffect, useState, useRef, MutableRefObject } from "react";
import { io } from "socket.io-client";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, RoundedBox, Sphere } from "@react-three/drei";
import { DoubleSide } from "three";
import EndGame from "./EndGame";
import ScoreBoard from "./ScoreBoard";

  function Plane() {
    return (
      <mesh rotation-x={Math.PI * -0.5}>
        <planeGeometry args={[15, 20]} />
        <meshBasicMaterial color="rgb(0, 0, 0)" side={DoubleSide} />
      </mesh>
    );
  }

  function Ball(props:any)
  {
    const [ball, setBall] = useState([0,5,0])

    useFrame(() => {
      props.socket.emit('updateBallPos', props.room)
    })
    
    useEffect(() => {
      props.socket.on('updateBallPos', (data: any) => {

        if(data.pos === 1)
          setBall([data.ball.x, data.ball.y, data.ball.z]);
        else
          setBall([data.ball.x, data.ball.y, -data.ball.z]);
      });
    
      return () => {
        props.socket.off('updateBallPos');
      };
    }, [props.socket]);

    return (
      <>
        <Sphere args={[0.3, 10, 10]} position={[ball[0], ball[1], ball[2]]}>
          <meshBasicMaterial color="red"/>
        </Sphere>
      </>
    )
  }

  function PlayerPaddle(props:any)
  {

    const refPlayer1 = useRef<MutableRefObject<undefined> | any>();

    useFrame(({mouse}) => {
      if (refPlayer1.current) {
        refPlayer1.current.position.x = -(((1 - mouse.x) * 15) - 15);
        
        if (refPlayer1.current.position.x < -6 || refPlayer1.current.position.x > 6)
        {
          if (refPlayer1.current.position.x < -6)
            refPlayer1.current.position.x = -6;
          if (refPlayer1.current.position.x > 6)
            refPlayer1.current.position.x = 6;
        }
      }
      props.socket.emit('playerPos', {room: props.room, position: refPlayer1.current.position.x})
    })
    return (
      <mesh>
        <RoundedBox ref={refPlayer1} args={[3, 0.5, 0.5]} radius={0.2} position={[0, 0.3, 9.3]}>
          <meshBasicMaterial color="rgb(255, 255, 255)" />
        </RoundedBox>
      </mesh>
    )
  }

  function OpponentPaddle(props:any){
    const [pos, setPos] = useState(0)

    useEffect(() => {
      props.socket.on('updateOpponentPos', (pos:number) => {
        setPos(pos)
      })
    }, [pos]) 

    return(
      <mesh>
          <RoundedBox args={[3, 0.5, 0.5]} radius={0.2} position={[pos, 0.3, -9.3]}>
            <meshBasicMaterial color="rgb(255, 255, 255)" />
          </RoundedBox>
        </mesh>
    )
  }

  function GameObjects(props:any) {
    
    return (
      <>
        <PlayerPaddle socket={props.socket} room={props.room}/>
        <OpponentPaddle socket={props.socket}/>
        <Ball socket={props.socket} room={props.room}/>
      </>
    );
  }

export default function OnlineGame(props:any) {
    
    const [socket, setSocket] = useState<any>(null);
    const [connected, setConnected] = useState<boolean>(false);
    const [start, setStarted] = useState<boolean>(false)
    const [room, setRoom] = useState<number>(NaN);
    const [scoreBoard, setScoreBoard] = useState({});
    const [opponentData, setOpponentData] = useState({});
    const [stop, setStop] = useState(false);
    const [result, setResult] = useState("");

    if(socket === null)
    {
      console.log('connection')
      setSocket(io("http://localhost:3000/", {auth: {token: props.userId}}));
      setConnected(true)
    }

    useEffect(() => {
      
      if(socket)
      {
        socket.on('disconnect', (room:number) => {
          setConnected(false);
          setStarted(false)
        })
        
        socket.on('connection', (room:number) => {
          setConnected(true);
        })

        socket.on('joinedRoom', (room:number) => {
          setRoom(room);
        })

        socket.on('start', () => {
          setStarted(true);
        })

        socket.on('opponentData', (data:any) => {
          setOpponentData(data);
        })

        if (stop) {
          socket.emit('addMatchHistory', room);
        }

        socket.on('scoreBoard', (data:Object) => {
          setScoreBoard(data)
        })

        socket.on('won', () => {
          setResult("won")
        })
      
        socket.on('lost', () => {
          setResult("lost")
        })

        socket.on('stop', () => {
          setStop(true);
        })
      }

      return(() => {
        if (socket) {
          socket.off('connect');
          socket.off('disconnect');
          socket.off('joinedRoom');
          socket.off('start');
          socket.off('stop');
          socket.off('won');
          socket.off('lost');
        }
      })
    }, [room, start, stop])

    if (start && connected && !stop) {
        return (
          <div className="flex flex-col w-full">
            <ScoreBoard scoreBoard={scoreBoard} opponentData={opponentData}/>
            <Canvas camera={{position: [0.0005, 15, 0]}}>
                <OrbitControls enableRotate={false}/>
                <Plane/>
                <GameObjects socket={socket} room={room}/>
            </Canvas>
          </div>
        );
    }
    else if(start && connected && stop)
    {
      return(
        <EndGame result={result}/>
      )
    }
    else if(!start && connected)
    {
        return(
          <div role="status" className="m-auto">
            <svg aria-hidden="true" className="inline w-10 h-10 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
            </svg>
            <span className="dark:text-white">In Queue</span>
          </div>
        )
    }
    else {
      return(
        <div role="status" className="m-auto">
          <span className="dark:text-white">Disconnected</span>
        </div>
      )
    }
}
