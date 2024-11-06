import * as React from 'react'
import { SidebarList } from '@/components/sidebar-list'
import { usePathname } from 'next/navigation'
import { NewChat } from './newChat'

export function ChatHistory() {
  const pathname = usePathname()
  const match = pathname.split('/chat/')
  const id = match ? +match[1] : null
  const [selectedChatId, setSelectedChatId] = React.useState<number>(id)
  const [isResponding, setIsResponding] = React.useState(false)
  const handleClick = e => {
    if (isResponding) {
      e.preventDefault()
    } else {
      setSelectedChatId(null)
    }
  }
  React.useEffect(() => {
    if (id && selectedChatId !== id) {
      setSelectedChatId(id)
    }
  }, [id, selectedChatId])

  React.useEffect(() => {
    const checkRespondingStatus = () => {
      const respondingStatus = localStorage.getItem('isResponding')
      setIsResponding(respondingStatus === 'true')
    }

    checkRespondingStatus()

    window.addEventListener('respondingStatusChange', checkRespondingStatus)

    return () => {
      window.removeEventListener(
        'respondingStatusChange',
        checkRespondingStatus
      )
    }
  }, [])
  return (
    <div className="flex flex-col h-full">
      <NewChat isResponding={isResponding} handleClick={handleClick} id={id} />
      <React.Suspense
        fallback={
          <div className="flex flex-col flex-1 px-4 space-y-4 overflow-auto">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="w-full h-6 rounded-lg shrink-0 animate-pulse bg-zinc-200"
              />
            ))}
          </div>
        }
      >
        <SidebarList
          selectedChatId={selectedChatId}
          setSelectedChatId={setSelectedChatId}
        />
      </React.Suspense>
    </div>
  )
}
