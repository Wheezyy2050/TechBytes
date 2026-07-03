const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  const hashed = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 10)
  await prisma.user.upsert({
    where: { username: process.env.ADMIN_USERNAME || 'admin' },
    update: { password: hashed },
    create: {
      username: process.env.ADMIN_USERNAME || 'admin',
      password: hashed,
    },
  })

  const categories = [
    { name: 'AI & Machine Learning', slug: 'ai' },
    { name: 'Web Development', slug: 'web-dev' },
    { name: 'Mobile', slug: 'mobile' },
    { name: 'Cybersecurity', slug: 'security' },
    { name: 'Tech News', slug: 'tech-news' },
  ]

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name },
      create: cat,
    })
  }

  const allCats = await prisma.category.findMany()
  const catMap = Object.fromEntries(allCats.map(c => [c.slug, c.id]))

  const posts = [
    {
      title: 'OpenAI GPT-5: What We Know So Far',
      slug: 'openai-gpt-5',
      excerpt: 'Rumors are swirling about the next generation of OpenAI\'s language model. Here\'s a roundup of everything that has been leaked or announced.',
      content: `# OpenAI GPT-5: What We Know So Far\n\nThe AI community is buzzing with speculation about GPT-5. While OpenAI has remained tight-lipped, several clues have emerged.\n\n## Improved Reasoning\n\nEarly benchmarks suggest GPT-5 will feature significantly improved reasoning capabilities, particularly in mathematics and coding tasks.\n\n## Multimodal by Default\n\nUnlike GPT-4 which added vision later, GPT-5 is expected to be natively multimodal — handling text, images, audio, and video out of the box.\n\n## When?\n\nMost predictions point to a late 2025 or early 2026 release. Stay tuned.`,
      categorySlug: 'ai',
      featuredImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80',
    },
    {
      title: 'React 19: New Features You Need to Know',
      slug: 'react-19-new-features',
      excerpt: 'React 19 is here with server components, improved hydration, and a new compiler. Here\'s what changed and why it matters.',
      content: `# React 19: New Features You Need to Know\n\nReact 19 introduces several groundbreaking features that change how we think about building user interfaces.\n\n## React Server Components (RSC)\n\nServer Components allow you to render components entirely on the server, reducing bundle size and improving performance.\n\n## New Compiler\n\nThe new React Compiler (formerly "React Forget") automatically memoizes components and hooks, eliminating the need for useMemo and useCallback in most cases.\n\n## Actions API\n\nForm handling gets a major upgrade with the new Actions API, making form submissions and mutations more intuitive.\n\nReact 19 is a significant step forward for the ecosystem.`,
      categorySlug: 'web-dev',
      featuredImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80',
    },
    {
      title: 'Major Security Flaw Discovered in Popular npm Package',
      slug: 'npm-security-flaw',
      excerpt: 'A critical vulnerability was found in a widely-used npm package affecting thousands of applications. Here\'s what developers need to do.',
      content: `# Major Security Flaw Discovered in Popular npm Package\n\nA critical remote code execution vulnerability was discovered this week in one of npm's most downloaded packages.\n\n## The Impact\n\nOver 50,000 projects are estimated to be affected, including several Fortune 500 companies.\n\n## What To Do\n\n1. Check if your project uses the affected package\n2. Update to the patched version immediately\n3. Audit your dependencies with \`npm audit\`\n\n## Lessons Learned\n\nThis incident is a reminder of the importance of supply chain security. Consider using tools like Socket or Snyk to monitor your dependencies.`,
      categorySlug: 'security',
      featuredImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80',
    },
  ]

  for (const post of posts) {
    const { categorySlug, ...data } = post
    await prisma.post.upsert({
      where: { slug: post.slug },
      update: { ...data, categoryId: catMap[categorySlug] },
      create: { ...data, categoryId: catMap[categorySlug] },
    })
  }

  console.log('Database seeded successfully!')
}

main().catch(e => { console.error(e); process.exit(1) }).finally(() => prisma.$disconnect())
