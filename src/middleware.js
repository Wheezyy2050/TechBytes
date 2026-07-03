import { NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'

export function middleware(req) {
  const url = req.nextUrl.pathname
  if (!url.startsWith('/admin')) return NextResponse.next()
  if (url.startsWith('/admin/login')) return NextResponse.next()

  const token = req.cookies.get('token')?.value
  if (!token || !verifyToken(token)) {
    return NextResponse.redirect(new URL('/admin/login', req.url))
  }
  return NextResponse.next()
}

export const config = { matcher: ['/admin/:path*'] }
