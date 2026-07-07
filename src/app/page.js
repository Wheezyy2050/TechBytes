import prisma from '@/lib/prisma'
import PostCard from '@/components/PostCard'
import { decodeHtmlEntities } from '@/lib/utils'

function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  })
}

export default async function HomePage() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    include: { category: true },
    orderBy: { createdAt: 'desc' },
  })

  const featured = posts.find(p => !p.sourceUrl?.includes('gsmarena.com')) || posts[0]
  const latest = posts.filter(p => p.id !== featured.id)
  const trending = posts.slice(0, 5)

  return (
    <div className="max-w-6xl mx-auto px-6 md:px-10 py-12">

      {/* ── Featured Hero ── */}
      {featured && (
        <section className="mb-16">
          <a href={`/posts/${featured.slug}`} className="block group">
            <div className="aspect-[2/1] overflow-hidden bg-[#f0f0f0] mb-6">
              {decodeHtmlEntities(featured.featuredImage) ? (
                <img src={decodeHtmlEntities(featured.featuredImage)} alt={featured.title} className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700" />
              ) : (
                <div className="w-full h-full placeholder-gradient" />
              )}
            </div>
            <div className="max-w-3xl">
              {featured.category && (
                <span className={`category-tag tag-${featured.category.slug}`}>
                  {featured.category.name}
                </span>
              )}
              <h1 className="text-3xl md:text-5xl font-bold leading-tight mt-3 mb-4 text-[var(--text-primary)]">
                {featured.title}
              </h1>
              <p className="text-base md:text-lg text-[var(--text-secondary)] leading-relaxed mb-4">
                {featured.excerpt}
              </p>
              <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
                <span>{featured.author || 'TechBytes'}</span>
                <span className="mx-1">·</span>
                <time>{formatDate(featured.createdAt)}</time>
              </div>
            </div>
          </a>
        </section>
      )}

      {/* ── 2-Column Layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10 md:gap-14">

        {/* ═══ Main Feed ═══ */}
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--text-muted)] mb-1">
            Latest
          </h2>
          <hr className="border-[var(--border)] mb-6" />
          <div>
            {latest.length === 0 && (
              <p className="text-[var(--text-muted)] py-10 text-center">
                No posts yet. Check back soon!
              </p>
            )}
            {latest.map((post, i) => (
              <PostCard key={post.id} post={post} index={i} total={latest.length} />
            ))}
          </div>
        </div>

        {/* ═══ Sidebar ═══ */}
        <aside className="space-y-10 lg:sticky lg:top-8 lg:self-start">

          {/* ── Trending ── */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--text-muted)] mb-6">
              Trending
            </h3>
            <div className="space-y-5">
              {trending.map((post, i) => (
                <a
                  key={post.id}
                  href={`/posts/${post.slug}`}
                  className="flex items-start gap-4 group"
                >
                  <span className="text-2xl font-bold text-[#d0d0d0] tabular-nums leading-none mt-0.5 w-6">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className="min-w-0">
                    <h4 className="text-sm font-semibold leading-snug text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">
                      {post.title}
                    </h4>
                    <span className="text-xs text-[var(--text-muted)] mt-1.5 block">
                      {post.category?.name || 'Tech'}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* ── Newsletter ── */}
          <div className="border-t border-[var(--border)] pt-8">
            <h3 className="text-sm font-semibold mb-2 text-[var(--text-primary)]">
              Stay Updated
            </h3>
            <p className="text-sm text-[var(--text-muted)] mb-4 leading-relaxed">
              Get the latest tech news delivered to your inbox.
            </p>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 min-w-0 px-3 py-2.5 text-sm border border-[#d0d0d0] bg-white text-[var(--text-primary)] placeholder:text-[#b0b0b0] focus:outline-none focus:border-[var(--accent)] transition-colors"
              />
              <button
                type="submit"
                className="px-5 py-2.5 text-sm font-medium bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] transition-colors whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          </div>

        </aside>
      </div>
    </div>
  )
}
