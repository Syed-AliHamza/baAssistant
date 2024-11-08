import * as React from 'react'
import { PromptForm } from '@/components/prompt-form'
import { ButtonScrollToBottom } from '@/components/button-scroll-to-bottom'
import { FooterText } from '@/components/footer'
import { useActions, useUIState } from 'ai/rsc'
import type { AI } from '@/lib/chat/actions'
import { nanoid } from 'nanoid'
import { UserMessage } from './stocks/message'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { ClipboardIcon } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'
import { AGENTS } from '@/lib/utils/constants'

export interface ChatPanelProps {
  id?: string
  title?: string
  input: string
  setInput: () => void
  isAtBottom: boolean
  scrollToBottom: () => void
  isEmptyScreen: boolean
}
export const exampleMessages = [
  {
    icon: <ClipboardIcon style={{ color: '#003366' }} />,
    heading: 'Initial Dairy Data Records',
    subheading: 'Retrieve Sample Dairy Records for Review',
    message: `Retrieve the first 10 records from the dairy data tables, displaying all relevant details for each entry.`
  },
  {
    icon: <ClipboardIcon style={{ color: '#003366' }} />,
    heading: 'Weight by Tag for Specific Study',
    subheading: 'Find Weight Data for Tag IDs in Study "BC500"',
    message: 'For Tag_ID= [33], retrieve Pen_ID and Animal_Count'
  },
  {
    icon: <ClipboardIcon style={{ color: '#003366' }} />,
    heading: 'Pen ID and Animal Count by Tag',
    subheading: 'Fetch Pen and Animal Data for Tag "33"',
    message:
      'Write an SQL query to fetch the pen ID and animal count for the record with tag ID "33" in the beef animal information table order by pen id.'
  },
  {
    icon: <ClipboardIcon style={{ color: '#003366' }} />,
    heading: 'Gate and Animal Count for Study',
    subheading: 'Find Gate and Animal Data for Study "CF718"',
    message: 'For study_id= [CF718], find all Gate_IDs and their Animal_Counts'
  }
]

export function ChatPanel({
  id,
  input,
  setInput,
  isAtBottom,
  scrollToBottom,
  isEmptyScreen
}: ChatPanelProps) {
  const [messages, setMessages] = useUIState<typeof AI>()
  const { submitUserMessage } = useActions()
  const chatId = id || ''
  const queryClient = useQueryClient()

  const [selected, setSelected] = React.useState(AGENTS.PANDA)

  return (
    <div className=" inset-x-0 duration-300 ease-in-out dark:from-10% ">
      <ButtonScrollToBottom
        isAtBottom={isAtBottom}
        scrollToBottom={scrollToBottom}
      />

      <div className="mx-auto sm:max-w-[740px] sm:px-4">
        <div className="grid sm:grid-cols-2 gap-2 sm:gap-4 px-4 sm:px-0 max-w-[700px] "></div>

        <div className="mb-[60px]">
          {!isEmptyScreen ? (
            <div className="bg-white py-4 border-t border-zinc-200 lg:fixed lg:bottom-0 lg:left-[300px] lg:right-0 lg:pl-[0px] lg:mx-[0px] flex justify-center">
              <PromptForm
                input={input}
                setInput={setInput}
                id={id}
                selected={selected}
                isEmptyScreen={isEmptyScreen}
              />
            </div>
          ) : (
            <div className="mt-[50px] mb-[24px]">
              {/* <SelectionBoxes selected={selected} setSelected={setSelected} /> */}
              <PromptForm
                input={input}
                setInput={setInput}
                id={id}
                selected={selected}
                isEmptyScreen={isEmptyScreen}
              />
            </div>
          )}
        </div>
        <FooterText className="hidden sm:block" />
      </div>
    </div>
  )
}
