import { useEffect, useMemo, useState } from "react";
import { GameRoomType, QuestionType, ServerSocketEvnets, SocketEvents } from "../types";
import { Socket } from "socket.io-client";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom"; 

interface Props {
    fetchQuestion: boolean
    fetchGame: boolean
    socket: Socket
    gameId: string
}

// TODO: complete the custom hook

export function useGameSocket({ fetchQuestion = false, fetchGame = false, socket, gameId }: Props) {
    const [game, setGame] = useState<GameRoomType | null>(null);
    const [socketError, setSocketError] = useState('');
    const [currentQuestion, setCurrentQuestion] = useState();
    const [gameQuestion, setGameQuestion] = useState<QuestionType[]>();
    const userState = useSelector((state: RootState) => state.userReducer.user);
    const navigate = useNavigate();
    const currentPlayer = useMemo(() => {
        if (!game || !userState?.id) return null;
        return {
            playerId: userState.id,
            ...game.players.get(userState.id),
        }
    }, [game, userState]);

    useEffect(() => {

        const handleGameUpdate = (response:{gameState:GameRoomType}) => {
            setGame({
                ...response.gameState,
                players: new Map(response.gameState.players)
            });
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
            if (response.message) toast.error(response.message);
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
        }
    },[])

    //initial fetches
    useEffect(() => {
        if (fetchGame) {
            socket.emit(SocketEvents.GAME_STATE, { gameId }, (response: { status: boolean, gameState: GameRoomType, message: string }) => {
                setGame({
                    ...response.gameState,
                    players: new Map(response.gameState.players)
                })
            });
        }
        if (fetchQuestion) {
            socket.emit(SocketEvents.GAME_QUESTION, { gameId }, (response: { game: GameRoomType, status: boolean, error?: boolean, message: string, question: QuestionType[] }) => {
                if (response.status && response.error) {
                    setGameQuestion(response.question);
                    setGame(game)
                } else {
                    console.log("from question update", response);
                    if (response.message) setSocketError(response.message);
                }
                
            })
        }
        
    }, [fetchGame,fetchQuestion]);

    function joinRoom(playerId: string, username: string) {
        let result;
        socket.emit(SocketEvents.JOIN_ROOM, { gameId, playerId, username }, ({ status }:{status:boolean}) => {
            result = status;
        });
        return result
    }

    function quitGame() {
        socket.emit(SocketEvents.QUIT_GAME, { gameId, playerId: currentPlayer?.playerId }, (response: { status: boolean }) => {
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
        currentQuestion,
        gameQuestion,
        setGame,
        quitGame,
        setCurrentQuestion,
        joinRoom
    }
}