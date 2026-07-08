const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://tech-bytes-tau.vercel.app'

export default function robots() {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${BASE_URL}/sitemap.xml`,
  }
}
