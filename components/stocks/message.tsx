'use client'

/* eslint-disable @next/next/no-img-element */

import { IconUser } from '@/components/ui/icons'
import { cn } from '@/lib/utils'
import { spinner } from './spinner'
import React, { useEffect } from 'react'
// Different types of message bubbles.
export const dynamic = 'force-dynamic'

export function UserMessage({ children }: { children: React.ReactNode }) {
  return (
    <div className="group relative flex items-start md:-ml-12 bg-[#3B86F7] text-white p-5 rounded-lg border userMessage">
      <div className="flex size-[25px] shrink-0 select-none items-center justify-center rounded shadow-sm text-black">
        <IconUser />
      </div>
      <div className="ml-4 flex-1 space-y-2 overflow-hidden pl-">
        {children}
      </div>
    </div>
  )
}

export function BotCard({ children, showAvatar = true }: any) {
  return (
    <div className="group relative flex items-start md:-ml-12 mb-5 systemChat rounded-lg border botMessage">
      <div
        className={cn(
          'bg-background flex size-[25px] shrink-0 select-none items-center justify-center rounded-lg border shadow-sm',
          !showAvatar && 'invisible'
        )}
      >
        <img
          className="size-12"
          src="/images/nova.svg"
          alt="cosmic logo test"
        />
      </div>
      <div className="ml-4 flex-1 pl-2">{children}</div>
    </div>
  )
}

export function SystemMessage({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={
        'mt-2 flex items-center justify-center gap-2 text-xs text-gray-500'
      }
    >
      <div className={'flex-initial p-2'}>{children}</div>
    </div>
  )
}

export function SpinnerMessage({ text }) {
  useEffect(() => {
    localStorage.setItem('isResponding', 'true')
    window.dispatchEvent(new Event('respondingStatusChange'))
  }, [])
  return (
    <div className="group relative flex items-start md:-ml-12">
      {/* <div className="flex size-[25px] shrink-0 select-none items-center justify-center rounded-full border shadow-sm mb-2">
    <img className="size-3" src="/images/ai-icon.png" alt="cosmic logo" />
  </div> */}
      <div className="ml-4 h-[30px] flex flex-row items-center flex-1 overflow-hidden px-1">
        {spinner}
        <span className="px-2 flex items-center"> {text}</span>
      </div>
    </div>
  )
}
