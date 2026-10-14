# NKO dashboard recovery

## What happened

The dashboard was **replaced inside `src/App.jsx`**, not moved to a different dashboard file. The old app put its dashboard, production tools, templates, translations, database access, exports, and authentication screens in one large file.

| Commit | Evidence |
| --- | --- |
| `2c258ad` | Shared ancestor before the redesign; full app and `DashboardView` exist in `src/App.jsx`. |
| `d617f3f` | Replaced that file with the landing page: 13 added lines and 4,220 removed lines. |
| `d5d304c` | Latest intact dashboard on the original development line, including subsequent invoice/purchase-order fixes. Recovery source: 4,408-line `src/App.jsx`. |
| `74d102b` | Merge of the old app line into `shalom`; the landing-page version of `App.jsx` was retained. |
| `c792681` | `main` at inspection time: merged landing-page work, without the dashboard or newer auth pages. |
| `6a8cbb1` | `shalom` at inspection time: newer sign-in, onboarding, routing, shared logo, and image-source changes. |

Earlier deletions of `views1.jsx`, `views2.jsx`, and `data.js` predate this change. The latest intact app no longer imports them. Restoring those files would recover obsolete structure, not missing dependencies.

The later uploaded `Nkoapp(4).zip` already restored this code into `src/legacy/LegacyApp.jsx`. It was compared directly with the historical source, and its `/app` routing was preserved in the completed integration.

The local `recover/dashboard-auth` branch starts from `origin/main`, merges `origin/shalom`, then adds the recovered dashboard. Neither remote branch has been reset or rewritten.

## Inspect the evidence yourself

These commands read history and do not overwrite working files:

```sh
git status --short --branch
git fetch origin
git log --graph --oneline --decorate --all -35
git diff --stat origin/main...origin/shalom
git log --all -m --name-status --find-renames --diff-filter=DR -- src
git log --all -S 'function DashboardView' --oneline -- src/App.jsx
git show --numstat d617f3f -- src/App.jsx
git show d5d304c:src/App.jsx
git diff d5d304c 74d102b -- src/App.jsx
git diff d5d304c origin/main -- api src/hooks
```

`git fetch` updates remote-tracking refs, not the checked-out files. The last comparison shows that the existing API functions and deletion hooks were already present; they did not need restoring.

## How the files were recovered safely

The work was done in a fresh clone, on a new branch. To reproduce the branch setup in a separate working directory:

```sh
git clone https://github.com/Nkobudget/Nkoapp.git Nkoapp-recovery
cd Nkoapp-recovery
git switch -c recover/dashboard-auth origin/main
git merge --no-ff origin/shalom
git show d5d304c:src/App.jsx > ../dashboard-original.jsx
```

The final command writes only the new scratch copy outside the project. Redirection with `>` overwrites that destination if it already exists; choose a new name if you have one there already.

The historical source was then adapted into `src/legacy/LegacyApp.jsx`. **Do not run `git restore --source=d5d304c -- src/App.jsx` on the current app:** it would overwrite your current landing page and route definitions. Likewise, a broad restore of `src`, or `git reset --hard`, would discard the improvements being preserved. No such commands were used.

If you prefer a worktree instead of a new clone, `git worktree add -b recover/dashboard-auth ../Nkoapp-recovery origin/main` creates an isolated checkout without moving your current checkout. It fails if that branch or destination already exists; select a new unused name.

## What changed

| Area | Integration |
| --- | --- |
| `src/legacy/LegacyApp.jsx` | Original workspace, budgets, revenue, breakdowns, scheduling, reconciliation, payments, purchase orders, templates, AI tools, imports/exports, translations, and data handlers recovered together. |
| Authentication shell | Extracted into shared modules, preserving recovery, login/signup/Terms, and the three onboarding steps. Current public pages remain; the actual credential form is `AuthScreen`. |
| Supabase client | One existing central client, configured by `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`, is reused by auth and the dashboard. The historical duplicate client is removed. |
| Auth provider and route guard | SDK session persistence/refresh plus server-side identity verification through `getUser` before private UI is rendered. Missing/invalid sessions cannot fetch dashboard rows. Service outages show retry instead of accepting cached identity. |
| Email form | Accessible labels, autocomplete, password visibility control, loading/duplicate-submit handling, invalid-credential/network/rate-limit messages, and redirect on authenticated state. |
| Routing | The ZIP's `/app/*` is controlled by `AuthGate`; MainApp loads lazily after onboarding. `/dashboard` redirects to `/app`. Public routes remain. |
| Data loading | Visible loading/error/retry states replace silent query failures; stale requests cannot update an unmounted dashboard. |
| Logos | Dashboard logo instances now use `BrandLogo` and `/assets/logo.png`, retaining their display heights and image aspect ratio. |
| Styling | The original dashboard inline theme and print styling are retained, with scoped typography/focus styles. Current Tailwind tokens and marketing/auth styles are unchanged. |
| Mobile | Original bottom navigation is retained; a mobile sign-out control is added. Top controls can wrap without overflowing narrow screens. |
| Invitations | The existing invitation link points to `/app`, since `/` is the landing page. No email was sent. |
| Deployment | Explicit `/app`, `/app/*`, and `/dashboard` → `/index.html` rewrites alongside sign-in/onboarding; API routes and security headers are preserved. |
| Tests | Playwright browser tests use simulated Supabase responses, with zero production writes. No mock authentication bypass is shipped in the application. |

Dashboard section selection remains the original in-page state: refresh returns to the main dashboard. Public routes and the dashboard route use browser history normally. Splitting every legacy section into its own route is outside this recovery.

The stylesheet at these commits has `@import "tailwindcss"` and the existing palette. `header-theme.css` had already been removed in the branch history; this recovery does not reintroduce an import to a missing file.

## Service configuration and what remains to verify

The original public Supabase project URL and publishable browser key were recovered from `d5d304c`, moved into `.env.example`, and used in the ignored local `.env.local`. These public credentials identify the same existing service; no new Supabase project was created. Never substitute a `service_role` or secret key in a `VITE_*` variable.

On October 14, 2026, a read-only request to that project's Auth settings returned HTTP 200 and confirmed email authentication is enabled and Google is disabled; automatic email confirmation is enabled. The Google button remains disabled with an explanation. Enabling Google later requires provider configuration in Supabase and an OAuth callback integration; it is not silently simulated here.

An anonymous REST schema request returned HTTP 401. That does not establish whether the authenticated tables are missing or healthy. Their availability, policies, and real account access cannot be verified without an authenticated test account and project access.

Required by the recovered source:

| Service | Existing requirements |
| --- | --- |
| Supabase Auth | Existing email/password account; the two public Vite variables configured at build time. |
| Database | `projects`, `budget_items`, `advances`, `recon_entries`, `payees`, `scenes`, `characters`, `purchase_orders`, `project_collaborators`, `user_trial_state`, `revenue_items`, `schedule_days`, and `feedback`. |
| Database access | Row-level security and ownership/collaborator policies must enforce authorization. A browser route guard does not replace database policies. |
| Collaborator lookup | Existing `resolve_user_by_email` RPC. |
| File storage | Existing private `payment-receipts` bucket with authorized upload/read/delete policies and signed-URL access. |
| AI | Existing `/api/claude` function and server-only `ANTHROPIC_API_KEY`. |
| Email | Existing `/api/send-email` function, server-only `BREVO_API_KEY`, and the sender already configured in that function must be verified in Brevo. |
| Import/export | Original lazy-loaded PDF.js and SheetJS CDN scripts require network access; their URLs remain as recovered. |

The API functions were preserved. They currently **do not verify a Supabase JWT server-side**, and the Claude function still contains a placeholder cross-origin allowlist. The restored route guard does not secure those standalone API endpoints. Server-side authorization/rate limiting and any cross-origin configuration should be addressed before enabling unrestricted production access to those endpoints. Same-origin Vercel calls do not require a CORS allowlist entry.

There are no database migrations or deployment-secret records in the recovered source that prove these services are fully configured. No tables, policies, passwords, or live records were changed. The old soft-delete hook is preserved but not newly connected: the recovered dashboard keeps its historical deletion behavior. Test destructive operations only with disposable productions.

## Verification performed

- `npm run build`: passed; dashboard emits a separate lazy-loaded bundle. Vite still reports an entry chunk over 500 kB.
- `npm run lint`: zero errors, 19 warnings. Most warnings concern unused legacy bindings or existing effect dependencies. Missing identifiers are now checked rather than ignored.
- Browser integration tests (see `AUTH_FLOW.md` for the complete expanded coverage): public navigation/back/forward/direct routes; unauthenticated guard; invalid credentials/network/rate limits; login/loading/refresh/identity validation; all ten dashboard sections; expired refresh, rejected refresh, and rejected stored identity; verification-outage retry; data-error retry; mobile layout and logout; logo decoding/proportions; deployment rewrite configuration.
- No production accounts were created, no real sign-in credentials were supplied, and no real database rows, uploads, email, or paid AI requests were used by these tests.

To repeat locally:

```sh
npm ci
cp .env.example .env.local
npm run build
npm run lint
npx playwright install chromium
npm run test:integration
```

`cp` overwrites an existing `.env.local`; if you already have one, compare its variables instead of copying over it. The test suite replaces service URLs only inside its own test server and intercepts every external request. It does not change your environment file.

For a live acceptance check, use a test account to sign in, reload `/app`, sign out, and directly revisit it. With a disposable production, verify creation, a budget line, file upload/download, and applicable AI/email actions. Verify a second unrelated account cannot read that production, and that invited collaborators have only their intended permissions. These live checks are still outstanding.

## Use the delivered recovery branch

The downloadable Git bundle contains the local recovery branch and its commits. It is based on `c792681`, which must be present in your clone (a normal `git fetch origin` retrieves it through main's history).

After downloading `NKO_Dashboard_Recovery.bundle`, run these from your existing repository, replacing the example download path:

```sh
git status --short --branch
git fetch origin
git bundle verify /path/to/NKO_Dashboard_Recovery.bundle
git fetch /path/to/NKO_Dashboard_Recovery.bundle recover/dashboard-auth
git worktree add -b review/dashboard-recovery ../Nkoapp-dashboard-review FETCH_HEAD
cd ../Nkoapp-dashboard-review
git diff --stat origin/main...HEAD
```

The worktree protects uncommitted work in your current checkout. The new `review/dashboard-recovery` branch points to the recovered branch tip; the alternate local name avoids conflicts if you already have a branch with the original name. Choose an unused destination/branch name. `FETCH_HEAD` is the bundle's tip immediately after that fetch, so do not perform another fetch between fetching the bundle and creating the worktree.

If main has advanced, review and merge it on this review branch with `git merge origin/main`, resolving any conflicts deliberately. That merge can modify files in the review worktree; start with a clean worktree. Do not resolve conflicts by replacing all of `App.jsx` with the historical version. Rerun the checks before pushing.

When satisfied, publish only the review branch and open a pull request:

```sh
git push -u origin review/dashboard-recovery
```

No force push, reset, main-branch write, or deployment is needed for recovery. The provided local recovery was not pushed or deployed.

## Deployment refresh behavior

Keep `vercel.json` at the project root. It rewrites `/sign-in`, `/onboarding`, `/app`, `/app/*`, and `/dashboard` to `/index.html` while preserving the requested URL. Existing `/api/*` handlers continue to resolve independently. Configure both public Supabase variables in the deployment's build environment, rebuild, and use a preview deployment before merging.

Other hosts need equivalent SPA rewrites for these paths; a redirect to `/` is not equivalent. A static-only host cannot run the existing Vercel API functions without a separate backend deployment. The supplied configuration targets the existing Vercel setup, not a newly provisioned service.
