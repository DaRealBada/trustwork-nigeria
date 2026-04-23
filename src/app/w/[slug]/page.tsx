import { notFound } from 'next/navigation'
import { MapPin, CheckCircle, Award, ShieldCheck, Briefcase, ThumbsUp, MessageCircle, UserCheck } from 'lucide-react'
import { getCategoryByName } from '@/lib/utils/constants'
import { formatNaira } from '@/lib/utils/formatters'
import type { Metadata } from 'next'
import { WorkerSharePanel } from '@/components/profile/WorkerSharePanel'
import { BehaviouralStats } from '@/components/profile/BehaviouralStats'

type Confirmation = { name: string; verdict: 'positive' | 'neutral' | 'negative'; note?: string; jobType: string; contextTags?: string[]; date: string; trustLevel: 1 | 2 | 3 }
type NetworkConfirmation = { contactName: string; verdict: 'positive' | 'neutral' | 'negative'; jobType: string; note?: string; contextTags?: string[]; date: string }
type WorkHistory = { role: string; employer: string; period: string; description: string; verifiedBy?: 'whatsapp' | 'reference_code' }
type SkillEndorsement = { skill: string; endorsers: string[]; count: number }
type Milestone = { label: string; done: boolean; reward: string; weight: number }

type BehaviouralData = {
  responseRate: number; avgResponseHours: number
  cancellationRate: number; repeatHireRate: number
  memberSinceYear: number; totalJobsCompleted: number
}

type WorkerProfile = {
  slug: string
  name: string
  headline: string
  bio: string
  city: string
  area?: string
  primarySkill: string
  rateMin: number
  rateMax: number
  rateType: 'daily' | 'hourly' | 'monthly' | 'project'
  recommendRatio: number   // % who said 👍
  confirmedJobs: number    // total job confirmations
  networkContacts: number  // how many of "your" contacts confirmed them (mock)
  contextTags: string[]    // aggregated context tags from confirmers
  yearsExp: number
  verified: boolean
  joinedYear: number
  completedJobs: number
  workHistory: WorkHistory[]
  skillEndorsements: SkillEndorsement[]
  milestones: Milestone[]
  confirmations: Confirmation[]
  networkConfirmations?: NetworkConfirmation[]
  agency?: string; agencySlug?: string
  behavioural: BehaviouralData
}

const MOCK_WORKERS: Record<string, WorkerProfile> = {
  'emeka-okonkwo': {
    slug: 'emeka-okonkwo',
    name: 'Emeka Okonkwo',
    headline: 'Professional Chef · Nigerian & Continental · Lagos',
    bio: 'I specialise in Nigerian and continental cuisines. Trained under Chef Kunle at Oriental Hotel before going independent in 2014. I have cooked for private families, naming ceremonies, weddings, and corporate events across Lagos — serving anything from 4 guests to 350. I bring my own equipment when needed, keep a clean kitchen, and I am always on time.',
    city: 'Lagos', area: 'Lekki',
    primarySkill: 'Chef / Cook',
    rateMin: 15000, rateMax: 30000, rateType: 'daily',
    recommendRatio: 94, confirmedJobs: 34, networkContacts: 3,
    contextTags: ['Family household', 'High-end project', 'Corporate / office'],
    yearsExp: 12, verified: true, joinedYear: 2022, completedJobs: 87,
    workHistory: [
      {
        role: 'Private Family Chef',
        employer: 'Okafor Household — Lekki Phase 1',
        period: 'Jan 2023 – Present',
        description: 'Full-time family chef for a household of 5. Daily Nigerian and continental meals, weekly meal prep, and management of kitchen supplies.',
        verifiedBy: 'whatsapp',
      },
      {
        role: 'Event Caterer',
        employer: 'Bukky\'s Catering & Events — Lagos',
        period: 'Mar 2021 – Dec 2022',
        description: 'Lead chef for events of 50–350 guests. Specialised in jollof rice, egusi, and continental buffet spreads.',
        verifiedBy: 'reference_code',
      },
      {
        role: 'Sous Chef',
        employer: 'Oriental Hotel — Victoria Island',
        period: 'Jun 2016 – Feb 2021',
        description: 'Worked under Executive Chef Kunle in a 200-cover restaurant. Managed breakfast service and continental menu preparation.',
      },
    ],
    skillEndorsements: [
      { skill: 'Nigerian Cuisine',      endorsers: ['Chioma A.', 'Mrs. Fashola', 'Tunde B.', 'Yewande O.'], count: 14 },
      { skill: 'Event Catering',        endorsers: ['Chioma A.', 'Tunde B.', 'Sola K.'],                    count: 9  },
      { skill: 'Continental Cooking',   endorsers: ['Mrs. Fashola', 'Sola K.'],                              count: 7  },
      { skill: 'Punctuality',           endorsers: ['Tunde B.', 'Yewande O.', 'Chioma A.'],                 count: 11 },
      { skill: 'Kitchen Management',    endorsers: ['Mrs. Fashola'],                                         count: 5  },
    ],
    milestones: [
      { label: 'First review received',    done: true,  reward: 'Profile visible in search',              weight: 15 },
      { label: '5+ verified reviews',      done: true,  reward: '"Reviewed Worker" badge',                weight: 20 },
      { label: 'Identity verified (NIN)',  done: false, reward: '"TrustWork Verified" badge + top rank',  weight: 30 },
      { label: '10+ reviews · 4.5+ avg',  done: false, reward: '"Top Rated" badge + featured listing',   weight: 25 },
      { label: 'Profile shared 3+ times', done: false, reward: '90-day permanent search boost',           weight: 10 },
    ],
    agency: 'Domus Domestic Services', agencySlug: 'domus-domestic',
    confirmations: [
      { name: 'Chioma A.',    verdict: 'positive', note: 'Cooked for my daughter\'s naming — 120 guests. Organised everything himself. Will use again.', jobType: 'Cooking / Chef', contextTags: ['Family household'], date: '2024-11', trustLevel: 1 },
      { name: 'Tunde B.',     verdict: 'positive', note: 'Our family chef for months. Very clean, always on time, food is excellent.', jobType: 'Cooking / Chef', contextTags: ['Family household', 'High-end project'], date: '2024-09', trustLevel: 2 },
      { name: 'Anonymous',    verdict: 'neutral',  note: 'Food was good but arrived late on day one.', jobType: 'Cooking / Chef', contextTags: [], date: '2024-07', trustLevel: 3 },
    ],
    networkConfirmations: [
      { contactName: 'Chioma', verdict: 'positive', jobType: 'Cooking / Chef', note: 'Cooked for my daughter\'s naming — 120 guests. Organised everything himself.', contextTags: ['Family household'], date: '2024-11' },
      { contactName: 'Tunde',  verdict: 'positive', jobType: 'Cooking / Chef', note: 'Our family chef for months. Always on time.', contextTags: ['Family household'], date: '2024-09' },
      { contactName: 'Bisi',   verdict: 'positive', jobType: 'Cooking / Chef', note: 'Hired for my husband\'s 50th. Everyone loved the food.', contextTags: ['High-end project'], date: '2024-06' },
    ],
    behavioural: { responseRate: 92, avgResponseHours: 2, cancellationRate: 3, repeatHireRate: 68, memberSinceYear: 2022, totalJobsCompleted: 87 },
  },
  'bola-adeyemi': {
    slug: 'bola-adeyemi',
    name: 'Bola Adeyemi',
    headline: 'Experienced Plumber · Residential & Commercial · Lagos',
    bio: 'Over 8 years fixing pipework, water systems, and drainage issues across Lagos Island. Quick diagnosis, clean work, fair pricing. Available for emergency callouts.',
    city: 'Lagos', area: 'Victoria Island',
    primarySkill: 'Plumber',
    rateMin: 10000, rateMax: 25000, rateType: 'daily',
    recommendRatio: 88, confirmedJobs: 21, networkContacts: 1,
    contextTags: ['Emergency callout', 'Budget-conscious'],
    yearsExp: 8, verified: false, joinedYear: 2023, completedJobs: 43,
    workHistory: [
      {
        role: 'Independent Plumber',
        employer: 'Self-employed — Lagos Island',
        period: '2019 – Present',
        description: 'Residential and commercial plumbing across Lekki, VI, and Ikoyi. Burst pipes, bathroom installations, water heater setups.',
        verifiedBy: 'whatsapp',
      },
      {
        role: 'Junior Plumber',
        employer: 'Fagbemi Building Services',
        period: '2016 – 2019',
        description: 'Assisted on large commercial projects including estate plumbing installations in Lekki Phase 2.',
      },
    ],
    skillEndorsements: [
      { skill: 'Pipe Repair',       endorsers: ['Chioma A.', 'James O.'], count: 8 },
      { skill: 'Fast Response',     endorsers: ['Chioma A.'],             count: 6 },
      { skill: 'Bathroom Fitting',  endorsers: ['James O.'],              count: 4 },
    ],
    milestones: [
      { label: 'First review received',    done: true,  reward: 'Profile visible in search',             weight: 15 },
      { label: '5+ verified reviews',      done: false, reward: '"Reviewed Worker" badge',               weight: 20 },
      { label: 'Identity verified (NIN)',  done: false, reward: '"TrustWork Verified" badge + top rank', weight: 30 },
      { label: '10+ reviews · 4.5+ avg',  done: false, reward: '"Top Rated" badge + featured listing',  weight: 25 },
      { label: 'Profile shared 3+ times', done: false, reward: '90-day permanent search boost',          weight: 10 },
    ],
    agency: 'ArtisanPro Lagos', agencySlug: 'artisanpro-lagos',
    confirmations: [
      { name: 'Chioma A.', verdict: 'positive', note: 'Fixed burst pipe at 9pm. Came within the hour. Reasonable charge.', jobType: 'Plumbing', contextTags: ['Emergency callout'], date: '2024-10', trustLevel: 1 },
      { name: 'Uche N.',   verdict: 'positive', note: 'Good bathroom installation. Left site clean.', jobType: 'Plumbing', contextTags: ['Budget-conscious'], date: '2024-08', trustLevel: 3 },
    ],
    networkConfirmations: [
      { contactName: 'Chioma', verdict: 'positive', jobType: 'Plumbing', note: 'Fixed burst pipe at 9pm. Came within the hour.', contextTags: ['Emergency callout'], date: '2024-10' },
    ],
    behavioural: { responseRate: 85, avgResponseHours: 4, cancellationRate: 8, repeatHireRate: 55, memberSinceYear: 2023, totalJobsCompleted: 43 },
  },
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const worker = MOCK_WORKERS[params.slug]
  if (!worker) return { title: 'Worker not found' }
  return {
    title: `${worker.name} — TrustWork`,
    description: `${worker.headline}. ${worker.confirmedJobs} job confirmations. Find trusted workers through people you know.`,
    openGraph: {
      title: `${worker.name} on TrustWork`,
      description: worker.headline,
      images: [`/w/${params.slug}/opengraph-image`],
    },
  }
}

const RATE_LABELS = { daily: 'day', hourly: 'hr', monthly: 'month', project: 'project' }
const TRUST_STYLES = {
  1: { bar: 'bg-green-500', badge: 'bg-green-50 border-green-200 text-green-700', tag: 'Your contact' },
  2: { bar: 'bg-blue-400',  badge: 'bg-blue-50 border-blue-200 text-blue-700',   tag: 'Trusted network' },
  3: { bar: 'bg-gray-300',  badge: 'bg-gray-50 border-gray-200 text-gray-500',   tag: 'Public' },
}
const VERDICT_STYLES = {
  positive: { emoji: '👍', label: 'Recommends', color: 'text-green-600' },
  neutral:  { emoji: '😐', label: 'It was okay', color: 'text-amber-600' },
  negative: { emoji: '👎', label: 'Would not recommend', color: 'text-red-500' },
}

export default function WorkerPublicProfile({ params }: { params: { slug: string } }) {
  const worker = MOCK_WORKERS[params.slug]
  if (!worker) notFound()

  const category = getCategoryByName(worker.primarySkill)
  const accent = category?.color.accent ?? '#16a34a'
  const light = category?.color.light ?? '#f0fdf4'
  const initials = worker.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
  const rateLabel = RATE_LABELS[worker.rateType]

  // Trust score derived purely from milestones
  const trustScore = worker.milestones.reduce((sum, m) => sum + (m.done ? m.weight : 0), 0)
  const scoreColor = trustScore >= 65 ? '#16a34a' : trustScore >= 35 ? '#d97706' : '#6b7280'

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Cover photo — purely decorative, name is BELOW ── */}
      <div className="relative">
        <div style={{ backgroundColor: accent }} className="h-32 w-full" />
        {/* Avatar overlaps cover bottom — LinkedIn style */}
        <div className="absolute left-4 bottom-0 translate-y-1/2">
          <div
            className="w-24 h-24 rounded-2xl flex items-center justify-center text-3xl font-black text-white border-4 border-white shadow-lg"
            style={{ backgroundColor: accent }}
          >
            {initials}
          </div>
        </div>
      </div>

      {/* ── Identity — name is always below the cover ── */}
      <div className="max-w-xl mx-auto px-4">
        <div className="bg-white rounded-b-2xl border border-t-0 border-gray-100 px-5 pt-16 pb-5 mb-3">

          {/* Name row */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-black text-gray-900">{worker.name}</h1>
                {worker.verified && <CheckCircle size={18} className="text-green-500 flex-shrink-0" />}
              </div>
              <p className="text-sm text-gray-500 mt-1">{worker.headline}</p>
              <div className="flex items-center gap-1 mt-1.5 text-xs text-gray-400">
                <MapPin size={11} />
                {worker.area ? `${worker.area}, ` : ''}{worker.city}
              </div>
            </div>
            {/* Trust score badge */}
            <div className="flex-shrink-0 text-center bg-gray-50 rounded-xl px-3 py-2 border border-gray-100">
              <div className="text-2xl font-black leading-none" style={{ color: scoreColor }}>{trustScore}%</div>
              <div className="text-xs text-gray-400 mt-0.5">trust score</div>
            </div>
          </div>

          {/* Earned badges */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {worker.milestones.filter(m => m.done).map((m, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full text-white"
                style={{ backgroundColor: accent }}
              >
                <CheckCircle size={11} />
                {i === 0 ? 'On TrustWork' : 'Reviewed Worker'}
              </span>
            ))}
            <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 text-gray-400">
              <ShieldCheck size={11} />
              NIN Verify pending
            </span>
          </div>

          {/* Agency affiliation */}
          {worker.agency && (
            <div className="mt-3">
              <a href={`/agency/${worker.agencySlug}`}
                className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 border border-gray-200 rounded-full px-2.5 py-1 bg-gray-50">
                <Briefcase size={10} />
                Works with <span className="font-semibold">{worker.agency}</span>
                <span className="text-gray-400">· hire direct or via agency →</span>
              </a>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-3 gap-0 mt-4 pt-4 border-t border-gray-100 text-center">
            <div>
              <p className="text-lg font-black" style={{ color: accent }}>{worker.recommendRatio}%</p>
              <p className="text-xs text-gray-400 mt-0.5">recommend</p>
              <p className="text-xs text-gray-400">{worker.confirmedJobs} confirmed jobs</p>
            </div>
            <div className="border-x border-gray-100">
              {worker.networkContacts > 0 ? (
                <>
                  <p className="text-lg font-black text-green-600">{worker.networkContacts}</p>
                  <p className="text-xs text-gray-400 mt-0.5">your contacts</p>
                  <p className="text-xs text-gray-400">used them</p>
                </>
              ) : (
                <>
                  <p className="text-lg font-black text-gray-400">{worker.yearsExp}</p>
                  <p className="text-xs text-gray-400 mt-1">yrs experience</p>
                </>
              )}
            </div>
            <div>
              <p className="text-lg font-black" style={{ color: accent }}>{formatNaira(worker.rateMin)}</p>
              <p className="text-xs text-gray-400 mt-1">from / {rateLabel}</p>
            </div>
          </div>

          {/* Context tags — who hired them */}
          {worker.contextTags.length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <p className="text-xs text-gray-400 mb-2">Used by</p>
              <div className="flex flex-wrap gap-1.5">
                {worker.contextTags.map(tag => (
                  <span key={tag} className="text-xs px-2.5 py-1 rounded-full border border-gray-200 text-gray-600 bg-gray-50">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Share panel — WhatsApp + copy + link */}
        <WorkerSharePanel
          name={worker.name}
          slug={worker.slug}
          headline={worker.headline}
          rating={worker.recommendRatio}
          reviewCount={worker.confirmedJobs}
          skill={worker.primarySkill}
          city={worker.city}
          area={worker.area}
          accent={accent}
          light={light}
          emoji={category?.icon ?? '👷'}
        />

        {/* Your Network — passive referral (TJ Feature 7) */}
        {worker.networkConfirmations && worker.networkConfirmations.length > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-5 mb-3">
            <div className="flex items-center gap-2 mb-3">
              <UserCheck size={14} className="text-green-600" />
              <h2 className="text-sm font-bold text-green-900">
                {worker.networkConfirmations.length} of your contacts used {worker.name.split(' ')[0]}
              </h2>
            </div>
            <div className="space-y-3">
              {worker.networkConfirmations.map((nc, i) => (
                <div key={i} className="flex items-start gap-3 bg-white rounded-xl p-3">
                  <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-xs font-black text-white flex-shrink-0">
                    {nc.contactName[0]}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-gray-900">{nc.contactName}</p>
                      <span className="text-sm">{nc.verdict === 'positive' ? '👍' : nc.verdict === 'neutral' ? '😐' : '👎'}</span>
                      <span className="text-xs text-gray-400">{nc.jobType}</span>
                    </div>
                    {nc.note && <p className="text-xs text-gray-600 mt-0.5 italic">&ldquo;{nc.note}&rdquo;</p>}
                    {nc.contextTags && nc.contextTags.length > 0 && (
                      <div className="flex gap-1 mt-1.5 flex-wrap">
                        {nc.contextTags.map(t => (
                          <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">{t}</span>
                        ))}
                      </div>
                    )}
                    <p className="text-xs text-gray-400 mt-1">{nc.date}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-3">These confirmations are visible to you because these people are in your network.</p>
          </div>
        )}

        {/* About */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-3">
          <h2 className="text-sm font-bold text-gray-900 mb-2">About</h2>
          <p className="text-sm text-gray-600 leading-relaxed">{worker.bio}</p>
        </div>

        {/* Trust milestones */}
        <div className="bg-white rounded-2xl border border-gray-100 mb-3 overflow-hidden">
          <div className="px-5 pt-4 pb-3 border-b border-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award size={15} style={{ color: accent }} />
                <h2 className="text-sm font-bold text-gray-900">Trust Score: {trustScore}%</h2>
              </div>
              <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${trustScore}%`, backgroundColor: accent }} />
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-1">Each milestone directly increases this worker&apos;s verified trust level</p>
          </div>
          <div className="divide-y divide-gray-50">
            {worker.milestones.map((m, i) => (
              <div key={i} className={`flex items-start gap-3 px-5 py-3 ${m.done ? '' : 'opacity-70'}`}>
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold"
                  style={m.done ? { backgroundColor: accent, color: '#fff' } : { backgroundColor: '#f3f4f6', color: '#9ca3af' }}
                >
                  {m.done ? '✓' : i + 1}
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-semibold ${m.done ? 'text-gray-900' : 'text-gray-500'}`}>{m.label}</p>
                  <p className="text-xs text-gray-400">{m.reward}</p>
                </div>
                <span className="text-xs font-bold flex-shrink-0 mt-1" style={{ color: m.done ? accent : '#d1d5db' }}>
                  +{m.weight}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Work history */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-3">
          <div className="flex items-center gap-2 mb-4">
            <Briefcase size={15} style={{ color: accent }} />
            <h2 className="text-sm font-bold text-gray-900">Work History</h2>
          </div>
          <div className="space-y-5">
            {worker.workHistory.map((job, i) => (
              <div key={i} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: light }}>
                    <Briefcase size={13} style={{ color: accent }} />
                  </div>
                  {i < worker.workHistory.length - 1 && (
                    <div className="w-px flex-1 bg-gray-100 mt-2" />
                  )}
                </div>
                <div className="flex-1 pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-bold text-gray-900">{job.role}</p>
                    {job.verifiedBy && (
                      <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${
                        job.verifiedBy === 'whatsapp'
                          ? 'bg-green-50 text-green-700 border border-green-200'
                          : 'bg-blue-50 text-blue-700 border border-blue-200'
                      }`}>
                        <CheckCircle size={9} />
                        {job.verifiedBy === 'whatsapp' ? 'Employer confirmed' : 'Code verified'}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{job.employer}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{job.period}</p>
                  <p className="text-sm text-gray-600 mt-1.5 leading-relaxed">{job.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Skills & Endorsements */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-3">
          <div className="flex items-center gap-2 mb-4">
            <ThumbsUp size={15} style={{ color: accent }} />
            <h2 className="text-sm font-bold text-gray-900">Skills & Endorsements</h2>
          </div>
          <div className="space-y-3">
            {worker.skillEndorsements.map((s, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-semibold text-gray-800">{s.skill}</span>
                  <div className="flex items-center gap-1.5">
                    <div className="flex -space-x-1">
                      {s.endorsers.slice(0, 3).map((name, j) => (
                        <div key={j}
                          className="w-5 h-5 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold text-white"
                          style={{ backgroundColor: accent, opacity: 1 - j * 0.15 }}>
                          {name[0]}
                        </div>
                      ))}
                    </div>
                    <span className="text-xs font-bold" style={{ color: accent }}>{s.count}</span>
                  </div>
                </div>
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full"
                    style={{ width: `${Math.min(100, (s.count / 15) * 100)}%`, backgroundColor: accent }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Behavioural Stats */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-3">
          <h2 className="text-sm font-bold text-gray-900 mb-3">Reliability Signals</h2>
          <BehaviouralStats data={worker.behavioural} accent={accent} light={light} />
        </div>

        {/* Job Confirmations */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-3">
          <div className="flex items-center gap-2 mb-4">
            <MessageCircle size={15} style={{ color: accent }} />
            <h2 className="text-sm font-bold text-gray-900">
              Job Confirmations <span className="text-gray-400 font-normal">({worker.confirmedJobs})</span>
            </h2>
          </div>
          <div className="space-y-4">
            {worker.confirmations.map((c, i) => {
              const style = TRUST_STYLES[c.trustLevel]
              const verdict = VERDICT_STYLES[c.verdict]
              return (
                <div key={i} className="relative pl-3">
                  <div className={`absolute left-0 top-0 bottom-0 w-0.5 rounded-full ${style.bar}`} />
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-sm font-semibold text-gray-900">{c.name}</span>
                    <span className={`text-xs font-bold ${verdict.color}`}>{verdict.emoji} {verdict.label}</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded-full border ${style.badge}`}>{style.tag}</span>
                  </div>
                  <div className="flex gap-1.5 mb-1.5 flex-wrap">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">{c.jobType}</span>
                    {c.contextTags?.map(tag => (
                      <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">{tag}</span>
                    ))}
                  </div>
                  {c.note && <p className="text-sm text-gray-600 leading-relaxed">{c.note}</p>}
                  <p className="text-xs text-gray-400 mt-1">{c.date}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Employer CTA */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-8">
          <p className="text-sm font-bold text-gray-900 mb-1">
            Want to hire {worker.name.split(' ')[0]}?
          </p>
          <p className="text-xs text-gray-500 mb-4">
            Join TrustWork free — see who your contacts have confirmed and recommended.
          </p>
          <a
            href="/search"
            className="w-full flex items-center justify-center py-3 rounded-xl text-sm font-bold text-white"
            style={{ backgroundColor: accent }}
          >
            Find trusted workers — it&apos;s free
          </a>
        </div>

      </div>
    </div>
  )
}
