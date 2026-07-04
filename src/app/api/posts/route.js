import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  const posts = await prisma.post.findMany({
    include: { category: true },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(posts)
}

export async function POST(req) {
  const { title, slug, content, excerpt, published, featuredImage, categoryId, author } = await req.json()
  const post = await prisma.post.create({
    data: { title, slug, content, excerpt, published: published ?? true, featuredImage: featuredImage || '', categoryId: categoryId || null, author: author || '' },
    include: { category: true },
  })
  return NextResponse.json(post)
}
