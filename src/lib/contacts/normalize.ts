/**
 * Normalizes Nigerian phone numbers to E.164 format (+234XXXXXXXXXX)
 * Handles all common formats:
 *   08012345678    -> +2348012345678
 *   8012345678     -> +2348012345678
 *   2348012345678  -> +2348012345678
 *   +2348012345678 -> +2348012345678
 */
export function normalizeNigerianPhone(raw: string): string | null {
  const digits = raw.replace(/\D/g, '')

  if (digits.startsWith('234') && digits.length === 13) {
    return '+' + digits
  }
  if (digits.startsWith('0') && digits.length === 11) {
    return '+234' + digits.slice(1)
  }
  if (!digits.startsWith('0') && digits.length === 10) {
    return '+234' + digits
  }
  return null
}

export function normalizePhoneList(rawNumbers: string[]): string[] {
  const seen = new Set<string>()
  const results: string[] = []
  for (const raw of rawNumbers) {
    const normalized = normalizeNigerianPhone(raw.trim())
    if (normalized && !seen.has(normalized)) {
      seen.add(normalized)
      results.push(normalized)
    }
  }
  return results
}
