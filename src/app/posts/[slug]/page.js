import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Markdown from 'react-markdown'
import Link from 'next/link'
import { decodeHtmlEntities } from '@/lib/utils'

function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  })
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
