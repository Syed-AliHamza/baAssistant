'use client'

import React from 'react'
import { SidebarItems } from '@/components/sidebar-items'
import { useQuery } from '@tanstack/react-query'
import { fetchChats } from '@/lib/queryFunctions/queryFuntions'

export function SidebarList({ selectedChatId, setSelectedChatId }) {
  const { data, isLoading } = useQuery({
    queryFn: fetchChats,
    queryKey: ['chats']
  })
  const chats = data?.rows || []

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="flex-1 overflow-auto">
        {isLoading ? (
          <div className="p-8 text-center">
            <p className="text-sm text-muted-foreground">Loading...</p>
          </div>
        ) : chats?.length ? (
          <div className="space-y-2 px-2">
            <SidebarItems
              chats={chats}
              selectedChatId={selectedChatId}
              setSelectedChatId={setSelectedChatId}
            />
          </div>
        ) : (
          <div className="p-8 text-center">
            <p className="text-sm text-muted-foreground">No chat history</p>
          </div>
        )}
      </div>
      <div className="flex items-center justify-between p-4">
        {/* <ClearHistory
          clearChats={handleClearChats}
          isEnabled={chats.length > 0}
        /> */}
      </div>
    </div>
  )
}
