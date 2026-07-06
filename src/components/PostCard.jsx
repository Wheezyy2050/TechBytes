import Link from 'next/link'
import { decodeHtmlEntities } from '@/lib/utils'

export default function PostCard({ post }) {
  const date = new Date(post.createdAt).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  })
  const imageUrl = decodeHtmlEntities(post.featuredImage)

  return (
    <Link href={`/posts/${post.slug}`} className="block group">
      <article className="border border-[#e0e0e0] bg-white rounded-xl overflow-hidden hover:border-black transition-all shadow-sm h-full flex flex-col">
        <div className="h-44 bg-[#f0f0f0] overflow-hidden">
          {imageUrl ? (
            <img src={imageUrl} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          ) : (
            <div className="w-full h-full placeholder-gradient" />
          )}
        </div>
        <div className="p-6 flex flex-col flex-1">
          {post.category && (
            <span className="text-[10px] text-black uppercase tracking-wider mb-2 font-medium">{post.category.name}</span>
          )}
          <h2 className="font-bold mb-2 text-black group-hover:opacity-60 transition-opacity">{post.title}</h2>
          <p className="text-xs text-[#333] leading-relaxed flex-1">{post.excerpt}</p>
          <div className="flex items-center gap-2 text-[10px] text-[#4a4a4a] mt-4 pt-4 border-t border-[#e0e0e0]">
            <span>{post.author || 'Churchill Mgamba'}</span>
            <span>·</span>
            <time>{date}</time>
          </div>
        </div>
      </article>
    </Link>
  )
}
