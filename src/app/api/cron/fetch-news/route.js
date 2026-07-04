import { NextResponse } from 'next/server'
import Parser from 'rss-parser'
import prisma from '@/lib/prisma'

const parser = new Parser()

const FEEDS = [
  { url: 'https://techcrunch.com/feed/' },
  { url: 'https://www.theverge.com/rss/index.xml' },
  { url: 'https://feeds.arstechnica.com/arstechnica/index' },
]

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
    .slice(0, 100)
}

function mapCategory(title, description) {
  const text = `${title} ${description}`.toLowerCase()
  if (/ai|artificial intelligence|gpt|machine learning|deep learning|neural|llm|openai|chatgpt|claude|gemini/.test(text)) return 'ai'
  if (/hack|breach|vulnerability|cyber|malware|ransomware|security|privacy|encryption|phishing/.test(text)) return 'security'
  if (/react|javascript|framework|typescript|next\.js|web dev|css|frontend|backend|api|node\.js|npm/.test(text)) return 'web-dev'
  if (/ios|android|mobile|iphone|smartphone|app store|google play/.test(text)) return 'mobile'
  return 'tech-news'
}

function getSourceName(url) {
  const domain = new URL(url).hostname.replace('www.', '')
  const map = {
    'techcrunch.com': 'TechCrunch',
    'theverge.com': 'The Verge',
    'arstechnica.com': 'Ars Technica',
  }
  return map[domain] || domain.split('.')[0]
}

function stripHtml(html) {
  return html?.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim() || ''
}

export async function GET() {
  const results = { fetched: 0, skipped: 0, published: 0, errors: [] }

  const categoryMap = new Map()
  const cats = await prisma.category.findMany()
  for (const c of cats) categoryMap.set(c.slug, c.id)

  for (const feed of FEEDS) {
    try {
      const data = await parser.parseURL(feed.url)
      const items = data.items.slice(0, 3)

      for (const item of items) {
        results.fetched++
        const sourceUrl = item.link || ''
        const sourceName = getSourceName(sourceUrl)

        const existing = await prisma.post.findFirst({ where: { sourceUrl } })
        if (existing) {
          results.skipped++
          continue
        }

        const title = item.title || 'Untitled'
        const slug = slugify(title) + '-' + Date.now()
        const description = stripHtml(item.contentSnippet || item.content || item.description || '')
        const excerpt = description.slice(0, 150)
        const pubDate = item.pubDate ? new Date(item.pubDate) : new Date()
        const categorySlug = mapCategory(title, description)
        const categoryId = categoryMap.get(categorySlug) || null

        await prisma.post.create({
          data: {
            title,
            slug,
            content: description,
            excerpt,
            published: true,
            createdAt: pubDate,
            categoryId,
            sourceUrl,
            sourceName,
            author: 'TechBytes Curated',
          },
        })

        results.published++
      }
    } catch (err) {
      results.errors.push(`${feed.url}: ${err.message}`)
    }
  }

  return NextResponse.json({
    message: 'Cron completed',
    ...results,
  })
}
