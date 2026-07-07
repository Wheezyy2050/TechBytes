import './globals.css'
import Header from '@/components/Header'

export const metadata = {
  title: 'Tech Bytes — Latest Tech News',
  description: 'Your daily dose of tech news — AI, web dev, cybersecurity, and more.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main className="min-h-screen">{children}</main>
        <footer className="border-t border-[var(--border)] py-10 px-6 md:px-10 text-center text-sm text-[var(--text-muted)]">
          &copy; {new Date().getFullYear()} TechBytes
        </footer>
      </body>
    </html>
  )
}
