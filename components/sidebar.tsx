'use client'

import * as React from 'react'

import { useSidebar } from '@/lib/hooks/use-sidebar'
import { cn } from '@/lib/utils'
import { SidebarToggle } from './sidebar-toggle'

export interface SidebarProps extends React.ComponentProps<'div'> {}

export function Sidebar({ className, children }: SidebarProps) {
  const { isSidebarOpen, isLoading } = useSidebar()

  return (
    <div
      data-state={isSidebarOpen && !isLoading ? 'open' : 'closed'}
      className={cn(className, 'h-full flex-col dark:bg-zinc-950')}
      style={{
        transform: isSidebarOpen ? 'translateX(0)' : 'translateX(0)',
        width: isSidebarOpen ? '300px' : '300px',
        marginLeft: isSidebarOpen ? '0' : '-245px'
      }}
    >
      <div style={{ position: 'absolute', right: '5px', top: '10px' }}>
        <SidebarToggle />
      </div>
      {children}
    </div>
  )
}
