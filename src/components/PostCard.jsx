import Link from 'next/link'
import { decodeHtmlEntities } from '@/lib/utils'

export default function PostCard({ post, index, total }) {
  const date = new Date(post.createdAt).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  })
  const imageUrl = decodeHtmlEntities(post.featuredImage)

  const categoryTag = post.category && (
    <Link
      href={`/category/${post.category.slug}`}
      className={`category-tag tag-${post.category.slug} hover:opacity-70 transition-opacity`}
      onClick={e => e.stopPropagation()}
    >
      {post.category.name}
    </Link>
  )

  return (
    <div>
      <Link href={`/posts/${post.slug}`} className="block group py-6">
        {imageUrl ? (
          <div className="flex gap-5 md:gap-6">
            <div className="w-36 md:w-48 h-24 md:h-32 flex-shrink-0 bg-[#f0f0f0] overflow-hidden">
              <img src={imageUrl} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="flex-1 min-w-0">
              {categoryTag}
              <h2 className="text-base md:text-lg font-bold leading-snug mt-1 mb-1.5 text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">
                {post.title}
              </h2>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed line-clamp-2">
                {post.excerpt}
              </p>
              <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] mt-2">
                <span>{post.author || 'TechBytes'}</span>
                <span>·</span>
                <time>{date}</time>
              </div>
            </div>
          </div>
        ) : (
          <div>
            {categoryTag}
            <h2 className="text-base md:text-lg font-bold leading-snug mt-1 mb-1.5 text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">
              {post.title}
            </h2>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              {post.excerpt}
            </p>
            <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] mt-2">
              <span>{post.author || 'TechBytes'}</span>
              <span>·</span>
              <time>{date}</time>
            </div>
          </div>
        )}
      </Link>
      {index < total - 1 && <hr className="border-[var(--border)]" />}
    </div>
  )
}
