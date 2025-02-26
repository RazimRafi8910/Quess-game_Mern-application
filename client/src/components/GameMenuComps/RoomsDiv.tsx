import { useNavigate } from "react-router-dom";

interface RoomDivProps {
    roomName: string;
    players: number;
    category: string;
}


function RoomsDiv({ roomName, players, category }: RoomDivProps) {
    const navigate = useNavigate()
  return (
      <>
          <div className="container" onClick={()=>{navigate(`/lobby/${roomName}`)}}>
              <div className="border my-2 rounded-md px-3 py-2 border-stone-400 hover:bg-neutral-700 text-white w-full">
                  <div className="flex justify-between">
                      <div>
                          <h6 className="font-semibold text-neutral-300">{ roomName }</h6>
                          <p className="text-sm text-stone-500">Category : <span className="font-medium">{ category }</span></p>
                      </div>
                      <p className="text-sm font-light text-neutral-400 text-balance mt-2"><strong>Lobby: <span></span> </strong>4/{ players }</p>
                  </div>
              </div>
          </div>
      </>
  )
}

export default RoomsDiv