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
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm border border-[#1e1e1e] bg-[#111] p-8 rounded-lg">
        <h1 className="text-2xl font-bold mb-6">Admin Login</h1>
        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
        <div className="mb-4">
          <label className="text-xs uppercase tracking-wider text-[#555] block mb-2">Username</label>
          <input type="text" required className="w-full bg-[#0a0a0a] border border-[#1e1e1e] rounded p-3 text-sm focus:outline-none focus:border-[#e8ff47]" value={form.username} onChange={e => setForm(f => ({ ...f, username: e.target.value }))} />
        </div>
        <div className="mb-6">
          <label className="text-xs uppercase tracking-wider text-[#555] block mb-2">Password</label>
          <input type="password" required className="w-full bg-[#0a0a0a] border border-[#1e1e1e] rounded p-3 text-sm focus:outline-none focus:border-[#e8ff47]" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
        </div>
        <button type="submit" className="w-full bg-[#e8ff47] text-[#0a0a0a] font-bold py-3 rounded hover:bg-[#d4eb00] transition-colors">
          Sign In
        </button>
      </form>
    </div>
  )
}
