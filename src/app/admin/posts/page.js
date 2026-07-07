'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function AdminPosts() {
  const [posts, setPosts] = useState([])
  const router = useRouter()

  useEffect(() => {
    fetch('/api/posts').then(r => r.json()).then(setPosts)
  }, [])

  const handleDelete = async (id) => {
    if (!confirm('Delete this post?')) return
    await fetch(`/api/posts/${id}`, { method: 'DELETE' })
    setPosts(posts.filter(p => p.id !== id))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Posts</h1>
        <Link href="/admin/posts/create" className="bg-[var(--accent)] text-white px-4 py-2 text-sm font-medium hover:bg-[var(--accent-hover)] transition-colors">
          + New Post
        </Link>
      </div>
      <div className="space-y-2">
        {posts.map(post => (
          <div key={post.id} className="flex items-center justify-between py-4 px-1 border-b border-[var(--border)]">
            <div>
              <h3 className="font-semibold text-[var(--text-primary)]">{post.title}</h3>
              <p className="text-xs text-[var(--text-muted)] mt-1">
                {post.category?.name || 'Uncategorized'} &middot; {post.published ? 'Published' : 'Draft'} &middot; {new Date(post.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex gap-4">
              <Link href={`/admin/posts/${post.id}/edit`} className="text-sm text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors">Edit</Link>
              <button onClick={() => handleDelete(post.id)} className="text-sm text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors">Delete</button>
            </div>
          </div>
        ))}
        {posts.length === 0 && <p className="text-[var(--text-muted)]">No posts yet.</p>}
      </div>
    </div>
  )
}
