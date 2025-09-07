import { useEffect, useRef, useState } from "react";
import RoomsDiv from "../../components/GameMenuComps/RoomsDiv";
import CreateGameModal from "../../components/modal/CreateGameModal";
import useFetch from "../../Hooks/useFetch";
import { GameRoomType, ServerSocketEvnets } from "../../types";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/Loader";
import { useOutletContext } from "react-router-dom";
import { Socket } from "socket.io-client";
import { toast } from "react-toastify";

function RoomsPage() {
  const searchRef = useRef<HTMLInputElement>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [totalPlayers, setTotalPlayers] = useState(0);
  const { error, data, loading } = useFetch<[GameRoomType]>('/game/rooms');
  const [currentLobby, setCurrentLobby] = useState<GameRoomType[] | null>(null);
  const socket = useOutletContext<Socket | null>()
  const navigate = useNavigate()

  useEffect(() => {
    if (data !== null) {
      setCurrentLobby(data);
    }
  }, [data]);

  useEffect(() => {

    const handleCurrentLobby = (data: any) => {
      console.log("emited",data.players);
      setTotalPlayers(data.players);
    }

    const handleGameCreated = (data: any) => {
      console.log("game emit", data);
      setCurrentLobby(data.data)
    }

    const handleSocketError = (error: string) => {
      console.log(error)
      toast.error(error || "Something went wrong")
      navigate('/room')
    }
    
    socket?.on(ServerSocketEvnets.LOBBY_PLAYER_UPDATE, handleCurrentLobby);
    socket?.on(ServerSocketEvnets.SOCKET_ERROR, handleSocketError)
    socket?.on(ServerSocketEvnets.LOBBY_ROOM_UPDATE,handleGameCreated)

    return () => {
      socket?.off(ServerSocketEvnets.LOBBY_PLAYER_UPDATE, handleCurrentLobby);
      socket?.off(ServerSocketEvnets.LOBBY_ROOM_UPDATE, handleGameCreated);
      socket?.off(ServerSocketEvnets.LOBBY_PLAYER_UPDATE, handleCurrentLobby);
    }

  },[socket])

  const handleSearch = () => {
    if (searchRef?.current?.value == '') {
      searchRef.current.focus();
    } 
  };

  if (!socket || !socket.connected) {
    return (
      <>
        <Loader />
      </>
    )
  }

  return (
    <>
      <div className="container mx-auto">
        <CreateGameModal isOpen={modalOpen} setModal={setModalOpen} />
        <div className="flex justify-center h-full">
          <div className="md:border border-t-2 border-neutral-700 bg-neutral-900/[0.4] rounded-md w-full md:w-1/2 mt-20 py-4">
            <p className="text-gray-300 me-4 text-opacity-50 my-0 text-end">online: { totalPlayers }</p>
            <div className="flex mb-3 mt-1 w-full gap-2 px-6">
              <div className="md:w-1/2 w-full">
                <input
                  type="text"
                  id="helper-text"
                  ref={searchRef}
                  aria-describedby="helper-text-explanation"
                  className="bg-gray-50 border w-full border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-500/[0.2] dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Enter the Room id"
                />
              </div>

              <div className="flex gap-2 md:justify-between w-1/2">
                <button
                  type="button"
                  onClick={handleSearch}
                  className="px-4 md:px-5 h-full rounded-md bg-gray-800 text-slate-400 border border-slate-400 hover:bg-slate-500 hover:text-slate-300 focus:bg-slate-700 focus:ring-slate-400 focus:ring-2"
                >
                  Search
                </button>
                {/* <button className="px-5 bg-slate-700 h-full rounded-md border border-white text-white">Filter</button> */}
                <button
                  type="button"
                  onClick={()=>{setModalOpen(true)}}
                  className="px-4 md:px-6 py-2 rounded-md hover:bg-green-800 bg-green-950 text-lime-200 border border-lime-400"
                >
                  Create
                </button>
              </div>
            </div>
            <hr className="border-neutral-600" />
            {loading && <Loader />}
            <p className="text-red-500">{ error }</p>
            <div className="flex-row px-6 py-2">
              {loading == false && currentLobby && currentLobby.length > 0 ? 
                currentLobby.map((room) => (
                  <RoomsDiv
                    key={room.gameId}
                    gameId={room.gameId}
                    roomName={room.gameName}
                    players={room.players}
                    playerLimit={room.playerLimit}
                    category={room.category}
                    secure={ room.secure }
                  />
                ))
                :
                <p className="text-neutral-300 text-center">No rooms found</p>
               }
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default RoomsPage;
