import BrandHomeLink from '../components/BrandHomeLink'
import LanguageSwitcher from '../i18n/LanguageSwitcher'
import { useLang } from '../i18n/LangContext'

export default function AuthCard({ children, title }) {
  const { t } = useLang()
  return <main className="flex min-h-svh items-center justify-center bg-palette-near-black px-5 py-10 font-sans text-palette-ivory">
    <section aria-label={title} className="w-full max-w-[23.75rem] rounded-xl border border-palette-graphite bg-palette-charcoal px-6 py-7 sm:px-7">
      <div className="mb-4 flex justify-center"><LanguageSwitcher /></div>
      <div className="flex justify-center"><BrandHomeLink className="h-[1.875rem] w-auto" /></div>
      <p className="mt-2 mb-7 text-center text-[0.625rem] font-semibold tracking-[0.14em] text-palette-gold uppercase">{t('tagline')}</p>
      {children}
    </section>
  </main>
}
