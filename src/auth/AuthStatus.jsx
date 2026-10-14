import { LoaderCircle } from 'lucide-react'
import { Link } from 'react-router'

export default function AuthStatus({ error, onRetry }) {
  return <main className="flex min-h-svh items-center justify-center bg-palette-black p-6 text-palette-ivory">
    <div className="max-w-md text-center">
      {error ? <>
        <p role="alert">{error}</p>
        <button type="button" onClick={onRetry} className="mt-6 rounded-lg bg-palette-gold px-5 py-3 text-palette-black focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-palette-ivory">Try again</button>
        <Link to="/" className="ml-5 rounded underline focus-visible:outline-2 focus-visible:outline-palette-gold">Return home</Link>
      </> : <p role="status" className="flex items-center gap-3">
        <LoaderCircle aria-hidden="true" className="size-5 motion-safe:animate-spin" /> Loading your workspace…
      </p>}
    </div>
  </main>
}
