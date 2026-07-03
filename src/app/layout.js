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
        <footer className="border-t border-[#1e1e1e] py-6 px-8 text-center text-sm text-[#555]">
          &copy; {new Date().getFullYear()} Churchill Mgamba
        </footer>
      </body>
    </html>
  )
}
