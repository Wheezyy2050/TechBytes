'use client'
import { useState } from 'react'

export default function NewsletterSubscribe() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('loading')
    setMessage('')

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      setStatus(res.ok ? 'success' : 'error')
      setMessage(data.message || data.error || 'Something went wrong')
      if (res.ok) setEmail('')
    } catch {
      setStatus('error')
      setMessage('Something went wrong')
    }
  }

  return (
    <div className="border-t border-[var(--border)] pt-8">
      <h3 className="text-sm font-semibold mb-2 text-[var(--text-primary)]">
        Stay Updated
      </h3>
      <p className="text-sm text-[var(--text-muted)] mb-4 leading-relaxed">
        Get the latest tech news delivered to your inbox.
      </p>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          required
          placeholder="Enter your email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="flex-1 min-w-0 px-3 py-2.5 text-sm border border-[#d0d0d0] bg-white text-[var(--text-primary)] placeholder:text-[#b0b0b0] focus:outline-none focus:border-[var(--accent)] transition-colors"
          disabled={status === 'loading'}
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="px-5 py-2.5 text-sm font-medium bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] transition-colors whitespace-nowrap disabled:opacity-50"
        >
          {status === 'loading' ? 'Sending…' : 'Subscribe'}
        </button>
      </form>
      {message && (
        <p className={`text-xs mt-2 ${status === 'success' ? 'text-[var(--text-muted)]' : ''}`}
           style={status === 'error' ? { color: '#c44' } : {}}>
          {message}
        </p>
      )}
    </div>
  )
}
