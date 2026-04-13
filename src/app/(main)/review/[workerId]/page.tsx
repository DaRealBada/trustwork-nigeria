'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Star, CheckCircle, AlertCircle, ShieldCheck, Eye, EyeOff, Calendar, Banknote } from 'lucide-react'

type ReviewStep = 'hire_gate' | 'rating' | 'review' | 'submitted'

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

const PAYMENT_OPTIONS = [
  'Bank transfer',
  'Cash',
  'Palmpay / Opay / mobile money',
  'Agreed rate, paid after job',
]

const RATING_LABELS = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent']

const STRUCTURED_QUESTIONS = [
  { key: 'punctual',   label: 'Did they show up on time?'           },
  { key: 'quality',   label: 'Was the quality of work as expected?' },
  { key: 'honest',    label: 'Were they honest and trustworthy?'    },
  { key: 'rehire',    label: 'Would you hire them again?'           },
]

export default function ReviewPage({ params }: { params: { workerId: string } }) {
  const router = useRouter()
  const workerName = WORKER_NAMES[params.workerId] ?? 'this worker'

  // Hire gate state
  const [hireDate, setHireDate] = useState('')
  const [howFound, setHowFound] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('')
  const [, setHireConfirmed] = useState(false)
  const [gateError, setGateError] = useState('')

  // Review state
  const [step, setStep] = useState<ReviewStep>('hire_gate')
  const [rating, setRating] = useState(0)
  const [hover, setHover] = useState(0)
  const [structured, setStructured] = useState<Record<string, boolean | null>>({
    punctual: null, quality: null, honest: null, rehire: null,
  })
  const [body, setBody] = useState('')
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [loading, setLoading] = useState(false)

  // Auto-suggest anonymity for negative reviews
  const isNegative = rating > 0 && rating <= 2

  function confirmHire() {
    setGateError('')
    if (!hireDate) { setGateError('Please enter when you hired them'); return }
    if (!howFound) { setGateError('Please select how you found them'); return }
    if (!paymentMethod) { setGateError('Please select the payment method'); return }

    // Validate hire date is within past 60 days
    const hired = new Date(hireDate)
    const now = new Date()
    const daysDiff = (now.getTime() - hired.getTime()) / (1000 * 60 * 60 * 24)
    if (daysDiff > 365) {
      setGateError('You can only review workers hired within the past 12 months')
      return
    }
    if (hired > now) {
      setGateError('Hire date cannot be in the future')
      return
    }
    setHireConfirmed(true)
    setStep('rating')
  }

  function toggleStructured(key: string, val: boolean) {
    setStructured(prev => ({ ...prev, [key]: prev[key] === val ? null : val }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (rating === 0 || body.length < 20) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 1000))
    setLoading(false)
    setStep('submitted')
  }

  // ── Hire confirmation gate ──
  if (step === 'hire_gate') {
    return (
      <div className="max-w-lg mx-auto p-4 pb-10">
        <div className="mb-5">
          <h1 className="text-xl font-black text-gray-900">Write a Review</h1>
          <p className="text-sm text-gray-500 mt-1">
            TrustWork only accepts reviews from verified hires. This protects workers from fake negative reviews and employers from fake positive ones.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-4">
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck size={16} className="text-green-600" />
            <h2 className="text-sm font-bold text-gray-900">Confirm you hired {workerName.split(' ')[0]}</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                When did you hire them? <span className="text-red-400">*</span>
              </label>
              <input type="date" value={hireDate} onChange={e => setHireDate(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
              <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                <Calendar size={10} />
                Reviews only accepted within 12 months of hire date
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                How did you find them? <span className="text-red-400">*</span>
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

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                How did you pay them? <span className="text-red-400">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {PAYMENT_OPTIONS.map(opt => (
                  <label key={opt} className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-colors ${
                    paymentMethod === opt ? 'border-green-300 bg-green-50' : 'border-gray-200 hover:bg-gray-50'
                  }`}>
                    <input type="radio" name="payment" value={opt}
                      checked={paymentMethod === opt} onChange={() => setPaymentMethod(opt)} className="sr-only" />
                    <Banknote size={13} className={paymentMethod === opt ? 'text-green-600' : 'text-gray-400'} />
                    <span className="text-xs text-gray-700">{opt}</span>
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
                <strong>Why do we ask this?</strong> False reviews are a serious problem in digital marketplaces.
                By confirming hire details, your review gets a <em>Verified Hire</em> badge that carries significantly
                more weight in the worker&apos;s trust score. Workers cannot ask you to leave reviews — only genuine employers can.
              </p>
            </div>

            <Button onClick={confirmHire} className="w-full" size="lg">
              Confirm & write review
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // ── Submitted ──
  if (step === 'submitted') {
    return (
      <div className="max-w-lg mx-auto p-4 text-center py-16">
        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={40} className="text-green-600" />
        </div>
        <h2 className="text-xl font-black text-gray-900 mb-2">Review submitted</h2>
        <p className="text-sm text-gray-500 mb-1">
          {isAnonymous ? 'Your review will appear anonymously.' : `Your review will appear under your name.`}
        </p>
        <p className="text-sm text-gray-500 mb-6">
          Verified hire reviews update the worker&apos;s trust score within 24 hours.
        </p>
        <button onClick={() => router.push(`/worker/${params.workerId}`)}
          className="bg-green-600 text-white font-bold px-6 py-3 rounded-xl text-sm">
          Back to {workerName.split(' ')[0]}&apos;s profile
        </button>
      </div>
    )
  }

  // ── Rating + Review ──
  return (
    <div className="max-w-lg mx-auto p-4 pb-10">
      {/* Hire confirmed banner */}
      <div className="flex items-center gap-2 bg-green-50 border border-green-100 rounded-xl px-4 py-2.5 mb-5">
        <CheckCircle size={14} className="text-green-600 flex-shrink-0" />
        <p className="text-xs text-green-700 font-semibold">Hire confirmed — your review will carry a Verified Hire badge</p>
      </div>

      <div className="mb-5">
        <h1 className="text-xl font-black text-gray-900">Rate {workerName.split(' ')[0]}</h1>
        <p className="text-sm text-gray-500 mt-0.5">Your honest review helps others in your network make better decisions</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Star rating */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 text-center">
          <p className="text-sm font-semibold text-gray-700 mb-3">Overall rating</p>
          <div className="flex justify-center gap-2">
            {[1,2,3,4,5].map(i => (
              <button key={i} type="button"
                onClick={() => { setRating(i); setIsAnonymous(i <= 2) }}
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(0)}>
                <Star size={36} className={i <= (hover || rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'} />
              </button>
            ))}
          </div>
          <p className="text-sm font-semibold mt-2 text-gray-600">
            {rating === 0 ? 'Tap to rate' : RATING_LABELS[rating]}
          </p>
        </div>

        {/* Structured yes/no questions */}
        {rating > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <p className="text-sm font-bold text-gray-900 mb-3">Quick questions</p>
            <div className="space-y-3">
              {STRUCTURED_QUESTIONS.map(({ key, label }) => (
                <div key={key} className="flex items-center justify-between gap-3">
                  <span className="text-sm text-gray-700 flex-1">{label}</span>
                  <div className="flex gap-2 flex-shrink-0">
                    {[true, false].map(val => (
                      <button key={String(val)} type="button"
                        onClick={() => toggleStructured(key, val)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-colors ${
                          structured[key] === val
                            ? val ? 'bg-green-600 text-white border-green-600' : 'bg-red-500 text-white border-red-500'
                            : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
                        }`}>
                        {val ? 'Yes' : 'No'}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Written review */}
        {rating > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <label className="block text-sm font-bold text-gray-900 mb-2">
              Written review <span className="text-gray-400 font-normal text-xs">(min 20 characters)</span>
            </label>
            <textarea value={body} onChange={e => setBody(e.target.value)}
              placeholder={rating <= 2
                ? "Tell others what went wrong. Be specific about what happened — not personal."
                : "Tell others what made them great. Specific details help future employers most."}
              rows={4}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none" />
            <p className="text-xs text-gray-400 mt-1">{body.length} characters</p>
          </div>
        )}

        {/* Anonymous toggle — auto-on for negative reviews */}
        {rating > 0 && (
          <div className={`rounded-2xl border p-4 ${isNegative ? 'bg-amber-50 border-amber-200' : 'bg-white border-gray-100'}`}>
            <div className="flex items-start gap-3">
              <button type="button" onClick={() => setIsAnonymous(a => !a)}
                className={`flex-shrink-0 w-10 h-6 rounded-full transition-colors mt-0.5 ${isAnonymous ? 'bg-green-600' : 'bg-gray-200'}`}>
                <div className={`w-4 h-4 rounded-full bg-white shadow mx-1 transition-transform ${isAnonymous ? 'translate-x-4' : ''}`} />
              </button>
              <div>
                <div className="flex items-center gap-2">
                  {isAnonymous ? <EyeOff size={13} className="text-amber-600" /> : <Eye size={13} className="text-gray-500" />}
                  <p className="text-sm font-bold text-gray-900">
                    {isAnonymous ? 'Anonymous review' : 'Review under your name'}
                  </p>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  {isNegative
                    ? 'Negative reviews are anonymous by default to protect your relationship with the worker\'s community. The review is still verified and counted in their trust score.'
                    : 'Your name adds credibility — employers in your network see you vouched for this worker.'}
                </p>
              </div>
            </div>
          </div>
        )}

        {rating > 0 && body.length >= 20 && (
          <Button type="submit" className="w-full" size="lg" loading={loading}>
            Submit verified review
          </Button>
        )}

        {rating > 0 && body.length < 20 && body.length > 0 && (
          <p className="text-xs text-center text-gray-400">{20 - body.length} more characters needed</p>
        )}
      </form>
    </div>
  )
}
