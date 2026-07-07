'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLogin() {
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (!res.ok) return setError('Invalid username or password')
    router.push('/admin')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg)] px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm border border-[var(--border)] bg-white p-8">
        <h1 className="text-xl font-bold mb-6 text-[var(--text-primary)]">
          Admin<span className="text-[var(--accent)]">.</span>
        </h1>
        {error && <p className="text-sm mb-4" style={{ color: '#c44' }}>{error}</p>}
        <div className="mb-4">
          <label className="text-xs uppercase tracking-wider text-[var(--text-muted)] block mb-2">Username</label>
          <input type="text" required className="w-full bg-[var(--bg)] border border-[var(--border)] p-3 text-sm focus:outline-none focus:border-[var(--accent)] transition-colors text-[var(--text-primary)]" value={form.username} onChange={e => setForm(f => ({ ...f, username: e.target.value }))} />
        </div>
        <div className="mb-6">
          <label className="text-xs uppercase tracking-wider text-[var(--text-muted)] block mb-2">Password</label>
          <input type="password" required className="w-full bg-[var(--bg)] border border-[var(--border)] p-3 text-sm focus:outline-none focus:border-[var(--accent)] transition-colors text-[var(--text-primary)]" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
        </div>
        <button type="submit" className="w-full bg-[var(--accent)] text-white font-medium py-3 hover:bg-[var(--accent-hover)] transition-colors text-sm">
          Sign In
        </button>
      </form>
    </div>
  )
}
