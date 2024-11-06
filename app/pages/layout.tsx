import { SidebarDesktop } from '@/components/sidebar-desktop'
import React from 'react'

interface Dashboard {
  children: React.ReactNode
}

export default async function RootLayout({ children }: Dashboard) {
  return (
    <div className="relative flex h-[calc(100vh_-_theme(spacing.16))] overflow-hidden">
      <SidebarDesktop />
      {children}
    </div>
  )
}
