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
        <h1 className="text-2xl font-bold">Posts</h1>
        <Link href="/admin/posts/create" className="bg-[#e8ff47] text-[#0a0a0a] px-4 py-2 rounded text-sm font-bold hover:bg-[#d4eb00]">
          + New Post
        </Link>
      </div>
      <div className="space-y-3">
        {posts.map(post => (
          <div key={post.id} className="border border-[#1e1e1e] bg-[#111] p-5 rounded-lg flex items-center justify-between">
            <div>
              <h3 className="font-bold">{post.title}</h3>
              <p className="text-xs text-[#555] mt-1">
                {post.category?.name || 'Uncategorized'} · {post.published ? 'Published' : 'Draft'} · {new Date(post.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex gap-3">
              <Link href={`/admin/posts/${post.id}/edit`} className="text-sm text-[#e8ff47] hover:underline">Edit</Link>
              <button onClick={() => handleDelete(post.id)} className="text-sm text-red-400 hover:underline">Delete</button>
            </div>
          </div>
        ))}
        {posts.length === 0 && <p className="text-[#555]">No posts yet.</p>}
      </div>
    </div>
  )
}
