/**
 * Client-side SHA-256 hashing of phone numbers.
 * We hash before sending to the server so plaintext contact
 * phone numbers of non-users are never transmitted.
 */
export async function hashPhone(normalizedPhone: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(normalizedPhone)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

export async function hashPhoneList(normalizedPhones: string[]): Promise<string[]> {
  return Promise.all(normalizedPhones.map(hashPhone))
}
