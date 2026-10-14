# NKO
The African Production Ledger — budgeting tool for African filmmakers.

## Run locally

Use Node.js 20 or newer. The existing lockfile installs React 18.3.1 and React Router 7.18.4, whose React peer requirement is `>=18`.

```sh
npm ci
npm run dev
```

## Page routes

| URL | Page |
| --- | --- |
| `/` | Existing landing page |
| `/onboarding` | OnboardingWelcome |
| `/sign-in` | SignInPage |

The existing `react-router` dependency is reused. `BrowserRouter` wraps the app inside the existing reduced-motion provider, and `App.jsx` defines the routes. The landing-page layout, sections, asset paths, and styles are preserved.

Navigation:

- Header **Get Started** opens `/onboarding`.
- Header **Login** opens `/sign-in`.
- Onboarding **Set Up My Production** opens `/sign-in`.
- Onboarding **Back** and **I'll do this later** return to `/`.
- Sign-in **New to NKO? Get started** opens `/onboarding`. This footer uses the component's existing copy/navigation props so its label describes its destination.
- Browser Back/Forward uses normal history entries. An unknown client-side route returns to `/` with replacement history.

The supplied ZIP contained `SignInPage` but no onboarding component. The previously supplied `OnboardingWelcome` page is added in `src/onboarding/OnboardingWelcome.jsx` with its existing design and image placeholder.

These changes handle page navigation only. The Google/email buttons retain their original behavior and remain disabled until authentication callbacks are provided by the application. Production setup and skipping do not create records, change authentication, or persist an onboarding status. Existing API functions, Supabase configuration, CSS, and assets are preserved.

## Brand logo

The header, footer, sign-in page, and onboarding welcome page all use `src/components/BrandLogo.jsx`, which loads the existing `/assets/logo.png` image. The file stays in `public/assets/logo.png`, following Vite's existing public-asset convention. Text/SVG logo substitutes and alternate-logo props were removed from these locations.

The image's intrinsic dimensions are 72 × 28. Tailwind sets one display dimension and lets the other scale automatically: the header is 40 pixels high, sign-in is 24 pixels high, onboarding is 24 pixels high on smaller screens and 28 on large screens, and the footer is 64 pixels wide within its original 64 × 32 container. Existing page padding and grids are preserved. Home links have the accessible name “NKO home”; standalone page logos have the alternative text “NKO”.

The production browser check confirmed HTTP 200, the PNG content type, unchanged asset bytes, successful image decoding, and the correct aspect ratio in all four locations at 320, 375, 768, 1280, and 1440 pixels. Navigation and existing authentication-button behavior also passed after the logo update.

## Deploy and refresh page URLs

Build with `npm run build` and deploy the `dist` directory using the Vite preset. The existing `vercel.json` now rewrites `/sign-in` and `/onboarding` to `/index.html`, keeping the requested URL so React Router can render it on a direct visit or refresh. The rewrites are limited to those page paths; existing API functions, assets, and security headers remain configured as before. Include `vercel.json` in the project root when deploying.

On another static host, configure equivalent **rewrites** for these page URLs to `index.html`. The host must serve the app entrypoint while retaining the requested path. Vite's development and preview servers already support this SPA behavior. Other hosting configurations are not included because a Vercel configuration was supplied.

## Verification

Run the existing checks:

```sh
npm run lint
npm run build
```

In the browser, verify the header links, onboarding setup/back/skip controls, sign-in footer, Back/Forward history, and direct visits plus refreshes at both `/onboarding` and `/sign-in`. The completed integration is checked against the production build locally; no live Vercel deployment is performed.

Completed checks:

- Production build passed.
- The existing ESLint check completed with zero errors and 101 warnings after the logo update. Its configuration does not enable `react/jsx-uses-vars`, so it reports JSX-used bindings as unused; the updates introduce no errors. The lint configuration is preserved.
- Browser navigation and Back/Forward passed without full-document reloads during internal navigation.
- Direct visits and refreshes returned HTTP 200 and the correct page for both routes, using Vite production preview and a static server applying the supplied Vercel rewrites.
- Header, setup, back, skip, and sign-in footer controls passed at 375, 768, 1280, and 1440 pixels, with no horizontal overflow or browser runtime errors.
- The page rewrites preserved asset delivery and did not map API paths to the app entrypoint. Backend/authentication code and both page designs were preserved.
