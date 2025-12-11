import { useEffect, useMemo, useState } from "react";
import { GameRoomType, GameStateType, ServerSocketEvnets, SocketEvents } from "../types";
import { Socket } from "socket.io-client";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom"; 

interface Props {
    socket: Socket | null
    gameId: string | undefined
}

// TODO: complete the custom hook
// TODO: REMOVE FETCH GAMESTATE AND GET QUESTION FROM THIS HOOK TO GAME PAGE (THOSE ARE NOT \WORING)

export function useGameSocket({ socket, gameId }: Props) {
    const [game, setGame] = useState<GameRoomType | null>();
    const [localgameState, setLocalGameState] = useState<GameStateType>(GameStateType.LOBBY);
    const [socketError, setSocketError] = useState('');
    const [gameState, setGameState] = useState<GameStateType>(GameStateType.RUNNING);
    const [currentQuestion, setCurrentQuestion] = useState();
    const userState = useSelector((state: RootState) => state.userReducer.user);
    const navigate = useNavigate();
    const currentPlayer = useMemo(() => {
        if (!game || !userState?.id) return null;
        return {
            playerId: userState.id,
            ...game.players.get(userState.id),
        }
    }, [game, userState]);


    function updateGameState(gameState:GameRoomType) {
        setGame({
            ...gameState,
            players: new Map(gameState.players)
        });
        return true
    }

    useEffect(() => {

        const handleGameUpdate = (response: { gameState: GameRoomType }) => {
            updateGameState(response.gameState)
        }

        const handleSocketError = (response: { status: boolean, message: string, redirect:boolean }) => {
            if (response.message) {
                setSocketError(response.message);
                toast.error(response.message)
            }
            if (response.redirect) {
                navigate('/');
            }
        }

        const handleGameError = (response: { message: string, redirect: boolean }) => {
            if (response.message) setSocketError(response.message);
            if (response.redirect) {
                navigate('/')
            }
        }

        socket?.on(ServerSocketEvnets.GAME_ROOM_UPDATE, handleGameUpdate);
        socket?.on(ServerSocketEvnets.SOCKET_ERROR, handleSocketError);
        socket?.on(ServerSocketEvnets.GAME_ROOM_ERROR, handleGameError);

        return () => {
            socket?.off(ServerSocketEvnets.GAME_ROOM_UPDATE, handleGameUpdate);
            socket?.off(ServerSocketEvnets.SOCKET_ERROR, handleSocketError);
            socket?.off(ServerSocketEvnets.GAME_ROOM_ERROR, handleGameError);
        }
    },[socket])
    

    function joinRoom(playerId: string, username: string) {
        let result;
        socket?.emit(SocketEvents.JOIN_ROOM, { gameId, playerId, username }, ({ status }:{status:boolean}) => {
            result = status;
        });
        return result
    }

    function quitGame() {
        socket?.emit(SocketEvents.QUIT_GAME, { gameId, playerId: currentPlayer?.playerId }, (response: { status: boolean }) => {
            if (!response.status) {
                toast.error("Failed to Quit the game");
                console.log("failed to quit", response)
            }
            navigate('/room');
        })
    }

    return {
        game,
        socketError,
        currentPlayer,
        gameState,
        setGameState,
        currentQuestion,
        updateGameState,
        quitGame,
        setCurrentQuestion,
        joinRoom,
        localgameState,
        setLocalGameState,
    }
}