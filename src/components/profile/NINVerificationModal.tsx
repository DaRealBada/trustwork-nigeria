'use client'
import { useState, useRef } from 'react'
import { ShieldCheck, X, Camera, CheckCircle, AlertCircle, ChevronRight, Eye, EyeOff } from 'lucide-react'

type Step = 'intro' | 'nin' | 'face' | 'verifying' | 'success' | 'failed'

interface Props {
  onClose: () => void
  onVerified: () => void
}

const STEPS = ['intro', 'nin', 'face', 'verifying', 'success']

function StepDots({ current }: { current: Step }) {
  const idx = STEPS.indexOf(current)
  return (
    <div className="flex gap-1.5 justify-center mb-5">
      {[0, 1, 2].map(i => (
        <div key={i} className={`h-1.5 rounded-full transition-all ${
          i < idx ? 'w-6 bg-green-500' : i === idx ? 'w-6 bg-green-500' : 'w-1.5 bg-gray-200'
        }`} />
      ))}
    </div>
  )
}

export function NINVerificationModal({ onClose, onVerified }: Props) {
  const [step, setStep] = useState<Step>('intro')
  const [nin, setNin] = useState('')
  const [dob, setDob] = useState('')
  const [fullName, setFullName] = useState('')
  const [showNin, setShowNin] = useState(false)
  const [faceScanned, setFaceScanned] = useState(false)
  const [error, setError] = useState('')
  const scanRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  function handleNINInput(val: string) {
    const digits = val.replace(/\D/g, '').slice(0, 11)
    setNin(digits)
  }

  function submitNIN() {
    setError('')
    if (nin.length !== 11) { setError('NIN must be exactly 11 digits'); return }
    if (!dob) { setError('Please enter your date of birth'); return }
    if (!fullName.trim()) { setError('Please enter your full name as on your NIN card'); return }
    setStep('face')
  }

  function startFaceScan() {
    setFaceScanned(false)
    scanRef.current = setTimeout(() => setFaceScanned(true), 2500)
  }

  function submitFace() {
    if (!faceScanned) return
    setStep('verifying')
    setTimeout(() => {
      // In production: call YouVerify / VerifyMe API with NIN + DOB + face biometric
      // For demo: any 11-digit NIN passes
      setStep('success')
    }, 3000)
  }

  function handleSuccess() {
    onVerified()
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <ShieldCheck size={18} className="text-green-600" />
            <span className="font-bold text-gray-900 text-sm">Identity Verification</span>
          </div>
          {step !== 'verifying' && (
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X size={18} />
            </button>
          )}
        </div>

        <div className="px-5 py-5">

          {/* ── Intro ── */}
          {step === 'intro' && (
            <div>
              <StepDots current="intro" />
              <div className="text-center mb-5">
                <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <ShieldCheck size={32} className="text-green-600" />
                </div>
                <h2 className="text-lg font-black text-gray-900">Verify your identity</h2>
                <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                  TrustWork uses your NIN to confirm you are who you say you are.
                  A verified identity unlocks the <strong>TrustWork Verified</strong> badge and adds
                  <strong> +30%</strong> to your trust score.
                </p>
              </div>
              <div className="space-y-2 mb-5">
                {[
                  'Your NIN is verified via NIMC — TrustWork does not store it',
                  'A face check confirms the NIN belongs to you',
                  'Verification is permanent — no repeat steps',
                  'NIN-linked identity prevents banned workers from creating new accounts',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <CheckCircle size={14} className="text-green-500 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-gray-600">{item}</p>
                  </div>
                ))}
              </div>
              <button onClick={() => setStep('nin')}
                className="w-full py-3 rounded-xl bg-green-600 text-white font-bold text-sm flex items-center justify-center gap-2">
                Start verification <ChevronRight size={16} />
              </button>
            </div>
          )}

          {/* ── NIN + DOB input ── */}
          {step === 'nin' && (
            <div>
              <StepDots current="nin" />
              <h2 className="text-base font-black text-gray-900 mb-1">Enter your NIN details</h2>
              <p className="text-xs text-gray-500 mb-4">Your 11-digit National Identification Number as issued by NIMC</p>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">NIN (11 digits)</label>
                  <div className="relative">
                    <input
                      type={showNin ? 'text' : 'password'}
                      inputMode="numeric"
                      value={nin}
                      onChange={e => handleNINInput(e.target.value)}
                      placeholder="12345678901"
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-green-500 pr-10"
                    />
                    <button type="button" onClick={() => setShowNin(s => !s)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                      {showNin ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{nin.length}/11 digits entered</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Date of birth</label>
                  <input type="date" value={dob} onChange={e => setDob(e.target.value)}
                    max={new Date(Date.now() - 16 * 365.25 * 24 * 3600 * 1000).toISOString().split('T')[0]}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Full name (as on NIN card)</label>
                  <input type="text" value={fullName} onChange={e => setFullName(e.target.value)}
                    placeholder="e.g. OKONKWO EMEKA JAMES"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm uppercase focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>

                {error && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 rounded-xl border border-red-100">
                    <AlertCircle size={14} className="text-red-500 flex-shrink-0" />
                    <p className="text-xs text-red-600">{error}</p>
                  </div>
                )}

                <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
                  <p className="text-xs text-blue-700">
                    <strong>Privacy:</strong> Your NIN is sent directly to NIMC via encrypted connection. TrustWork stores only a confirmation token — never your raw NIN.
                  </p>
                </div>

                <button onClick={submitNIN}
                  className="w-full py-3 rounded-xl bg-green-600 text-white font-bold text-sm flex items-center justify-center gap-2">
                  Continue to face check <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* ── Face check ── */}
          {step === 'face' && (
            <div>
              <StepDots current="face" />
              <h2 className="text-base font-black text-gray-900 mb-1">Face verification</h2>
              <p className="text-xs text-gray-500 mb-4">
                We compare your live selfie to the photo on your NIN record. This ensures no one else can use your NIN.
              </p>

              {/* Simulated camera viewfinder */}
              <div className="relative bg-gray-900 rounded-2xl overflow-hidden mb-4" style={{ height: 220 }}>
                <div className="absolute inset-0 flex items-center justify-center">
                  {!faceScanned ? (
                    <div className="text-center">
                      <Camera size={40} className="text-white/40 mx-auto mb-2" />
                      <p className="text-white/60 text-xs">Camera will activate here</p>
                      <p className="text-white/40 text-xs mt-1">(demo mode — tap scan below)</p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <CheckCircle size={48} className="text-green-400 mx-auto mb-2" />
                      <p className="text-green-400 font-bold text-sm">Face detected</p>
                    </div>
                  )}
                </div>
                {/* Face oval guide */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-36 h-44 border-2 border-white/30 rounded-full" />
                </div>
                {faceScanned && (
                  <div className="absolute inset-0 bg-green-500/10" />
                )}
              </div>

              <div className="space-y-2">
                {!faceScanned ? (
                  <button onClick={startFaceScan}
                    className="w-full py-3 rounded-xl bg-gray-900 text-white font-bold text-sm flex items-center justify-center gap-2">
                    <Camera size={15} />
                    Scan face (demo simulation)
                  </button>
                ) : (
                  <button onClick={submitFace}
                    className="w-full py-3 rounded-xl bg-green-600 text-white font-bold text-sm flex items-center justify-center gap-2">
                    <CheckCircle size={15} />
                    Face matched — submit for verification
                  </button>
                )}
                <p className="text-xs text-center text-gray-400">
                  In production this opens your phone camera. No photos are stored.
                </p>
              </div>
            </div>
          )}

          {/* ── Verifying ── */}
          {step === 'verifying' && (
            <div className="text-center py-6">
              <div className="w-16 h-16 mx-auto mb-4 relative">
                <div className="w-16 h-16 rounded-full border-4 border-green-100 border-t-green-600 animate-spin" />
                <ShieldCheck size={20} className="text-green-600 absolute inset-0 m-auto" />
              </div>
              <h2 className="text-base font-black text-gray-900 mb-1">Verifying with NIMC</h2>
              <p className="text-sm text-gray-500">Checking your NIN against the national database...</p>
              <div className="mt-4 space-y-1.5">
                {['Connecting to NIMC database', 'Matching NIN and date of birth', 'Running face biometric check'].map((s, i) => (
                  <p key={i} className="text-xs text-gray-400 flex items-center justify-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" style={{ animationDelay: `${i * 0.3}s` }} />
                    {s}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* ── Success ── */}
          {step === 'success' && (
            <div className="text-center py-4">
              <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldCheck size={40} className="text-green-600" />
              </div>
              <h2 className="text-xl font-black text-gray-900 mb-1">Identity Verified</h2>
              <p className="text-sm text-gray-500 mb-4">
                Your NIN has been confirmed by NIMC. Your trust score just went up <strong className="text-green-600">+30%</strong>.
              </p>
              <div className="bg-green-50 rounded-xl p-4 mb-5 border border-green-100">
                <div className="flex items-center gap-2 justify-center mb-2">
                  <ShieldCheck size={16} className="text-green-600" />
                  <span className="text-sm font-bold text-green-700">TrustWork Verified badge unlocked</span>
                </div>
                <p className="text-xs text-gray-500">
                  This badge now appears on your public profile and in search results. Verified workers appear higher in employer searches.
                </p>
              </div>
              <button onClick={handleSuccess}
                className="w-full py-3 rounded-xl bg-green-600 text-white font-bold text-sm">
                View my updated profile
              </button>
            </div>
          )}

          {/* ── Failed ── */}
          {step === 'failed' && (
            <div className="text-center py-4">
              <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle size={40} className="text-red-500" />
              </div>
              <h2 className="text-lg font-black text-gray-900 mb-1">Verification failed</h2>
              <p className="text-sm text-gray-500 mb-4">
                The details you entered did not match the NIMC database. Please check your NIN and date of birth and try again.
              </p>
              <div className="space-y-2">
                <button onClick={() => { setStep('nin'); setError('') }}
                  className="w-full py-3 rounded-xl bg-gray-900 text-white font-bold text-sm">
                  Try again
                </button>
                <button onClick={onClose} className="w-full py-3 rounded-xl border border-gray-200 text-gray-600 font-semibold text-sm">
                  Cancel
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
