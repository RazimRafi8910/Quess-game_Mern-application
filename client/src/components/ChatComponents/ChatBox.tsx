import ChatBubble from './ChatBubble'
import PlayerCard from './PlayerCard'

function ChatBox() {
    return (
        <>
            <div className="container mt-4">
                <div className="border bg-neutral-800/[0.4] rounded-lg p-4 border-slate-300 min-w-52">
                    <p className='text-xl text-white font-bold my-2'>Chat</p>
                    <hr />
                    <div className="players md:flex grid grid-cols-2 md:gap-1">
                        <PlayerCard color={1} />
                        <PlayerCard color={0} />
                        <PlayerCard color={2} />
                        <PlayerCard color={3} />
                        <PlayerCard color={4} />
                    </div>
                    <ChatBubble/>
                </div>
            </div>
        </>
    )
}

export default ChatBox

