import { Resend } from 'resend'
import prisma from '@/lib/prisma'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

const FROM = 'TechBytes <onboarding@resend.dev>'
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL
  || (process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`)
  || 'https://tech-bytes-tau.vercel.app'

export async function sendDigest(posts) {
  if (!resend) {
    console.log('Email skipped: RESEND_API_KEY not set')
    return
  }
  if (posts.length === 0) return

  const subject = `New on TechBytes: ${posts.length} new ${posts.length === 1 ? 'story' : 'stories'}`

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
              ${p.author || 'TechBytes'} &middot; ${p.sourceName || ''}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `).join('')

  const subscribers = await prisma.subscriber.findMany({ where: { active: true } })
  if (subscribers.length === 0) return

  for (const sub of subscribers) {
    const unsubscribeLink = `${BASE_URL}/api/unsubscribe?email=${encodeURIComponent(sub.email)}`

    const html = `
      <table cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; font-family: -apple-system, 'Segoe UI', sans-serif;">
        <tr>
          <td style="padding: 32px 0 16px 0; border-bottom: 1px solid #e8e8e8;">
            <span style="font-size: 20px; font-weight: 700; color: #1a1a1a;">Tech<span style="color: #1a7a7a;">Bytes</span></span>
          </td>
        </tr>
        <tr>
          <td style="padding: 24px 0 4px 0; font-size: 14px; color: #6b6b6b;">
            Latest stories from TechBytes
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

    try {
      await resend.emails.send({
        from: FROM,
        to: sub.email,
        subject,
        html,
      })
      console.log(`Digest sent to ${sub.email}`)
    } catch (err) {
      console.error(`Failed to send to ${sub.email}: ${err.message}`)
    }
  }
}
