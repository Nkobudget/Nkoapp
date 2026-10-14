import { useEffect, useId, useRef } from 'react'
import { X } from 'lucide-react'
import { TERMS_TEXT } from './terms'
import { useLang } from '../i18n/LangContext'

export default function TermsModal({ onClose }) {
  const dialog = useRef(null)
  const title = useId()
  const { lang } = useLang()
  useEffect(() => { if (!dialog.current.open) dialog.current.showModal() }, [])
  return <dialog ref={dialog} aria-labelledby={title} onClose={onClose} onClick={event => { if (event.target === event.currentTarget) dialog.current.close() }} className="m-auto max-h-[85svh] w-[calc(100%-2rem)] max-w-xl overflow-y-auto rounded-xl border border-palette-graphite bg-palette-charcoal p-6 text-palette-ivory backdrop:bg-palette-black/85 sm:p-8">
    <div className="mb-5 flex items-center justify-between gap-4">
      <h2 id={title} className="text-xl font-medium">Terms &amp; Conditions</h2>
      <button type="button" autoFocus aria-label={lang === 'fr' ? 'Fermer' : 'Close terms'} onClick={() => dialog.current.close()} className="flex size-10 shrink-0 items-center justify-center rounded focus-visible:outline-2 focus-visible:outline-palette-gold"><X aria-hidden="true" className="size-5" /></button>
    </div>
    <div lang="en" className="whitespace-pre-wrap text-sm leading-6 text-palette-stone">{TERMS_TEXT}</div>
    <button type="button" onClick={() => dialog.current.close()} className="mt-6 min-h-11 w-full rounded-lg bg-palette-gold px-4 text-palette-black focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-palette-ivory">{lang === 'fr' ? 'Fermer' : 'Close'}</button>
  </dialog>
}
