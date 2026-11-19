import { useId, useRef, useState } from 'react'
import { Link } from 'react-router'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, Eye, EyeOff, LoaderCircle } from 'lucide-react'
import { useAuth } from './AuthContext'
import { useLang } from '../i18n/LangContext'
import { authErrorMessage } from './authErrors'
import AuthSplitLayout from './AuthSplitLayout'
import LanguageSwitcher from '../i18n/LanguageSwitcher'
import TermsModal from './TermsModal'
import AuthStatus from './AuthStatus'
import { GoogleLogo } from './SignInPage'
import { DURATION, EASE_OUT, fadeUp, staggerContainer } from '../lib/motion'

export default function AuthScreen() {
  const { signIn, signInWithGoogle, signUp, requestPasswordReset, callbackError } = useAuth()
  const { t, lang } = useLang()
  const [mode, setMode] = useState('login')
  const [showPassword, setShowPassword] = useState(false)
  const [showTerms, setShowTerms] = useState(false)
  const [agreed, setAgreed] = useState(false)
  const [pending, setPending] = useState('')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState(callbackError)
  const [redirecting, setRedirecting] = useState(false)
  const busy = useRef(false)
  const email = useRef(null)
  const id = useId()
  const headingId = `${id}-heading`
  const field =
    'min-h-12 w-full rounded-xl border border-palette-graphite bg-palette-near-black px-4 py-3 text-sm text-palette-ivory placeholder:text-palette-gray transition-colors focus:border-palette-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-palette-gold disabled:opacity-60'

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
      if (mode === 'login') {
        await signIn(credentials)
        setRedirecting(true)
      } else {
        const result = await signUp(credentials)
        if (result.requiresConfirmation) {
          setNotice(lang === 'fr' ? 'Consultez votre messagerie pour confirmer votre compte avant de vous connecter.' : 'Check your email to confirm your account before signing in.')
        } else {
          setRedirecting(true)
        }
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

  if (redirecting) {
    return <AuthStatus message={lang === 'fr' ? 'Ouverture de votre espace de travail…' : 'Loading your workspace…'} />
  }

  const subtitle = mode === 'login'
    ? (lang === 'fr'
      ? 'Connectez-vous avec votre e-mail pour accéder à votre espace de production NKŌ.'
      : 'Sign in with your email to access your NKŌ production workspace.')
    : (lang === 'fr'
      ? 'Créez votre espace NKŌ et commencez à bâtir votre production avec l’IA.'
      : 'Create your NKŌ workspace and start building your production with AI.')

  return (
    <AuthSplitLayout ariaLabelledBy={headingId} headerRight={<LanguageSwitcher />}>
      {showTerms && <TermsModal onClose={() => setShowTerms(false)} />}

      <motion.div
        variants={staggerContainer(0.06, 0.04)}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={fadeUp} className="mb-5">
          <Link
            to="/sign-in"
            className="inline-flex items-center gap-1.5 rounded-sm text-xs font-medium text-palette-stone transition-colors hover:text-palette-ivory focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-palette-gold"
          >
            <ArrowLeft aria-hidden="true" className="size-3.5" />
            <span>{lang === 'fr' ? 'Autres options de connexion' : 'All sign-in options'}</span>
          </Link>
        </motion.div>

        <motion.div variants={fadeUp}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={mode}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: DURATION.fast, ease: EASE_OUT }}
            >
              <h1
                id={headingId}
                className="text-[2rem] leading-[1.08] font-medium tracking-[-0.04em] sm:text-[2.375rem] lg:text-[2.625rem]"
              >
                {mode === 'login' ? t('signIn') : t('createAccount')}
              </h1>
              <p className="mt-3 text-sm leading-6 text-palette-stone sm:text-[0.9375rem]">{subtitle}</p>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        <motion.div variants={fadeUp} className="mt-7">
          <motion.button
            type="button"
            disabled={!!pending}
            aria-busy={pending === 'google'}
            onClick={() => {
              void run('google', async () => {
                await signInWithGoogle()
              })
            }}
            whileHover={!pending ? { scale: 1.01 } : undefined}
            whileTap={!pending ? { scale: 0.985 } : undefined}
            transition={{ duration: DURATION.fast, ease: EASE_OUT }}
            className="flex min-h-12 w-full min-w-0 items-center justify-center gap-2.5 rounded-full border border-palette-ivory bg-palette-ivory px-5 py-3 text-sm leading-5 font-medium text-palette-charcoal transition-colors enabled:hover:bg-palette-ivory/90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-palette-gold disabled:cursor-not-allowed disabled:opacity-65"
          >
            <span aria-hidden="true" className="flex size-4 shrink-0 items-center justify-center">
              {pending === 'google' ? (
                <LoaderCircle focusable="false" strokeWidth={1.75} className="size-4 motion-safe:animate-spin" />
              ) : (
                <GoogleLogo className="size-4" />
              )}
            </span>
            <span className="min-w-0">
              {pending === 'google'
                ? (lang === 'fr' ? 'Connexion à Google…' : 'Connecting to Google…')
                : (lang === 'fr' ? 'Continuer avec Google' : 'Continue with Google')}
            </span>
          </motion.button>

          <div className="my-5 flex items-center gap-3 text-xs text-palette-stone">
            <span className="h-px flex-1 bg-palette-graphite/60" aria-hidden="true" />
            <span>{lang === 'fr' ? 'ou par e-mail' : 'or continue with email'}</span>
            <span className="h-px flex-1 bg-palette-graphite/60" aria-hidden="true" />
          </div>
        </motion.div>

        <motion.form variants={fadeUp} onSubmit={submit} aria-busy={!!pending} className="space-y-4">
          <div>
            <label htmlFor={`${id}-email`} className="mb-1.5 block text-xs font-medium text-palette-stone">
              {t('emailPlaceholder')}
            </label>
            <input
              ref={email}
              id={`${id}-email`}
              name="email"
              type="email"
              required
              autoComplete="username"
              placeholder={lang === 'fr' ? 'vous@studio.com' : 'you@studio.com'}
              disabled={!!pending}
              className={field}
            />
          </div>

          <div>
            <div className="mb-1.5 flex items-center justify-between gap-2">
              <label htmlFor={`${id}-password`} className="block text-xs font-medium text-palette-stone">
                {t('passwordPlaceholder')}
              </label>
              <AnimatePresence initial={false}>
                {mode === 'login' && (
                  <motion.button
                    type="button"
                    disabled={!!pending}
                    onClick={resetPassword}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: DURATION.fast, ease: EASE_OUT }}
                    className="rounded text-xs font-medium text-palette-stone transition-colors hover:text-palette-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-palette-gold disabled:opacity-60"
                  >
                    {t('forgotPassword')}
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
            <div className="relative">
              <input
                id={`${id}-password`}
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                minLength={mode === 'signup' ? 6 : undefined}
                autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                placeholder="••••••••"
                disabled={!!pending}
                className={`${field} pr-20`}
                aria-describedby={error ? `${id}-error` : undefined}
              />
              <button
                type="button"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                aria-pressed={showPassword}
                onClick={() => setShowPassword(value => !value)}
                className="absolute inset-y-0 right-1.5 inline-flex min-w-12 items-center justify-center gap-1 rounded-lg px-2.5 text-xs font-medium text-palette-stone transition-colors hover:text-palette-ivory focus-visible:outline-2 focus-visible:outline-palette-gold"
              >
                {showPassword ? <EyeOff aria-hidden="true" className="size-3.5" /> : <Eye aria-hidden="true" className="size-3.5" />}
                <span>{showPassword ? t('hide') : t('show')}</span>
              </button>
            </div>
          </div>

          <AnimatePresence initial={false}>
            {mode === 'signup' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: DURATION.fast, ease: EASE_OUT }}
                className="overflow-hidden"
              >
                <div className="flex items-start gap-2.5 pt-1 text-xs leading-5 text-palette-stone">
                  <input
                    id={`${id}-terms`}
                    type="checkbox"
                    aria-label={lang === 'fr' ? "J'accepte les conditions générales" : 'I agree to the Terms & Conditions'}
                    required
                    checked={agreed}
                    disabled={!!pending}
                    onChange={event => setAgreed(event.target.checked)}
                    className="mt-1 size-4 rounded border-palette-graphite bg-palette-near-black accent-palette-gold"
                  />
                  <div>
                    <label htmlFor={`${id}-terms`}>{lang === 'fr' ? "J'accepte les " : 'I agree to the '}</label>
                    <button
                      type="button"
                      onClick={() => setShowTerms(true)}
                      className="rounded text-palette-gold underline underline-offset-4 hover:text-palette-apricot focus-visible:outline-2 focus-visible:outline-palette-gold"
                    >
                      Terms &amp; Conditions
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence initial={false}>
            {error && (
              <motion.p
                id={`${id}-error`}
                role="alert"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: DURATION.fast, ease: EASE_OUT }}
                className="rounded-lg border border-palette-apricot/30 bg-palette-apricot/10 px-3.5 py-2.5 text-sm leading-5 text-palette-apricot"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>
          <AnimatePresence initial={false}>
            {notice && (
              <motion.p
                role="status"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: DURATION.fast, ease: EASE_OUT }}
                className="rounded-lg border border-palette-graphite bg-palette-near-black px-3.5 py-2.5 text-sm leading-5 text-palette-ivory"
              >
                {notice}
              </motion.p>
            )}
          </AnimatePresence>

          <motion.button
            type="submit"
            disabled={!!pending}
            whileHover={!pending ? { scale: 1.01 } : undefined}
            whileTap={!pending ? { scale: 0.985 } : undefined}
            transition={{ duration: DURATION.fast, ease: EASE_OUT }}
            className="mt-2 flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-palette-gold px-5 py-3 text-sm font-semibold text-palette-black transition-colors enabled:hover:bg-palette-apricot focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-palette-ivory disabled:cursor-wait disabled:opacity-60"
          >
            {pending && <LoaderCircle aria-hidden="true" className="size-4 motion-safe:animate-spin" />}
            {pending ? (lang === 'fr' ? 'Veuillez patienter…' : 'Please wait…') : mode === 'login' ? t('signIn') : t('createAccount')}
          </motion.button>
        </motion.form>

        <motion.div variants={fadeUp} className="mt-8 border-t border-palette-graphite/50 pt-6">
          <button
            type="button"
            disabled={!!pending}
            onClick={() => {
              setMode(value => value === 'login' ? 'signup' : 'login')
              setError('')
              setNotice('')
              setAgreed(false)
            }}
            className="rounded-sm text-sm font-medium text-palette-stone transition-colors hover:text-palette-gold focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-palette-gold disabled:opacity-60"
          >
            {mode === 'login' ? t('noAccountSignUp') : t('haveAccountSignIn')}
          </button>
        </motion.div>
      </motion.div>
    </AuthSplitLayout>
  )
}
