import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isProtectedRoute = createRouteMatcher(['/profile(.*)', '/editProfile(.*)', '/companyProfile(.*)', '/chat(.*)', '/'])
const isPublicRoute = createRouteMatcher(['/login', '/signup'])

export default clerkMiddleware((auth, req) => {
  const { userId } = auth()

  if (userId && isPublicRoute(req)) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  if (!userId && isProtectedRoute(req)) {
    return NextResponse.redirect(new URL('/login', req.url))
  }


  return NextResponse.next()
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
