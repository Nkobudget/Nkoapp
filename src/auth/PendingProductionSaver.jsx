import { useEffect, useRef, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from './AuthContext'
import { saveOnboardingProduction, toNumber } from '../onboarding/saveOnboardingProduction'
import AuthStatus from './AuthStatus'
import { PENDING_KEY, readPending, writePending, clearPending } from './pendingProduction.js'

export { PENDING_KEY, readPending, writePending, clearPending, toNumber }

export default function PendingProductionSaver() {
  const { status, user } = useAuth()
  const attempted = useRef(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (status !== 'authenticated' || !user || !supabase || attempted.current) return
    const profile = readPending()
    if (!profile) return

    attempted.current = true
    setSaving(true)

    ;(async () => {
      try {
        const result = await saveOnboardingProduction(supabase, user, profile)
        if (result) {
          clearPending()
          window.location.replace('/app')
          return
        }
      } catch (err) {
        console.error('Could not save the onboarding draft:', err)
      } finally {
        setSaving(false)
      }
    })()
  }, [status, user])

  if (saving) {
    return <AuthStatus message="Saving your production and setting up your workspace…" />
  }

  return null
}