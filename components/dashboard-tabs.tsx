import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import React, { useEffect } from 'react'

const CustomTabs = ({ tabs, onTabChange }) => {
  return (
    <Tabs
      defaultValue={tabs[0]?.value}
      onValueChange={value => {
        if (onTabChange) {
          console.log('title', value)
          onTabChange(value)
        }
      }}
      className="w-full max-w-md mx-auto"
    >
      <TabsList className="flex space-x-1 p-1 bg-white rounded-xl">
        {tabs.map(tab => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className="py-2 px-6 text-sm font-medium text-gray-700 data-[state=active]:bg-blue-500 data-[state=active]:text-white"
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {tabs.map(tab => (
        <TabsContent
          key={tab.value}
          value={tab.value}
          className="mt-2 bg-white rounded-xl p-3"
        >
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  )
}

export default CustomTabs
