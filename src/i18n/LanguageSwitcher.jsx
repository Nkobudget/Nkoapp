import { useLang } from './LangContext'

export default function LanguageSwitcher() {
  const { lang, setLang } = useLang()
  return <div role="group" aria-label="Language / Langue" className="inline-flex shrink-0 overflow-hidden rounded border border-palette-graphite font-sans">
    {['en', 'fr'].map(value => <button key={value} type="button" lang={value} aria-label={value === 'en' ? 'English' : 'Français'} aria-pressed={lang === value} onClick={() => setLang(value)} className={`min-h-8 min-w-9 px-2 text-[0.6875rem] font-semibold focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-palette-ivory ${lang === value ? 'bg-palette-gold text-palette-black' : 'bg-transparent text-palette-stone'}`}>{value.toUpperCase()}</button>)}
  </div>
}
