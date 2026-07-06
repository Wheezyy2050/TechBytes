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

  if (loading) return <div className="min-h-screen bg-white flex items-center justify-center text-[#4a4a4a]">Loading...</div>

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  return (
    <div className="min-h-screen bg-white">
      {!pathname.includes('/login') && (
        <div className="flex">
          <aside className="w-56 border-r border-[#e0e0e0] bg-[#fafafa] min-h-screen p-6 flex flex-col justify-between">
            <div>
              <Link href="/admin" className="font-bold text-lg mb-8 block text-black">CMS</Link>
              <nav className="space-y-3 text-sm">
                <Link href="/admin" className={`block py-2 px-3 rounded ${pathname === '/admin' ? 'bg-black text-white' : 'text-[#333] hover:text-black'}`}>Dashboard</Link>
                <Link href="/admin/posts" className={`block py-2 px-3 rounded ${pathname.includes('/posts') ? 'bg-black text-white' : 'text-[#333] hover:text-black'}`}>Posts</Link>
                <a href="/" target="_blank" className="block py-2 px-3 text-[#333] hover:text-black">View Site →</a>
              </nav>
            </div>
            <button onClick={handleLogout} className="text-sm text-[#4a4a4a] hover:text-black">Logout</button>
          </aside>
          <main className="flex-1 p-8">{children}</main>
        </div>
      )}
      {pathname.includes('/login') && children}
    </div>
  )
}
