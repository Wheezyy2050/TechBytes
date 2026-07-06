import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Markdown from 'react-markdown'
import Link from 'next/link'
import { decodeHtmlEntities } from '@/lib/utils'

export default async function PostPage({ params }) {
  const post = await prisma.post.findUnique({
    where: { slug: params.slug },
    include: { category: true },
  })
  if (!post) notFound()

  const date = new Date(post.createdAt).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  })
  const imageUrl = decodeHtmlEntities(post.featuredImage)

  return (
    <article className="max-w-3xl mx-auto px-8 py-12">
      <div className="mb-8">
        <Link href="/" className="text-xs text-[#4a4a4a] hover:text-black transition-colors">← Back to News</Link>
      </div>

      <div className="rounded-xl overflow-hidden mb-8 border border-[#e0e0e0]">
        {imageUrl ? (
          <img src={imageUrl} alt={post.title} className="w-full h-64 md:h-80 object-cover" />
        ) : (
          <div className="w-full h-64 md:h-80 placeholder-gradient" />
        )}
      </div>

      {post.category && (
        <span className="inline-block text-xs text-black uppercase tracking-wider mb-3 border border-black/20 bg-black/5 px-3 py-1 rounded font-medium">
          {post.category.name}
        </span>
      )}

      <h1 className="text-4xl font-bold mb-4 text-black">{post.title}</h1>

      <div className="flex items-center gap-3 text-sm text-[#4a4a4a] mb-6 pb-6 border-b border-[#e0e0e0]">
        <span className="font-medium text-black">{post.author || 'Churchill Mgamba'}</span>
        <span>·</span>
        <time>{date}</time>
      </div>

      {post.sourceUrl && post.sourceName && (
        <div className="text-xs text-[#4a4a4a] mb-8 pb-4 border-b border-[#e0e0e0]">
          Originally published by {post.sourceName} —{' '}
          <a href={post.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-black">
            Read the full article
          </a>
        </div>
      )}

      <div className="prose">
        <Markdown>{post.content}</Markdown>
      </div>
    </article>
  )
}
