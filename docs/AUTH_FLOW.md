# Authentication and onboarding integration

## Verified starting point

The supplied `Nkoapp(4).zip` already recovered the historical app into `src/legacy/LegacyApp.jsx` and mounted it at `/app/*`. Its business code matches `d5d304c`; the meaningful adaptations were the shared Supabase client, `/app` email links, and cleanup of legacy body styling. The public `SignInPage` only forwarded Continue with Email to `/app`; the real login/signup form was embedded inside `AuthScreen` in the legacy module.

No repository instruction file was found in the tracked repository or uploaded source. The APIs, hooks, assets, package versions, and public components were compared against `shalom`; several apparent ZIP differences were only Windows line endings. Existing React Router 7 remains compatible with the installed React 18. No backend schema or provider settings were changed.

The historical gate initialized onboarding as complete and then accepted any truthy parsed JSON. That could briefly render the dashboard and accept `{}` or another incomplete record. The integration fixes both issues.

## Provider and screen ownership

`main.jsx` retains the existing router and motion configuration. `App` now owns a single `LangProvider` and `AuthProvider`. Routes select public pages or the single `AuthGate` at `/app/*`; the legacy workspace no longer creates providers or a second auth client.

| Priority after initialization | Screen |
| --- | --- |
| Auth error/outage | Visible error with retry; private UI stays closed |
| Valid recovery session | `SetNewPasswordScreen` |
| No authenticated user | `AuthScreen`: login/signup/Terms |
| User with no valid completed record | `OnboardingScreen` |
| User with completed onboarding | `MainApp` in `src/legacy/LegacyApp.jsx` |

There is no separate competing `Login` component: the actual credential form remains inside the extracted `AuthScreen`. The public `SignInPage` keeps its current design and links to it. `/dashboard` is an alias for the ZIP's existing `/app` route. Root callbacks from older emails are consumed before navigating to `/app`.

Auth events are handled outside the SDK event lock. The SDK continues to persist and refresh the session. The provider calls `getUser` to validate restored identity, cancels stale validation results, and keys the user flow by the current user's ID so switching accounts cannot retain the previous account's completion or workspace state.

## Onboarding data contract

The three steps are welcome, role, and market/currency. Choices are copied from `d5d304c`:

- Roles: `line_producer`, `production_manager`, `producer`, `production_accountant`.
- Markets/currencies: `NGN`, `GHS`, `KES`, `ZAR`, `UGX`, `TZS`.
- Key: `nko_onboarding_<current-user-id>`.
- Value: `{ role, market, completedAt: Date.now() }`.

The validator requires an object, a recognized role, a recognized market, and a positive safe-integer timestamp. Arrays, booleans, `{}`, incomplete values, malformed JSON, and unknown choices are incomplete. Only the current user's key is read. A write failure leaves the user on the final onboarding step with a retryable error. No onboarding data was moved to Supabase.

The original app persists completion only. That behavior is preserved: unfinished progress resets to welcome on refresh. Back navigation within an unfinished flow retains the selected choices in memory. The existing skip control returns home without creating a completion record. A completed record supplies the default currency for newly created productions.

Language remains `en`/`fr`, persisted under the historical `nko_lang` key. The original dashboard translation dictionary is reused; language selection now also applies to auth and all onboarding steps. The legal Terms text is recovered verbatim and remains in English, as in the historical source.

## Reference interpretation

Both supplied images were successfully inspected from the uploaded files. The login reference is a compact centered dark card with language control, logo, email/password fields, password visibility, reset link, and mode switch. `AuthCard`/`AuthScreen` implement that arrangement using the existing color tokens, responsive sizing, accessible labels, native form validation, and visible keyboard focus.

The other image depicts Production → Scale → Goals → AI Setup, with production details. It does **not** specify role or currency screens. The explicit requested three-step flow takes precedence: the role/currency screens use that image's split layout, progress indicator, dark selection cards, spacing, and workspace preview while retaining the historical choices and behavior. Production-detail inputs and extra steps were not invented.

The current welcome page/image is reused with flow-appropriate text. Small screens stack the preview below the form and reduce selection cards to one column. The brand logo everywhere remains the existing `/assets/logo.png`; its aspect ratio is preserved. Existing dashboard views keep their historical theme and gain scoped typography/focus rules, avoiding style leakage into public pages.

## Signup and password recovery

Signup requires the recovered Terms agreement. With an immediate session, it continues to onboarding. Without a session, it reports that email confirmation is needed and stays out of onboarding/private data. Both responses are supported without changing Supabase's confirmation setting.

Forgot password sends the existing reset request with `/app` as its redirect. Recovery is detected from the callback before the SDK consumes the URL and from `PASSWORD_RECOVERY` events. The recovery user ID is retained in tab-scoped sessionStorage so refreshing the same tab does not bypass the password screen. It is cleared on a successful password update or sign-out. This marker controls presentation only; it does not grant a session or replace server validation.

Password fields require at least the original six characters, matching confirmation, and acceptance by Supabase's password policy. Server errors leave the reset form open. Invalid/expired callback links show an explanation. Recovery takes priority whether onboarding is complete or incomplete.

## Configuration and remaining service checks

A read-only inspection of the original Supabase Auth settings returned HTTP 200: email authentication is enabled, automatic email confirmation is enabled, and Google is disabled. The implementation handles the current immediate-session signup and the confirmation-required alternative. No real signup, reset email, or password update was performed.

Keep `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` configured at build time. The original public values are in `.env.example`; preserve an existing local environment file. No service-role, Anthropic, or Brevo secret belongs in browser variables.

Supabase URL Configuration must allow `/app` on each production, preview, and local development origin used for confirmation/reset emails. This requirement was identified before implementing the redirect behavior; the uploaded legacy app already used `/app` for password recovery. The project configuration was not modified remotely. Real email delivery and deployed redirect allowlists cannot be verified from the source alone.

The existing Vercel rewrites now cover `/app`, `/app/*`, `/dashboard`, `/sign-in`, and `/onboarding`. They preserve API routes and existing headers/functions. A static host needs equivalent rewrites; it also needs a separate deployment for the Vercel API handlers.

Authenticated database access, ownership/collaborator row-level security, the receipt bucket, AI credentials, and email delivery still require live project access and a test account. An anonymous REST schema request was denied, so table availability could not be established. Existing `/api/claude` and `/api/send-email` handlers still lack server-side Supabase JWT verification; the frontend gate does not protect those standalone endpoints. They were preserved rather than changing unrelated backend behavior.

## Verification

Results: production build passed; 15 browser tests passed against the production bundle and actual rewrite rules; the preceding development-server run passed all 13 then-existing scenarios; three storage unit tests passed. ESLint reports zero errors and 19 warnings, primarily inherited unused bindings/effect dependencies. Vite reports an entry chunk over 500 kB; the recovered workspace is still loaded as a separate chunk. Desktop/mobile screenshots were inspected.

Commands:

```sh
npm test
npm run lint
npm run build
npx playwright install chromium
npm run test:integration
npm run test:production
```

`test:production` builds an isolated test bundle and serves it with the actual `vercel.json` rewrite rules. Both browser suites intercept every external request; they never access real accounts, production rows, email delivery, or paid AI services. Temporary output goes to ignored `dist-test/`.

Coverage includes login success/failure/loading, rate limits and network errors, signup/Terms/modal keyboard behavior under both confirmation settings, password-reset request/errors/success/refresh, expired links, old root callbacks, strict completion validation, storage failures, returning users, logout/account switching, initial loading with no wrong-screen flash, language persistence, browser history/direct routes, dashboard sections, mobile layout and logo loading.

The recovered production operations were inspected and their views exercised, but real database CRUD, uploads, AI output, and email delivery remain unverified without live credentials. Use a disposable account/production for those checks; do not use real production deletion as a smoke test.
