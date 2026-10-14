import { useCallback, useEffect, useRef, useState } from 'react'
import { supabase, authConfigurationError, isRecoveryCallback, authCallbackError } from '../lib/supabaseClient'
import { AuthContext } from './AuthContext'
import { authErrorMessage, isInvalidSession } from './authErrors'

const anonymous = { status: 'anonymous', user: null, error: '', recovery: false }
const recoveryKey = 'nko_password_recovery'
function storedRecoveryUser() {
  try { return sessionStorage.getItem(recoveryKey) } catch { return null }
}
function rememberRecovery(userId) {
  try { if (userId) sessionStorage.setItem(recoveryKey, userId); else sessionStorage.removeItem(recoveryKey) } catch { /* In-memory recovery still works. */ }
}

export default function AuthProvider({ children }) {
  const [state, setState] = useState({ status: 'loading', user: null, error: '' })
  const generation = useRef(0)
  const mounted = useRef(false)
  const recoveryIntent = useRef(isRecoveryCallback)
  const currentUserId = useRef(null)
  const [callbackError, setCallbackError] = useState(authCallbackError)

  const restoreSession = useCallback(async () => {
    const attempt = ++generation.current
    const update = next => {
      if (mounted.current && attempt === generation.current) setState(next)
    }
    if (!supabase) {
      update({ status: 'error', user: null, error: authConfigurationError })
      return
    }
    try {
      const { data, error } = await supabase.auth.getSession()
      if (error) throw error
      if (!data.session) { currentUserId.current = null; update(anonymous); return }

      // Stored session JSON is not proof of identity. Validate with Auth before
      // rendering private pages; Supabase refreshes expired tokens in getSession.
      const { data: identity, error: identityError } = await supabase.auth.getUser(data.session.access_token)
      if (identityError) throw identityError
      if (!identity.user || identity.user.id !== data.session.user.id) {
        throw Object.assign(new Error('Invalid session'), { status: 401 })
      }
      if (!mounted.current || attempt !== generation.current) return
      currentUserId.current = identity.user.id
      const recovery = recoveryIntent.current || storedRecoveryUser() === identity.user.id
      if (recovery) rememberRecovery(identity.user.id)
      recoveryIntent.current = false
      update({ status: 'authenticated', user: identity.user, error: '', recovery })
    } catch (error) {
      if (!mounted.current || attempt !== generation.current) return
      if (isInvalidSession(error)) {
        recoveryIntent.current = false
        rememberRecovery(null)
        update(anonymous)
        await supabase.auth.signOut({ scope: 'local' })
      } else {
        update({ status: 'error', user: null, error: authErrorMessage(error) })
      }
    }
  }, [])

  useEffect(() => {
    mounted.current = true
    const timers = new Set()
    const subscription = supabase?.auth.onAuthStateChange((event, session) => {
      if (event === 'INITIAL_SESSION') return // The explicit restore below owns initialization.
      if (!session) {
        generation.current += 1
        currentUserId.current = null
        recoveryIntent.current = false
        rememberRecovery(null)
        setState(anonymous)
        return
      }
      if (event === 'PASSWORD_RECOVERY') recoveryIntent.current = true
      if (session.user.id !== currentUserId.current || event === 'PASSWORD_RECOVERY') {
        generation.current += 1
        setState({ status: 'loading', user: null, error: '', recovery: false })
      }
      // Run SDK calls outside its auth event lock.
      const timer = setTimeout(() => {
        timers.delete(timer)
        void restoreSession()
      }, 0)
      timers.add(timer)
    }).data.subscription
    void restoreSession()
    return () => {
      mounted.current = false
      generation.current += 1
      timers.forEach(clearTimeout)
      subscription?.unsubscribe()
    }
  }, [restoreSession])

  const signIn = async ({ email, password }) => {
    if (!supabase) throw new Error(authConfigurationError)
    setCallbackError('')
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
    if (error) throw error
    await restoreSession()
  }

  const signUp = async ({ email, password }) => {
    if (!supabase) throw new Error(authConfigurationError)
    setCallbackError('')
    const { data, error } = await supabase.auth.signUp({ email: email.trim(), password,
      options: { emailRedirectTo: `${window.location.origin}/app` },
    })
    if (error) throw error
    if (data.session) await restoreSession()
    return { requiresConfirmation: !data.session }
  }

  const requestPasswordReset = async email => {
    if (!supabase) throw new Error(authConfigurationError)
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo: `${window.location.origin}/app` })
    if (error) throw error
  }

  const updatePassword = async password => {
    const { error } = await supabase.auth.updateUser({ password })
    if (error) throw error
    recoveryIntent.current = false
    rememberRecovery(null)
    setState(value => ({ ...value, recovery: false }))
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut({ scope: 'local' })
    if (error) throw error
    generation.current += 1
    recoveryIntent.current = false
    rememberRecovery(null)
    setState(anonymous)
  }

  return <AuthContext.Provider value={{ ...state, signIn, signUp, signOut, requestPasswordReset, updatePassword, callbackError, retry: restoreSession }}>
    {children}
  </AuthContext.Provider>
}
