import { useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LoaderCircle, Mail } from "lucide-react";
import AuthSplitLayout from "./AuthSplitLayout";
import { DURATION, EASE_OUT, fadeUp, staggerContainer } from "../lib/motion";

// Official four-colour Google "G" mark, as used on Google sign-in buttons.
function GoogleLogo({ className = "" }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 48 48" focusable="false" aria-hidden="true" className={`shrink-0 ${className}`}>
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
  accountLinkLabel = "Log in",
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
    <AuthSplitLayout
      ariaLabelledBy={headingId}
      heroImageSrc={heroImageSrc}
      heroImageAlt={heroImageAlt}
      projectPreview={projectPreview}
      className={className}
    >
      <motion.div
        variants={staggerContainer(0.06, 0.04)}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          id={headingId}
          variants={fadeUp}
          className="text-[2rem] leading-[1.08] font-medium tracking-[-0.04em] sm:text-[2.5rem] lg:text-[2.85rem]"
        >
          <span className="block">Let's get your</span>{" "}
          <span className="block">production moving.</span>
        </motion.h1>
        <motion.p variants={fadeUp} className="mt-4 text-sm leading-6 text-palette-stone sm:text-[0.9375rem]">
          {introText}
        </motion.p>

        <motion.div variants={fadeUp} className="mt-8 grid grid-cols-1 gap-3">
          {actions.map(({ provider, label, pendingLabel, handler }) => {
            const isDisabled = pending !== null || typeof handler !== "function";
            return (
              <motion.button
                key={provider}
                type="button"
                disabled={isDisabled}
                aria-busy={pending === provider}
                aria-describedby={error ? errorId : undefined}
                onClick={() => continueWith(provider, handler)}
                whileHover={!isDisabled ? { scale: 1.01 } : undefined}
                whileTap={!isDisabled ? { scale: 0.985 } : undefined}
                transition={{ duration: DURATION.fast, ease: EASE_OUT }}
                className={`flex min-h-12 w-full min-w-0 items-center justify-center gap-2.5 rounded-full border px-5 py-3 text-sm leading-5 font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-palette-gold disabled:cursor-not-allowed disabled:opacity-65 ${
                  provider === "google"
                    ? "border-palette-ivory bg-palette-ivory text-palette-charcoal enabled:hover:bg-palette-ivory/90"
                    : "border-palette-graphite bg-palette-near-black text-palette-ivory enabled:hover:border-palette-stone enabled:hover:bg-palette-dark-gray"
                }`}
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
              </motion.button>
            );
          })}
        </motion.div>

        {googleUnavailableMessage && (
          <motion.p variants={fadeUp} className="mt-3 text-xs leading-5 text-palette-stone">
            {googleUnavailableMessage}
          </motion.p>
        )}

        <p role="status" className="sr-only">
          {pending ? "Please wait while we continue." : ""}
        </p>
        <AnimatePresence initial={false}>
          {error && (
            <motion.p
              id={errorId}
              role="alert"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: DURATION.fast, ease: EASE_OUT }}
              className="mt-4 text-sm leading-6 text-palette-apricot"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>

        <motion.p variants={fadeUp} className="mt-8 text-sm leading-6 text-palette-stone">
          {accountPrompt}{" "}
          <OptionalLink href={accountHref} onClick={onAccountClick} className="font-medium text-palette-ivory">
            {accountLinkLabel}
          </OptionalLink>
        </motion.p>

        <motion.p variants={fadeUp} className="mt-8 border-t border-palette-graphite/50 pt-5 text-xs leading-5 text-palette-stone">
          By continuing, you agree to NKŌ's{" "}
          <OptionalLink href={termsHref}>Terms of Service</OptionalLink> and{" "}
          <OptionalLink href={privacyHref}>Privacy Policy</OptionalLink>.
        </motion.p>
      </motion.div>
    </AuthSplitLayout>
  );
}
