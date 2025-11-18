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
                    <p className='text-xl text-white font-bold my-2'>Chat</p>
                    <hr />
                    <div className="players md:flex grid grid-cols-2 md:gap-1">
                        {
                            Players &&
                            Array.from(Players.values()).map((item,index) => (
                                <PlayerCard key={index} playerName={item.username } role={item.role} color={ item.status ? index + 1 : 4} />       
                            ))
                        }
                        {/* <PlayerCard color={0} />
                        <PlayerCard color={2} />
                        <PlayerCard color={3} />
                        <PlayerCard color={4} /> */}
                    </div>
                    <ChatBubble/>
                </div>
            </div>
        </>
    )
}

export default ChatBox

