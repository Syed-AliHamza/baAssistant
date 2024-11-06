'use client'

import { useUser } from '@clerk/nextjs'

export function EmptyScreen() {
  const { user } = useUser()
  return (
    <div className="mx-auto px-4">
      <div className="flex flex-col gap-2 sm:p-8 p-4 text-sm sm:text-base justify-center">
        <h1 className="text-2xl flex sm:text-3xl tracking-tight font-semibold justify-center">
          Hello, {user?.firstName}
        </h1>
        <p className="text-3xl sm:text-4xl text-neutral-400 tracking-tight font-semibold flex justify-center">
          How can I help you today?
        </p>
      </div>
    </div>
  )
}
