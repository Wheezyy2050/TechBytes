const fs = require('fs')
const path = require('path')

const envPath = path.resolve(__dirname, '../.env')
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, 'utf-8').split('\n')
  for (const line of lines) {
    const match = line.match(/^\s*([\w._-]+)\s*=\s*(.*?)\s*$/)
    if (match) {
      let val = match[2].replace(/^["']|["']$/g, '')
      process.env[match[1]] = val
    }
  }
}

const { PrismaClient } = require('@prisma/client')
const Parser = require('rss-parser')

const prisma = new PrismaClient()
const parser = new Parser({
  customFields: {
    item: ['media:content'],
  },
})

const FEEDS = [
  'https://9to5google.com/feed/',
  'https://www.androidauthority.com/feed/',
  'https://www.gsmarena.com/rss-news-reviews.php3',
  'https://techcrunch.com/feed/',
  'https://www.theverge.com/rss/index.xml',
]

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

function preferLargestImageUrl(url) {
  if (!url) return url
  url = url.replace(/\/-\d+x\d+\//, '/')
  return url
}

function extractImage(item) {
  if (item.enclosure?.url && item.enclosure?.type?.startsWith('image/')) {
    return preferLargestImageUrl(decodeHtmlEntities(item.enclosure.url))
  }

  const mc = item['media:content']
  if (mc) {
    const entries = Array.isArray(mc) ? mc : [mc]
    let best = null
    let bestWidth = 0
    for (const entry of entries) {
      const url = entry?.$?.url
      if (!url) continue
      if (entry.$.medium && entry.$.medium !== 'image') continue
      const w = parseInt(entry.$.width, 10) || 0
      if (w > bestWidth || !best) {
        best = url
        bestWidth = w
      }
    }
    if (best) return preferLargestImageUrl(decodeHtmlEntities(best))
    const last = entries[entries.length - 1]?.$?.url
    if (last) return preferLargestImageUrl(decodeHtmlEntities(last))
  }

  const html = item.content || item.description || ''
  const match = html.match(/<img[^>]+src=["']([^"']+)["']/)
  if (match) return preferLargestImageUrl(decodeHtmlEntities(match[1]))

  return ''
}

async function main() {
  const posts = await prisma.post.findMany({
    where: {
      sourceUrl: { not: '' },
      featuredImage: '',
    },
  })

  console.log(`Found ${posts.length} posts missing featuredImage`)

  if (posts.length === 0) {
    console.log('Nothing to backfill.')
    await prisma.$disconnect()
    return
  }

  const sourceToPost = new Map()
  for (const post of posts) {
    sourceToPost.set(post.sourceUrl, post)
  }

  let updated = 0

  for (const feedUrl of FEEDS) {
    try {
      const data = await parser.parseURL(feedUrl)
      console.log(`\nFetched ${data.items.length} items from ${feedUrl}`)

      for (const item of data.items) {
        const link = item.link
        if (!link || !sourceToPost.has(link)) continue

        const image = extractImage(item)
        if (!image) continue

        await prisma.post.update({
          where: { id: sourceToPost.get(link).id },
          data: { featuredImage: image },
        })

        updated++
        console.log(`  ✓ Updated: ${item.title?.slice(0, 60)}`)
        sourceToPost.delete(link)
      }
    } catch (err) {
      console.error(`  ✗ Error fetching ${feedUrl}: ${err.message}`)
    }
  }

  const remaining = sourceToPost.size
  console.log(`\nDone. Updated: ${updated}, Still missing: ${remaining}`)
  await prisma.$disconnect()
}

main().catch(err => {
  console.error('Fatal:', err)
  process.exit(1)
})
