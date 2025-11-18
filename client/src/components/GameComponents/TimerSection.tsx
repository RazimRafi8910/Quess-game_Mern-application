import { useEffect, useRef, useState } from "react";
import DeleteModal from "../modal/DeleteModal";
import {Socket} from 'socket.io-client'
import { GameRoomPlayerType, GameRoomType, ServerSocketEvnets, SocketEvents } from "../../types";
import { useNavigate } from "react-router-dom";

type Props = {
    socket: Socket | null,
    game: GameRoomType | null,
    currentPlayer:GameRoomPlayerType | null
}

type QuitResponse = {
	status: boolean
	message?:string
}

function TimerSection({socket,game,currentPlayer}:Props) {
    const [timer, setTimer] = useState();
	const [modal, setModal] = useState(false);
	const navigate = useNavigate()
	const [error, setError] = useState('');
    const [opensetting, setOpenSettings] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);
	

	useEffect(() => {
		const handleSocketError = (res: { message: string, redirect: boolean }) => {
			console.log(res.message)
			if (res.message) {
				setError(res.message);
		  	}
		  	if (res.redirect) {
				navigate('/');
		  	}
		};
		socket?.on(ServerSocketEvnets.GAME_ROOM_ERROR, handleSocketError);
		return () => {
		  socket?.off(ServerSocketEvnets.GAME_ROOM_ERROR, handleSocketError);
			};
	  },[])
    
    // close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event:MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenSettings(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
    
	const handlePlayerQuit = () => {
		console.log("called")
        socket?.emit(SocketEvents.QUIT_GAME, { gameId: game?.gameId, playerId: currentPlayer?.playerId }, (response: QuitResponse) => {
			if (!response.status) {
				console.log(response.message);
			}
			console.log("done")
			navigate('/room', { replace: true, state: {} });
		})
    }

	return (
		<>
            <div className="flex justify-between mb-5 text-white">
                <DeleteModal
                    isOpen={modal}
                    toggle={setModal}
                    handleDelete={handlePlayerQuit}
                    message="If you click you will be removed from room"
                    
                />
				<div>
					<p className="mt-1 mb-1 text-gray-300">Q-2/3</p>
				</div>
				<div>
					<h1 className="text-3xl font-bold text-emerald-300 mt-1">
						12:29
					</h1>
				</div>
				<div ref={dropdownRef} className="relative">
					{/* Gear Button */}
					<button
						onClick={() => setOpenSettings((prev) => !prev)}
						className="bg-gray-600/50 px-3 py-2 rounded-lg border border-slate-400 hover:bg-gray-600 transition">
						<i className="fa-solid fa-gear text-lg"></i>
					</button>

					{/* Dropdown */}
					{opensetting && (
						<div className="absolute right-0 mt-2 w-40 bg-slate-800 border border-slate-600 rounded-xl shadow-lg overflow-hidden animate-fadeIn">
							<button
								onClick={() => alert("Settings clicked")}
								className="w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-slate-700 transition">
								Settings
                            </button>
                            <button
								onClick={handlePlayerQuit}
								className="w-full text-left px-4 py-2 text-sm text-red-300 hover:bg-red-600 hover:text-white transition">
								Quit Game
							</button>
							<button
								onClick={() => {
									setOpenSettings(false);
								}}
								className="w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-slate-700 transition">
								Close
                            </button>
                            
						</div>
					)}
				</div>
			</div>
		</>
	);
}

export default TimerSection;
