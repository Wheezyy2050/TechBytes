import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Markdown from 'react-markdown'
import Link from 'next/link'
import { decodeHtmlEntities } from '@/lib/utils'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://tech-bytes-tau.vercel.app'

function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  })
}

export async function generateMetadata({ params }) {
  const post = await prisma.post.findUnique({
    where: { slug: params.slug },
  })
  if (!post) return {}

  const excerpt = post.excerpt.length > 155
    ? post.excerpt.slice(0, 152) + '...'
    : post.excerpt

  const imageUrl = decodeHtmlEntities(post.featuredImage)

  return {
    title: post.title,
    description: excerpt,
    alternates: { canonical: `${BASE_URL}/posts/${post.slug}` },
    openGraph: {
      title: post.title,
      description: excerpt,
      url: `${BASE_URL}/posts/${post.slug}`,
      type: 'article',
      ...(imageUrl && { images: [{ url: imageUrl, width: 1200, height: 630 }] }),
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: excerpt,
      ...(imageUrl && { images: [imageUrl] }),
    },
  }
}

export default async function PostPage({ params }) {
  const post = await prisma.post.findUnique({
    where: { slug: params.slug },
    include: { category: true },
  })
  if (!post) notFound()

  const imageUrl = decodeHtmlEntities(post.featuredImage)

  return (
    <article className="max-w-3xl mx-auto px-6 md:px-10 py-12">

      {/* ── Back link ── */}
      <div className="mb-10">
        <Link
          href="/"
          className="text-sm text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"
        >
          &larr; Back to News
        </Link>
      </div>

      {/* ── Image ── */}
      <div className="mb-8">
        {imageUrl ? (
          <img src={imageUrl} alt={post.title} className="w-full h-64 md:h-[420px] object-cover" />
        ) : (
          <div className="w-full h-64 md:h-[420px] placeholder-gradient" />
        )}
      </div>

      {/* ── Category ── */}
      {post.category && (
        <span className={`category-tag tag-${post.category.slug} mb-4 block`}>
          {post.category.name}
        </span>
      )}

      {/* ── Headline ── */}
      <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-6 text-[var(--text-primary)]">
        {post.title}
      </h1>

      {/* ── Byline ── */}
      <div className="flex items-center gap-2 text-sm text-[var(--text-muted)] pb-6 mb-6 border-b border-[var(--border)]">
        <span className="font-medium text-[var(--text-primary)]">{post.author || 'TechBytes'}</span>
        <span>·</span>
        <time>{formatDate(post.createdAt)}</time>
      </div>

      {/* ── Attribution ── */}
      {post.sourceUrl && post.sourceName && (
        <div className="text-sm text-[var(--text-muted)] mb-10 pb-6 border-b border-[var(--border)] leading-relaxed">
          Originally published by {post.sourceName} &mdash;{' '}
          <a
            href={post.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--accent)] hover:underline"
          >
            Read the full article
          </a>
        </div>
      )}

      {/* ── Content ── */}
      <div className="prose max-w-none">
        <Markdown>{post.content}</Markdown>
      </div>
    </article>
  )
}
