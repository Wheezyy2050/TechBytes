'use client'
import Link from 'next/link'

export default function Header() {
  return (
    <header className="border-b border-[#e0e0e0] px-8 py-5 flex items-center justify-between bg-white">
      <Link href="/" className="font-bold text-lg tracking-tight text-black">
        Tech<span className="text-black">Bytes</span>
      </Link>
      <nav className="flex gap-8 text-sm text-[#666]">
        <Link href="/" className="hover:text-black transition-colors">Home</Link>
        <a href="https://github.com/Wheezyy2050" target="_blank" rel="noreferrer" className="hover:text-black transition-colors">GitHub</a>
        <a href="https://linkedin.com/in/churchillmgamba" target="_blank" rel="noreferrer" className="hover:text-black transition-colors">LinkedIn</a>
      </nav>
    </header>
  )
}
