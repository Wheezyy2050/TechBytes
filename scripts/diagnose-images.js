// Run: node scripts/diagnose-images.js
// Diagnoses what image URLs are stored and what feeds actually provide

const { PrismaClient } = require('@prisma/client')
const Parser = require('rss-parser')

const prisma = new PrismaClient()

const FEEDS = [
  'https://9to5google.com/feed/',
  'https://www.androidauthority.com/feed/',
  'https://www.gsmarena.com/rss-news-reviews.php3',
  'https://techcrunch.com/feed/',
  'https://www.theverge.com/mobile/rss/index.xml',
]

async function main() {
  // ── Part 1: What's in the database? ──
  console.log('═══ STORED IMAGE URLS ═══\n')
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: 'desc' },
    take: 20,
  })
  for (const post of posts) {
    const img = post.featuredImage || '(empty)'
    console.log(`[${post.id}] ${post.title.slice(0, 60)}`)
    console.log(`      URL: ${img.slice(0, 120)}`)
    console.log()
  }

  // ── Part 2: What do the feeds actually provide? ──
  console.log('\n═══ RAW FEED INSPECTION ═══\n')

  for (const feedUrl of FEEDS) {
    try {
      console.log(`\n--- ${feedUrl} ---`)
      const parser = new Parser()
      const data = await parser.parseURL(feedUrl)
      const item = data.items[0]
      if (!item) { console.log('  No items'); continue }

      console.log(`  Title: ${item.title}`)

      // enclosure
      if (item.enclosure) {
        console.log(`  enclosure: ${JSON.stringify(item.enclosure)}`)
      } else {
        console.log(`  enclosure: (none)`)
      }

      // media:content — dump ALL entries
      const mc = item['media:content']
      if (mc) {
        const arr = Array.isArray(mc) ? mc : [mc]
        console.log(`  media:content (${arr.length} entries):`)
        for (let i = 0; i < arr.length; i++) {
          const attrs = arr[i]?.$ || {}
          console.log(`    [${i}] url: ${(attrs.url || '(none)').slice(0, 120)}`)
          console.log(`         width: ${attrs.width || '?'}, height: ${attrs.height || '?'}, medium: ${attrs.medium || '?'}`)
        }
      } else {
        console.log(`  media:content: (none — parser likely needs customFields config)`)
      }

      // First <img> in content
      const html = item.content || item.description || ''
      const imgs = [...html.matchAll(/<img[^>]+src=["']([^"']+)["'][^>]*>/gi)]
      if (imgs.length > 0) {
        console.log(`  First <img> in content: ${imgs[0][1].slice(0, 120)}`)
        if (imgs.length > 1) {
          console.log(`  Total <img> tags found: ${imgs.length}`)
        }
      } else {
        console.log(`  <img> in content: (none)`)
      }

      console.log()
    } catch (err) {
      console.error(`  ERROR: ${err.message}\n`)
    }
  }

  await prisma.$disconnect()
}

main().catch(err => { console.error(err); process.exit(1) })
