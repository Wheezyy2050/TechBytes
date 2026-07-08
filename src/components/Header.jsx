'use client'
import Link from 'next/link'

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-[var(--border)] px-6 md:px-10 py-5 flex items-center justify-between bg-white">
      <Link href="/" className="text-lg font-bold tracking-tight text-[var(--text-primary)]">
        Tech<span className="text-[var(--accent)]">Bytes</span>
      </Link>
      <nav className="flex gap-6 text-sm text-[var(--text-muted)]">
        <Link href="/" className="hover:text-[var(--accent)] transition-colors">Home</Link>
        <a href="https://github.com/Wheezyy2050" target="_blank" rel="noreferrer" className="hover:text-[var(--accent)] transition-colors">GitHub</a>
      </nav>
    </header>
  )
}
