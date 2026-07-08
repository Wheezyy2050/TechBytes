import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(req) {
  try {
    const { email } = await req.json()

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    const existing = await prisma.subscriber.findUnique({ where: { email } })

    if (existing) {
      if (!existing.active) {
        await prisma.subscriber.update({
          where: { email },
          data: { active: true },
        })
        return NextResponse.json({ message: 'You\'re back! Subscription reactivated.' })
      }
      return NextResponse.json({ message: 'Already subscribed!' })
    }

    await prisma.subscriber.create({ data: { email } })

    return NextResponse.json({ message: 'You\'re subscribed!' })
  } catch (err) {
    console.error('Subscribe error:', err)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
