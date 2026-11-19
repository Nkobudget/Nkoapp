import { useEffect, useRef } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from './AuthContext'
import { saveOnboardingProduction, toNumber } from '../onboarding/saveOnboardingProduction'

// The onboarding draft is parked here while the user signs in. sessionStorage
// survives the Google redirect (router state does not).
export const PENDING_KEY = 'nko_pending_production'

export function readPending() {
  try {
    const raw = sessionStorage.getItem(PENDING_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function clearPending() {
  try { sessionStorage.removeItem(PENDING_KEY) } catch { /* ignore */ }
}

export { toNumber }

export default function PendingProductionSaver() {
  const { status, user } = useAuth()
  const attempted = useRef(false)

  useEffect(() => {
    if (status !== 'authenticated' || !user || !supabase || attempted.current) return
    const profile = readPending()
    if (!profile) return

    attempted.current = true

    ;(async () => {
      try {
        const result = await saveOnboardingProduction(supabase, user, profile)
        if (result) {
          clearPending()
          window.location.replace('/app')
        }
      } catch (err) {
        console.error('Could not save the onboarding draft:', err)
      }
    })()
  }, [status, user])

  return null
}