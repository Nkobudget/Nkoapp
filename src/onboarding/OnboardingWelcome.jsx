import { useId, useRef, useState } from "react";
import BrandHomeLink from "../components/BrandHomeLink";
import {
  ArrowLeft,
  ArrowRight,
  Clapperboard,
  Clock3,
  Image as ImageIcon,
  LoaderCircle,
  Sparkles,
  Target,
} from "lucide-react";

const setupSections = [
  { title: "Production", description: "Name, type and where you're shooting", Icon: Clapperboard },
  { title: "Scale", description: "Shooting days, crew and budget", Icon: Clock3 },
  { title: "Goals", description: "What you're working towards", Icon: Target },
  { title: "AI Setup", description: "We'll prepare your starting point", Icon: Sparkles },
];

function WorkspacePreview({ imageSrc, imageAlt, workspace }) {
  const [imageFailed, setImageFailed] = useState(false);
  const headingId = useId();
  const preview = { title: "Your workspace", plan: "PayGo", productions: "0", costs: "₦0", ...workspace };

  return (
    <aside aria-label="Workspace preview" className="relative flex min-h-[28rem] min-w-0 flex-col justify-end overflow-hidden border-t border-palette-graphite/50 bg-palette-dark-gray lg:min-h-[49rem] lg:border-t-0 lg:border-l">
      {imageSrc && !imageFailed ? (
        <img src={imageSrc} alt={imageAlt} decoding="async" onError={() => setImageFailed(true)} className="absolute inset-0 h-full w-full object-cover" />
      ) : (
        <div role="img" aria-label="Studio image placeholder" className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-linear-to-br from-palette-graphite via-palette-dark-gray to-palette-black p-6 pb-56 text-center text-palette-stone lg:pb-6">
          <ImageIcon aria-hidden="true" focusable="false" strokeWidth={1.25} className="size-12" />
          <span className="text-sm leading-6">Studio image</span>
        </div>
      )}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-linear-to-t from-palette-black/85 via-palette-black/20 to-palette-black/10" />

      <div className="relative z-10 px-6 pb-10 sm:px-10 lg:px-14 lg:pb-30">
        <section aria-labelledby={headingId} className="@container max-w-[26.5rem] overflow-hidden rounded-lg border border-palette-graphite/70 bg-palette-black/85">
          <div className="px-4 py-4">
            <p className="text-[0.625rem] leading-4 tracking-[0.08em] text-palette-stone uppercase">Workspace</p>
            <h2 id={headingId} className="mt-1 text-2xl leading-8 font-medium tracking-[-0.04em]">{preview.title}</h2>
          </div>
          <dl className="grid grid-cols-1 border-t border-palette-graphite/70 @min-[14rem]:grid-cols-3">
            {[["Plan", preview.plan], ["Productions", preview.productions], ["Costs", preview.costs]].map(([label, value]) => (
              <div key={label} className="min-w-0 px-4 py-3 not-first:border-t not-first:border-palette-graphite/70 @min-[14rem]:not-first:border-t-0 @min-[14rem]:not-first:border-l">
                <dt className="text-[0.6875rem] leading-4 text-palette-stone">{label}</dt>
                <dd className="mt-1 text-sm leading-6 font-medium">{value}</dd>
              </div>
            ))}
          </dl>
        </section>
        <p className="mt-6 max-w-[30rem] text-sm leading-6 text-palette-stone">
          Budgets, breakdowns, schedules and payments, connected from the first frame.
        </p>
      </div>
    </aside>
  );
}


export default function OnboardingWelcome({
  onSetUpProduction,
  onSkip,
  onBack,
  heroImageSrc= "/assets/studio.png",
  heroImageAlt = "A studio set prepared for filming",
  workspacePreview,
  durationText = "About 3 minutes",
  sections = setupSections,
  headerActions,
  copy = {},
  className = "",
}) {
  const headingId = useId();
  const errorId = useId();
  const busyRef = useRef(false);
  const [pending, setPending] = useState(null);
  const [error, setError] = useState("");
  const content = {
    heading: "Welcome to NKO.", tagline: "Let's set up your first production.",
    body: "NKO uses the information you provide to help organise your production, build smarter budgets, and keep everything connected from planning to payment.",
    back: "Back", setup: "Set Up My Production", skip: "I'll do this later", ...copy,
  };

  async function runAction(action, handler) {
    if (busyRef.current || typeof handler !== "function") return;
    busyRef.current = true;
    setPending(action);
    setError("");
    try {
      await handler();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      busyRef.current = false;
      setPending(null);
    }
  }

  const isBusy = pending !== null;

  return (
    <main aria-labelledby={headingId} className={`min-h-svh bg-palette-black text-palette-ivory wrap-break-word ${className}`}>
      <div className="flex min-h-svh items-center justify-center bg-palette-near-black/35 px-5 py-10 sm:px-8 lg:px-12">
        <div className="grid w-full max-w-[80rem] lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
          <div className="min-w-0">
            <header className="flex flex-wrap items-center justify-between gap-2 border-b border-palette-graphite/50 px-4 py-3 sm:px-10 lg:px-14">
              <BrandHomeLink className="h-6 w-auto lg:h-7" />
              {headerActions}
              <button
                type="button"
                onClick={() => runAction("back", onBack)}
                disabled={isBusy || typeof onBack !== "function"}
                aria-busy={pending === "back"}
                className="flex min-h-11 min-w-0 items-center gap-1 rounded-sm px-1 text-xs leading-5 text-palette-stone enabled:hover:text-palette-ivory focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-palette-gold disabled:cursor-not-allowed"
              >
                <ArrowLeft aria-hidden="true" focusable="false" strokeWidth={1.5} className="size-3.5 shrink-0" />
                <span className="min-w-0">{content.back}</span>
              </button>
            </header>

            <div className="@container px-6 pt-10 pb-12 sm:px-10 lg:px-16 lg:pt-14 lg:pb-16">
              <h1 id={headingId} className="text-[2.25rem] leading-[1.08] font-medium tracking-[-0.05em] sm:text-[2.75rem] lg:text-[clamp(2.75rem,4.4vw,4rem)]">{content.heading}</h1>
              <p className="mt-4 text-lg leading-7 text-palette-stone lg:mt-4 lg:text-[1.75rem] lg:leading-9">{content.tagline}</p>
              <p className="mt-8 text-sm leading-6 text-palette-stone lg:mt-10 lg:text-base">
                {content.body}
              </p>

              <dl className="mt-8 border-t border-palette-graphite/60">
                {sections.map(({ title, description, Icon }) => (
                  <div key={title} className="grid grid-cols-1 gap-1 border-b border-palette-graphite/60 py-3 sm:@min-[24rem]:grid-cols-[minmax(0,1fr)_minmax(0,1.8fr)] sm:@min-[24rem]:gap-x-4">
                    <dt className="flex min-w-0 items-center gap-3 text-sm leading-6 font-medium">
                      {Icon && <Icon aria-hidden="true" focusable="false" strokeWidth={1.5} className="size-4 shrink-0 text-palette-stone" />}
                      <span className="min-w-0">{title}</span>
                    </dt>
                    <dd className="min-w-0 pl-7 text-xs leading-6 text-palette-stone sm:@min-[24rem]:pl-0 sm:@min-[24rem]:text-right lg:text-sm">{description}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-3 text-xs leading-5 text-palette-stone">{durationText}</p>

              <div className="mt-9 flex min-w-0 flex-col gap-3 sm:flex-row sm:flex-wrap">
                <button
                  type="button"
                  onClick={() => runAction("setup", onSetUpProduction)}
                  disabled={isBusy || typeof onSetUpProduction !== "function"}
                  aria-busy={pending === "setup"}
                  aria-describedby={error ? errorId : undefined}
                  className="flex min-h-12 w-full min-w-0 items-center justify-center gap-2 rounded-xl border border-palette-apricot bg-palette-apricot px-4 py-3 text-sm leading-6 font-medium text-palette-near-black shadow-[0_0_2rem_0] shadow-palette-apricot/20 enabled:hover:bg-palette-apricot/90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-palette-gold disabled:cursor-not-allowed sm:w-auto sm:px-6 sm:text-base"
                >
                  <span className="min-w-0">{pending === "setup" ? "Starting…" : content.setup}</span>
                  {pending === "setup" ? <LoaderCircle aria-hidden="true" focusable="false" className="size-4 shrink-0 motion-safe:animate-spin" /> : <ArrowRight aria-hidden="true" focusable="false" strokeWidth={1.75} className="size-4 shrink-0" />}
                </button>
                <button
                  type="button"
                  onClick={() => runAction("skip", onSkip)}
                  disabled={isBusy || typeof onSkip !== "function"}
                  aria-busy={pending === "skip"}
                  aria-describedby={error ? errorId : undefined}
                  className="min-h-12 w-full min-w-0 rounded-xl border border-palette-graphite bg-palette-black px-4 py-3 text-sm leading-6 font-medium enabled:hover:border-palette-stone enabled:hover:bg-palette-near-black focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-palette-gold disabled:cursor-not-allowed sm:w-auto sm:px-5 sm:text-base"
                >
                  {pending === "skip" ? "Continuing…" : content.skip}
                </button>
              </div>
              <p role="status" className="sr-only">{isBusy ? "Please wait while we continue." : ""}</p>
              {error && <p id={errorId} role="alert" className="mt-4 text-sm leading-6 text-palette-apricot">{error}</p>}
            </div>
          </div>

          <WorkspacePreview key={heroImageSrc || "studio-placeholder"} imageSrc={heroImageSrc} imageAlt={heroImageAlt} workspace={workspacePreview} />
        </div>
      </div>
    </main>
  );
}
