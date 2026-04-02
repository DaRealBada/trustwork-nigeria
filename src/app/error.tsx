'use client'
import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center">
        <p className="text-4xl mb-4">⚠️</p>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Something went wrong</h2>
        <button
          onClick={reset}
          className="text-sm text-green-600 hover:underline"
        >
          Try again
        </button>
      </div>
    </div>
  )
}
