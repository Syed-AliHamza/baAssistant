import React from 'react'
import Link from 'next/link'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'

const ChatIcon = () => {
  return (
    <div className="fixed bottom-8 right-8 z-50">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link href="/chat" className="block relative">
              <div className="absolute inset-0 rounded-full bg-blue-600/100 animate-ping" />
              <div className="absolute inset-0 rounded-full bg-blue-500/80 animate-pulse" />
              <img
                src="/images/chatNova.svg"
                alt="Chat Icon"
                className="relative rounded-full w-16 h-16 shadow-lg transition-transform hover:scale-110 bg-white"
              />
            </Link>
          </TooltipTrigger>
          <TooltipContent className="bg-slate-900 text-white px-3 py-1.5 rounded shadow-lg">
            <p>Chat with Nova</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}

export default ChatIcon
