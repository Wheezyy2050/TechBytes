'use client'
import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'

export default function EditPost() {
  const [form, setForm] = useState({ title: '', slug: '', excerpt: '', content: '', published: true, featuredImage: '', categoryId: '' })
  const [categories, setCategories] = useState([])
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const params = useParams()

  useEffect(() => {
    Promise.all([
      fetch('/api/posts').then(r => r.json()),
      fetch('/api/categories').then(r => r.json()),
    ]).then(([posts, cats]) => {
      setCategories(cats)
      const post = posts.find(p => p.id === Number(params.id))
      if (post) {
        setForm({
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          content: post.content,
          published: post.published,
          featuredImage: post.featuredImage || '',
          categoryId: post.categoryId ? String(post.categoryId) : '',
        })
      }
    }).finally(() => setLoading(false))
  }, [])

  const handleSubmit = async e => {
    e.preventDefault()
    setSaving(true)
    await fetch(`/api/posts/${params.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, categoryId: form.categoryId ? Number(form.categoryId) : null }),
    })
    router.push('/admin/posts')
  }

  if (loading) return <p className="text-[var(--text-muted)]">Loading...</p>

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8 text-[var(--text-primary)]">Edit Post</h1>
      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        <div>
          <label className="text-xs uppercase tracking-wider text-[var(--text-muted)] block mb-2">Title</label>
          <input type="text" required className="w-full bg-[var(--bg)] border border-[var(--border)] p-3 text-sm focus:outline-none focus:border-[var(--accent)] transition-colors text-[var(--text-primary)]" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
        </div>
        <div>
          <label className="text-xs uppercase tracking-wider text-[var(--text-muted)] block mb-2">Slug</label>
          <input type="text" required className="w-full bg-[var(--bg)] border border-[var(--border)] p-3 text-sm focus:outline-none focus:border-[var(--accent)] transition-colors text-[var(--text-primary)]" value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs uppercase tracking-wider text-[var(--text-muted)] block mb-2">Category</label>
            <select className="w-full bg-[var(--bg)] border border-[var(--border)] p-3 text-sm focus:outline-none focus:border-[var(--accent)] transition-colors text-[var(--text-primary)]" value={form.categoryId} onChange={e => setForm(f => ({ ...f, categoryId: e.target.value }))}>
              <option value="">Uncategorized</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs uppercase tracking-wider text-[var(--text-muted)] block mb-2">Featured Image URL</label>
            <input type="url" className="w-full bg-[var(--bg)] border border-[var(--border)] p-3 text-sm focus:outline-none focus:border-[var(--accent)] transition-colors text-[var(--text-primary)]" value={form.featuredImage} onChange={e => setForm(f => ({ ...f, featuredImage: e.target.value }))} placeholder="https://..." />
          </div>
        </div>
        <div>
          <label className="text-xs uppercase tracking-wider text-[var(--text-muted)] block mb-2">Excerpt</label>
          <input type="text" required className="w-full bg-[var(--bg)] border border-[var(--border)] p-3 text-sm focus:outline-none focus:border-[var(--accent)] transition-colors text-[var(--text-primary)]" value={form.excerpt} onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))} />
        </div>
        <div>
          <label className="text-xs uppercase tracking-wider text-[var(--text-muted)] block mb-2">Content (Markdown)</label>
          <textarea required rows={16} className="w-full bg-[var(--bg)] border border-[var(--border)] p-3 text-sm font-mono focus:outline-none focus:border-[var(--accent)] transition-colors text-[var(--text-primary)]" value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} />
        </div>
        <div className="flex items-center gap-3">
          <input type="checkbox" id="published" checked={form.published} onChange={e => setForm(f => ({ ...f, published: e.target.checked }))} className="accent-[var(--accent)]" />
          <label htmlFor="published" className="text-sm text-[var(--text-primary)]">Published</label>
        </div>
        <button type="submit" disabled={saving} className="bg-[var(--accent)] text-white px-6 py-3 font-medium hover:bg-[var(--accent-hover)] transition-colors disabled:opacity-50 text-sm">
          {saving ? 'Saving...' : 'Update Post'}
        </button>
      </form>
    </div>
  )
}
