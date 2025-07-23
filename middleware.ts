import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { toast } from 'sonner'

// Define protected routes
const protectedRoutes = [
  '/admin/verification',
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const authToken = request.cookies.get('authToken')?.value
  // const authToken = sessionStorage.getItem('authToken');

  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))

  if (isProtectedRoute && !authToken) {
    // Redirect to login page if trying to access protected route without auth
    const loginUrl = new URL('/', request.url)
    // toast.error("Please login to proceed!!")
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    '/profile/:path*',
    '/favourites/:path*',
    '/verification/:path*',
    '/admin/verification/:path*',
    '/sell/:path*'
  ]
} 