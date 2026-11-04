import { Link } from 'react-router'
import IrisLoader from '../components/IrisLoader'

export default function AuthStatus({ error, onRetry, message = 'Loading your workspace…' }) {
  return (
    <main className="flex min-h-svh items-center justify-center bg-palette-black p-6 text-palette-ivory">
      <div className="max-w-md text-center">
        {error ? (
          <>
            <p role="alert">{error}</p>
            <button
              type="button"
              onClick={onRetry}
              className="mt-6 rounded-lg bg-palette-gold px-5 py-3 text-palette-black focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-palette-ivory"
            >
              Try again
            </button>
            <Link
              to="/"
              className="ml-5 rounded underline focus-visible:outline-2 focus-visible:outline-palette-gold"
            >
              Return home
            </Link>
          </>
        ) : (
          <IrisLoader message={message} />
        )}
      </div>
    </main>
  )
}
