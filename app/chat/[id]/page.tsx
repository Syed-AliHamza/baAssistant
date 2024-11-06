// @ts-nocheck
import { type Metadata } from 'next'

import { getChat } from '@/app/actions'
import { Chat } from '@/components/chat'
import { AI } from '@/lib/chat/actions'

export interface ChatPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({
  params
}: ChatPageProps): Promise<Metadata> {
  const chat = await getChat(Number(params.id))
  return {
    title: chat?.title.toString().slice(0, 50) ?? 'Chat'
  }
}
export const dynamic = 'force-dynamic'
export const maxDuration = 60

export default async function ChatPage({ params }: ChatPageProps) {
  const chat = await getChat(Number(params.id))

  return (
    <>
      {/* <div className="bg-muted">
        <h3>Chat AI</h3>
      </div> */}
      <AI
        initialAIState={{
          chatId: chat.id,
          messages: chat.messages,
          interactions: []
        }}
      >
        <Chat id={chat.id} initialMessages={chat?.messages} />
      </AI>
    </>
  )
}
