'use client'

import { SidebarDesktop } from '@/components/sidebar-desktop'
import { useSidebar } from '@/lib/hooks/use-sidebar'
import React from 'react'

interface ChatLayoutProps {
  children: React.ReactNode
}

export default function ChatLayout({ children }: ChatLayoutProps) {
  const { isSidebarOpen } = useSidebar()
  return (
    <>
      <div className="bg-muted p-5 flex">
        {/* <h2 className='text-black-600 p-5'>Chat AI</h2>  */}
        <SidebarDesktop />
        <div
          id="mainchatarea"
          style={{
            transition: 'all .3s ease-out',
            marginLeft: isSidebarOpen ? '300px' : '60px',
            width: '100%'
          }}
        >
          <div className="relative w-full  overflow-hidden bg-white border">
            {children}
          </div>
        </div>
      </div>
    </>
  )
}
