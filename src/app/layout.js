import './globals.css'
import Header from '@/components/Header'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://tech-bytes-tau.vercel.app'

export const metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'TechBytes — Latest Tech News',
    template: '%s — TechBytes',
  },
  description: 'Your daily dose of tech news covering mobile, AI, cybersecurity, web development, and more.',
  openGraph: {
    siteName: 'TechBytes',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main className="min-h-screen pt-16">{children}</main>
        <footer className="border-t border-[var(--border)] py-10 px-6 md:px-10 text-center text-sm text-[var(--text-muted)]">
          &copy; {new Date().getFullYear()} TechBytes
        </footer>
      </body>
    </html>
  )
}
