// @ts-nocheck
import { Chat } from '@/components/chat'
import { AI } from '@/lib/chat/actions'
import { unstable_noStore as noStore } from 'next/cache'
export const dynamic = 'force-dynamic'
export const maxDuration = 60

export const metadata = {
  title: process.env.BUSINESS_NAME + ' Chat'
}

export default async function IndexPage() {
  noStore()
  return (
    <AI initialAIState={{ chatId: null, interactions: [], messages: [] }}>
      <Chat />
    </AI>
  )
}
