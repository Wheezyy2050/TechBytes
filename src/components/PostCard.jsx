import Link from 'next/link'

export default function PostCard({ post }) {
  const date = new Date(post.createdAt).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  })

  return (
    <Link href={`/posts/${post.slug}`} className="block group">
      <article className="border border-[#e0e0e0] bg-white rounded-xl overflow-hidden hover:border-black transition-all h-full flex flex-col">
        <div className="h-44 bg-[#f0f0f0] overflow-hidden">
          {post.featuredImage ? (
            <img src={post.featuredImage} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-3xl text-[#999]">📰</div>
          )}
        </div>
        <div className="p-5 flex flex-col flex-1">
          {post.category && (
            <span className="text-[10px] text-black uppercase tracking-wider mb-2 font-medium">{post.category.name}</span>
          )}
          <h2 className="font-bold mb-2 text-black group-hover:opacity-60 transition-opacity">{post.title}</h2>
          <p className="text-xs text-[#666] leading-relaxed flex-1">{post.excerpt}</p>
          <div className="flex items-center gap-2 text-[10px] text-[#999] mt-4 pt-4 border-t border-[#e0e0e0]">
            <span>Churchill Mgamba</span>
            <span>·</span>
            <time>{date}</time>
          </div>
        </div>
      </article>
    </Link>
  )
}
