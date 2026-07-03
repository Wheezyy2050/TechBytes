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

  if (loading) return <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-[#555]">Loading...</div>

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {!pathname.includes('/login') && (
        <div className="flex">
          <aside className="w-56 border-r border-[#1e1e1e] bg-[#111] min-h-screen p-6 flex flex-col justify-between">
            <div>
              <Link href="/admin" className="font-bold text-lg mb-8 block">CMS</Link>
              <nav className="space-y-3 text-sm">
                <Link href="/admin" className={`block py-2 px-3 rounded ${pathname === '/admin' ? 'bg-[#e8ff47]/10 text-[#e8ff47]' : 'text-[#555] hover:text-white'}`}>Dashboard</Link>
                <Link href="/admin/posts" className={`block py-2 px-3 rounded ${pathname.includes('/posts') ? 'bg-[#e8ff47]/10 text-[#e8ff47]' : 'text-[#555] hover:text-white'}`}>Posts</Link>
                <a href="/" target="_blank" className="block py-2 px-3 text-[#555] hover:text-white">View Site →</a>
              </nav>
            </div>
            <button onClick={handleLogout} className="text-sm text-red-400 hover:text-red-300">Logout</button>
          </aside>
          <main className="flex-1 p-8">{children}</main>
        </div>
      )}
      {pathname.includes('/login') && children}
    </div>
  )
}
