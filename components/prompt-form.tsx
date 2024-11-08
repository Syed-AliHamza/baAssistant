'use client'

import * as React from 'react'
import Textarea from 'react-textarea-autosize'
import { useActions, useUIState } from 'ai/rsc'
import { UserMessage } from './stocks/message'
import { type AI } from '@/lib/chat/actions'
import { Button } from '@/components/ui/button'
import { IconArrowElbow } from '@/components/ui/icons'
import { HiOutlineExclamationTriangle } from 'react-icons/hi2'
import { useEnterSubmit } from '@/lib/hooks/use-enter-submit'
import { nanoid } from 'nanoid'
import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'
import { AGENTS } from '@/lib/utils/constants'

export const DISPLAY_AGENTS = {
  PANDA: 'Panda',
  RESEARCH_STUDIES: 'Research Studies'
}

export function PromptForm({
  input,
  setInput,
  id
}: {
  input: string
  setInput: () => void
  chatType: any
  id: any
}) {
  const inputRef = React.useRef<HTMLTextAreaElement>(null)
  const { submitUserMessage, describeImage } = useActions()
  const [, setMessages] = useUIState<typeof AI>()
  const [isPopupVisible, setIsPopupVisible] = React.useState(false)
  const [filteredAgents, setFilteredAgents] = React.useState<string[]>([])
  const [selectedAgent, setSelectedAgent] = React.useState<number>(-1)
  const [Agent, setAgent] = React.useState<string>(AGENTS.AI_INTERN)
  const [hasSelectedAgent, setHasSelectedAgent] = React.useState(false)
  const { formRef } = useEnterSubmit(isPopupVisible)
  const [showError, setShowError] = React.useState(false)

  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    const selectionStart = e.target.selectionStart
    setInput(value)

    if (!value) {
      setIsPopupVisible(false)
      setHasSelectedAgent(false)
      setShowError(false)
      return
    }

    const hasCompleteMention = (text: string, agent: string) => {
      const escapedAgent = agent.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      const pattern = new RegExp(`@${escapedAgent}(?:\\s|$)`)
      return pattern.test(text)
    }

    const completedMentions = Object.values(DISPLAY_AGENTS).reduce(
      (count, agent) => {
        return count + (hasCompleteMention(value, agent) ? 1 : 0)
      },
      0
    )

    if (value[selectionStart - 1] === '@') {
      if (completedMentions > 0 && hasSelectedAgent) {
        setIsPopupVisible(false)
        setShowError(true)
        return
      }

      setIsPopupVisible(true)
      setFilteredAgents(Object.values(DISPLAY_AGENTS))
      setShowError(false)
      return
    }

    const textBeforeCursor = value.slice(0, selectionStart)
    const lastAtIndex = textBeforeCursor.lastIndexOf('@')

    const atSymbolCount = (value.match(/@/g) || []).length

    if (atSymbolCount <= 1 || !hasSelectedAgent) {
      setShowError(false)
    }

    if (lastAtIndex === -1) {
      setIsPopupVisible(false)
      setShowError(false)
      return
    }

    const textAfterAt = value.slice(lastAtIndex + 1)

    const isCompletedSelection = Object.values(DISPLAY_AGENTS).some(agent => {
      return hasCompleteMention(value.slice(lastAtIndex), agent)
    })

    const searchText = textAfterAt.split(' ').join(' ')
    const matchingAgents = Object.values(DISPLAY_AGENTS).filter(agent =>
      agent.toLowerCase().includes(searchText.trim().toLowerCase())
    )

    const isCursorInMention = (() => {
      if (lastAtIndex === -1) return false

      const nextAtIndex = value.indexOf('@', lastAtIndex + 1)

      let nextSpaceIndex = lastAtIndex
      let tempText = value.slice(lastAtIndex + 1)

      for (const agent of Object.values(DISPLAY_AGENTS)) {
        if (tempText.startsWith(agent)) {
          nextSpaceIndex = lastAtIndex + agent.length + 1
          break
        }
      }

      if (nextSpaceIndex === lastAtIndex) {
        nextSpaceIndex = value.indexOf(' ', lastAtIndex)
      }

      const endOfMention =
        nextAtIndex === -1
          ? nextSpaceIndex
          : Math.min(nextAtIndex, nextSpaceIndex)
      return endOfMention === -1 || selectionStart <= endOfMention
    })()

    if (isCursorInMention && !isCompletedSelection) {
      setIsPopupVisible(true)
      setShowError(false)
    }

    if (matchingAgents.length > 0 && isCursorInMention) {
      setFilteredAgents(matchingAgents)
      setIsPopupVisible(true)
      setShowError(false)
    } else if (isCursorInMention) {
      setIsPopupVisible(false)
    }

    if (completedMentions === 0 && !hasSelectedAgent) {
      setShowError(false)
    }
  }

  const handleAgentSelect = (agent: string) => {
    const lastAtIndex = input.lastIndexOf('@')

    if (lastAtIndex !== -1) {
      const beforeAt = input.slice(0, lastAtIndex)

      const afterAt = input.slice(lastAtIndex + 1)

      let mentionEndIndex = afterAt.length

      const nextAtIndex = afterAt.indexOf('@')
      if (nextAtIndex !== -1) {
        mentionEndIndex = nextAtIndex
      }

      const currentWord = afterAt.split(' ')[0]
      if (currentWord && currentWord.length < mentionEndIndex) {
        mentionEndIndex = currentWord.length
      }

      const remainingText = afterAt.slice(mentionEndIndex)

      const newText = `${beforeAt}@${agent}${remainingText}`
      setInput(newText)
    }

    setIsPopupVisible(false)
    setHasSelectedAgent(true)
    setAgent(agent)
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (isPopupVisible) {
      if (event.key === 'ArrowDown') {
        setSelectedAgent(prev => Math.min(prev + 1, filteredAgents.length - 1))
        event.preventDefault()
      } else if (event.key === 'ArrowUp') {
        setSelectedAgent(prev => Math.max(prev - 1, -1))
        event.preventDefault()
      } else if (event.key === 'Enter' && selectedAgent !== -1) {
        handleAgentSelect(filteredAgents[selectedAgent])
        event.preventDefault()
      } else if (event.key === 'Escape') {
        setIsPopupVisible(false)
        event.preventDefault()
      }
    }

    if (!isPopupVisible) {
      if (
        event.key === 'Enter' &&
        !event.shiftKey &&
        !event.nativeEvent.isComposing
      ) {
        formRef.current?.requestSubmit()
        event.preventDefault()
      }
    }
  }

  const fileRef = React.useRef<HTMLInputElement>(null)
  const queryClient = useQueryClient()
  const [isResponding, setIsResponding] = React.useState(false)

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
    <form
      className="form"
      ref={formRef}
      onSubmit={async (e: any) => {
        e.preventDefault()
        if (isPopupVisible || isResponding) return

        if (window.innerWidth < 600) {
          e.target['message']?.blur()
        }

        const value = input.trim()
        setInput('')
        if (!value) return

        setMessages(currentMessages => [
          ...currentMessages,
          {
            id: nanoid(),
            display: <UserMessage>{value}</UserMessage>
          }
        ])
        const chatId = id || ''
        try {
          const responseMessage = await submitUserMessage({
            content: value,
            chatId: chatId,
            agent: Agent
          })
          setAgent(AGENTS.AI_INTERN)
          if (!chatId) {
            queryClient.invalidateQueries({
              queryKey: ['chats'],
              exact: true,
              refetchType: 'active'
            })
          }

          setMessages(currentMessages => [...currentMessages, responseMessage])
        } catch (e) {
          throw new Error(e)
        }
      }}
    >
      <style jsx>{`
        form {
          display: flex;
          align-items: center;
          width: 700px;
          margin: 0;
          position: relative;
        }

        @media (max-width: 800px) {
          form {
            width: auto;
            margin: 10px;
          }
        }
      `}</style>
      <input
        type="file"
        className="hidden"
        id="file"
        ref={fileRef}
        onChange={async event => {
          if (!event.target.files) {
            toast.error('No file selected')
            return
          }

          const file = event.target.files[0]

          if (file.type.startsWith('video/')) {
            const responseMessage = await describeImage('')
            setMessages(currentMessages => [
              ...currentMessages,
              responseMessage
            ])
          } else {
            const reader = new FileReader()
            reader.readAsDataURL(file)

            reader.onloadend = async () => {
              const base64String = reader.result
              const responseMessage = await describeImage(base64String)
              setMessages(currentMessages => [
                ...currentMessages,
                responseMessage
              ])
            }
          }
        }}
      />
      <div className="flex flex-col" style={{ width: '628px' }}>
        {showError && (
          <div className="bg-white text-red-500 p-1 mb-2 rounded-xl border border-red-500 w-1/2 flex items-center">
            <HiOutlineExclamationTriangle className="mr-1" />
            <span>A single agent can be selected only</span>
          </div>
        )}
        <div className="relative">
          <div className="flex max-h-40 w-full grow flex-col overflow-hidden bg-zinc-100 rounded-xl border sm-w-auto">
            <Textarea
              ref={inputRef}
              tabIndex={0}
              onKeyDown={handleKeyDown}
              placeholder="Send a message."
              className="w-full min-w-auto bg-transparent placeholder:text-zinc-900 resize-none p-4 focus-within:outline-none sm:text-sm"
              autoFocus
              spellCheck={false}
              autoComplete="off"
              autoCorrect="off"
              name="message"
              rows={1}
              value={input}
              onChange={handleInputChange}
            />
          </div>

          {isPopupVisible && (
            <div className="absolute bottom-full mb-2 left-0 w-48 bg-white rounded-lg shadow-lg border border-gray-200 max-h-40 overflow-y-auto z-50">
              {filteredAgents.map((agent, index) => (
                <div
                  key={agent}
                  onClick={() => handleAgentSelect(agent)}
                  className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                    index === selectedAgent ? 'bg-gray-200' : ''
                  }`}
                >
                  {agent}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Button
        type="submit"
        size="icon"
        disabled={input === '' || isResponding}
        className="bg-transparent shadow-none text-zinc-950 hover:bg-zinc-200 ml-2"
      >
        <IconArrowElbow className="size-[40px] rounded-[5px] bg-[#003366] text-white" />
      </Button>
    </form>
  )
}
