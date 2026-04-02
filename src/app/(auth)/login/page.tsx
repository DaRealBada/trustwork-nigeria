'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'

export default function LoginPage() {
  const router = useRouter()
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    // TODO: trigger Supabase phone OTP
    setTimeout(() => {
      setLoading(false)
      router.push('/verify')
    }, 1000)
  }

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-1">Enter your phone number</h2>
      <p className="text-sm text-gray-500 mb-6">We&apos;ll send you a verification code via SMS</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone number</label>
          <div className="flex">
            <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
              🇳🇬 +234
            </span>
            <input
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="801 234 5678"
              className="flex-1 block w-full rounded-r-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />
          </div>
        </div>
        <Button type="submit" className="w-full" size="lg" loading={loading}>
          Send Code
        </Button>
      </form>
      <p className="text-xs text-gray-400 text-center mt-4">
        By continuing, you agree to our Terms of Service and Privacy Policy
      </p>
    </div>
  )
}
