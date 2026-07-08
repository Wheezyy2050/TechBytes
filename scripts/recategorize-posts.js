// Usage: node scripts/recategorize-posts.js
// Re-runs category-matching logic against all existing posts

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
const prisma = new PrismaClient()

// Must match the logic in src/app/api/cron/fetch-news/route.js
function mapCategory(title, description) {
  const text = `${title} ${description}`.toLowerCase()

  if (/\b(pixel|galaxy|iphone|oneplus|xiaomi|huawei|oppo|vivo|nothing phone|motorola|nokia|sony|asus rog|foldable|smartphone|android|ios|ipados|app store|google play|ipad|samsung|5g|tablet)\b/.test(text)) return 'mobile'
  if (/\b(hack|breach|vulnerability|cyber|malware|ransomware|security|privacy|encryption|phishing|zero day|exploit)\b/.test(text)) return 'security'
  if (/\b(gpt|openai|chatgpt|claude|anthropic|midjourney|llama|machine learning|deep learning|neural network|llm|large language model|stable diffusion|dall.e)\b/.test(text)) return 'ai'
  if (/\b(react|javascript|typescript|next\.js|node\.js|npm|css|frontend|backend|api|web dev|webpack|babel)\b/.test(text)) return 'web-dev'
  if (/\b(movie|film|review|trailer|hollywood|netflix|disney|game|gaming|playstation|xbox|nintendo|streaming|tv show|entertainment|album|song|music)\b/.test(text)) return 'entertainment'
  if (/\b(science|research|study|space|nasa|physics|biology|climate|quantum|dna|gene|astronomy|particle)\b/.test(text)) return 'science'

  return 'tech-news'
}

async function main() {
  const cats = await prisma.category.findMany()
  const slugToId = new Map()
  for (const c of cats) slugToId.set(c.slug, c.id)

  const posts = await prisma.post.findMany({
    where: { published: true },
    include: { category: true },
    orderBy: { createdAt: 'desc' },
  })

  console.log(`Found ${posts.length} published posts\n`)

  let updated = 0
  let skipped = 0

  for (const post of posts) {
    const text = `${post.title} ${post.excerpt}`
    const newSlug = mapCategory(post.title, post.excerpt)
    const newId = slugToId.get(newSlug) || null
    const oldName = post.category?.name || 'none'
    const newName = cats.find(c => c.slug === newSlug)?.name || newSlug

    if (post.categoryId === newId) {
      skipped++
      continue
    }

    await prisma.post.update({
      where: { id: post.id },
      data: { categoryId: newId },
    })

    console.log(`  [${post.id}] "${post.title.slice(0, 55)}..."`)
    console.log(`         ${oldName.padEnd(25)} → ${newName}`)
    updated++
  }

  console.log(`\nDone. Updated: ${updated}, Unchanged: ${skipped}`)
  await prisma.$disconnect()
}

main().catch(err => {
  console.error('Fatal:', err)
  process.exit(1)
})
