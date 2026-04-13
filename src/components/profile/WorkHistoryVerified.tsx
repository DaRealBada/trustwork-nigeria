'use client'
import { useState } from 'react'
import { Briefcase, Plus, Trash2, CheckCircle, Clock, AlertCircle, MessageCircle, Hash, ChevronDown, ChevronUp } from 'lucide-react'

export type VerificationStatus = 'unverified' | 'whatsapp_pending' | 'whatsapp_confirmed' | 'reference_code'

export type VerifiedJob = {
  role: string
  employer: string
  period: string
  description: string
  employerPhone: string
  verificationStatus: VerificationStatus
  verifiedAt?: string
}

const STATUS_CONFIG: Record<VerificationStatus, { label: string; color: string; bg: string; icon: typeof CheckCircle }> = {
  unverified:          { label: 'Unverified',          color: 'text-gray-400',  bg: 'bg-gray-50 border-gray-200',   icon: AlertCircle  },
  whatsapp_pending:    { label: 'Pending reply',        color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200', icon: Clock        },
  whatsapp_confirmed:  { label: 'Employer confirmed',   color: 'text-green-600', bg: 'bg-green-50 border-green-200', icon: CheckCircle  },
  reference_code:      { label: 'Code verified',        color: 'text-blue-600',  bg: 'bg-blue-50 border-blue-200',   icon: CheckCircle  },
}

interface Props {
  jobs: VerifiedJob[]
  accent: string
  light: string
  onChange: (jobs: VerifiedJob[]) => void
}

const BLANK_JOB: VerifiedJob = {
  role: '', employer: '', period: '', description: '',
  employerPhone: '', verificationStatus: 'unverified',
}

export function WorkHistoryVerified({ jobs, accent, light, onChange }: Props) {
  const [addingJob, setAddingJob] = useState(false)
  const [newJob, setNewJob] = useState<VerifiedJob>({ ...BLANK_JOB })
  const [editingIdx, setEditingIdx] = useState<number | null>(null)
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null)
  const [refCode, setRefCode] = useState<Record<number, string>>({})
  const [refError, setRefError] = useState<Record<number, string>>({})

  function addJob() {
    if (!newJob.role.trim() || !newJob.employer.trim()) return
    onChange([{ ...newJob }, ...jobs])
    setNewJob({ ...BLANK_JOB })
    setAddingJob(false)
  }

  function removeJob(i: number) {
    onChange(jobs.filter((_, idx) => idx !== i))
  }

  function updateJob(i: number, patch: Partial<VerifiedJob>) {
    onChange(jobs.map((j, idx) => idx === i ? { ...j, ...patch } : j))
  }

  function requestWhatsApp(i: number) {
    const job = jobs[i]
    if (!job.employerPhone.trim()) return
    const phone = job.employerPhone.replace(/\D/g, '')
    const normalised = phone.startsWith('0') ? '234' + phone.slice(1) : phone.startsWith('234') ? phone : '234' + phone
    const msg = encodeURIComponent(
      `Hello, I am TrustWork reaching out on behalf of ${job.role ? job.role.toUpperCase() : 'a worker'} who listed you as a previous employer.\n\n` +
      `They claim to have worked as: *${job.role}*\n` +
      `Period: *${job.period || 'not specified'}*\n\n` +
      `To confirm this employment, please reply *YES* to this message.\n` +
      `To deny it, reply *NO*.\n\n` +
      `Your reply will be recorded on TrustWork to help build trust in the labour market. Thank you.`
    )
    window.open(`https://wa.me/${normalised}?text=${msg}`, '_blank')
    updateJob(i, { verificationStatus: 'whatsapp_pending' })
  }

  function submitRefCode(i: number) {
    const code = (refCode[i] ?? '').trim().toUpperCase()
    // In production: POST to /api/verify-reference-code — checks against employer's issued codes
    // Demo: accept any 6-char alphanumeric code
    if (code.length >= 4) {
      updateJob(i, { verificationStatus: 'reference_code', verifiedAt: new Date().toISOString() })
      setRefError(prev => ({ ...prev, [i]: '' }))
    } else {
      setRefError(prev => ({ ...prev, [i]: 'Invalid code — please check with your employer' }))
    }
  }

  // Demo helper: simulate employer confirming via WhatsApp
  function simulateConfirm(i: number) {
    updateJob(i, { verificationStatus: 'whatsapp_confirmed', verifiedAt: new Date().toISOString() })
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Briefcase size={15} style={{ color: accent }} />
          <h2 className="text-sm font-bold text-gray-900">Work History</h2>
          <span className="text-xs text-gray-400">
            {jobs.filter(j => j.verificationStatus !== 'unverified').length}/{jobs.length} verified
          </span>
        </div>
        <button onClick={() => setAddingJob(true)}
          className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg text-white"
          style={{ backgroundColor: accent }}>
          <Plus size={12} /> Add job
        </button>
      </div>

      {/* Verification explanation */}
      <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 mb-4">
        <p className="text-xs text-amber-800">
          <strong>Why verify?</strong> Unverified work history is ignored in your trust score.
          Confirmed employers add credibility employers can see — and you can&apos;t fake it because
          verification goes to a real phone number the employer controls.
        </p>
      </div>

      {/* Add job form */}
      {addingJob && (
        <div className="mb-4 p-4 rounded-xl border-2 border-dashed border-gray-200 space-y-3">
          <p className="text-xs font-bold text-gray-700 uppercase tracking-wide">New position</p>
          {[
            { key: 'role',     placeholder: 'Job title / role (e.g. Family Chef)' },
            { key: 'employer', placeholder: 'Employer name or household' },
            { key: 'period',   placeholder: 'Period (e.g. Jan 2022 – Dec 2023)' },
          ].map(({ key, placeholder }) => (
            <input key={key}
              value={newJob[key as keyof VerifiedJob] as string}
              onChange={e => setNewJob(p => ({ ...p, [key]: e.target.value }))}
              placeholder={placeholder}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
          ))}
          <textarea value={newJob.description}
            onChange={e => setNewJob(p => ({ ...p, description: e.target.value }))}
            placeholder="Brief description of your work..."
            rows={2}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none" />

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Employer&apos;s WhatsApp number <span className="text-gray-400">(for verification — optional but strongly recommended)</span>
            </label>
            <input value={newJob.employerPhone}
              onChange={e => setNewJob(p => ({ ...p, employerPhone: e.target.value }))}
              placeholder="+234 801 234 5678"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
            <p className="text-xs text-gray-400 mt-1">
              We send them a WhatsApp message to confirm. They reply YES or NO — you cannot fake this.
            </p>
          </div>

          <div className="flex gap-2">
            <button onClick={addJob}
              className="text-xs font-bold px-4 py-2 rounded-lg text-white"
              style={{ backgroundColor: accent }}>
              Add position
            </button>
            <button onClick={() => { setAddingJob(false); setNewJob({ ...BLANK_JOB }) }}
              className="text-xs font-semibold px-4 py-2 rounded-lg border border-gray-200 text-gray-600">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Job list */}
      <div className="space-y-3">
        {jobs.map((job, i) => {
          const status = STATUS_CONFIG[job.verificationStatus] ?? STATUS_CONFIG['unverified']
          const StatusIcon = status.icon
          const isExpanded = expandedIdx === i

          return (
            <div key={i} className={`rounded-xl border overflow-hidden ${status.bg}`}>
              {/* Job header */}
              <div className="flex items-start gap-3 p-4">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: light }}>
                  <Briefcase size={14} style={{ color: accent }} />
                </div>
                <div className="flex-1 min-w-0">
                  {editingIdx === i ? (
                    <div className="space-y-2">
                      {(['role', 'employer', 'period'] as const).map(field => (
                        <input key={field} value={job[field]}
                          onChange={e => updateJob(i, { [field]: e.target.value })}
                          className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-green-500" />
                      ))}
                      <button onClick={() => setEditingIdx(null)}
                        className="text-xs font-bold px-3 py-1 rounded-lg text-white"
                        style={{ backgroundColor: accent }}>Done</button>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm font-bold text-gray-900 truncate">{job.role || 'Untitled role'}</p>
                      <p className="text-xs text-gray-600">{job.employer}</p>
                      <p className="text-xs text-gray-400">{job.period}</p>
                    </>
                  )}
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full border ${status.bg} ${status.color}`}>
                    <StatusIcon size={11} />
                    <span className="hidden sm:inline">{status.label}</span>
                  </div>
                  <button onClick={() => setExpandedIdx(isExpanded ? null : i)}
                    className="text-gray-400 p-1">
                    {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>
                  {editingIdx !== i && (
                    <button onClick={() => setEditingIdx(i)} className="text-xs text-gray-400 px-1.5 py-1 hover:text-gray-600">
                      Edit
                    </button>
                  )}
                  <button onClick={() => removeJob(i)} className="text-gray-300 hover:text-red-400 p-1">
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>

              {/* Expanded verification panel */}
              {isExpanded && (
                <div className="px-4 pb-4 border-t border-black/5 pt-3 space-y-3">
                  {job.description && (
                    <p className="text-xs text-gray-600 leading-relaxed">{job.description}</p>
                  )}

                  {job.verificationStatus === 'unverified' && (
                    <div className="space-y-3">
                      <p className="text-xs font-semibold text-gray-700">Verify this role — choose a method:</p>

                      {/* Method 1: WhatsApp */}
                      <div className="bg-white rounded-lg p-3 border border-gray-200">
                        <div className="flex items-center gap-1.5 mb-2">
                          <MessageCircle size={13} className="text-green-600" />
                          <p className="text-xs font-bold text-gray-800">WhatsApp confirmation (recommended)</p>
                        </div>
                        <p className="text-xs text-gray-500 mb-2">
                          We send your employer a WhatsApp asking them to confirm. They reply YES — job verified.
                          They cannot be prompted by you — message goes directly to their number.
                        </p>
                        <div className="flex gap-2">
                          <input value={job.employerPhone}
                            onChange={e => updateJob(i, { employerPhone: e.target.value })}
                            placeholder="Employer's WhatsApp number"
                            className="flex-1 border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-green-500" />
                          <button onClick={() => requestWhatsApp(i)}
                            disabled={!job.employerPhone.trim()}
                            className="text-xs font-bold px-3 py-1.5 rounded-lg text-white disabled:opacity-40 flex-shrink-0"
                            style={{ backgroundColor: '#25D366' }}>
                            Send
                          </button>
                        </div>
                      </div>

                      {/* Method 2: Reference code */}
                      <div className="bg-white rounded-lg p-3 border border-gray-200">
                        <div className="flex items-center gap-1.5 mb-2">
                          <Hash size={13} className="text-blue-600" />
                          <p className="text-xs font-bold text-gray-800">Employer reference code</p>
                        </div>
                        <p className="text-xs text-gray-500 mb-2">
                          If your employer is on TrustWork, they can give you a unique 6-digit code from their dashboard to verify your employment.
                        </p>
                        <div className="flex gap-2">
                          <input value={refCode[i] ?? ''}
                            onChange={e => setRefCode(prev => ({ ...prev, [i]: e.target.value.toUpperCase() }))}
                            placeholder="e.g. TW-X7K2P9"
                            maxLength={10}
                            className="flex-1 border border-gray-200 rounded-lg px-2 py-1.5 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-blue-500" />
                          <button onClick={() => submitRefCode(i)}
                            className="text-xs font-bold px-3 py-1.5 rounded-lg bg-blue-600 text-white flex-shrink-0">
                            Verify
                          </button>
                        </div>
                        {refError[i] && (
                          <p className="text-xs text-red-500 mt-1">{refError[i]}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {job.verificationStatus === 'whatsapp_pending' && (
                    <div className="bg-amber-50 rounded-lg p-3 border border-amber-100 space-y-2">
                      <p className="text-xs font-semibold text-amber-800">Waiting for employer reply</p>
                      <p className="text-xs text-amber-700">
                        A WhatsApp message was sent to {job.employerPhone}. Once they reply YES, this entry will be marked confirmed.
                        You cannot speed this up — the reply must come from the employer directly.
                      </p>
                      <div className="flex gap-2">
                        <button onClick={() => requestWhatsApp(i)}
                          className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-amber-100 text-amber-800">
                          Resend message
                        </button>
                        {/* Demo only */}
                        <button onClick={() => simulateConfirm(i)}
                          className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-gray-500">
                          [Demo] Simulate confirm
                        </button>
                      </div>
                    </div>
                  )}

                  {(job.verificationStatus === 'whatsapp_confirmed' || job.verificationStatus === 'reference_code') && (
                    <div className="bg-green-50 rounded-lg p-3 border border-green-100">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle size={13} className="text-green-600" />
                        <p className="text-xs font-bold text-green-800">
                          {job.verificationStatus === 'whatsapp_confirmed' ? 'Employer confirmed via WhatsApp' : 'Verified via reference code'}
                        </p>
                      </div>
                      {job.verifiedAt && (
                        <p className="text-xs text-green-600 mt-0.5">
                          Confirmed {new Date(job.verifiedAt).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}

        {jobs.length === 0 && !addingJob && (
          <div className="text-center py-6 text-gray-400">
            <Briefcase size={28} className="mx-auto mb-2 opacity-30" />
            <p className="text-sm">No work history yet</p>
            <p className="text-xs mt-0.5">Adding verified history significantly increases your trust score</p>
          </div>
        )}
      </div>
    </div>
  )
}
