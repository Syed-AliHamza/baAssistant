'use client'

import { ChatList } from '@/components/chat-list'
import { ChatPanel } from '@/components/chat-panel'
import { EmptyScreen } from '@/components/empty-screen'
import { Message } from '@/lib/chat/actions'
import { useScrollAnchor } from '@/lib/hooks/use-scroll-anchor'
import { cn } from '@/lib/utils'
import { useAIState, useUIState } from 'ai/rsc'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import CustomCKEditor from '../components/ckEditor'

export interface ChatProps extends React.ComponentProps<'div'> {
  initialMessages?: Message[]
  id?: string
}

export function Chat({ id, className }: ChatProps) {
  const router = useRouter()
  const [input, setInput] = useState('')
  const [messages] = useUIState()
  const [aiState] = useAIState()
  useEffect(() => {
    if (id) {
      setTimeout(() => {
        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: 'smooth'
        })
      }, 1500)
    } else {
      localStorage.removeItem('lastReloadCount')
      localStorage.setItem('isResponding', 'false')
      window.dispatchEvent(new Event('respondingStatusChange'))
    }
  }, [id])

  useEffect(() => {
    const messagesLength = aiState.messages?.length
    if (messagesLength === 2) {
      router.refresh()
    }
  }, [aiState.messages, router])

  const { messagesRef, scrollRef, isAtBottom, scrollToBottom } =
    useScrollAnchor()

  const [initialData, setInitialData] = useState(
    '<p>Start typing... tehere</p>'
  )

  return (
    <div className="grid grid-cols-2 grid-rows-1 gap-4">
      <div
        className={`duration-300 ease-in-out p-0 size-full bg-white border-r bg-muted  peer-[[data-state=open]] peer-[[data-state=open]] group ${
          !messages.length ? ' bg-muted flex flex-col min-h-[85.5vh]' : ''
        }`}
        ref={scrollRef}
      >
        <div className={cn(' pt-4', className)} ref={messagesRef}>
          {messages.length ? (
            <ChatList messages={messages} isShared={false} />
          ) : (
            <EmptyScreen />
          )}
        </div>
        <ChatPanel
          id={id}
          input={input}
          setInput={setInput}
          isAtBottom={isAtBottom}
          scrollToBottom={scrollToBottom}
          isEmptyScreen={!messages?.length}
        />
      </div>
      <div>
        <CustomCKEditor
          content="text here"
          // onChange={handleEditorChange}
        />
      </div>
    </div>
  )
}
