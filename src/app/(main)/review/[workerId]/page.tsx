'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { CheckCircle, AlertCircle, ShieldCheck, Calendar, Briefcase } from 'lucide-react'

type Step = 'gate' | 'confirm' | 'submitted'

const WORKER_NAMES: Record<string, string> = {
  '1': 'Emeka Okonkwo',
  '2': 'Bola Adeyemi',
  '3': 'Funmi Adesanya',
  '4': 'Chukwudi Eze',
  '5': 'Ngozi Obi',
}

const HOW_FOUND_OPTIONS = [
  'Through a contact on TrustWork',
  'Through the TrustWork search',
  'They shared their profile link with me',
  'Referred by a friend',
  'Other',
]

const JOB_TYPES = [
  'Cooking / Chef',
  'Plumbing',
  'Carpentry / Joinery',
  'Electrical',
  'Cleaning',
  'Driving / Logistics',
  'Childcare / Nanny',
  'Security / Guard',
  'Tailoring / Fashion',
  'Other',
]

const JOB_SIZES = [
  { label: 'Small fix / one-off', sub: 'A few hours' },
  { label: 'Medium project', sub: 'A few days' },
  { label: 'Ongoing / regular', sub: 'Weekly or monthly' },
  { label: 'Large project', sub: 'Weeks or longer' },
]

const CONTEXT_TAGS = [
  'Family household', 'High-end project', 'Budget-conscious',
  'UK / foreign returnee', 'Corporate / office', 'Emergency callout',
]

type Verdict = 'positive' | 'neutral' | 'negative'

const VERDICT_CONFIG: Record<Verdict, { emoji: string; label: string; sub: string; bg: string; border: string; text: string }> = {
  positive: { emoji: '👍', label: 'Recommend',     sub: 'I would use them again',           bg: 'bg-green-50',  border: 'border-green-400', text: 'text-green-700' },
  neutral:  { emoji: '😐', label: 'It was okay',   sub: 'Did the job, nothing special',      bg: 'bg-amber-50',  border: 'border-amber-400', text: 'text-amber-700' },
  negative: { emoji: '👎', label: 'Would not recommend', sub: 'I would not use them again', bg: 'bg-red-50',    border: 'border-red-400',   text: 'text-red-700'   },
}

export default function ConfirmJobPage({ params }: { params: { workerId: string } }) {
  const router = useRouter()
  const workerName = WORKER_NAMES[params.workerId] ?? 'this worker'
  const firstName = workerName.split(' ')[0]

  // Gate state
  const [jobDate, setJobDate] = useState('')
  const [howFound, setHowFound] = useState('')
  const [gateError, setGateError] = useState('')

  // Confirmation state
  const [verdict, setVerdict] = useState<Verdict | null>(null)
  const [jobType, setJobType] = useState('')
  const [jobSize, setJobSize] = useState('')
  const [contextTags, setContextTags] = useState<string[]>([])
  const [note, setNote] = useState('')
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [loading, setLoading] = useState(false)

  const [step, setStep] = useState<Step>('gate')

  function toggleTag(tag: string) {
    setContextTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])
  }

  function confirmGate() {
    setGateError('')
    if (!jobDate) { setGateError('Please enter when the job took place'); return }
    if (!howFound) { setGateError('Please select how you found them'); return }
    const date = new Date(jobDate)
    const now = new Date()
    if (date > now) { setGateError('Date cannot be in the future'); return }
    const days = (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
    if (days > 365) { setGateError('You can only confirm jobs within the past 12 months'); return }
    setStep('confirm')
  }

  async function handleSubmit() {
    if (!verdict || !jobType) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 900))
    setLoading(false)
    setStep('submitted')
  }

  // ── Gate ──
  if (step === 'gate') {
    return (
      <div className="max-w-lg mx-auto p-4 pb-10">
        <div className="mb-5">
          <h1 className="text-xl font-black text-gray-900">Confirm a Job</h1>
          <p className="text-sm text-gray-500 mt-1">
            Your confirmation tells your network that this person did real work for you. No stars — just your honest take.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-4">
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck size={16} className="text-green-600" />
            <h2 className="text-sm font-bold text-gray-900">Verify the job happened</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                When did the job take place? <span className="text-red-400">*</span>
              </label>
              <input type="date" value={jobDate} onChange={e => setJobDate(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
              <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                <Calendar size={10} />
                Only accepted within 12 months
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                How did you find {firstName}? <span className="text-red-400">*</span>
              </label>
              <div className="space-y-2">
                {HOW_FOUND_OPTIONS.map(opt => (
                  <label key={opt} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                    howFound === opt ? 'border-green-300 bg-green-50' : 'border-gray-200 hover:bg-gray-50'
                  }`}>
                    <input type="radio" name="how_found" value={opt}
                      checked={howFound === opt} onChange={() => setHowFound(opt)} className="sr-only" />
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      howFound === opt ? 'border-green-500 bg-green-500' : 'border-gray-300'
                    }`}>
                      {howFound === opt && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                    <span className="text-sm text-gray-700">{opt}</span>
                  </label>
                ))}
              </div>
            </div>

            {gateError && (
              <div className="flex items-start gap-2 p-3 bg-red-50 rounded-xl border border-red-100">
                <AlertCircle size={14} className="text-red-500 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-red-600">{gateError}</p>
              </div>
            )}

            <div className="bg-blue-50 border border-blue-100 rounded-xl p-3">
              <p className="text-xs text-blue-700">
                <strong>Why no stars?</strong> A recommendation from someone your contacts trust is worth more than 100 anonymous five-star ratings. Your job confirmation helps people in your network make better decisions — fast.
              </p>
            </div>

            <Button onClick={confirmGate} className="w-full" size="lg">
              Continue
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // ── Submitted ──
  if (step === 'submitted') {
    const v = verdict ? VERDICT_CONFIG[verdict] : null
    return (
      <div className="max-w-lg mx-auto p-4 text-center py-16">
        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={40} className="text-green-600" />
        </div>
        <h2 className="text-xl font-black text-gray-900 mb-2">Job confirmed</h2>
        {v && (
          <p className="text-2xl mb-2">{v.emoji}</p>
        )}
        <p className="text-sm text-gray-500 mb-1">
          {isAnonymous ? 'Your confirmation is anonymous.' : 'Your name is attached to this confirmation.'}
        </p>
        <p className="text-sm text-gray-500 mb-6">
          People in your network will see that you worked with {firstName} when they search for this type of worker.
        </p>
        <button onClick={() => router.push(`/w/${params.workerId}`)}
          className="bg-green-600 text-white font-bold px-6 py-3 rounded-xl text-sm">
          Back to {firstName}&apos;s profile
        </button>
      </div>
    )
  }

  // ── Confirmation step ──
  return (
    <div className="max-w-lg mx-auto p-4 pb-10">
      <div className="flex items-center gap-2 bg-green-50 border border-green-100 rounded-xl px-4 py-2.5 mb-5">
        <CheckCircle size={14} className="text-green-600 flex-shrink-0" />
        <p className="text-xs text-green-700 font-semibold">Job verified — your confirmation counts in {firstName}&apos;s trust network</p>
      </div>

      <div className="mb-5">
        <h1 className="text-xl font-black text-gray-900">Would you recommend {firstName}?</h1>
        <p className="text-sm text-gray-500 mt-0.5">Your honest take helps people in your network decide faster</p>
      </div>

      <div className="space-y-4">

        {/* Verdict — the core signal */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <p className="text-sm font-bold text-gray-900 mb-3">Your verdict</p>
          <div className="space-y-2">
            {(Object.entries(VERDICT_CONFIG) as [Verdict, typeof VERDICT_CONFIG[Verdict]][]).map(([key, cfg]) => (
              <button key={key} type="button"
                onClick={() => { setVerdict(key); if (key === 'negative') setIsAnonymous(true) }}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                  verdict === key ? `${cfg.bg} ${cfg.border}` : 'border-gray-100 hover:bg-gray-50'
                }`}>
                <span className="text-2xl">{cfg.emoji}</span>
                <div>
                  <p className={`text-sm font-bold ${verdict === key ? cfg.text : 'text-gray-800'}`}>{cfg.label}</p>
                  <p className="text-xs text-gray-400">{cfg.sub}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Job type */}
        {verdict && (
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Briefcase size={14} className="text-gray-400" />
              <p className="text-sm font-bold text-gray-900">What type of job? <span className="text-red-400">*</span></p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {JOB_TYPES.map(t => (
                <button key={t} type="button" onClick={() => setJobType(t)}
                  className={`text-xs font-semibold px-3 py-2.5 rounded-xl border text-left transition-colors ${
                    jobType === t ? 'bg-green-50 border-green-300 text-green-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}>
                  {t}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Job size */}
        {verdict && jobType && (
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <p className="text-sm font-bold text-gray-900 mb-3">How big was the job?</p>
            <div className="grid grid-cols-2 gap-2">
              {JOB_SIZES.map(({ label, sub }) => (
                <button key={label} type="button" onClick={() => setJobSize(label)}
                  className={`text-left px-3 py-2.5 rounded-xl border transition-colors ${
                    jobSize === label ? 'bg-green-50 border-green-300' : 'border-gray-200 hover:bg-gray-50'
                  }`}>
                  <p className={`text-xs font-semibold ${jobSize === label ? 'text-green-700' : 'text-gray-700'}`}>{label}</p>
                  <p className="text-xs text-gray-400">{sub}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Context tags */}
        {verdict && jobType && (
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <p className="text-sm font-bold text-gray-900 mb-1">Describe your situation <span className="text-gray-400 font-normal text-xs">(optional)</span></p>
            <p className="text-xs text-gray-400 mb-3">Helps people with similar needs find the right match</p>
            <div className="flex flex-wrap gap-2">
              {CONTEXT_TAGS.map(tag => (
                <button key={tag} type="button" onClick={() => toggleTag(tag)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors ${
                    contextTags.includes(tag)
                      ? 'bg-green-50 border-green-300 text-green-700'
                      : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                  }`}>
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Short note */}
        {verdict && jobType && (
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <label className="block text-sm font-bold text-gray-900 mb-2">
              Short note <span className="text-gray-400 font-normal text-xs">(optional)</span>
            </label>
            <textarea value={note} onChange={e => setNote(e.target.value)}
              placeholder={verdict === 'negative'
                ? 'What went wrong? Be specific, not personal.'
                : 'What made them good? One sentence is enough.'}
              rows={3}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none" />
          </div>
        )}

        {/* Anonymous toggle */}
        {verdict && (
          <div className={`rounded-2xl border p-4 ${verdict === 'negative' ? 'bg-amber-50 border-amber-200' : 'bg-white border-gray-100'}`}>
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => setIsAnonymous(a => !a)}
                className={`flex-shrink-0 w-10 h-6 rounded-full transition-colors ${isAnonymous ? 'bg-green-600' : 'bg-gray-200'}`}>
                <div className={`w-4 h-4 rounded-full bg-white shadow mx-1 transition-transform ${isAnonymous ? 'translate-x-4' : ''}`} />
              </button>
              <div>
                <p className="text-sm font-bold text-gray-900">
                  {isAnonymous ? 'Anonymous confirmation' : 'Confirmation under your name'}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {verdict === 'negative'
                    ? 'Negative confirmations are anonymous by default. The signal still counts in the trust network.'
                    : 'Your name adds credibility — people in your network see you vouched for this worker.'}
                </p>
              </div>
            </div>
          </div>
        )}

        {verdict && jobType && (
          <Button onClick={handleSubmit} className="w-full" size="lg" loading={loading}>
            Submit job confirmation
          </Button>
        )}

        {verdict && !jobType && (
          <p className="text-xs text-center text-gray-400">Select a job type to continue</p>
        )}
      </div>
    </div>
  )
}
