import * as React from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from './ui/tooltip'
import Link from 'next/link'
import { IconPlus } from './ui/icons'
import clsx from 'clsx'

export function NewChat({ isResponding, handleClick, id }) {
  const isDisabled = !id && isResponding
  return (
    <TooltipProvider>
      <div className="flex items-center justify-between p-4">
        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              <Link href="/chat" onClick={handleClick}>
                <div
                  className={`flex`}
                  style={{
                    cursor: isDisabled ? 'not-allowed' : 'pointer',
                    opacity: isDisabled ? 0.5 : 1
                  }}
                >
                  <IconPlus
                    className={clsx(
                      'size-[30px] p-1 bg-[#3B86F7] text-white rounded-full ',
                      isDisabled ? 'cursor-not-allowed' : ''
                    )}
                  />
                </div>
              </Link>
            </div>
          </TooltipTrigger>
          <TooltipContent side="right">
            {isDisabled
              ? 'Wait for the current response to finish.'
              : 'New Chat'}
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  )
}
