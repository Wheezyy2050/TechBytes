// Usage: node scripts/test-email.js you@example.com
// Sends a sample digest email to test Resend delivery

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

const { Resend } = require('resend')

const email = process.argv[2]
if (!email) {
  console.error('Usage: node scripts/test-email.js you@example.com')
  process.exit(1)
}

const apiKey = process.env.RESEND_API_KEY
if (!apiKey) {
  console.error('Error: RESEND_API_KEY not found in environment or .env file')
  process.exit(1)
}

const resend = new Resend(apiKey)
const BASE_URL = 'https://tech-bytes-tau.vercel.app'

const posts = [
  {
    title: 'Google Pixel 10 Pro Review: The Camera King Returns',
    slug: 'google-pixel-10-pro-review',
    excerpt: 'Google\'s latest flagship brings meaningful camera improvements and seven years of OS updates. We put it through our full suite of tests.',
    author: 'TechBytes Curated',
    sourceName: 'Android Authority',
  },
  {
    title: 'Apple Finally Adds RCS Support in iOS 19 Update',
    slug: 'apple-rcs-support-ios-19',
    excerpt: 'After years of resistance, Apple is embracing the messaging standard. Here\'s what changes for iPhone and Android users alike.',
    author: 'TechBytes Curated',
    sourceName: '9to5Google',
  },
  {
    title: 'Qualcomm Snapdragon 8 Gen 5: Everything We Know So Far',
    slug: 'qualcomm-snapdragon-8-gen-5',
    excerpt: 'Leaks point to major GPU and AI improvements in Qualcomm\'s next flagship chipset, expected to launch later this year.',
    author: 'TechBytes Curated',
    sourceName: 'GSMArena',
  },
]

const itemsHtml = posts.map(p => `
    <tr>
      <td style="padding: 0 0 24px 0;">
        <table cellpadding="0" cellspacing="0" style="width: 100%;">
          <tr>
            <td style="font-size: 16px; font-weight: 700; color: #1a1a1a; padding: 0 0 4px 0;">
              <a href="${BASE_URL}/posts/${p.slug}" style="color: #1a1a1a; text-decoration: none;">${p.title}</a>
            </td>
          </tr>
          <tr>
            <td style="font-size: 14px; color: #555; line-height: 1.5; padding: 0 0 8px 0;">
              ${p.excerpt}
            </td>
          </tr>
          <tr>
            <td style="font-size: 13px; color: #6b6b6b;">
              ${p.author} &middot; ${p.sourceName}
            </td>
          </tr>
        </table>
      </td>
    </tr>
`).join('')

const unsubscribeLink = `${BASE_URL}/api/unsubscribe?email=${encodeURIComponent(email)}`

const html = `
<table cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; font-family: -apple-system, 'Segoe UI', sans-serif;">
  <tr>
    <td style="padding: 32px 0 16px 0; border-bottom: 1px solid #e8e8e8;">
      <span style="font-size: 20px; font-weight: 700; color: #1a1a1a;">Tech<span style="color: #1a7a7a;">Bytes</span></span>
    </td>
  </tr>
  <tr>
    <td style="padding: 24px 0 4px 0; font-size: 14px; color: #6b6b6b;">
      Latest stories from TechBytes (test email)
    </td>
  </tr>
  ${itemsHtml}
  <tr>
    <td style="padding: 16px 0 0 0; border-top: 1px solid #e8e8e8; font-size: 12px; color: #6b6b6b;">
      <a href="${unsubscribeLink}" style="color: #6b6b6b; text-decoration: underline;">Unsubscribe</a>
    </td>
  </tr>
</table>
`

async function main() {
  console.log(`Sending test digest to ${email}...`)

  try {
    const result = await resend.emails.send({
      from: 'TechBytes <onboarding@resend.dev>',
      to: email,
      subject: 'New on TechBytes: 3 new stories (test)',
      html,
    })

    console.log(`\n✓ Success! Email sent.`)
    console.log(`  ID: ${result.id || result.data?.id || 'see above'}`)
  } catch (err) {
    console.error(`\n✗ Failed to send: ${err.message}`)
    if (err.response) {
      console.error(`  Response: ${JSON.stringify(err.response)}`)
    }
    process.exit(1)
  }
}

main()
