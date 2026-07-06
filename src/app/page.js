import prisma from '@/lib/prisma'
import PostCard from '@/components/PostCard'
import { decodeHtmlEntities } from '@/lib/utils'

export default async function HomePage() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    include: { category: true },
    orderBy: { createdAt: 'desc' },
  })

  const featured = posts[0]

  return (
    <div className="max-w-6xl mx-auto px-8 py-12">
      <div className="mb-12">
        <h1 className="text-5xl font-bold mb-2 text-black">Tech Bytes</h1>
        <p className="text-[#333] text-lg">Your daily dose of tech news.</p>
      </div>

      {featured && (
        <a href={`/posts/${featured.slug}`} className="block group mb-16">
          <article className="grid md:grid-cols-2 gap-8 border border-[#e0e0e0] bg-white rounded-xl overflow-hidden hover:border-black transition-all shadow-sm">
            <div className="h-64 md:h-full bg-[#f0f0f0] overflow-hidden">
              {decodeHtmlEntities(featured.featuredImage) ? (
                <img src={decodeHtmlEntities(featured.featuredImage)} alt={featured.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              ) : (
                <div className="w-full h-full placeholder-gradient" />
              )}
            </div>
            <div className="p-10 flex flex-col justify-center">
              {featured.category && (
                <span className="text-xs text-black uppercase tracking-wider mb-3 font-medium">{featured.category.name}</span>
              )}
              <h2 className="text-3xl font-bold mb-3 text-black group-hover:opacity-60 transition-opacity">{featured.title}</h2>
              <p className="text-[#333] leading-relaxed mb-4">{featured.excerpt}</p>
              <div className="flex items-center gap-3 text-xs text-[#4a4a4a]">
                <span>{featured.author || 'Churchill Mgamba'}</span>
                <span>·</span>
                <time>{new Date(featured.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
              </div>
            </div>
          </article>
        </a>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.slice(1).map(post => <PostCard key={post.id} post={post} />)}
      </div>

      {posts.length === 0 && <p className="text-[#4a4a4a] text-center py-20">No posts yet. Check back soon!</p>}
    </div>
  )
}
