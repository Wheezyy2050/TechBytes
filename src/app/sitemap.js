import prisma from '@/lib/prisma'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://tech-bytes-tau.vercel.app'

export default async function sitemap() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    select: { slug: true, updatedAt: true },
    orderBy: { updatedAt: 'desc' },
  })

  const entries = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 1,
    },
    ...posts.map(post => ({
      url: `${BASE_URL}/posts/${post.slug}`,
      lastModified: post.updatedAt,
      changeFrequency: 'daily',
      priority: 0.8,
    })),
  ]

  return entries
}
