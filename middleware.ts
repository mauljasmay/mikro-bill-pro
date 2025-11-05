import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const isAuth = !!token
    const isAuthPage = req.nextUrl.pathname.startsWith('/admin/login')
    const isAdminPage = req.nextUrl.pathname.startsWith('/admin')

    if (isAdminPage && !isAuthPage) {
      if (!isAuth) {
        return NextResponse.redirect(new URL('/admin/login', req.url))
      }

      // Check if user has admin role
      if (token.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/login', req.url))
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const isAuthPage = req.nextUrl.pathname.startsWith('/admin/login')
        const isAdminPage = req.nextUrl.pathname.startsWith('/admin')

        if (isAdminPage && !isAuthPage) {
          return !!token && token.role === 'ADMIN'
        }

        return true
      }
    }
  }
)

export const config = {
  matcher: ['/admin/:path*']
}
