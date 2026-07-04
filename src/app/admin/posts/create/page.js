'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function CreatePost() {
  const [form, setForm] = useState({ title: '', slug: '', excerpt: '', content: '', published: true, featuredImage: '', categoryId: '' })
  const [categories, setCategories] = useState([])
  const [saving, setSaving] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetch('/api/categories').then(r => r.json()).then(setCategories)
  }, [])

  const generateSlug = title => title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

  const handleTitleChange = e => {
    const title = e.target.value
    setForm(f => ({ ...f, title, slug: generateSlug(title) }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setSaving(true)
    await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, categoryId: form.categoryId ? Number(form.categoryId) : null }),
    })
    router.push('/admin/posts')
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">New Post</h1>
      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        <div>
          <label className="text-xs uppercase tracking-wider text-[#666] block mb-2">Title</label>
          <input type="text" required className="w-full bg-[#fafafa] border border-[#e0e0e0] rounded p-3 text-sm focus:outline-none focus:border-black" value={form.title} onChange={handleTitleChange} />
        </div>
        <div>
          <label className="text-xs uppercase tracking-wider text-[#666] block mb-2">Slug</label>
          <input type="text" required className="w-full bg-[#fafafa] border border-[#e0e0e0] rounded p-3 text-sm focus:outline-none focus:border-black" value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs uppercase tracking-wider text-[#666] block mb-2">Category</label>
            <select className="w-full bg-[#fafafa] border border-[#e0e0e0] rounded p-3 text-sm focus:outline-none focus:border-black" value={form.categoryId} onChange={e => setForm(f => ({ ...f, categoryId: e.target.value }))}>
              <option value="">Uncategorized</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs uppercase tracking-wider text-[#666] block mb-2">Featured Image URL</label>
            <input type="url" className="w-full bg-[#fafafa] border border-[#e0e0e0] rounded p-3 text-sm focus:outline-none focus:border-black" value={form.featuredImage} onChange={e => setForm(f => ({ ...f, featuredImage: e.target.value }))} placeholder="https://..." />
          </div>
        </div>
        <div>
          <label className="text-xs uppercase tracking-wider text-[#666] block mb-2">Excerpt</label>
          <input type="text" required className="w-full bg-[#fafafa] border border-[#e0e0e0] rounded p-3 text-sm focus:outline-none focus:border-black" value={form.excerpt} onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))} />
        </div>
        <div>
          <label className="text-xs uppercase tracking-wider text-[#666] block mb-2">Content (Markdown)</label>
          <textarea required rows={16} className="w-full bg-[#fafafa] border border-[#e0e0e0] rounded p-3 text-sm font-mono focus:outline-none focus:border-black" value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} />
        </div>
        <div className="flex items-center gap-3">
          <input type="checkbox" id="published" checked={form.published} onChange={e => setForm(f => ({ ...f, published: e.target.checked }))} />
          <label htmlFor="published" className="text-sm">Published</label>
        </div>
        <button type="submit" disabled={saving} className="bg-black text-white px-6 py-3 rounded font-bold hover:opacity-80 disabled:opacity-50">
          {saving ? 'Saving...' : 'Create Post'}
        </button>
      </form>
    </div>
  )
}
