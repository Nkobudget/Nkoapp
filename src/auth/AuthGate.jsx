import { lazy, Suspense, useEffect, useState } from 'react'
import { useAuth } from './AuthContext'
import AuthStatus from './AuthStatus'
import AuthScreen from './AuthScreen'
import SetNewPasswordScreen from './SetNewPasswordScreen'
import OnboardingScreen from '../onboarding/OnboardingScreen'
import { onboardingKey, readOnboarding, saveOnboarding } from '../onboarding/storage'

const MainApp = lazy(() => import('../legacy/LegacyApp'))

function UserWorkspace({ user }) {
  // Keyed by user.id below: never reuse another account's completion state.
  const [record, setRecord] = useState(() => readOnboarding(user.id))
  useEffect(() => {
    const changed = event => {
      if (event.key === onboardingKey(user.id) || event.key === null) setRecord(readOnboarding(user.id))
    }
    window.addEventListener('storage', changed)
    return () => window.removeEventListener('storage', changed)
  }, [user.id])
  if (!record) return <OnboardingScreen onComplete={choices => setRecord(saveOnboarding(user.id, choices))} />
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
