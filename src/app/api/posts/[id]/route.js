import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function PUT(req, { params }) {
  const { title, slug, content, excerpt, published, featuredImage, categoryId, author } = await req.json()
  const post = await prisma.post.update({
    where: { id: Number(params.id) },
    data: { title, slug, content, excerpt, published, featuredImage: featuredImage || '', categoryId: categoryId || null, author: author || '' },
    include: { category: true },
  })
  return NextResponse.json(post)
}

export async function DELETE(req, { params }) {
  await prisma.post.delete({ where: { id: Number(params.id) } })
  return NextResponse.json({ success: true })
}
