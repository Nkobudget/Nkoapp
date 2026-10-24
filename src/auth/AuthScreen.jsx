import { useEffect, useId, useRef, useState } from 'react'
import { LoaderCircle } from 'lucide-react'
import { useSearchParams } from 'react-router'
import { useAuth } from './AuthContext'
import { useLang } from '../i18n/LangContext'
import { authErrorMessage } from './authErrors'
import AuthCard from './AuthCard'
import TermsModal from './TermsModal'

export default function AuthScreen({ defaultMode }) {
  const { signIn, signUp, requestPasswordReset, callbackError } = useAuth()
  const { t, lang } = useLang()
  const [searchParams] = useSearchParams()
  const initialMode = defaultMode || (searchParams.get('mode') === 'signup' || searchParams.get('signup') !== null ? 'signup' : 'login')
  const [mode, setMode] = useState(initialMode)

  useEffect(() => {
    const qMode = searchParams.get('mode')
    if (qMode === 'signup' || qMode === 'login') {
      setMode(qMode)
    }
  }, [searchParams])

  const [showPassword, setShowPassword] = useState(false)
  const [showTerms, setShowTerms] = useState(false)
  const [agreed, setAgreed] = useState(false)
  const [pending, setPending] = useState('')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState(callbackError)
  const busy = useRef(false)
  const email = useRef(null)
  const id = useId()
  const field = 'min-h-11 w-full rounded-md border border-palette-graphite bg-palette-dark-gray px-3 py-2 text-sm text-palette-ivory placeholder:text-palette-stone focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-palette-gold'

  async function run(action, task) {
    if (busy.current) return
    busy.current = true; setPending(action); setError(''); setNotice('')
    try { await task() } catch (failure) { setError(authErrorMessage(failure)) }
    finally { busy.current = false; setPending('') }
  }
  function submit(event) {
    event.preventDefault()
    if (mode === 'signup' && !agreed) { setError('Please agree to the Terms & Conditions to create an account.'); return }
    const data = new FormData(event.currentTarget)
    const credentials = { email: String(data.get('email')), password: String(data.get('password')) }
    void run('submit', async () => {
      if (mode === 'login') await signIn(credentials)
      else {
        const result = await signUp(credentials)
        if (result.requiresConfirmation) setNotice(lang === 'fr' ? 'Consultez votre messagerie pour confirmer votre compte avant de vous connecter.' : 'Check your email to confirm your account before signing in.')
      }
    })
  }
  function resetPassword() {
    if (!email.current.reportValidity()) return
    void run('reset', async () => {
      await requestPasswordReset(email.current.value)
      setNotice(lang === 'fr' ? 'Si un compte correspond à cette adresse, vous recevrez un lien de réinitialisation.' : 'If an account exists for that email, you will receive a password-reset link.')
    })
  }

  return <AuthCard title={mode === 'login' ? t('signIn') : t('createAccount')}>
    <h1 className="sr-only">{mode === 'login' ? t('signIn') : t('createAccount')}</h1>
    {showTerms && <TermsModal onClose={() => setShowTerms(false)} />}
    <form onSubmit={submit} aria-busy={!!pending} className="space-y-3">
      <div>
        <label htmlFor={`${id}-email`} className="sr-only">{t('emailPlaceholder')}</label>
        <input ref={email} id={`${id}-email`} name="email" type="email" required autoComplete="username" placeholder={t('emailPlaceholder')} disabled={!!pending} className={field} />
      </div>
      <div className="relative">
        <label htmlFor={`${id}-password`} className="sr-only">{t('passwordPlaceholder')}</label>
        <input id={`${id}-password`} name="password" type={showPassword ? 'text' : 'password'} required minLength={mode === 'signup' ? 6 : undefined} autoComplete={mode === 'signup' ? 'new-password' : 'current-password'} placeholder={t('passwordPlaceholder')} disabled={!!pending} className={`${field} pr-16`} aria-describedby={error ? `${id}-error` : undefined} />
        <button type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} aria-pressed={showPassword} onClick={() => setShowPassword(value => !value)} className="absolute inset-y-0 right-1 min-w-12 rounded px-2 text-xs text-palette-gold focus-visible:outline-2 focus-visible:outline-palette-ivory">{showPassword ? t('hide') : t('show')}</button>
      </div>
      {mode === 'login' && <button type="button" disabled={!!pending} onClick={resetPassword} className="ml-auto block min-h-8 rounded text-xs text-palette-gold focus-visible:outline-2 focus-visible:outline-palette-ivory">{t('forgotPassword')}</button>}
      {mode === 'signup' && <div className="flex items-start gap-2 text-xs leading-5 text-palette-stone">
        <input id={`${id}-terms`} type="checkbox" aria-label={lang === 'fr' ? "J'accepte les conditions générales" : 'I agree to the Terms & Conditions'} required checked={agreed} disabled={!!pending} onChange={event => setAgreed(event.target.checked)} className="mt-1 size-4 accent-palette-gold" />
        <div><label htmlFor={`${id}-terms`}>{lang === 'fr' ? "J'accepte les " : 'I agree to the '}</label><button type="button" onClick={() => setShowTerms(true)} className="rounded text-palette-gold underline focus-visible:outline-2 focus-visible:outline-palette-ivory">Terms &amp; Conditions</button></div>
      </div>}
      {error && <p id={`${id}-error`} role="alert" className="text-sm leading-5 text-palette-apricot">{error}</p>}
      {notice && <p role="status" className="text-sm leading-5 text-palette-ivory">{notice}</p>}
      <button type="submit" disabled={!!pending} className="flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-palette-gold px-4 py-2 text-sm font-semibold text-palette-black enabled:hover:bg-palette-apricot focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-palette-ivory disabled:cursor-wait disabled:opacity-60">
        {pending && <LoaderCircle aria-hidden="true" className="size-4 motion-safe:animate-spin" />}
        {pending ? (lang === 'fr' ? 'Veuillez patienter…' : 'Please wait…') : mode === 'login' ? t('signIn') : t('createAccount')}
      </button>
      <button type="button" disabled={!!pending} onClick={() => { setMode(value => value === 'login' ? 'signup' : 'login'); setError(''); setNotice(''); setAgreed(false) }} className="min-h-9 w-full rounded text-xs text-palette-gold focus-visible:outline-2 focus-visible:outline-palette-ivory">{mode === 'login' ? t('noAccountSignUp') : t('haveAccountSignIn')}</button>
    </form>
  </AuthCard>
}
