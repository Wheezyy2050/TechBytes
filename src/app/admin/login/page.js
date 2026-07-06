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
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm border border-[#e0e0e0] bg-white p-8 rounded-lg shadow-sm">
        <h1 className="text-2xl font-bold mb-6 text-black">Admin Login</h1>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <div className="mb-4">
          <label className="text-xs uppercase tracking-wider text-[#333] block mb-2">Username</label>
          <input type="text" required className="w-full bg-[#fafafa] border border-[#e0e0e0] rounded p-3 text-sm focus:outline-none focus:border-black" value={form.username} onChange={e => setForm(f => ({ ...f, username: e.target.value }))} />
        </div>
        <div className="mb-6">
          <label className="text-xs uppercase tracking-wider text-[#333] block mb-2">Password</label>
          <input type="password" required className="w-full bg-[#fafafa] border border-[#e0e0e0] rounded p-3 text-sm focus:outline-none focus:border-black" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
        </div>
        <button type="submit" className="w-full bg-black text-white font-bold py-3 rounded hover:opacity-80 transition-opacity">
          Sign In
        </button>
      </form>
    </div>
  )
}
