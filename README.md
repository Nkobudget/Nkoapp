# NKO

The African Production Ledger, with the current marketing pages and the recovered production workspace.

## Run locally

Use Node.js 20 or newer. React 18.3.1 and React Router 7.18.4 are retained from the project lockfile.

```sh
npm ci
cp .env.example .env.local
npm run dev
```

If `.env.local` already exists, compare its variables instead of overwriting it. The example contains the original project's public Supabase URL and publishable browser key, recovered from `d5d304c`. Never put a service-role key or server secret in a `VITE_*` variable.

## Routing and flow

| URL | Behavior |
| --- | --- |
| `/` | Current public landing page |
| `/sign-in` | Current provider-choice design; Continue with Email opens `/app` |
| `/onboarding` | Current public welcome page; signed-in visitors continue through the gate at `/app` |
| `/app/*` | One `AuthGate`: recovery, login/signup, onboarding, then the workspace |
| `/dashboard` | Compatibility redirect to `/app` |

`main.jsx` keeps the existing BrowserRouter and reduced-motion provider. `App` owns exactly one `LangProvider` and one `AuthProvider`. `AuthGate` waits for initialization and selects screens in this order:

1. Password recovery: `SetNewPasswordScreen`.
2. No user: `AuthScreen`, with login, signup, and the recovered Terms modal.
3. User without a valid completion record: `OnboardingScreen`.
4. User with completed onboarding: the recovered `MainApp` in `src/legacy/LegacyApp.jsx`.

The public `SignInPage` is a provider-choice page, not a second authentication system. Its Google button stays disabled because Google is disabled in the original Supabase project. The actual email/password form is `AuthScreen`, extracted from the old app and styled to the supplied compact login reference.

## Onboarding

Welcome → role → market/currency. The historical choices and storage shape are retained:

```js
// Key: nko_onboarding_<authenticated-user-id>
{ role: 'producer', market: 'NGN', completedAt: 1791979200000 }
```

Completion requires a recognized historical role, one of the six historical market/currency codes, and a positive integer timestamp. Malformed JSON, `{}`, partial records, invalid choices, and another account's record cannot bypass onboarding. Only completed choices are persisted; refreshing an unfinished flow returns to welcome. Storage failures are shown and do not permit completion.

The production-details screenshot has a different four-step wizard. Its split layout and selection-card styling inform the role/currency screens, but no production/scale/goals/AI steps were invented. The existing welcome image and all current assets remain intact. On small screens, preview panels stack beneath the form and selection cards use one column.

## Authentication and deployment

The existing central Supabase client owns session persistence and token refresh. The provider validates stored sessions with Auth before rendering private UI. SDK auth callbacks execute outside its event lock; stale validation results cannot restore a signed-out or previous account.

Signup requires agreement to the original Terms. A session returned by signup immediately advances to onboarding. A signup without a session displays a confirmation-email message. Password recovery has priority over onboarding, remains active through refresh in the same tab, and clears only after a successful password update or logout.

Keep the existing Auth settings. Email authentication and automatic confirmation were enabled when checked; Google was disabled. No service settings were changed. Ensure Supabase URL Configuration permits `https://YOUR_HOST/app` and the local development equivalent for confirmation and password-reset redirects. Existing reset callbacks targeting `/` are also handled. Delivery of real confirmation/reset emails requires working SMTP configuration and has not been exercised with a live account.

`vercel.json` retains the current headers/functions and rewrites `/sign-in`, `/onboarding`, `/app`, `/app/*`, and `/dashboard` to `index.html`. Existing API paths are not rewritten. Configure the two public Vite variables at build time and keep existing server-only Anthropic/Brevo credentials on the host.

## Verification

```sh
npm test
npm run lint
npm run build
npx playwright install chromium
npm run test:integration
npm run test:production
```

Results: build passed, 15 production-browser tests passed, three storage unit tests passed, and lint has zero errors with 19 legacy warnings. The browser suite intercepts external service requests; it never creates real accounts, writes production rows, sends emails, or invokes paid AI. It covers authentication, both confirmation modes, password recovery, onboarding validation and persistence, switching accounts, language, direct routes/history, restored dashboard sections, mobile layouts, and logo loading. See [implementation and verification notes](docs/AUTH_FLOW.md) and [the Git recovery walkthrough](docs/DASHBOARD_RECOVERY.md).

All brand-logo locations use `BrandLogo` and the unchanged `/assets/logo.png` file. The dashboard retains its original business views and inline theme, with scoped typography and keyboard focus styles. Public page styles, images, APIs, and database schema remain unchanged.

Real account access, database row-level-security policies, storage, AI, and email delivery still require a live acceptance check. Existing standalone API functions do not validate a Supabase JWT server-side; the frontend gate does not replace that missing protection.
