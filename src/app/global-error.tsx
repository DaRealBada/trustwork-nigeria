'use client'

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-4xl mb-4">⚠️</p>
          <h2 className="text-lg font-semibold mb-2">Something went wrong</h2>
          <button onClick={reset} className="text-sm text-green-600 hover:underline">
            Try again
          </button>
        </div>
      </body>
    </html>
  )
}
