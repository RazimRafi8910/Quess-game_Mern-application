import { GameRoomPlayerType } from '../../types'
import ChatBubble from './ChatBubble'
import PlayerCard from './PlayerCard'

type Props = {
    Players:Map<string,GameRoomPlayerType> | undefined
}

function ChatBox({ Players }: Props) {
    return (
        <>
            <div className="container mt-4">
                <div className="border bg-neutral-800/[0.4] rounded-lg p-4 border-slate-300 min-w-52">
                    <p className='text-xl text-white font-bold my-2'>{false ? "Chat" : "Players"}</p>
                    <hr />
                    {/* grid grid-cols-2 */}
                    <div className="players flex justify-center place-content-center md:gap-1">
                        {
                            Players &&
                            Array.from(Players.values()).map((item,index) => (
                                <PlayerCard key={index} playerName={item.username } status={item.status} role={item.role} completed={item.completed} />       
                            ))
                        }                    
                    </div>
                    { false && <ChatBubble/>}
                </div>
            </div>
        </>
    )
}

export default ChatBox

