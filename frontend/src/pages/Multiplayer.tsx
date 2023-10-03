import { useEffect, useState, useRef, MutableRefObject } from "react";
import { Socket, io } from "socket.io-client";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, RoundedBox, Sphere } from "@react-three/drei";
import { DoubleSide } from "three";
import EndGame from "./EndGame";
import RotatingButton from './RotatingButton';
import NavBar from "../components/Navbar";

const  PlayArea = () => {
    return (
      <mesh rotation-x={Math.PI * -0.5}>
        <planeGeometry args={[15, 20]} />
        <meshBasicMaterial color="rgb(0, 0, 0)" side={DoubleSide} />
      </mesh>
    );
  }

const   PlayerPaddle = (props: any) => {
    const   refPlayer = useRef<MutableRefObject<undefined> | any>();

    useFrame(({mouse}) => {
        if (refPlayer.current) {
            refPlayer.current.position.x = (((1 - mouse.y) * 15) - 15);
            if (refPlayer.current.position.x < -6 || refPlayer.current.position.x > 6) {
                if (refPlayer.current.position.x < -6)
                    refPlayer.current.position.x = -6;
                if (refPlayer.current.position.x > 6)
                    refPlayer.current.position.x = 6;
            }
            props.socket.emit('PaddleMovement', {x: refPlayer.current.position.x, room: props.roomId});
        }
    })
    return (
        <mesh>
            <RoundedBox ref={refPlayer} args={[3, 0.5, 0.5]} radius={0.2} position={[0, 0.3, 9.3]} >
                <meshBasicMaterial color="rgb(255, 255, 255)" />
            </RoundedBox>
        </mesh>
    )
}

const   DrawBall = (props: any) => {
    const   [ball, setBall] = useState<number[]>([0, 5, 0]);
    
}

const   OpponentPlayerPaddle = (props: any) => {
    const   [position, setPosition] = useState<number>(0);

    useEffect(() => {
        props.socket.on('OppenentPaddlePosition', (position: number) => {
            setPosition(position);
        })
    },[position]);

    return (
        <mesh>
            <RoundedBox args={[3, 0.5, 0.5]} radius={0.2} position={[position, 0.3, -9.3]}>
                <meshBasicMaterial color="rgb(255, 255, 255)" />
            </RoundedBox>
        </mesh>
    )
}

const   CallEverything = (props: any) => {
    return (
        <>
            <PlayerPaddle socket={props.socket} roomId={props.roomId} />
            <OpponentPlayerPaddle socket={props.socket} />
            {/*I need to add ball Object here*/}
        </>
    );
}

const RotatedCircle: React.FC = () => {
    return (
        <div className="h-screen flex items-center justify-center">
          <RotatingButton />
        </div>
      );
  };

export default function Multiplayer(props: any) {
    const   [socket, setSocket] = useState<Socket | null>(null);
    const   [isConnected, setIsConnected] = useState<boolean>(false);
    const   [IsGameStarted, setIsGameStarted] = useState<boolean>(false);
    const   [IsGameEnded, setIsGameEnded] = useState<boolean>(false);

    const   [RoomNumber, setRoomNumber] = useState<number>(-1);

    if (!socket) {
        setSocket(io("http://localhost:3000/", {auth: {token: props.userId}}));
        setIsConnected(true);
    }

    useEffect(() => {
        if (socket) {
            socket.on('joined', (RoomId: number) => {
                console.log('joined event received!')
                setRoomNumber(RoomId);
            })

            socket.on('gameStarted', () => {
                setIsGameStarted(true);
            })

            socket.on('gameEnded', () => {
                setIsGameEnded(true);
            })
        }
        return (() => {
            if (socket){
                socket.off('joined');
                socket.off('gameStarted');
                socket.off('gameEnded');
            }
        })
    }, [RoomNumber, IsGameStarted])

    if (isConnected && IsGameStarted && !IsGameEnded) {
        return (
            <div className="flex flex-col App background-image min-h-screen w-screen h-screen">
                <NavBar />
                <Canvas camera={{position: [0.0005, 15, 0]}}>
                    <OrbitControls enableRotate={false} enableZoom={false} />
                    <PlayArea />
                    <CallEverything socket={socket} roomId={RoomNumber} />
                </Canvas>
            </div>
        );
    }
    else if (isConnected && IsGameStarted && IsGameEnded){
        return (
            <EndGame result={""} />
        )
    }
    else {
        return (
            <div className="flex flex-col App background-image min-h-screen w-screen h-screen">
                <NavBar />
                <RotatedCircle />
            </div>
        );
    }
}