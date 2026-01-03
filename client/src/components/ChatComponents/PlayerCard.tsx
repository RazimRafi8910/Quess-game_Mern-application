import { useEffect, useState } from "react";

const statusConfig = {
    online: { color: 'bg-green-500', text: "online" },
    offline: { color: 'bg-gray-400', text: "offline" },
    completed: { color: 'bg-blue-500', text: "completed" },
}

type Prop = {
    playerName: string,
    role: string,
    status: boolean,
    completed:boolean
}

function PlayerCard({ playerName, role, status, completed }: Prop) {
    const [playerState, setPlayerState] = useState(statusConfig.online);
    useEffect(() => {
        if (completed) {
            setPlayerState(statusConfig.completed);
        } else if (!status) {
            setPlayerState(statusConfig.offline);
        }
    }, [status, completed]);
    console.log(completed)
    return (
        <>
             <button className="w-full m-1 bg-slate-800 hover:bg-slate-700 transition-colors rounded-md px-3 py-2 flex items-center gap-2 shadow-md border border-slate-700 hover:border-slate-600">
      {/* Status Indicator */}
      <div className={`w-1.5 h-1.5 rounded-full ${playerState.color} animate-pulse`} />
      
      {/* Player Info */}
      <div className="flex-1 text-left">
        <div className="flex items-center gap-2">
              <h3 className={`${ status ? "text-white" : "text-slate-400"  } font-medium text-sm sm:text-xl truncate`}>{playerName}</h3>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-0.5">
          <span className="bg-slate-700 px-1.5 py-0.5 rounded">{role}</span>
        </div>
      </div>

      {/* Status Badge */}
      <div className={`${playerState.color} bg-opacity-20 ${ status ? "text-white" : "text-slate-400"  } px-1.5 py-0.5 rounded text-[10px] flex items-center gap-1`}>
        <span className=" sm:inline">{playerState.text}</span>
      </div>
    </button>
        </>
    )
}

export default PlayerCard