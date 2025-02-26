import { useParams } from "react-router-dom"
import UserCard from "../../components/GameMenuComps/UserCard"
import { useNavigate } from "react-router-dom"

function GameLobby() {
    const { id: lobbyId } = useParams()
    const navigate = useNavigate()
  return (
      <>
          <div className="container mx-auto min-h-full">
              <div className="flex justify-center min-h-full mx-2 sm:mx-0 ">
                  <div className="md:border border-t-2 border-neutral-700 bg-neutral-900/[0.4] rounded-md w-full md:w-1/2 mt-20 py-4">
                      <div className="flex justify-between px-3 mb-3">
                          <div>
                              <h1 className="text-white">{lobbyId?.toUpperCase()}'s {" "} Lobby <span className="text-neutral-600">(i)</span></h1>
                              <p className="text-sm text-neutral-500"> <span className="text-neutral-400">Link:</span> testing.com/game_id</p>
                          </div>
                          <div>
                              <p className="m-0 text-neutral-500">3/6</p>
                          </div>
                      </div>
                      <hr className="border-neutral-600" />
                      <div className="grid grid-flow-row grid-cols-2 md:grid-cols-4 gap-1 p-2">
                          <UserCard userReady={false } username="Razim" rank={2030} />
                          <UserCard userReady={false } />
                          <UserCard userReady={true } />
                      </div>
                      <hr className="border-neutral-600 mt-6" />
                      <div className="flex justify-end gap-2 px-2 mt-2">
                          <button className="bg-red-950 border border-red-500 rounded-md text-red-200 px-4 py-2 hover:bg-red-600" onClick={()=>{navigate('/room')}} type="button">Exit</button>
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