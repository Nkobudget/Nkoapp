import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { ArrowLeft, ArrowRight, Coins, Users } from 'lucide-react'
import BrandHomeLink from '../components/BrandHomeLink'
import LanguageSwitcher from '../i18n/LanguageSwitcher'
import { useLang } from '../i18n/LangContext'
import { useAuth } from '../auth/AuthContext'
import OnboardingWelcome from './OnboardingWelcome'
import { ROLES, MARKETS } from './options'

const roleFrench = {
  line_producer: ['Directeur de production', 'Gère le budget et le suivi quotidien des coûts'],
  production_manager: ['Régisseur général', 'Organise la logistique, les équipes et les lieux'],
  producer: ['Producteur', "Supervise l'ensemble de la production"],
  production_accountant: ['Comptable de production', 'Rapproche les dépenses et traite les paiements'],
}
const marketFrench = { NGN: 'Nigeria', GHS: 'Ghana', KES: 'Kenya', ZAR: 'Afrique du Sud', UGX: 'Ouganda', TZS: 'Tanzanie' }

export default function OnboardingScreen({ onComplete }) {
  const { t, lang } = useLang(), { signOut } = useAuth(), navigate = useNavigate()
  const [step, setStep] = useState(0), [role, setRole] = useState(''), [market, setMarket] = useState('')
  const [error, setError] = useState(''), [pending, setPending] = useState(false)
  const heading = useRef(null)
  const fr = lang === 'fr'
  useEffect(() => { heading.current?.focus() }, [step])
  const roleLabel = item => fr ? roleFrench[item.id][0] : item.label
  const roleDescription = item => fr ? roleFrench[item.id][1] : item.sub
  const marketLabel = item => fr ? marketFrench[item.code] : item.country
  const accountControls = <div className="flex items-center gap-3">
    <LanguageSwitcher />
    <button type="button" disabled={pending} onClick={async () => {
      try { await signOut() } catch { setError(fr ? 'Impossible de vous déconnecter. Réessayez.' : 'Could not sign out. Please try again.') }
    }} className="min-h-9 rounded text-xs text-palette-stone underline focus-visible:outline-2 focus-visible:outline-palette-gold">{t('signOut')}</button>
  </div>

  if (step === 0) return <>
    {error && <p role="alert" className="bg-palette-near-black p-4 text-center text-palette-apricot">{error}</p>}
    <OnboardingWelcome onSetUpProduction={() => setStep(1)} onSkip={() => navigate('/')} onBack={() => navigate('/')} headerActions={accountControls}
      durationText={fr ? 'Deux choix pour commencer' : 'Two choices to get started'}
      sections={[
        { title: fr ? 'Rôle' : 'Role', description: fr ? 'Ce que vous gérez au quotidien' : 'What you manage day to day', Icon: Users },
        { title: fr ? 'Marché et devise' : 'Market & currency', description: fr ? 'La devise de vos productions' : 'The default for your productions', Icon: Coins },
      ]}
      copy={{ heading: fr ? 'Bienvenue sur NKO.' : 'Welcome to NKO.', tagline: fr ? 'Préparons votre espace de travail.' : "Let's set up your workspace.", body: t('onboardTagline'), back: t('backBtn'), setup: t('getStarted'), skip: fr ? 'Je le ferai plus tard' : "I'll do this later" }} />
  </>

  const options = step === 1
    ? ROLES.map(item => ({ value: item.id, label: roleLabel(item), description: roleDescription(item) }))
    : MARKETS.map(item => ({ value: item.code, label: marketLabel(item), description: `${item.code} · ${item.symbol}` }))
  const selected = step === 1 ? role : market
  async function submit(event) {
    event.preventDefault()
    if (!selected || pending) return
    if (step === 1) { setStep(2); setError(''); return }
    setPending(true); setError('')
    try { await onComplete({ role, market }) }
    catch { setError(fr ? "Impossible d'enregistrer vos choix. Autorisez le stockage du navigateur puis réessayez." : 'Your preferences could not be saved. Allow browser storage, then try again.') }
    finally { setPending(false) }
  }

  return <main className="min-h-svh bg-palette-black px-5 py-6 font-sans text-palette-ivory sm:px-10 lg:px-16 lg:py-10">
    <div className="mx-auto grid w-full max-w-[78rem] lg:min-h-[calc(100svh-5rem)] lg:grid-cols-[1.08fr_1fr]">
      <div className="min-w-0 lg:pr-12">
        <header className="flex flex-wrap items-center gap-5 border-b border-palette-graphite/60 pb-5">
          <BrandHomeLink className="h-6 w-auto" />
          <ol aria-label={fr ? "Étapes d'accueil" : 'Onboarding progress'} className="flex flex-1 gap-4 text-[0.6875rem]">
            {[fr ? 'Bienvenue' : 'Welcome', fr ? 'Rôle' : 'Role', fr ? 'Devise' : 'Currency'].map((label, index) => <li key={label} aria-current={step === index ? 'step' : undefined} className={step === index ? 'text-palette-gold' : 'text-palette-stone'}><span className="mr-1 tabular-nums">0{index + 1}</span>{label}</li>)}
          </ol>
          {accountControls}
        </header>
        <form onSubmit={submit} aria-busy={pending} className="mx-auto max-w-[28rem] py-10 lg:py-12">
          <p className="mb-3 text-xs text-palette-stone">{t(step === 1 ? 'step1Of2' : 'step2Of2')}</p>
          <h1 ref={heading} tabIndex={-1} className="max-w-sm text-[2rem] leading-[1.08] font-medium tracking-[-0.04em] outline-none sm:text-[2.5rem]">{t(step === 1 ? 'whatsYourRole' : 'baseCurrency')}</h1>
          <p id="onboarding-description" className="mt-4 max-w-sm text-sm leading-6 text-palette-stone">{t(step === 1 ? 'roleSubtitle' : 'currencySubtitle')}</p>
          <fieldset aria-describedby="onboarding-description" disabled={pending} className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <legend className="sr-only">{step === 1 ? (fr ? 'Votre rôle' : 'Your role') : (fr ? 'Votre marché' : 'Your market')}</legend>
            {options.map(option => <label key={option.value} className="relative cursor-pointer">
              <input type="radio" name={step === 1 ? 'role' : 'market'} value={option.value} checked={selected === option.value} onChange={() => (step === 1 ? setRole : setMarket)(option.value)} required className="peer sr-only" />
              <span className="flex h-full min-h-24 items-start gap-3 rounded-lg border border-palette-graphite bg-palette-dark-gray/60 p-4 peer-checked:border-palette-gold peer-checked:bg-palette-graphite/60 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-palette-gold">
                <span aria-hidden="true" className={`mt-1 flex size-4 shrink-0 items-center justify-center rounded-full border ${selected === option.value ? 'border-palette-gold' : 'border-palette-warm-gray'}`}>{selected === option.value && <span className="size-2 rounded-full bg-palette-gold" />}</span>
                <span><span className="block text-sm font-medium">{option.label}</span><span className="mt-1 block text-xs leading-5 text-palette-stone">{option.description}</span></span>
              </span>
            </label>)}
          </fieldset>
          {error && <p role="alert" className="mt-5 text-sm text-palette-apricot">{error}</p>}
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
            <button type="button" disabled={pending} onClick={() => { setStep(value => value - 1); setError('') }} className="flex min-h-11 items-center gap-2 rounded px-2 text-sm text-palette-stone focus-visible:outline-2 focus-visible:outline-palette-gold"><ArrowLeft aria-hidden="true" className="size-4" />{t('backBtn')}</button>
            <button type="submit" disabled={!selected || pending} className="flex min-h-11 items-center gap-3 rounded-md bg-palette-apricot px-5 py-3 text-sm font-medium text-palette-black focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-palette-gold disabled:cursor-not-allowed disabled:opacity-40">{pending ? (fr ? 'Enregistrement…' : 'Saving…') : t(step === 1 ? 'continueBtn' : 'finishBtn')}<ArrowRight aria-hidden="true" className="size-4" /></button>
          </div>
        </form>
      </div>
      <aside aria-label={fr ? "Aperçu de l'espace de travail" : 'Workspace preview'} className="min-w-0 border-t border-palette-graphite/60 bg-palette-near-black/35 px-5 py-8 sm:px-10 lg:border-t-0 lg:border-l">
        <div className="mb-4 flex justify-between gap-4 text-[0.6875rem] text-palette-stone"><span>{fr ? 'Votre espace' : 'Workspace preview'}</span><span><span className="mr-1 text-palette-gold">•</span>{fr ? 'Vos préférences' : 'Your preferences'}</span></div>
        <section className="rounded-lg border border-palette-graphite bg-palette-dark-gray/40">
          <div className="p-5"><p className="text-xs text-palette-stone">NKO</p><h2 className="mt-1 text-2xl tracking-[-0.04em]">{fr ? 'Votre espace de travail' : 'Your workspace'}</h2></div>
          <dl className="grid grid-cols-1 divide-y divide-palette-graphite border-t border-palette-graphite text-sm">
            <div className="p-5"><dt className="text-xs text-palette-stone">{fr ? 'Rôle' : 'Role'}</dt><dd className="mt-2">{role ? roleLabel(ROLES.find(item => item.id === role)) : '—'}</dd></div>
            <div className="p-5"><dt className="text-xs text-palette-stone">{fr ? 'Devise par défaut' : 'Default currency'}</dt><dd className="mt-2">{market ? `${marketLabel(MARKETS.find(item => item.code === market))} · ${market}` : '—'}</dd></div>
          </dl>
          <div className="border-t border-palette-graphite p-5"><p className="mb-3 text-xs text-palette-stone">{fr ? 'Modules' : 'Workspace modules'}</p>{['navBudgets', 'navBreakdown', 'navSchedule', 'navRecon', 'navPayments'].map(label => <p key={label} className="mt-2 flex justify-between text-xs text-palette-stone"><span>{t(label)}</span><span aria-hidden="true">—</span></p>)}</div>
        </section>
        <p className="mt-5 text-xs leading-5 text-palette-stone">{fr ? 'Vous pourrez choisir une autre devise pour chaque production.' : 'You can choose a different currency for each production.'}</p>
      </aside>
    </div>
  </main>
}
