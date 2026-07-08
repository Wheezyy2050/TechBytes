import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(req) {
  try {
    const email = req.nextUrl.searchParams.get('email')

    if (!email) {
      return new Response('Missing email parameter', { status: 400 })
    }

    await prisma.subscriber.updateMany({
      where: { email, active: true },
      data: { active: false },
    })

    return new Response('Unsubscribed successfully. You will no longer receive emails.', {
      status: 200,
      headers: { 'Content-Type': 'text/plain' },
    })
  } catch (err) {
    console.error('Unsubscribe error:', err)
    return new Response('Something went wrong', { status: 500 })
  }
}
