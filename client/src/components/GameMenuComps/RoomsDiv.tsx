import { useNavigate } from "react-router-dom";
import { IoLockOpenOutline,IoLockClosedOutline } from "react-icons/io5";
import { useState } from "react";
import PasswordModal from "../modal/PasswordModal";

interface RoomDivProps {
    roomName: string;
    players: Map<string,object>;
    category: string;
    playerLimit:number
    gameId: string
    secure:boolean
}

function RoomsDiv({ gameId, roomName, players, playerLimit, category, secure }: RoomDivProps) {
    const [passwordModal,setPasswordModal] = useState<boolean>(false)
    const navigate = useNavigate()
    const handleGameJoin = () => {
        if (secure) {
            setPasswordModal(true)
        } else {
            navigate(`/lobby/${gameId}`)
        }
    }
  return (
      <>
          <PasswordModal isOpen={passwordModal} setModal={setPasswordModal} gameId={gameId} roomName={ roomName } navigate={navigate}  /> 
          <div className="container" onClick={handleGameJoin}>
              <div className="border my-2 rounded-md px-3 py-2 border-stone-400 hover:bg-neutral-700 text-white w-full">
                  <div className="flex justify-between">
                      <div>
                          <h6 className="font-semibold text-neutral-300 text-xl">{ roomName }</h6>
                          <p className="text-xs text-stone-500">Category : <span className="font-medium">{ category }</span></p>
                      </div>
                      <div className="flex">
                          <p className="text-sm font-light text-neutral-400 text-balance mt-2"><strong>Lobby: <span>{players.size}</span> </strong>{playerLimit}</p>
                          <p className="m-0 mt-2 ms-1 text-slate-400">{secure == true ? <IoLockClosedOutline/> : "" }</p>
                      </div>
                  </div>
              </div>
          </div>
      </>
  )
}

export default RoomsDiv