import { lazy, Suspense, useEffect, useState } from 'react'
import { useAuth } from './AuthContext'
import AuthStatus from './AuthStatus'
import AuthScreen from './AuthScreen'
import SetNewPasswordScreen from './SetNewPasswordScreen'
import OnboardingScreen from '../onboarding/OnboardingScreen'
import { isCompleteOnboarding, onboardingKey, readOnboarding, saveOnboarding } from '../onboarding/storage'
import { ROLES, MARKETS } from '../onboarding/options'
import { supabase } from '../lib/supabaseClient'

const MainApp = lazy(() => import('../legacy/LegacyApp'))

function resolveKnownOnboarding(user) {
  const local = readOnboarding(user.id)
  if (local) return local
  const meta = user?.user_metadata?.onboarding
  if (isCompleteOnboarding(meta)) {
    try { window.localStorage.setItem(onboardingKey(user.id), JSON.stringify(meta)) } catch { /* ignore */ }
    return meta
  }
  if (user?.user_metadata?.onboarding_completed) {
    const fallback = {
      role: ROLES.some(r => r.id === meta?.role) ? meta.role : ROLES[0].id,
      market: MARKETS.some(m => m.code === meta?.market) ? meta.market : MARKETS[0].code,
      completedAt: Number.isSafeInteger(meta?.completedAt) && meta.completedAt > 0 ? meta.completedAt : Date.now(),
    }
    try { window.localStorage.setItem(onboardingKey(user.id), JSON.stringify(fallback)) } catch { /* ignore */ }
    return fallback
  }
  return null
}

function UserWorkspace({ user }) {
  // Keyed by user.id below: never reuse another account's completion state.
  const [record, setRecord] = useState(() => resolveKnownOnboarding(user))
  const [checking, setChecking] = useState(() => !resolveKnownOnboarding(user) && Boolean(supabase))

  useEffect(() => {
    const changed = event => {
      if (event.key === onboardingKey(user.id) || event.key === null) setRecord(resolveKnownOnboarding(user))
    }
    window.addEventListener('storage', changed)
    return () => window.removeEventListener('storage', changed)
  }, [user])

  useEffect(() => {
    if (record || !supabase) { setChecking(false); return }
    let active = true
    ;(async () => {
      try {
        const [{ data: owned }, { data: shared }] = await Promise.all([
          supabase.from('projects').select('id').eq('user_id', user.id).limit(1),
          supabase.from('collaborators').select('id').eq('user_id', user.id).limit(1),
        ])
        if (!active) return
        if ((owned && owned.length > 0) || (shared && shared.length > 0)) {
          const saved = saveOnboarding(user.id, { role: ROLES[0].id, market: MARKETS[0].code })
          setRecord(saved)
          void supabase.auth.updateUser({ data: { onboarding: saved, onboarding_completed: true } }).catch(() => {})
        }
      } catch {
        // Fall back to standard onboarding if remote check fails.
      } finally {
        if (active) setChecking(false)
      }
    })()
    return () => { active = false }
  }, [record, user.id])

  if (checking) return <AuthStatus />
  if (!record) return (
    <OnboardingScreen
      onComplete={choices => {
        const saved = saveOnboarding(user.id, choices)
        setRecord(saved)
        void supabase?.auth.updateUser({ data: { onboarding: saved, onboarding_completed: true } }).catch(() => {})
      }}
    />
  )
  return <Suspense fallback={<AuthStatus />}><MainApp key={user.id} /></Suspense>
}

export default function AuthGate() {
  const { status, user, recovery, error, retry } = useAuth()
  if (status === 'loading') return <AuthStatus />
  if (status === 'error') return <AuthStatus error={error} onRetry={retry} />
  if (recovery && user) return <SetNewPasswordScreen />
  if (!user) return <AuthScreen />
  return <UserWorkspace key={user.id} user={user} />
}
