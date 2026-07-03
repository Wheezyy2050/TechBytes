import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Markdown from 'react-markdown'
import Link from 'next/link'

export default async function PostPage({ params }) {
  const post = await prisma.post.findUnique({
    where: { slug: params.slug },
    include: { category: true },
  })
  if (!post) notFound()

  const date = new Date(post.createdAt).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  })

  return (
    <article className="max-w-3xl mx-auto px-8 py-12">
      <div className="mb-8">
        <Link href="/" className="text-xs text-[#555] hover:text-[#e8ff47] transition-colors">← Back to News</Link>
      </div>

      {post.featuredImage && (
        <div className="rounded-xl overflow-hidden mb-8 border border-[#1e1e1e]">
          <img src={post.featuredImage} alt={post.title} className="w-full h-64 md:h-80 object-cover" />
        </div>
      )}

      {post.category && (
        <span className="inline-block text-xs text-[#e8ff47] uppercase tracking-wider mb-3 border border-[#e8ff47]/20 bg-[#e8ff47]/5 px-3 py-1 rounded">
          {post.category.name}
        </span>
      )}

      <h1 className="text-4xl font-bold mb-4">{post.title}</h1>

      <div className="flex items-center gap-3 text-sm text-[#555] mb-10 pb-6 border-b border-[#1e1e1e]">
        <span className="font-medium text-[#f0ede8]">Churchill Mgamba</span>
        <span>·</span>
        <time>{date}</time>
      </div>

      <div className="prose">
        <Markdown>{post.content}</Markdown>
      </div>
    </article>
  )
}
