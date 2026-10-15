# Header, logo, and sharing updates

The landing header reads the existing `AuthProvider`. Login points directly to
`/app`, where the unchanged `AuthGate` still checks session initialization,
password recovery, authentication, and the current user's onboarding record.
The `/sign-in` provider-choice page remains available. Its existing multicolored
Google SVG and email/Google callbacks are preserved; Google is still disabled
when no Google handler is configured.

## Account menu

The uploaded project already contained `AccountMenu`, `BrandHomeLink`, and the
initials helper. This change reuses them and finishes their integration.

- During session restoration, the header reserves the account-control space.
- Signed-in users see initials from the first two name parts. A single name uses
  one initial; missing names use the email's first letter, then a user icon.
- The menu supports mouse hover, click/tap, Enter/Space, arrow keys, Home/End,
  Escape, Tab, and outside-pointer dismissal. Escape returns focus to the trigger.
- My dashboard goes to `/app`, including onboarding for users who need it.
- Sign out calls the shared `signOut`. A rejected request that leaves the session
  intact can be retried in the menu. The installed Supabase SDK can also clear
  the local session despite a remote revocation error; the header follows the
  provider's anonymous state in that case. Successful logout restores
  Login/Get Started and focuses Login.
- The header has a stacking level so the menu appears above hero animations.
  The existing navigation links appear from 1024px to avoid tablet overlap.

## Brand links and favicon

Authentication, onboarding welcome/role/currency screens, and both dashboard
brand marks use `BrandHomeLink`. Header and footer logos also lead to `/`.
These links do not sign users out or mark incomplete onboarding as complete.
Every brand mark uses the original `/assets/logo.png` and retains its proportions.

`public/favicon.svg` embeds the same PNG, centered without stretching on a square
dark background. The original PNG is also declared as an icon fallback in
`index.html`. The source logo is 72 × 28 pixels; a higher-resolution logo would
improve large future brand graphics, but no replacement is required for this task.

## Website metadata

`index.html` contains a descriptive title, description, canonical URL, Open Graph
tags, and Twitter/X large-image card tags. They are present in the initial HTML,
so preview crawlers do not need to execute React.

The canonical site is `https://nko-three.vercel.app/`. That address and its logo
returned HTTP 200 during verification. The preview reuses the existing production
workspace image at `/assets/Background.png` (2512 × 1498); its actual dimensions
and a descriptive alt text are included. No personal social-media handles or
unverified custom domains were invented.

If the owner chooses another primary domain, update these four URL values in
`index.html`: canonical, `og:url`, `og:image`, and `twitter:image`. All use the
public production origin, including when the source is deployed to a preview.

Link-preview limitations:

- Changes must be deployed before external crawlers see them.
- Messaging/social services cache cards and may retain an old preview until
  they re-fetch the URL. They control cropping and whether a card is displayed.
- The URL and image must remain publicly accessible without a login or Vercel
  deployment-protection wall. Test the production URL rather than a protected
  preview deployment.
- All client routes currently share the website metadata. Route-specific share
  cards would require a separate prerendering/server-rendering decision.

## Applying and checking

Apply the patch to the existing project, or copy the updated source files while
keeping your existing `.env.local`. Download archives exclude local environment
files, dependency folders, build output, and Git internals. Keep the existing
Supabase environment values and service settings. On Vercel, the Output Directory
must remain `dist` and the build command `npm run build`.

Run `npm test`, `npm run lint`, `npm run build`, and `npm run test:production`.
Install the Playwright browser once with `npx playwright install chromium` if
needed. Browser tests mock Supabase; no live account credentials, production
database writes, or email/AI service calls are used. The new checks cover direct
Login navigation, account-menu input methods, logout success/remote failure, logo links,
small-screen fit, initialization, favicon loading, and crawler-visible metadata.
