'use client'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { SKILL_CATEGORIES, NIGERIAN_CITIES, LAGOS_AREAS, getCategoryByName } from '@/lib/utils/constants'
import {
  Camera, Share2, Copy, CheckCheck, TrendingUp, Award,
  Eye, ExternalLink, CheckCircle, ThumbsUp, ShieldCheck, MessageCircle,
} from 'lucide-react'
import { NINVerificationModal } from '@/components/profile/NINVerificationModal'
import { WorkHistoryVerified, type VerifiedJob } from '@/components/profile/WorkHistoryVerified'
import { BehaviouralStats, type BehaviouralData } from '@/components/profile/BehaviouralStats'

const PROFILE_SLUG = 'emeka-okonkwo'
const PROFILE_URL = `https://trustwork.ng/w/${PROFILE_SLUG}`
const STORAGE_KEY = 'trustwork_worker_profile'

type ProfileData = {
  name: string
  headline: string
  bio: string
  city: string
  area: string
  skills: string[]
  rateMin: string
  rateMax: string
  rateType: string
  hasShared: boolean
  shareCount: number
  ninVerified: boolean
  workHistory: VerifiedJob[]
}

const DEFAULT_PROFILE: ProfileData = {
  name: 'Emeka Okonkwo',
  headline: 'Professional Chef · Nigerian & Continental · Lagos',
  bio: 'I specialise in Nigerian and continental cuisines. Trained under Chef Kunle at Oriental Hotel before going independent.',
  city: 'Lagos',
  area: 'Lekki',
  skills: ['chef'],
  rateMin: '15000',
  rateMax: '30000',
  rateType: 'daily',
  hasShared: false,
  shareCount: 0,
  ninVerified: false,
  workHistory: [
    {
      role: 'Private Family Chef',
      employer: 'Okafor Household — Lekki Phase 1',
      period: 'Jan 2023 – Present',
      description: 'Full-time family chef for a household of 5. Daily Nigerian and continental meals.',
      employerPhone: '',
      verificationStatus: 'whatsapp_confirmed',
      verifiedAt: '2024-03-15T10:00:00Z',
    },
    {
      role: 'Sous Chef',
      employer: 'Oriental Hotel — Victoria Island',
      period: 'Jun 2016 – Feb 2021',
      description: 'Continental and Nigerian menu preparation for a 200-cover restaurant.',
      employerPhone: '',
      verificationStatus: 'unverified',
    },
  ],
}

const MOCK_BEHAVIOURAL: BehaviouralData = {
  responseRate: 92,
  avgResponseHours: 2,
  cancellationRate: 3,
  repeatHireRate: 68,
  memberSinceYear: 2022,
  totalJobsCompleted: 87,
}

// Milestones — each has a weight; trust score = sum of done weights
// IMPORTANT: 'done' is only ever set server-side based on verified events.
// The share milestone requires 3 unique new-user visits via referral link — not button clicks.
const MILESTONES = [
  { key: 'first_review',  label: 'First review received',              done: true,  reward: 'Profile visible in search',                                    weight: 15, action: null },
  { key: 'five_reviews',  label: '5+ verified reviews',                done: true,  reward: '"Reviewed Worker" badge',                                      weight: 20, action: null },
  { key: 'nin',           label: 'Identity verified (NIN)',            done: false, reward: '"TrustWork Verified" badge + top ranking',                     weight: 30, action: 'Verify ID' },
  { key: 'top_rated',     label: '10+ reviews · 4.5+ avg rating',     done: false, reward: '"Top Rated" badge + featured listing',                          weight: 25, action: null },
  { key: 'referrals',     label: '3 employers joined via your link',   done: false, reward: '90-day permanent search boost · verified by server, not clicks', weight: 10, action: null },
]

// Endorsements — mock, will come from network
const ENDORSEMENTS = [
  { skill: 'Nigerian Cuisine',    count: 14, endorsers: ['Chioma A.', 'Tunde B.', 'Yewande O.'] },
  { skill: 'Event Catering',      count: 9,  endorsers: ['Chioma A.', 'Sola K.'] },
  { skill: 'Punctuality',         count: 11, endorsers: ['Tunde B.', 'Chioma A.', 'Mrs. Fashola'] },
  { skill: 'Continental Cooking', count: 7,  endorsers: ['Mrs. Fashola'] },
]

export default function MyProfilePage() {
  const [profile, setProfile] = useState<ProfileData>(DEFAULT_PROFILE)
  const [tab, setTab] = useState<'overview' | 'edit' | 'history'>('overview')
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [copied, setCopied] = useState<'link' | 'bio' | null>(null)
  const [showNINModal, setShowNINModal] = useState(false)

  useEffect(() => {
    try {
      const s = localStorage.getItem(STORAGE_KEY)
      if (s) {
        const parsed = JSON.parse(s) as ProfileData
        // Sanitise legacy work history entries that predate the verificationStatus field
        if (parsed.workHistory) {
          parsed.workHistory = parsed.workHistory.map(j => ({
            ...j,
            verificationStatus: j.verificationStatus ?? 'unverified',
            employerPhone: j.employerPhone ?? '',
          }))
        }
        setProfile(parsed)
      }
    } catch {}
  }, [])

  function save(data: ProfileData) {
    setProfile(data)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }

  function updateField<K extends keyof ProfileData>(key: K, value: ProfileData[K]) {
    setProfile(prev => ({ ...prev, [key]: value }))
  }

  function toggleSkill(slug: string) {
    setProfile(prev => ({
      ...prev,
      skills: prev.skills.includes(slug)
        ? prev.skills.filter(s => s !== slug)
        : [...prev.skills, slug],
    }))
  }

  function handleNINVerified() {
    const updated = { ...profile, ninVerified: true }
    save(updated)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    save(profile)
    await new Promise(r => setTimeout(r, 500))
    setLoading(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  async function copyLink() {
    await navigator.clipboard.writeText(PROFILE_URL)
    setCopied('link')
    const next = { ...profile, hasShared: true, shareCount: profile.shareCount + 1 }
    save(next)
    setTimeout(() => setCopied(null), 2000)
  }

  async function shareProfile() {
    const msg = `Hi, I'm ${profile.name}\n${profile.headline}\n\nSee my verified profile on TrustWork:\n${PROFILE_URL}`
    const next = { ...profile, hasShared: true, shareCount: profile.shareCount + 1 }
    save(next)
    if (navigator.share) {
      try { await navigator.share({ title: `${profile.name} on TrustWork`, text: msg, url: PROFILE_URL }); return } catch {}
    }
    copyLink()
  }

  async function copyBio() {
    const bio = `${profile.name} | ${SKILL_CATEGORIES.find(c => c.slug === profile.skills[0])?.name ?? profile.skills[0]}\n📍 ${profile.area ? profile.area + ', ' : ''}${profile.city}\n✅ Verified on TrustWork\n🔗 ${PROFILE_URL}`
    await navigator.clipboard.writeText(bio)
    setCopied('bio')
    setTimeout(() => setCopied(null), 2000)
  }

  function handleWorkHistoryChange(jobs: VerifiedJob[]) {
    const updated = { ...profile, workHistory: jobs }
    save(updated)
  }

const category = getCategoryByName(profile.skills[0]
    ? (SKILL_CATEGORIES.find(c => c.slug === profile.skills[0])?.name ?? '') : '')
  const accent = category?.color.accent ?? '#16a34a'
  const light = category?.color.light ?? '#f0fdf4'
  const initials = profile.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()

  // Trust score reflects actual verified state from localStorage
  const milestones = MILESTONES.map(m =>
    m.key === 'nin' ? { ...m, done: profile.ninVerified } : m
  )
  const trustScore = milestones.reduce((sum, m) => sum + (m.done ? m.weight : 0), 0)
  const scoreColor = trustScore >= 65 ? '#16a34a' : trustScore >= 35 ? '#d97706' : '#6b7280'
  const verifiedHistoryCount = profile.workHistory.filter(j => j.verificationStatus !== 'unverified').length

  return (
    <div className="max-w-2xl mx-auto px-4 pt-4 pb-10">

      {showNINModal && (
        <NINVerificationModal
          onClose={() => setShowNINModal(false)}
          onVerified={handleNINVerified}
        />
      )}

      {/* ── LinkedIn-style header ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm mb-4 overflow-hidden">
        {/* Cover strip */}
        <div style={{ backgroundColor: accent }} className="h-16" />

        <div className="px-5 pb-5">
          {/* Avatar overlaps cover */}
          <div className="flex items-end justify-between -mt-8 mb-3">
            <div className="relative">
              <div
                className="w-16 h-16 rounded-xl flex items-center justify-center text-xl font-black text-white border-4 border-white shadow"
                style={{ backgroundColor: accent }}
              >
                {initials}
              </div>
              <button type="button" className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow border border-gray-100">
                <Camera size={9} className="text-gray-500" />
              </button>
            </div>
            <a
              href={`/w/${PROFILE_SLUG}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50"
            >
              <ExternalLink size={12} />
              Preview profile
            </a>
          </div>

          {/* Name & trust score */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h1 className="text-base font-black text-gray-900">{profile.name}</h1>
              <p className="text-xs text-gray-500 mt-0.5">{profile.headline}</p>
              <p className="text-xs text-gray-400 mt-0.5">{profile.area ? `${profile.area}, ` : ''}{profile.city}</p>
            </div>
            <div className="text-center flex-shrink-0 bg-gray-50 rounded-xl px-3 py-2 border border-gray-100">
              <div className="text-xl font-black" style={{ color: scoreColor }}>{trustScore}%</div>
              <div className="text-xs text-gray-400">trust score</div>
            </div>
          </div>

          {/* Earned badges */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {milestones.filter(m => m.done).map((m, i) => (
              <span key={i} className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full text-white"
                style={{ backgroundColor: accent }}>
                <CheckCircle size={10} />
                {m.key === 'first_review' ? 'On TrustWork' : m.key === 'five_reviews' ? 'Reviewed Worker' : m.label}
              </span>
            ))}
            {!milestones.find(m => m.key === 'nin')?.done && (
              <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-400">
                <ShieldCheck size={10} />NIN pending
              </span>
            )}
          </div>

          {/* Share row */}
          <div className="mt-4 pt-4 border-t border-gray-100 flex gap-2">
            <a
              href={`https://wa.me/?text=${encodeURIComponent(`Hi, I'm ${profile.name}\n${profile.headline}\n\nSee my TrustWork profile:\n${PROFILE_URL}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-white text-xs font-bold"
              style={{ backgroundColor: '#25D366' }}
            >
              <MessageCircle size={14} />
              Share on WhatsApp
            </a>
            <button onClick={copyBio}
              className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50">
              {copied === 'bio' ? <CheckCheck size={13} className="text-green-500" /> : <Copy size={13} />}
              {copied === 'bio' ? 'Copied' : 'Copy bio'}
            </button>
            <button onClick={copyLink}
              className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50">
              {copied === 'link' ? <CheckCheck size={13} className="text-green-500" /> : <Share2 size={13} />}
              {copied === 'link' ? 'Copied' : 'Link'}
            </button>
          </div>
          {profile.hasShared && (
            <p className="text-xs mt-2 font-medium text-gray-400">
              Link shared — milestone unlocks when 3 new employers join via your link (server-verified)
            </p>
          )}
        </div>
      </div>

      {/* ── About ── */}
      {profile.bio ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-4">
          <h2 className="text-sm font-bold text-gray-900 mb-2">About</h2>
          <p className="text-sm text-gray-600 leading-relaxed">{profile.bio}</p>
        </div>
      ) : (
        <button onClick={() => setTab('edit')}
          className="w-full bg-white rounded-2xl border border-dashed border-gray-200 p-4 mb-4 text-xs text-gray-400 hover:bg-gray-50 text-left">
          + Add a bio so employers know who you are
        </button>
      )}

      {/* ── Tabs ── */}
      <div className="flex bg-gray-100 rounded-xl p-1 mb-4">
        {([
          ['overview', '⭐ Reputation'],
          ['history',  '💼 Work History'],
          ['edit',     '✏️ Edit Profile'],
        ] as const).map(([t, label]) => (
          <button key={t} onClick={() => setTab(t)}
            className={`flex-1 text-xs font-semibold py-2 rounded-lg transition-colors ${
              tab === t ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
            }`}>
            {label}
          </button>
        ))}
      </div>

      {/* ── Overview / Reputation tab ── */}
      {tab === 'overview' && (
        <div className="space-y-4">

          {/* Trust score milestones */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="px-5 pt-4 pb-3 border-b border-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award size={14} style={{ color: accent }} />
                  <h2 className="text-sm font-bold text-gray-900">Trust Score: {trustScore}%</h2>
                </div>
                <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${trustScore}%`, backgroundColor: accent }} />
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Your trust score is shown on your public profile. Each milestone adds points directly.
              </p>
            </div>
            <div className="divide-y divide-gray-50">
              {milestones.map((m, i) => (
                <div key={i} className={`flex items-start gap-3 px-5 py-3.5 ${!m.done ? 'opacity-75' : ''}`}>
                  <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold"
                    style={m.done ? { backgroundColor: accent, color: '#fff' } : { backgroundColor: '#f3f4f6', color: '#9ca3af' }}>
                    {m.done ? '✓' : i + 1}
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm font-semibold ${m.done ? 'text-gray-900' : 'text-gray-600'}`}>{m.label}</p>
                    <p className="text-xs text-gray-400">{m.reward}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-xs font-bold" style={{ color: m.done ? accent : '#d1d5db' }}>+{m.weight}%</span>
                    {!m.done && m.action && (
                      <button
                        onClick={m.key === 'nin' ? () => setShowNINModal(true) : undefined}
                        className="text-xs font-bold px-2.5 py-1 rounded-lg text-white"
                        style={{ backgroundColor: accent }}>
                        {m.action}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Skills & endorsements */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="flex items-center gap-2 mb-4">
              <ThumbsUp size={14} style={{ color: accent }} />
              <h2 className="text-sm font-bold text-gray-900">Skills & Endorsements</h2>
              <span className="text-xs text-gray-400 ml-auto">shown on public profile</span>
            </div>
            <div className="space-y-3">
              {ENDORSEMENTS.map((e, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold text-gray-800">{e.skill}</span>
                    <div className="flex items-center gap-1.5">
                      <div className="flex -space-x-1">
                        {e.endorsers.slice(0, 3).map((name, j) => (
                          <div key={j} className="w-5 h-5 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold text-white"
                            style={{ backgroundColor: accent, opacity: 1 - j * 0.2 }}>
                            {name[0]}
                          </div>
                        ))}
                      </div>
                      <span className="text-xs font-bold" style={{ color: accent }}>{e.count}</span>
                    </div>
                  </div>
                  <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${Math.min(100, (e.count / 15) * 100)}%`, backgroundColor: accent }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Reach stats */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp size={14} style={{ color: accent }} />
              <h2 className="text-sm font-bold text-gray-900">Profile reach this month</h2>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Profile views',               value: '14', icon: Eye },
                { label: 'Employers joined via link',    value: '2',  icon: Award },
                { label: 'Needed for share milestone',   value: '1',  icon: TrendingUp },
              ].map(({ label, value, icon: Icon }) => (
                <div key={label} className="rounded-xl p-3 text-center" style={{ backgroundColor: light }}>
                  <Icon size={14} className="mx-auto mb-1" style={{ color: accent }} />
                  <p className="text-lg font-black" style={{ color: accent }}>{value}</p>
                  <p className="text-xs text-gray-500 leading-tight mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ── Work history tab ── */}
      {tab === 'history' && (
        <div className="space-y-4">
          <WorkHistoryVerified
            jobs={profile.workHistory}
            accent={accent}
            light={light}
            onChange={handleWorkHistoryChange}
          />

          {/* Behavioural stats — read-only for worker */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={14} style={{ color: accent }} />
              <h2 className="text-sm font-bold text-gray-900">Behavioural signals</h2>
              <span className="text-xs text-gray-400 ml-auto">visible to employers</span>
            </div>
            <BehaviouralStats data={MOCK_BEHAVIOURAL} accent={accent} light={light} />
          </div>

          {/* Verified history count */}
          {verifiedHistoryCount > 0 && (
            <div className="bg-green-50 border border-green-100 rounded-xl p-4">
              <p className="text-sm font-semibold text-green-800">
                ✓ {verifiedHistoryCount} employer{verifiedHistoryCount > 1 ? 's' : ''} confirmed your work history
              </p>
              <p className="text-xs text-green-600 mt-0.5">
                Verified history entries are shown with a badge on your public profile
              </p>
            </div>
          )}
        </div>
      )}

      {/* ── Edit profile tab ── */}
      {tab === 'edit' && (
        <form onSubmit={handleSave} className="space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
            <h2 className="text-sm font-bold text-gray-900">Basic info</h2>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Full name</label>
              <input value={profile.name} onChange={e => updateField('name', e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Headline</label>
              <input value={profile.headline} onChange={e => updateField('headline', e.target.value)}
                placeholder="e.g. Experienced Plumber · 8 years · Lagos Island"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">About</label>
              <textarea value={profile.bio} onChange={e => updateField('bio', e.target.value)}
                placeholder="Tell employers what makes you stand out..."
                rows={4}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none" />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
            <h2 className="text-sm font-bold text-gray-900">Location & skills</h2>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">City</label>
                <select value={profile.city} onChange={e => updateField('city', e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                  {NIGERIAN_CITIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              {profile.city === 'Lagos' && (
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Area</label>
                  <select value={profile.area} onChange={e => updateField('area', e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                    {LAGOS_AREAS.map(a => <option key={a}>{a}</option>)}
                  </select>
                </div>
              )}
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-2">Skills</label>
              <div className="flex flex-wrap gap-2">
                {SKILL_CATEGORIES.map(cat => (
                  <button key={cat.slug} type="button" onClick={() => toggleSkill(cat.slug)}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                      profile.skills.includes(cat.slug) ? 'text-white border-transparent' : 'bg-white text-gray-600 border-gray-200'
                    }`}
                    style={profile.skills.includes(cat.slug) ? { backgroundColor: accent } : {}}>
                    {cat.icon} {cat.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
            <h2 className="text-sm font-bold text-gray-900">Rate (₦)</h2>
            <div className="flex items-center gap-2">
              <input value={profile.rateMin} onChange={e => updateField('rateMin', e.target.value)}
                placeholder="Min" className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
              <span className="text-gray-400">—</span>
              <input value={profile.rateMax} onChange={e => updateField('rateMax', e.target.value)}
                placeholder="Max" className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
              <select value={profile.rateType} onChange={e => updateField('rateType', e.target.value)}
                className="border border-gray-200 rounded-xl px-2 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                <option value="daily">/ day</option>
                <option value="hourly">/ hr</option>
                <option value="monthly">/ month</option>
                <option value="project">/ project</option>
              </select>
            </div>
          </div>

          <Button type="submit" className="w-full" size="lg" loading={loading}>
            {saved ? '✓ Saved!' : 'Save Profile'}
          </Button>
        </form>
      )}
    </div>
  )
}
