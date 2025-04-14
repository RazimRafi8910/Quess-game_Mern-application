import React from 'react'

function ChatBubble() {
  return (
      <div className="items-start gap-1">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <span className="text-sm font-semibold text-gray-900 dark:text-lime-500">Bonnie Green</span>
                <span className="text-sm font-normal text-gray-500 dark:text-gray-400">11:46</span>
            </div>  
        <div className="w-full max-w-[320px] leading-1.5 px-4 border-gray-200 bg-gray-100 rounded-e-xl rounded-es-xl dark:bg-gray-700">
            <p className="text-sm font-normal py-2.5 text-gray-900 dark:text-white">That's awesome. I think our users will really appreciate the improvements.</p>
        </div>
        </div>
  )
}

export default ChatBubble