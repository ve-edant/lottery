import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isAdminRoute = createRouteMatcher(['/admin(.*)'])
const isProtectedRoute = createRouteMatcher(['/dashboard(.*)', '/betting(.*)', '/profile(.*)'])

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims } = await auth()

  // Protect all routes starting with `/admin`
  if (isAdminRoute(req) && sessionClaims?.metadata?.role !== 'ADMIN') {
    const url = new URL('/', req.url)
    return NextResponse.redirect(url)
  }

  // For protected routes, ensure user is authenticated
  if (isProtectedRoute(req) && !userId) {
    const url = new URL('/sign-in', req.url)
    return NextResponse.redirect(url)
  }

  // For API routes that need user sync, add a header with the user ID
  if (req.nextUrl.pathname.startsWith('/api') && userId) {
    const requestHeaders = new Headers(req.headers)
    requestHeaders.set('x-user-id', userId)
    
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}