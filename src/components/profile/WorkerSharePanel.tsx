'use client'
import { useState } from 'react'
import { Copy, CheckCheck, Share2, MessageCircle } from 'lucide-react'

interface WorkerSharePanelProps {
  name: string
  slug: string
  headline: string
  rating: number
  reviewCount: number
  skill: string
  city: string
  area?: string
  accent: string
  light: string
  emoji: string
}

export function WorkerSharePanel(props: WorkerSharePanelProps) {
  const { name, slug, rating, reviewCount, skill, city, area, accent, emoji } = props
  const [copied, setCopied] = useState<'link' | 'bio' | null>(null)
  const [open, setOpen] = useState(false)

  const profileUrl = `https://trustwork.ng/w/${slug}`
  const location = area ? `${area}, ${city}` : city

  // Pre-written WhatsApp message — the wildfire mechanic
  const whatsappText = [
    `Hi, I'm ${name} ${emoji}`,
    `${skill} in ${location}`,
    `⭐ ${rating} rating · ${reviewCount} verified reviews on TrustWork`,
    ``,
    `See my full profile and trusted reviews:`,
    `👉 ${profileUrl}`,
  ].join('\n')

  // Copyable bio block — paste anywhere
  const bioBlock = [
    `${name} | ${skill}`,
    `📍 ${location}`,
    `⭐ ${rating}/5 · ${reviewCount} reviews`,
    `✅ Verified on TrustWork`,
    `🔗 ${profileUrl}`,
  ].join('\n')

  const waDeepLink = `https://wa.me/?text=${encodeURIComponent(whatsappText)}`

  async function copyLink() {
    await navigator.clipboard.writeText(profileUrl)
    setCopied('link')
    setTimeout(() => setCopied(null), 2000)
  }

  async function copyBio() {
    await navigator.clipboard.writeText(bioBlock)
    setCopied('bio')
    setTimeout(() => setCopied(null), 2000)
  }

  async function nativeShare() {
    if (navigator.share) {
      try {
        await navigator.share({ title: `${name} on TrustWork`, text: whatsappText, url: profileUrl })
        return
      } catch {}
    }
    copyLink()
  }

  return (
    <div className="rounded-2xl border border-gray-100 bg-white mb-3 overflow-hidden">
      {/* Collapsed state */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4"
      >
        <div className="flex items-center gap-2">
          <Share2 size={15} style={{ color: accent }} />
          <span className="text-sm font-bold text-gray-900">Share this profile</span>
        </div>
        <span className="text-xs text-gray-400">{open ? 'Close ▲' : 'Open ▼'}</span>
      </button>

      {open && (
        <div className="px-5 pb-5 space-y-3 border-t border-gray-50">

          {/* WhatsApp — primary action */}
          <a
            href={waDeepLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 w-full rounded-xl px-4 py-3 mt-3"
            style={{ backgroundColor: '#25D366' }}
          >
            <MessageCircle size={18} className="text-white flex-shrink-0" />
            <div className="flex-1 text-left">
              <p className="text-sm font-bold text-white">Share on WhatsApp</p>
              <p className="text-xs text-white/80">Opens with a pre-written message ready to send</p>
            </div>
          </a>

          {/* Copy profile link */}
          <button
            onClick={copyLink}
            className="flex items-center gap-3 w-full rounded-xl px-4 py-3 border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            {copied === 'link'
              ? <CheckCheck size={16} className="text-green-500 flex-shrink-0" />
              : <Copy size={16} className="text-gray-500 flex-shrink-0" />
            }
            <div className="flex-1 text-left">
              <p className="text-sm font-semibold text-gray-800">
                {copied === 'link' ? 'Link copied!' : 'Copy profile link'}
              </p>
              <p className="text-xs text-gray-400 truncate">{profileUrl}</p>
            </div>
          </button>

          {/* Copyable bio block */}
          <button
            onClick={copyBio}
            className="flex items-center gap-3 w-full rounded-xl px-4 py-3 border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            {copied === 'bio'
              ? <CheckCheck size={16} className="text-green-500 flex-shrink-0" />
              : <Copy size={16} className="text-gray-500 flex-shrink-0" />
            }
            <div className="flex-1 text-left">
              <p className="text-sm font-semibold text-gray-800">
                {copied === 'bio' ? 'Copied!' : 'Copy profile card text'}
              </p>
              <p className="text-xs text-gray-400">Paste into WhatsApp bio, groups, or status</p>
            </div>
          </button>

          {/* Native share */}
          <button
            onClick={nativeShare}
            className="flex items-center justify-center gap-2 w-full rounded-xl px-4 py-3 text-white font-semibold text-sm"
            style={{ backgroundColor: accent }}
          >
            <Share2 size={15} />
            More sharing options
          </button>

          {/* Preview of what gets shared */}
          <div className="rounded-xl p-3 border border-dashed border-gray-200 bg-gray-50">
            <p className="text-xs text-gray-400 mb-1.5 font-medium uppercase tracking-wide">Message preview</p>
            <pre className="text-xs text-gray-600 whitespace-pre-wrap font-sans leading-relaxed">
              {whatsappText}
            </pre>
          </div>

        </div>
      )}
    </div>
  )
}
