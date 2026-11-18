import { useEffect, useRef } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from './AuthContext'

// The onboarding draft is parked here while the user signs in. sessionStorage
// survives the Google redirect (router state does not).
export const PENDING_KEY = 'nko_pending_production'

function readPending() {
  try {
    const raw = sessionStorage.getItem(PENDING_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function clearPending() {
  try { sessionStorage.removeItem(PENDING_KEY) } catch { /* ignore */ }
}

// "25,000,000" -> 25000000. Returns null when there is no usable number.
function toNumber(value) {
  const n = Number(String(value ?? '').replace(/[^0-9.]/g, ''))
  return Number.isFinite(n) && n > 0 ? n : null
}

export default function PendingProductionSaver() {
  const { status, user } = useAuth()
  const attempted = useRef(false)

  useEffect(() => {
    if (status !== 'authenticated' || !user || !supabase || attempted.current) return
    const profile = readPending()
    if (!profile) return

    // One attempt per page load. If it fails, the draft stays in sessionStorage
    // and is tried again on the next load.
    attempted.current = true

    ;(async () => {
      const { error } = await supabase.from('projects').insert({
        id: crypto.randomUUID(),
        user_id: user.id,
        // NOTE: these profile field names are best guesses. Check them against
        // your onboarding state (console.log the profile) and adjust.
        name: profile.productionName || profile.projectName || profile.title || profile.name || 'Untitled production',
        type: profile.productionType || profile.type || null,
        base_currency: profile.currency || 'NGN',
        target_budget: toNumber(profile.budgetAmount),
      })

      if (error) {
        console.error('Could not save the onboarding draft:', error.message)
        return
      }
      clearPending()
      // Reload so the workspace loads with the new project in it.
      window.location.replace('/app')
    })()
  }, [status, user])

  return null
}