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
        <footer className="border-t border-[#e0e0e0] py-10 px-10 text-center text-sm text-[#4a4a4a]">
          &copy; {new Date().getFullYear()} TechBytes
        </footer>
      </body>
    </html>
  )
}
