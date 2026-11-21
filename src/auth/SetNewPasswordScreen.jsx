import { useId, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { useAuth } from './AuthContext'
import { useLang } from '../i18n/LangContext'
import AuthCard from './AuthCard'
import { authErrorMessage } from './authErrors'

export default function SetNewPasswordScreen() {
  const { updatePassword, signOut } = useAuth()
  const navigate = useNavigate()
  const { lang } = useLang()
  const id = useId(), busy = useRef(false)
  const [pending, setPending] = useState(false), [error, setError] = useState('')
  const title = lang === 'fr' ? 'Définir un nouveau mot de passe' : 'Set a new password'
  async function submit(event) {
    event.preventDefault()
    if (busy.current) return
    const data = new FormData(event.currentTarget), password = String(data.get('password'))
    if (password !== data.get('confirm')) { setError(lang === 'fr' ? 'Les mots de passe ne correspondent pas.' : 'Passwords do not match.'); return }
    busy.current = true; setPending(true); setError('')
    try { await updatePassword(password); navigate('/app', { replace: true }) } catch (failure) { setError(authErrorMessage(failure)) }
    finally { busy.current = false; setPending(false) }
  }
  return <AuthCard title={title}>
    <h1 className="mb-3 text-center text-2xl leading-tight font-medium tracking-tight">{title}</h1>
    <p className="mb-7 text-center text-sm leading-6 text-palette-stone">{lang === 'fr' ? 'Choisissez un nouveau mot de passe pour continuer.' : 'Choose a new password to finish recovering your account.'}</p>
    <form onSubmit={submit} aria-busy={pending} className="space-y-5">
      {['password', 'confirm'].map((name, index) => <div key={name}>
        <label htmlFor={`${id}-${name}`} className="mb-2 block text-sm font-medium text-palette-stone">{lang === 'fr' ? (index ? 'Confirmer le mot de passe' : 'Nouveau mot de passe') : (index ? 'Confirm new password' : 'New password')}</label>
        <input id={`${id}-${name}`} name={name} type="password" required minLength={6} autoComplete="new-password" disabled={pending} className="min-h-12 w-full rounded-xl border border-palette-graphite bg-palette-near-black px-4 py-3 text-sm text-palette-ivory placeholder:text-palette-gray focus:border-palette-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-palette-gold disabled:opacity-60" />
      </div>)}
      {error && <p role="alert" className="text-sm text-palette-apricot">{error}</p>}
      <button type="submit" disabled={pending} className="min-h-12 w-full rounded-xl bg-palette-apricot px-4 py-3 text-sm font-medium text-palette-black transition-colors hover:bg-palette-apricot/90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-palette-apricot disabled:opacity-60">{pending ? (lang === 'fr' ? 'Enregistrement…' : 'Saving…') : (lang === 'fr' ? 'Enregistrer' : 'Set new password')}</button>
      <button type="button" disabled={pending} onClick={() => signOut().catch(() => setError('Could not sign out. Please try again.'))} className="min-h-11 w-full rounded text-sm text-palette-stone underline underline-offset-4 hover:text-palette-ivory focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-palette-gold">{lang === 'fr' ? 'Se déconnecter' : 'Sign out'}</button>
    </form>
  </AuthCard>
}
