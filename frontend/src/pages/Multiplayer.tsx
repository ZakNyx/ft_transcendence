import { useEffect, useState, useRef, MutableRefObject } from "react";
import { Socket, io } from "socket.io-client";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, RoundedBox, Sphere } from "@react-three/drei";
import { DoubleSide } from "three";
import EndGame from "./EndGame";
import RotatingButton from './RotatingButton';
import NavBar from "../components/Navbar";
import { NavLink } from "react-router-dom";
// import { useRouter } from "next/router";

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
    const [ball, setBall] = useState([0, 0])

    useFrame(() => {
        props.socket.emit('demand', props.room)
    })

    useEffect(() => {
        //need to listen here for event to setBall coords
        props.socket.on('DrawBall', (data: { x: number, z: number, pos: number }) => {
            const { x, z, pos } = data;
            if (pos === 1)
                setBall([x, z]);
            else
                setBall([x, -z]);
        });
        return () => {
            props.socket.off('DrawBall');
        };
    }, [props.socket]);

    return (
        <>
            <Sphere args={[0.3, 10, 10]} position={[ball[0], 0, ball[1]]}>
                <meshBasicMaterial color="red" />
            </Sphere>
        </>
    )
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
            <DrawBall socket={props.socket} room={props.roomId} />
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

export default function Multiplayer() {

    const   [socket, setSocket] = useState<Socket | null>(null);

    const   [isConnected, setIsConnected] = useState<boolean>(false);
    const   [IsGameStarted, setIsGameStarted] = useState<boolean>(false);
    const   [IsGameEnded, setIsGameEnded] = useState<boolean>(false);

    const   [result, setResult] = useState<string>("");

    const   [RoomNumber, setRoomNumber] = useState<number>(-1);
    const   [token, setToken] = useState<string | null>(null);

    // const   router = useRouter();

    const tokenCookie = document.cookie.split("; ").find((cookie) => cookie.startsWith("token="));

    if (tokenCookie && !token)
        setToken(tokenCookie.split("=")[1]);

    if (!socket && token) {
        setSocket(io("http://localhost:3000/", {
            extraHeaders: {
                Authorization: token,
            },
        }));
        setIsConnected(true);
    }

    // const leaveQueue = () => {
    //     if (socket) {
    //       socket.emit('leaveQueue');
    //       socket.disconnect();
    //     }
    //   };

    useEffect(() => {
        if (socket) {
            // console.log(`check socket id : ${socket.id}`);
            // console.log(`token : ${token}`);
            socket.on('joined', (RoomId: number) => {
                console.log('joined event received!')
                setRoomNumber(RoomId);
            })

            socket.on('gameStarted', () => {
                console.log('game started :)');
                setIsGameStarted(true);
            })

            socket.on('gameEnded', () => {
                console.log('game ended nod tga3ad'); 
                setIsGameEnded(true);
            })

            socket.on('won', () => {
                console.log('you won the game!');
                setResult('won');
            })

            socket.on('lost', () => {
                console.log('you lost the game!');
                setResult('lost');
            })
        }

        return (() => {
            if (socket){
                socket.off('joined');
                socket.off('gameStarted');
                socket.off('gameEnded');
                socket.off('won');
                socket.off('lost');
                // socket.disconnect();
            }
        })
    }, [RoomNumber, IsGameStarted, socket])

    if (isConnected && IsGameStarted && !IsGameEnded) {
        return (
            <div className="background-image">
                <NavBar />
                <div className="flex flex-col App background-image min-h-screen w-screen h-screen justify-center items-center h-[65vh]">
                    <Canvas camera={{ position: [0.0005, 15, 0] }}>
                        <OrbitControls enableRotate={false} enableZoom={false} />
                        <PlayArea />
                        <CallEverything socket={socket} roomId={RoomNumber} />
                    </Canvas>
                </div>
            </div>
        );
    }
    else if (isConnected && IsGameStarted && IsGameEnded){
        return (
            <EndGame result={result}/>
        )
    }
    else if (isConnected && !IsGameStarted) {
        return (
            <div className="background-image relative min-h-screen w-screen h-screen">
                <NavBar />
                <div className="flex flex-col App background-image">
                    <RotatedCircle />
                </div>
                <NavLink to="/home">
                    <div className="absolute left-1/2 bottom-80 transform -translate-x-1/2">
                        <button className="bg-red-500/100 py-2 px-4 rounded">
                            Leave the queue
                        </button>
                    </div>
                </NavLink>
            </div>
        );
    }
}
