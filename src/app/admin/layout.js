'use client'
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'

export default function AdminLayout({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(data => {
        if (!data.authenticated && !pathname.includes('/login')) router.push('/admin/login')
        else setUser(data.user)
      })
      .catch(() => router.push('/admin/login'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="min-h-screen bg-white flex items-center justify-center text-[var(--text-muted)]">Loading...</div>

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  const isActive = (path) => {
    if (path === '/admin') return pathname === '/admin'
    return pathname.startsWith(path)
  }

  return (
    <div className="min-h-screen bg-white">
      {!pathname.includes('/login') && (
        <div className="flex">
          <aside className="w-56 border-r border-[var(--border)] bg-[#fafafa] min-h-screen p-6 flex flex-col justify-between">
            <div>
              <Link href="/admin" className="text-lg font-bold tracking-tight mb-8 block text-[var(--text-primary)]">
                CMS<span className="text-[var(--accent)]">.</span>
              </Link>
              <nav className="space-y-1 text-sm">
                <Link
                  href="/admin"
                  className={`block py-2 px-3 border-l-2 transition-colors ${
                    isActive('/admin') && !pathname.includes('/posts')
                      ? 'border-[var(--accent)] text-[var(--accent)] font-medium bg-[var(--accent)]/5'
                      : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:border-[var(--border)]'
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  href="/admin/posts"
                  className={`block py-2 px-3 border-l-2 transition-colors ${
                    pathname.includes('/posts')
                      ? 'border-[var(--accent)] text-[var(--accent)] font-medium bg-[var(--accent)]/5'
                      : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:border-[var(--border)]'
                  }`}
                >
                  Posts
                </Link>
                <a
                  href="/"
                  target="_blank"
                  className="block py-2 px-3 border-l-2 border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:border-[var(--border)] transition-colors"
                >
                  View Site &rarr;
                </a>
              </nav>
            </div>
            <button
              onClick={handleLogout}
              className="text-sm text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors text-left"
            >
              Logout
            </button>
          </aside>
          <main className="flex-1 p-8">{children}</main>
        </div>
      )}
      {pathname.includes('/login') && children}
    </div>
  )
}
