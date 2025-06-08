

interface Props {
    host: boolean,
    playerReady: boolean
    playerId:string | undefined
    handleReadyFunc: (playerStatus: boolean, playerId?: string) => void
    handleGameStart: () => void
}

function GameLobbyButton({ host, playerReady,handleReadyFunc,playerId,handleGameStart }: Props) {

    if (host) {
        return (
            <button className="bg-blue-950 border border-blue-400 rounded-md text-indigo-200 px-4 py-2 hover:bg-blue-800" onClick={() => { handleGameStart() }} type="button">Start Game</button>
        )
    }

    return (
        <>
            { 
                playerReady ? 
                <button onClick={()=>{handleReadyFunc(playerReady,playerId)}} className="bg-blue-950 border border-blue-400 rounded-md text-indigo-200 px-4 py-2 hover:bg-blue-800"
                // onClick={() => { navigate('/game') }}
                type="button">Not Ready</button>
                :
                <button className = "bg-green-800 border border-gray-100 rounded-md text-white px-4 py-2" onClick={()=>{handleReadyFunc(playerReady,playerId)}} type="button" >Ready</button >
            }
        </>

    )
}

export default GameLobbyButton