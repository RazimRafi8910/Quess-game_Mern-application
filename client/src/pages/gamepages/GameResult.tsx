import { useEffect, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { Socket } from "socket.io-client";
import { useGameSocket } from "../../Hooks/useGameSocket";
import { GameRoomPlayerType, GameRoomType, SocketEvents } from "../../types";
import ConfirmationModal from "../../components/modal/ConfirmationModal";

export default function GameResult() {
  const { id: gameId } = useParams();
  const socket = useOutletContext<Socket | null>();
  const { game, currentPlayer, updateGameState } = useGameSocket({ gameId, socket });
  const [playerList, setPlayerList] = useState<[string, GameRoomPlayerType][] | null>(null);
  const [gameStatus, setGameStatus] = useState<string>("Started");
  const [isExitModalOpen, setIsExitModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    socket?.emit(SocketEvents.FINISH_GAME, { gameId }, (res: { status: boolean, isFinished: boolean, gameState: GameRoomType }) => {
      if (res.status) {
        console.log(res)
        updateGameState(res.gameState);
      }
    })
  }, []);

  useEffect(() => {
    if (!game) {
      console.log("game not found");
      return;
    }
    setGameStatus(game.state);
    const players = [...game.players].sort((a, b) => {
      const scoreA = a[1].gameResult?.score ?? -Infinity;
      const scoreB = b[1].gameResult?.score ?? - Infinity;

      return scoreB - scoreA
    });
    setPlayerList(players);
  }, [game]);

  const handleExit = () => {
    setIsExitModalOpen(true);
  };


  const confirmExit = () => {
    setIsExitModalOpen(false);
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
            <p className="text-slate-200">Game status : {gameStatus == 'Running' || gameStatus == 'Started' ?
              <span className="text-red-200">running</span>
              :
              <span className="text-green-200">finished</span>
            }</p>
          </div>

          <div className="space-y-3 mb-8">
            {playerList?.map(([_, player], rank) => (
              <div
                key={player.username}
                className={`flex items-center justify-between p-4 rounded-xl transition-all ${player.username == currentPlayer?.username
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

      <ConfirmationModal
        isOpen={isExitModalOpen}
        onClose={() => setIsExitModalOpen(false)}
        onConfirm={confirmExit}
        title="Exit Game Results"
        message="Are you sure you want to leave the results screen? You will be returned to the room lobby."
        confirmText="Yes, Exit"
        cancelText="Cancel"
      />
    </div>
  );
}