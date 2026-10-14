import { useCallback, useEffect, useState } from 'react'
import { LangContext } from './LangContext'
import { TRANSLATIONS } from './translations'

export default function LangProvider({ children }) {
  const [lang, setLanguage] = useState(() => {
    try { return localStorage.getItem('nko_lang') === 'fr' ? 'fr' : 'en' } catch { return 'en' }
  })
  const setLang = value => {
    if (!['en', 'fr'].includes(value)) return
    try { localStorage.setItem('nko_lang', value) } catch { /* Switching still works for this tab. */ }
    setLanguage(value)
  }
  const t = useCallback(key => TRANSLATIONS[lang]?.[key] ?? TRANSLATIONS.en[key] ?? key, [lang])
  useEffect(() => { document.documentElement.lang = lang }, [lang])
  return <LangContext.Provider value={{ lang, setLang, t }}>{children}</LangContext.Provider>
}
