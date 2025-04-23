import { useOutletContext, useParams } from "react-router-dom"
import UserCard from "../../components/GameMenuComps/UserCard"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { Socket } from "socket.io-client"
import { ServerSocketEvnets, SocketEvents } from "../../types"
import { useDispatch, useSelector } from "react-redux"
import { GameRoomType } from '../../types'
import { RootState } from "../../store/store"
import { removeGameState, setGameState } from "../../store/slice/gameSlice"
import DeleteModal from "../../components/modal/DeleteModal"

function GameLobby() {
    const { id: lobbyId } = useParams()
    const [game, setGame] = useState<GameRoomType | null>(null)
    const [modalOpen, setModalOpen] = useState(false);
    const userReducer = useSelector((state: RootState) => state.userReducer);
    const gameReducer = useSelector((state: RootState) => state.gameReducer);
    const dispatch = useDispatch()
    const socket = useOutletContext<Socket | null>()

    useEffect(() => {

        const handleRoomUpdate = (data: any) => {
            if (gameReducer.gameId == null) {
                dispatch(setGameState({gameId:data.gameState.gameId,playerId:userReducer.user?.id}))
            }
            setGame(data.gameState)
        }

        socket?.on(ServerSocketEvnets.GAME_ROOM_UPDATE, handleRoomUpdate);

        socket?.emit(SocketEvents.JOIN_ROOM, {
            gameId: lobbyId,
            playerId: userReducer.user?.id,
            username: userReducer.user?.username
        });

        return () => {
            socket?.off(ServerSocketEvnets.GAME_ROOM_UPDATE, handleRoomUpdate);
            dispatch(removeGameState());
        }
    }, [])
    
    const handleLeaveRoom = () => {
        socket?.emit(SocketEvents.LEAVE_ROOM, { gameId:game?.gameId, playerId: userReducer.user?.id });
        navigate('/room');
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
                          message={`${game?.host.user_id == userReducer.user?.id ? "you are the host of this room if you leave, this room will removed" : "are sure you want to leave this room" }`}
                          toggle={setModalOpen}
                      />
                      <div className="flex justify-between px-3 mb-3">
                          <div>
                              <h1 className="text-white">{game?.gameName?.toUpperCase()}'s {" "} Lobby</h1>
                              <p className="text-sm text-neutral-400">host: <span className="text-neutral-400">{ }</span> </p>
                              <p className="text-sm text-neutral-500"> <span className="text-neutral-400">ID:</span>{ game?.gameId } <span><i className="ms-1 text-neutral-700 fa-solid fa-copy"></i></span> </p>
                          </div>
                          <div>
                              <p className="m-0 text-neutral-500">{ `${game?.players.length}/${game?.playerLimit}` }</p>
                          </div>
                      </div>
                      <hr className="border-neutral-600" />
                      <div className="grid grid-flow-row grid-cols-2 md:grid-cols-4 gap-1 p-2">
                          {game?.players && game.players.length > 0 &&
                              game.players.map((player) => (                                  
                                  <UserCard key={player[0]} userReady={player[1].isReady} username={player[1].username} host={player[1].role} />
                              ))
                          }
                      </div>
                      <hr className="border-neutral-600 mt-6" />
                      <div className="flex justify-end gap-2 px-2 mt-2">
                          <button className="bg-red-950 border border-red-500 rounded-md text-red-200 px-4 py-2 hover:bg-red-600" onClick={() => { setModalOpen(true) } } type="button">Exit</button>
                          <button className="bg-blue-950 border border-blue-400 rounded-md text-indigo-200 px-4 py-2 hover:bg-blue-800" onClick={()=>{navigate('/game')}} type="button">Start Game</button>
                          {/* <button className="bg-green-800 border border-gray-100 rounded-md text-white px-4 py-2" type="button">Ready</button> */}
                      </div>
                  </div>
              </div>
          </div>
      </>
  )
}

export default GameLobby