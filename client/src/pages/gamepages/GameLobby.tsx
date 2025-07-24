import { useOutletContext, useParams } from "react-router-dom"
import UserCard from "../../components/GameMenuComps/UserCard"
import { useNavigate } from "react-router-dom"
import { useEffect, useMemo, useState } from "react"
import { Socket } from "socket.io-client"
import { ServerSocketEvnets, SocketEvents } from "../../types"
import { useDispatch, useSelector } from "react-redux"
import { GameRoomType } from '../../types'
import { RootState } from "../../store/store"
import { removeGameState, setGameState } from "../../store/slice/gameSlice"
import DeleteModal from "../../components/modal/DeleteModal"
import GameLobbyButton from "../../components/Buttons/GameLobbyButton"
import { toast } from "react-toastify"

function GameLobby() {
    const { id: lobbyId } = useParams()
    const [error, setError] = useState<string>('');
    const [game, setGame] = useState<GameRoomType | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [startTimer, setStartTimer] = useState(6);
    const userReducer = useSelector((state: RootState) => state.userReducer);
    const gameReducer = useSelector((state: RootState) => state.gameReducer);
    const dispatch = useDispatch()
    const socket = useOutletContext<Socket | null>()

    const userId = userReducer.user?.id;
    const currentUser = useMemo(() => {
        if (!game || !userId) return null;
        return game.players.get(userId)
    }, [game, userId]);

    useEffect(() => {
        if (!userReducer || !socket || !lobbyId) return;

        const handleRoomUpdate = (data: { gameState: GameRoomType }) => {
            const players = data.gameState.players;

            if (gameReducer.gameId == null) {
                dispatch(setGameState({gameId:data.gameState.gameId,playerId:userReducer.user?.id}))
            }
            setGame({
                ...data.gameState,
                players : new Map(players)
            })
            
        }

        const handleGameError = (message:string,showtoast=true,doNavigate = false) => {
            if (showtoast) {
                toast.error(message)
            } else {
                setError(message);
            }
            if (doNavigate) {
              navigate('/room')  
            }
        }

        const handleGameStart = async (result: { status: boolean, gameId: string,message:string ,gameStarted:boolean}) => {
            if (result.status) {
                if (result.gameStarted) {
                    navigate(`/game/${result.gameId}`)
                    return
                }

                toast.info("Game will start soon");
                const interval = setInterval(() => {
                    setStartTimer((prev) => {
                        if (prev <= 1) {
                            clearInterval(interval)
                        }
                        return prev - 1
                    });
                },1000)
                setTimeout(() => {
                    navigate(`/game/${result.gameId}`)
                    clearInterval(interval)
                }, 5000);
                
            } else {
                toast.warning(result.message)
            }
        }

        const handleGameClose = (message:string) => {
            toast.warning(message);
            navigate('/room');
        }

        socket?.on(ServerSocketEvnets.GAME_ROOM_UPDATE, handleRoomUpdate);
        socket?.on(ServerSocketEvnets.GAME_ROOM_ERROR, handleGameError);
        socket?.on(ServerSocketEvnets.GAME_ROOM_CLOSED, handleGameClose);
        socket?.on(ServerSocketEvnets.GAME_ROOM_STARTED, handleGameStart);

        socket?.emit(SocketEvents.JOIN_ROOM, {
            gameId: lobbyId,
            playerId: userReducer.user?.id,
            username: userReducer.user?.username
        });

        return () => {
            socket?.off(ServerSocketEvnets.GAME_ROOM_UPDATE, handleRoomUpdate);
            socket?.off(ServerSocketEvnets.GAME_ROOM_ERROR, handleGameError);
            socket.off(ServerSocketEvnets.GAME_ROOM_CLOSED, handleGameClose);
            socket?.off(ServerSocketEvnets.GAME_ROOM_STARTED, handleGameStart);
            dispatch(removeGameState());
        }
    }, [])
    
    const handleLeaveRoom = () => {
        if (userId === game?.host.user_id) {
            socket?.emit(SocketEvents.CLOSE_ROOM, { gameId: game?.gameId, playerId: userId });
        }
        socket?.emit(SocketEvents.LEAVE_ROOM, { gameId: game?.gameId, playerId: userReducer.user?.id });
        navigate('/room');
    }

    const handlePlayerReady = (playerStatus: boolean, playerId?: string) => {
        console.log(playerStatus)
        socket?.emit(SocketEvents.PLAYER_UPDATE, { gameId:game?.gameId, playerId, playerStatus: !playerStatus });
    }

    const handleGameStart = () => {
        if (userId !== game?.host.user_id) {
            return;
        }
        socket?.emit(SocketEvents.START_GAME, { gameId: game?.gameId, hostId: game?.host.user_id, status: 'start' });
    }

    const navigate = useNavigate()
  return (
      <>
          <div className="container mx-auto min-h-full">
              <div className="flex justify-center min-h-full mx-2 sm:mx-0 ">
                  <div className="md:border border-t-2 border-neutral-700 bg-neutral-900/[0.4] rounded-md w-full md:w-1/2 mt-20 py-4">
                      <DeleteModal
                          handleDelete={handleLeaveRoom}
                          isOpen={modalOpen}
                          message={`${
                              game?.host.user_id === userId
                              ? "You are the host of this room. If you leave, the room will be removed."
                              : "Are you sure you want to leave this room?"
                              }`
                          }
                          toggle={setModalOpen}
                      />
                      <div className="flex justify-between px-3 mb-3">
                          <div>
                              <h1 className="text-white">{game?.gameName?.toUpperCase()}'s {" "} Lobby</h1>
                              <p className="text-sm text-neutral-400">host: <span className="text-neutral-400">{ }</span> </p>
                              <p className="text-sm text-neutral-500"> <span className="text-neutral-400">ID:</span>{ game?.gameId } <span><i className="ms-1 text-neutral-700 fa-solid fa-copy"></i></span> </p>
                          </div>
                          <div>
                              <p className="m-0 text-neutral-500">{ `${game?.players.size}/${game?.playerLimit}` }</p>
                          </div>
                      </div>
                      <hr className="border-neutral-600" />
                      <div className="grid grid-flow-row grid-cols-2 md:grid-cols-4 gap-1 p-2">
                          {game?.players && game.players.size > 0 &&
                              [...game.players].map((player) => (                                  
                                  <UserCard key={player[0]} userReady={player[1].isReady} username={player[1].username} host={player[1].role} />
                              ))
                          }
                      </div>
                      <hr className="border-neutral-600 mt-6" />
                      <div className="flex justify-end gap-2 px-2 mt-2">
                          {startTimer <= 5 ?
                              <p className="text-slate-300">Game will start in { startTimer }</p>
                              :
                              <>
                                  <button className="bg-red-950 border border-red-500 rounded-md text-red-200 px-4 py-2 hover:bg-red-600" onClick={() => { setModalOpen(true) } } type="button">Exit</button>
                                    <GameLobbyButton
                                        host={game?.host.user_id === userId}
                                        playerReady={currentUser?.isReady ?? false}
                                        handleReadyFunc={handlePlayerReady}
                                        playerId={userId}
                                        handleGameStart={handleGameStart}
                                    />
                              </>
                          }
                          {/* <button className="bg-green-800 border border-gray-100 rounded-md text-white px-4 py-2" type="button">Ready</button> */}
                      </div>    
                          { userId == game?.host.user_id && <p className="text-red-500 text-end me-4 mt-2">{ error }</p> }
                  </div>
              </div>
          </div>
      </>
  )
}

export default GameLobby