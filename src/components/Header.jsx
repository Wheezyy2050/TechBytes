'use client'
import Link from 'next/link'

export default function Header() {
  return (
    <header className="border-b border-[#1e1e1e] px-8 py-5 flex items-center justify-between">
      <Link href="/" className="font-bold text-lg tracking-tight">
        Tech<span className="text-[#e8ff47]">Bytes</span>
      </Link>
      <nav className="flex gap-8 text-sm text-[#555]">
        <Link href="/" className="hover:text-[#e8ff47] transition-colors">Home</Link>
        <a href="https://github.com/Wheezyy2050" target="_blank" rel="noreferrer" className="hover:text-[#e8ff47] transition-colors">GitHub</a>
        <a href="https://linkedin.com/in/churchillmgamba" target="_blank" rel="noreferrer" className="hover:text-[#e8ff47] transition-colors">LinkedIn</a>
      </nav>
    </header>
  )
}
