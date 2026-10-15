import { useId, useRef, useState } from "react";
import { Image as ImageIcon, LoaderCircle, Mail } from "lucide-react";
import BrandHomeLink from "../components/BrandHomeLink";

// Official four-colour Google "G" mark, as used on Google sign-in buttons.
function GoogleLogo({ className = "" }) {
  return (
    <svg viewBox="0 0 48 48" focusable="false" aria-hidden="true" className={className}>
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  );
}

function OptionalLink({ href, onClick, children, className = "" }) {
  const interactiveClasses =
    "rounded-sm underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-palette-gold";

  if (href) {
    return <a href={href} className={`${interactiveClasses} ${className}`}>{children}</a>;
  }
  if (typeof onClick === "function") {
    return <button type="button" onClick={onClick} className={`${interactiveClasses} ${className}`}>{children}</button>;
  }
  return <span className={className}>{children}</span>;
}

function ProductionPreview({ imageSrc, imageAlt, project }) {
  const [imageFailed, setImageFailed] = useState(false);
  const projectId = useId();
  const preview = { title: "Untitled", scenes: "46", days: "12", budget: "₦5.8m", ...project };

  return (
    <aside
      aria-label="Production preview"
      className="relative flex min-h-[28rem] flex-col justify-end overflow-hidden border-t border-palette-graphite/60 bg-palette-dark-gray lg:min-h-[44rem] lg:border-t-0 lg:border-l"
    >
      {imageSrc && !imageFailed ? (
        <img
          src={imageSrc}
          alt={imageAlt}
          decoding="async"
          onError={() => setImageFailed(true)}
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <div
          role="img"
          aria-label="Production image placeholder"
          className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-linear-to-br from-palette-graphite via-palette-dark-gray to-palette-black p-6 pb-56 text-center text-palette-stone lg:pb-6"
        >
          <ImageIcon aria-hidden="true" focusable="false" strokeWidth={1.25} className="size-12" />
          <span className="text-sm leading-6">Production image</span>
        </div>
      )}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-linear-to-t from-palette-black/85 via-palette-black/20 to-palette-black/10" />

      <div className="relative z-10 px-6 pb-10 sm:px-10 lg:px-14 lg:pb-14">
        <section aria-labelledby={projectId} className="@container max-w-[26.5rem] overflow-hidden rounded-lg border border-palette-graphite/80 bg-palette-near-black/95">
          <div className="px-4 py-4">
            <p className="text-[0.6875rem] leading-4 text-palette-stone">Production</p>
            <h2 id={projectId} className="mt-1 text-2xl leading-8 font-medium tracking-[-0.04em]">{preview.title}</h2>
          </div>
          <dl className="grid grid-cols-1 border-t border-palette-graphite/80 @min-[14rem]:grid-cols-3">
            {[["Scenes", preview.scenes], ["Days", preview.days], ["Budget", preview.budget]].map(([label, value]) => (
              <div key={label} className="min-w-0 px-4 py-3 not-first:border-t not-first:border-palette-graphite/80 @min-[14rem]:not-first:border-t-0 @min-[14rem]:not-first:border-l">
                <dt className="text-[0.6875rem] leading-4 text-palette-stone">{label}</dt>
                <dd className="mt-1 text-sm leading-6 font-medium">{value}</dd>
              </div>
            ))}
          </dl>
        </section>
        <p className="mt-6 max-w-[30rem] text-xs leading-5 text-palette-stone">
          Every production starts with a blank slate. Yours starts here.
        </p>
      </div>
    </aside>
  );
}


export default function SignInPage({
  onGoogleContinue,
  onEmailContinue,
  googleUnavailableMessage,
  accountHref,
  onAccountClick,
  termsHref,
  privacyHref,
  heroImageSrc = "/assets/product-complex2.png",
  heroImageAlt = "Production crew working on a film set",
  googleIcon,
  projectPreview,
  introText = "Create your NKŌ workspace and start building your production with AI.",
  accountPrompt = "Already have an account?",
  accountLinkLabel = "Login",
  className = "",
}) {
  const headingId = useId();
  const errorId = useId();
  const busyRef = useRef(false);
  const [pending, setPending] = useState(null);
  const [error, setError] = useState("");

  async function continueWith(provider, handler) {
    if (busyRef.current || typeof handler !== "function") return;
    busyRef.current = true;
    setPending(provider);
    setError("");
    try {
      await handler();
    } catch {
      setError("We couldn't continue. Please try again.");
    } finally {
      busyRef.current = false;
      setPending(null);
    }
  }

  const actions = [
    { provider: "google", label: "Continue with Google", pendingLabel: "Connecting to Google…", handler: onGoogleContinue },
    { provider: "email", label: "Continue with Email", pendingLabel: "Continuing…", handler: onEmailContinue },
  ];

  return (
    <main aria-labelledby={headingId} className={`min-h-svh bg-palette-black text-palette-ivory wrap-break-word ${className}`}>
      <div className="flex min-h-svh items-center justify-center bg-palette-near-black/35 px-5 py-10 sm:px-8 lg:px-12">
        <div className="grid w-full max-w-[80rem] lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
          <div className="min-w-0">
            <header className="border-b border-palette-graphite/50 px-6 pt-8 pb-3 sm:px-10 lg:px-14">
              <BrandHomeLink className="h-6 w-auto" />
            </header>

            <div className="px-6 pt-10 pb-12 sm:px-10 sm:pt-14 lg:px-16 lg:pt-[4.25rem] lg:pb-16">
              <h1 id={headingId} className="text-[2rem] leading-[1.06] font-medium tracking-[-0.05em] sm:text-[2.5rem] lg:text-[clamp(2.25rem,3.85vw,3.5rem)]">
                <span className="block">Let's get your</span>{" "}
                <span className="block">production moving.</span>
              </h1>
              <p className="mt-6 text-sm leading-6 text-palette-stone lg:mt-8 lg:text-base lg:leading-7">{introText}</p>

              <div className="mt-8 grid grid-cols-1 gap-3">
                {actions.map(({ provider, label, pendingLabel, handler }) => (
                  <button
                    key={provider}
                    type="button"
                    disabled={pending !== null || typeof handler !== "function"}
                    aria-busy={pending === provider}
                    aria-describedby={error ? errorId : undefined}
                    onClick={() => continueWith(provider, handler)}
                    className={`flex min-h-12 w-full min-w-0 items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm leading-5 font-medium focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-palette-gold disabled:cursor-not-allowed ${provider === "google"
                      ? "border-palette-ivory bg-palette-ivory text-palette-charcoal enabled:hover:bg-palette-ivory/90"
                      : "border-palette-graphite bg-palette-black text-palette-ivory enabled:hover:border-palette-stone enabled:hover:bg-palette-near-black"}`}
                  >
                    <span aria-hidden="true" className="flex size-4 shrink-0 items-center justify-center">
                      {pending === provider ? (
                        <LoaderCircle focusable="false" strokeWidth={1.75} className="size-4 motion-safe:animate-spin" />
                      ) : provider === "email" ? (
                        <Mail focusable="false" strokeWidth={1.75} className="size-4" />
                      ) : (
                        googleIcon || <GoogleLogo className="size-4" />
                      )}
                    </span>
                    <span className="min-w-0">{pending === provider ? pendingLabel : label}</span>
                  </button>
                ))}
              </div>

              {googleUnavailableMessage && <p className="mt-3 text-xs leading-5 text-palette-stone">{googleUnavailableMessage}</p>}

              <p role="status" className="sr-only">{pending ? "Please wait while we continue." : ""}</p>
              {error && <p id={errorId} role="alert" className="mt-4 text-sm leading-6 text-palette-apricot">{error}</p>}

              <p className="mt-9 text-sm leading-6 text-palette-stone">
                {accountPrompt}{" "}
                <OptionalLink href={accountHref} onClick={onAccountClick} className="text-palette-ivory">{accountLinkLabel}</OptionalLink>
              </p>

              <p className="mt-10 border-t border-palette-graphite/50 pt-6 text-xs leading-5 text-palette-stone">
                By continuing, you agree to NKŌ's{" "}
                <OptionalLink href={termsHref}>Terms of Service</OptionalLink>{" "}
                and <OptionalLink href={privacyHref}>Privacy Policy</OptionalLink>.
              </p>
            </div>
          </div>

          <ProductionPreview
            key={heroImageSrc || "production-placeholder"}
            imageSrc={heroImageSrc}
            imageAlt={heroImageAlt}
            project={projectPreview}
          />
        </div>
      </div>
    </main>
  );
}
