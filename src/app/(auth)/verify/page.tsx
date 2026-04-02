'use client'
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'

export default function VerifyPage() {
  const router = useRouter()
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const inputs = useRef<(HTMLInputElement | null)[]>([])

  function handleChange(i: number, val: string) {
    if (!/^\d?$/.test(val)) return
    const next = [...otp]
    next[i] = val
    setOtp(next)
    if (val && i < 5) inputs.current[i + 1]?.focus()
  }

  function handleKeyDown(i: number, e: React.KeyboardEvent) {
    if (e.key === 'Backspace' && !otp[i] && i > 0) inputs.current[i - 1]?.focus()
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      router.push('/onboarding')
    }, 1000)
  }

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-1">Enter verification code</h2>
      <p className="text-sm text-gray-500 mb-6">Code sent to +234 801 234 5678</p>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex gap-2 justify-between">
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={el => { inputs.current[i] = el }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={e => handleChange(i, e.target.value)}
              onKeyDown={e => handleKeyDown(i, e)}
              className="w-12 h-12 text-center text-xl font-semibold border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          ))}
        </div>
        <Button type="submit" className="w-full" size="lg" loading={loading}>
          Verify
        </Button>
      </form>
      <button className="text-sm text-green-600 text-center w-full mt-4 hover:underline">
        Resend code
      </button>
    </div>
  )
}
