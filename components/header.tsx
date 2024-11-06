'use client'

/* eslint-disable @next/next/no-img-element */
import * as React from 'react'
import HeaderComponent from './header/header'
import { SignedIn } from '@clerk/nextjs'

export function Header() {
  return (
    <SignedIn>
      <header className="sticky top-0 z-50 flex items-center justify-between w-full h-16 px-4 shrink-0 bg-white backdrop-blur-xl">
        <div className="w-full flex items-center">
          <HeaderComponent />
          <React.Suspense
            fallback={<div className="flex-1 overflow-auto" />}
          ></React.Suspense>
        </div>
      </header>
    </SignedIn>
  )
}
