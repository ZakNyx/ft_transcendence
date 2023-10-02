import { useEffect, useState, useRef, MutableRefObject } from "react";
import { Socket, io } from "socket.io-client";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, RoundedBox, Sphere } from "@react-three/drei";
import { DoubleSide } from "three";
import EndGame from "./EndGame";
import ScoreBoard from "./ScoreBoard";

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
            }
        })
    }, [RoomNumber, IsGameStarted])

    if (isConnected && IsGameStarted && IsGameEnded){
        return (
            <EndGame result={""} />
        )
    }
}