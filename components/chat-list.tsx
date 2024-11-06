import { UIState } from '@/lib/chat/actions'
import { ExclamationTriangleIcon } from '@radix-ui/react-icons'
import Link from 'next/link'

export interface ChatList {
  messages: UIState
  isShared: boolean
}

export function ChatList({ messages, isShared }: ChatList) {
  return messages.length ? (
    <div className="relative mx-auto max-w-2xl grid auto-rows-max gap-8 px-4 min-h-[71vh] transition-height ">
      {messages.map(message => (
        <div key={message.id}>
          {message.spinner}
          {message.display}
          {message.attachments}
        </div>
      ))}
    </div>
  ) : null
}
