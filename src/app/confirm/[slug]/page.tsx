'use client'
import { useState } from 'react'
import { CheckCircle, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'

// Worker lookup by slug — in production this comes from DB
const WORKERS: Record<string, { name: string; skill: string; emoji: string }> = {
  'emeka-okonkwo': { name: 'Emeka Okonkwo', skill: 'Chef / Cook', emoji: '🍳' },
  'bola-adeyemi':  { name: 'Bola Adeyemi',  skill: 'Plumber',     emoji: '🔧' },
}

const JOB_TYPES = [
  'Cooking / Chef', 'Plumbing', 'Carpentry / Joinery', 'Electrical',
  'Cleaning', 'Driving / Logistics', 'Childcare / Nanny', 'Security / Guard',
  'Tailoring / Fashion', 'Other',
]

const CONTEXT_TAGS = [
  'Family household', 'High-end project', 'Budget-conscious',
  'UK / foreign returnee', 'Corporate / office', 'Emergency callout',
]

type Verdict = 'positive' | 'neutral' | 'negative'

const VERDICTS: { key: Verdict; emoji: string; label: string; sub: string }[] = [
  { key: 'positive', emoji: '👍', label: 'Recommend',          sub: 'I would use them again' },
  { key: 'neutral',  emoji: '😐', label: 'It was okay',        sub: 'Did the job, nothing special' },
  { key: 'negative', emoji: '👎', label: 'Would not recommend', sub: 'I would not use them again' },
]

export default function ConfirmPage({ params }: { params: { slug: string } }) {
  const worker = WORKERS[params.slug]
  const [verdict, setVerdict] = useState<Verdict | null>(null)
  const [jobType, setJobType] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [note, setNote] = useState('')
  const [anon, setAnon] = useState(false)
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(false)

  function toggleTag(t: string) {
    setTags(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t])
  }

  async function submit() {
    if (!verdict || !jobType) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 800))
    setLoading(false)
    setDone(true)
  }

  if (!worker) {
    return (
      <div className="max-w-md mx-auto p-6 text-center py-20">
        <AlertCircle size={40} className="text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500">Worker not found</p>
      </div>
    )
  }

  if (done) {
    return (
      <div className="max-w-md mx-auto p-6 text-center py-20">
        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={40} className="text-green-600" />
        </div>
        <p className="text-2xl mb-2">{verdict === 'positive' ? '👍' : verdict === 'neutral' ? '😐' : '👎'}</p>
        <h2 className="text-xl font-black text-gray-900 mb-2">Confirmation sent</h2>
        <p className="text-sm text-gray-500">
          Your confirmation helps people in your network find workers they can trust.
          {anon ? ' It will appear anonymously.' : ''}
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto p-4 pb-10">
      {/* Worker header */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-4 text-center">
        <p className="text-4xl mb-2">{worker.emoji}</p>
        <h1 className="text-lg font-black text-gray-900">{worker.name}</h1>
        <p className="text-sm text-gray-500">{worker.skill}</p>
        <p className="text-xs text-gray-400 mt-2 leading-relaxed">
          {worker.name.split(' ')[0]} asked you to confirm the job you hired them for.
          Your honest response — good or bad — helps your contacts make better decisions.
        </p>
      </div>

      <div className="space-y-4">
        {/* Verdict */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <p className="text-sm font-bold text-gray-900 mb-3">Would you recommend them?</p>
          <div className="space-y-2">
            {VERDICTS.map(v => (
              <button key={v.key} type="button"
                onClick={() => { setVerdict(v.key); if (v.key === 'negative') setAnon(true) }}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                  verdict === v.key
                    ? v.key === 'positive' ? 'bg-green-50 border-green-400'
                    : v.key === 'neutral'  ? 'bg-amber-50 border-amber-400'
                    : 'bg-red-50 border-red-400'
                    : 'border-gray-100 hover:bg-gray-50'
                }`}>
                <span className="text-2xl">{v.emoji}</span>
                <div>
                  <p className="text-sm font-bold text-gray-900">{v.label}</p>
                  <p className="text-xs text-gray-400">{v.sub}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Job type */}
        {verdict && (
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <p className="text-sm font-bold text-gray-900 mb-3">What type of job? <span className="text-red-400">*</span></p>
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

        {/* Context tags */}
        {verdict && jobType && (
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <p className="text-sm font-bold text-gray-900 mb-1">Your situation <span className="text-gray-400 font-normal text-xs">(optional)</span></p>
            <p className="text-xs text-gray-400 mb-3">Helps people with similar needs find the right match</p>
            <div className="flex flex-wrap gap-2">
              {CONTEXT_TAGS.map(tag => (
                <button key={tag} type="button" onClick={() => toggleTag(tag)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors ${
                    tags.includes(tag) ? 'bg-green-50 border-green-300 text-green-700' : 'border-gray-200 text-gray-500 hover:bg-gray-50'
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
              placeholder={verdict === 'negative' ? 'What went wrong? Be specific, not personal.' : 'One sentence is enough.'}
              rows={2}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none" />
          </div>
        )}

        {/* Anonymous */}
        {verdict && (
          <div className={`rounded-2xl border p-4 ${verdict === 'negative' ? 'bg-amber-50 border-amber-200' : 'bg-white border-gray-100'}`}>
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => setAnon(a => !a)}
                className={`flex-shrink-0 w-10 h-6 rounded-full transition-colors ${anon ? 'bg-green-600' : 'bg-gray-200'}`}>
                <div className={`w-4 h-4 rounded-full bg-white shadow mx-1 transition-transform ${anon ? 'translate-x-4' : ''}`} />
              </button>
              <div>
                <p className="text-sm font-bold text-gray-900">{anon ? 'Anonymous' : 'Under your name'}</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {verdict === 'negative'
                    ? 'Negative confirmations are anonymous by default.'
                    : 'Your name adds credibility for people in your network.'}
                </p>
              </div>
            </div>
          </div>
        )}

        {verdict && jobType && (
          <Button onClick={submit} className="w-full" size="lg" loading={loading}>
            Submit confirmation
          </Button>
        )}
        {verdict && !jobType && (
          <p className="text-xs text-center text-gray-400">Select a job type to continue</p>
        )}
      </div>
    </div>
  )
}
