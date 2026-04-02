'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Avatar } from '@/components/ui/Avatar'
import { Shield, Upload, Users } from 'lucide-react'

const MATCHED_CONTACTS = [
  { id: 'u1', name: 'Chioma Eze', city: 'Lagos', isMutual: true },
  { id: 'u2', name: 'Tunde Balogun', city: 'Lagos', isMutual: true },
  { id: 'u3', name: 'Ngozi Obi', city: 'Abuja', isMutual: false },
]

export default function ContactsPage() {
  const [synced, setSynced] = useState(false)
  const [loading, setLoading] = useState(false)
  const [pastedNumbers, setPastedNumbers] = useState('')

  async function handleSync() {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSynced(true)
    }, 1500)
  }

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-xl font-bold text-gray-900 mb-2">My Contacts</h1>
      <p className="text-sm text-gray-500 mb-6">
        Sync your phone contacts to see trust-filtered search results
      </p>

      <div className="bg-green-50 border border-green-100 rounded-xl p-4 mb-6 flex gap-3">
        <Shield className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
        <div>
          <p className="text-sm font-medium text-green-900">Your contacts&apos; privacy is protected</p>
          <p className="text-xs text-green-700 mt-0.5">
            Phone numbers are hashed in your browser before being sent. We never store names or raw phone numbers of non-users.
          </p>
        </div>
      </div>

      {!synced ? (
        <div className="space-y-4">
          <div className="bg-white border border-gray-100 rounded-xl p-4">
            <h2 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
              <Upload size={16} />
              Paste phone numbers
            </h2>
            <p className="text-xs text-gray-500 mb-3">One number per line. Any Nigerian format works (08012345678, +234...)</p>
            <textarea
              value={pastedNumbers}
              onChange={e => setPastedNumbers(e.target.value)}
              placeholder={'08012345678\n08098765432\n+2348033445566'}
              rows={5}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
            />
          </div>
          <Button onClick={handleSync} className="w-full" size="lg" loading={loading}>
            Sync Contacts
          </Button>
        </div>
      ) : (
        <div>
          <div className="bg-green-100 text-green-800 rounded-xl p-4 mb-5 text-center">
            <p className="font-semibold">Contacts synced!</p>
            <p className="text-sm mt-1">Found {MATCHED_CONTACTS.length} of your contacts on TrustWork</p>
          </div>

          <div className="flex items-center gap-2 mb-3">
            <Users size={16} className="text-gray-500" />
            <h2 className="font-semibold text-gray-900">Your contacts on TrustWork</h2>
          </div>

          <div className="space-y-2">
            {MATCHED_CONTACTS.map(c => (
              <div key={c.id} className="bg-white rounded-xl border border-gray-100 p-3 flex items-center gap-3">
                <Avatar src={null} name={c.name} size="md" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{c.name}</p>
                  <p className="text-xs text-gray-500">{c.city}</p>
                </div>
                {c.isMutual && (
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Mutual</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
