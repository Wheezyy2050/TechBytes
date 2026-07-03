import prisma from '@/lib/prisma'
import PostCard from '@/components/PostCard'

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
        <h1 className="text-5xl font-bold mb-2">Tech Bytes</h1>
        <p className="text-[#888] text-lg">Your daily dose of tech news.</p>
      </div>

      {featured && (
        <a href={`/posts/${featured.slug}`} className="block group mb-12">
          <article className="grid md:grid-cols-2 gap-8 border border-[#1e1e1e] bg-[#111] rounded-xl overflow-hidden hover:border-[#e8ff47]/30 transition-all">
            <div className="h-64 md:h-full bg-[#1a1a1a] overflow-hidden">
              {featured.featuredImage ? (
                <img src={featured.featuredImage} alt={featured.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl text-[#333]">📰</div>
              )}
            </div>
            <div className="p-8 flex flex-col justify-center">
              {featured.category && (
                <span className="text-xs text-[#e8ff47] uppercase tracking-wider mb-3">{featured.category.name}</span>
              )}
              <h2 className="text-3xl font-bold mb-3 group-hover:text-[#e8ff47] transition-colors">{featured.title}</h2>
              <p className="text-[#888] leading-relaxed mb-4">{featured.excerpt}</p>
              <div className="flex items-center gap-3 text-xs text-[#555]">
                <span>Churchill Mgamba</span>
                <span>·</span>
                <time>{new Date(featured.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
              </div>
            </div>
          </article>
        </a>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.slice(1).map(post => <PostCard key={post.id} post={post} />)}
      </div>

      {posts.length === 0 && <p className="text-[#555] text-center py-20">No posts yet. Check back soon!</p>}
    </div>
  )
}
