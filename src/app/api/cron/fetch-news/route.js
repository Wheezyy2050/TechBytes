import { NextResponse } from 'next/server'
import Parser from 'rss-parser'
import prisma from '@/lib/prisma'

const parser = new Parser()

const FEEDS = [
  { url: 'https://9to5google.com/feed/', count: 4 },
  { url: 'https://www.androidauthority.com/feed/', count: 4 },
  { url: 'https://www.gsmarena.com/rss-news-reviews.php3', count: 4 },
  { url: 'https://techcrunch.com/feed/', count: 2 },
  { url: 'https://www.theverge.com/mobile/rss/index.xml', count: 2 },
]

const CATEGORIES = [
  { slug: 'ai', name: 'AI & Machine Learning' },
  { slug: 'web-dev', name: 'Web Development' },
  { slug: 'mobile', name: 'Mobile & Phones' },
  { slug: 'security', name: 'Cybersecurity' },
  { slug: 'tech-news', name: 'General Tech' },
  { slug: 'entertainment', name: 'Entertainment' },
  { slug: 'science', name: 'Science' },
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

  if (/\b(pixel|galaxy|iphone|oneplus|xiaomi|huawei|oppo|vivo|nothing phone|motorola|nokia|sony|asus rog|foldable|smartphone|android|ios|ipados|app store|google play|ipad|samsung|5g|tablet)\b/.test(text)) return 'mobile'
  if (/\b(gpt|openai|chatgpt|claude|gemini|llama|machine learning|deep learning|neural network|llm|large language model)\b/.test(text)) return 'ai'
  if (/\b(hack|breach|vulnerability|cyber|malware|ransomware|security|privacy|encryption|phishing|zero day|exploit)\b/.test(text)) return 'security'
  if (/\b(react|javascript|typescript|next\.js|node\.js|npm|css|frontend|backend|api|web dev|webpack|babel)\b/.test(text)) return 'web-dev'
  if (/\b(movie|film|review|trailer|hollywood|netflix|disney|game|gaming|playstation|xbox|nintendo|streaming|tv show|entertainment|album|song|music)\b/.test(text)) return 'entertainment'
  if (/\b(science|research|study|space|nasa|physics|biology|climate|quantum|dna|gene|astronomy|particle)\b/.test(text)) return 'science'

  return 'tech-news'
}

function getSourceName(url) {
  const domain = new URL(url).hostname.replace('www.', '')
  const map = {
    'techcrunch.com': 'TechCrunch',
    'theverge.com': 'The Verge',
    '9to5google.com': '9to5Google',
    'androidauthority.com': 'Android Authority',
    'gsmarena.com': 'GSMArena',
  }
  return map[domain] || domain.split('.')[0]
}

function stripHtml(html) {
  return html?.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim() || ''
}

function decodeHtmlEntities(str) {
  if (!str) return str
  return str
    .replace(/&#038;/g, '&')
    .replace(/&amp;/g, '&')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, '/')
}

function extractImage(item) {
  if (item.enclosure?.url && item.enclosure?.type?.startsWith('image/')) {
    return decodeHtmlEntities(item.enclosure.url)
  }

  if (item['media:content']?.$?.url) {
    return decodeHtmlEntities(item['media:content'].$.url)
  }

  const html = item.content || item.description || ''
  const match = html.match(/<img[^>]+src=["']([^"']+)["']/)
  if (match) return decodeHtmlEntities(match[1])

  return ''
}

export async function GET() {
  const results = { fetched: 0, skipped: 0, published: 0, errors: [] }

  for (const cat of CATEGORIES) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name },
      create: { slug: cat.slug, name: cat.name },
    })
  }

  const categoryMap = new Map()
  const cats = await prisma.category.findMany()
  for (const c of cats) categoryMap.set(c.slug, c.id)

  for (const feed of FEEDS) {
    try {
      const data = await parser.parseURL(feed.url)
      const items = data.items.slice(0, feed.count)

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
        const featuredImage = extractImage(item)

        await prisma.post.create({
          data: {
            title,
            slug,
            content: description,
            excerpt,
            featuredImage,
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
