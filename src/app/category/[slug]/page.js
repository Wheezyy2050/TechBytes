import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import PostCard from '@/components/PostCard'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://tech-bytes-tau.vercel.app'
const PAGE_SIZE = 20

export async function generateMetadata({ params }) {
  const category = await prisma.category.findUnique({ where: { slug: params.slug } })
  if (!category) return {}

  return {
    title: category.name,
    description: `Browse all ${category.name} articles on TechBytes.`,
    alternates: { canonical: `${BASE_URL}/category/${params.slug}` },
    openGraph: {
      title: `${category.name} — TechBytes`,
      description: `Browse all ${category.name} articles on TechBytes.`,
      url: `${BASE_URL}/category/${params.slug}`,
    },
  }
}

export default async function CategoryPage({ params, searchParams }) {
  const category = await prisma.category.findUnique({ where: { slug: params.slug } })
  if (!category) notFound()

  const page = Math.max(1, Number(searchParams?.page) || 1)
  const skip = (page - 1) * PAGE_SIZE

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where: { published: true, categoryId: category.id },
      include: { category: true },
      orderBy: { createdAt: 'desc' },
      skip,
      take: PAGE_SIZE,
    }),
    prisma.post.count({ where: { published: true, categoryId: category.id } }),
  ])

  const totalPages = Math.ceil(total / PAGE_SIZE)

  return (
    <div className="max-w-4xl mx-auto px-6 md:px-10 py-12">

      <Link
        href="/"
        className="text-sm text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors inline-block mb-8"
      >
        &larr; Back to News
      </Link>

      <h1 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-2">
        {category.name}
      </h1>
      <p className="text-sm text-[var(--text-muted)] mb-8">
        {total} {total === 1 ? 'story' : 'stories'}
      </p>

      <hr className="border-[var(--border)] mb-2" />

      <div>
        {posts.length === 0 && (
          <p className="text-[var(--text-muted)] py-10 text-center">
            No posts in this category yet.
          </p>
        )}
        {posts.map((post, i) => (
          <PostCard key={post.id} post={post} index={i} total={posts.length} />
        ))}
      </div>

      {totalPages > 1 && (
        <nav className="flex items-center justify-between pt-8 border-t border-[var(--border)] mt-2">
          <div>
            {page > 1 && (
              <Link
                href={`/category/${params.slug}?page=${page - 1}`}
                className="text-sm text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"
              >
                &larr; Newer
              </Link>
            )}
          </div>
          <span className="text-xs text-[var(--text-muted)]">
            Page {page} of {totalPages}
          </span>
          <div>
            {page < totalPages && (
              <Link
                href={`/category/${params.slug}?page=${page + 1}`}
                className="text-sm text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"
              >
                Older &rarr;
              </Link>
            )}
          </div>
        </nav>
      )}
    </div>
  )
}
