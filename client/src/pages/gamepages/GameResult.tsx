import { useEffect, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { Socket } from "socket.io-client";
import { useGameSocket } from "../../Hooks/useGameSocket";
import { GameRoomPlayerType } from "../../types";

export default function GameResult() {
  const { id: gameId } = useParams();
  const socket = useOutletContext<Socket | null>();
  const { game, currentPlayer } = useGameSocket({ gameId, socket });
  const [playerList, setPlayerList] = useState<[string, GameRoomPlayerType][] | null>(null);
  const [gamestate, setGameState] = useState<string>("Started");
  const navigate = useNavigate();

  useEffect(() => {
    if (game) {
      setGameState(game.state);
      const players = [...game.players].sort((a, b) => {
        const scoreA = a[1].gameResult?.score ?? -Infinity;
        const scoreB = b[1].gameResult?.score ?? - Infinity;

        return scoreB - scoreA
      });
      
      setPlayerList(players);
    }
  }, [game]);

  // const players = [
  //   { username: "DragonSlayer99", score: null, rank: 1, isCurrentPlayer: false },
  //   { username: "ShadowNinja", score: 2640, rank: 2, isCurrentPlayer: false },
  //   { username: "Aswanth", score: 0, rank: 3, isCurrentPlayer: true },
  //   { username: "ThunderStrike", score: 2420, rank: 4, isCurrentPlayer: false },
  //   { username: "MysticWarrior", score: 2310, rank: 5, isCurrentPlayer: false },
  //   { username: "CyberSamurai", score: 2180, rank: 6, isCurrentPlayer: false },
  // ];

  /**
   * TODO:make answer null on client side (ckeck where is sending the question with answer)
   */   

  const handleExit = () => {
    alert('Exiting game results...');
    navigate('/room');
    
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="bg-slate/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
          <h1 className="text-3xl font-bold text-white text-center mb-">
            Game Result
          </h1>
          <div className="text-center mb-4">
            <p className="text-slate-200">Game status : {gamestate == 'Running' || gamestate == 'Started' ?
              <span className="text-red-200">running</span>
              :
              <span className="text-green-200">finished</span>
            }</p>
          </div>

          <div className="space-y-3 mb-8">
            {playerList?.map(([_, player],rank) => (
              <div
                key={player.username}
                className={`flex items-center justify-between p-4 rounded-xl transition-all ${
                  player.username == currentPlayer?.username
                    ? 'bg-gradient-to-r from-cyan-500/30 to-blue-500/30 border-2 border-cyan-400 shadow-lg shadow-cyan-500/50'
                    : 'bg-white/5 hover:bg-white/10 border border-white/10'
                }`}
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-white font-semibold text-lg">
                        {player.username}
                      </span>
                      {player.username == currentPlayer?.username && (
                        <span className="px-2 py-1 bg-cyan-500 text-white text-xs font-bold rounded-full">
                          YOU
                        </span>
                      )}
                    </div>
                    <span className="text-gray-300 text-sm">
                      Rank {(rank + 1)}
                    </span>
                  </div>
                </div>

                {player.gameResult == null ?  
                  <div className="text-right">
                  <div className="">
                    <p className="text-red-300 text-xl font-bold">playing.....</p>
                  </div> 
                </div>
                :
                  <div className="text-right">
                  <div className="text-2xl font-bold text-white">
                      {player.gameResult.score.toLocaleString()}
                  </div>
                  <div className="text-gray-400 text-sm">points</div>
                </div>
                 }
                
              </div>
            ))}
          </div>

          <button
            onClick={handleExit}
            className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-xl"
          >
            Exit Results
          </button>
        </div>
      </div>
    </div>
  );
}