import { motion } from "framer-motion";
import { ArrowLeft, Check } from "lucide-react";
import BrandHomeLink from "../components/BrandHomeLink";
import { DURATION, EASE_OUT } from "../lib/motion";

const STEPS = [
  { num: "01", label: "You" },
  { num: "02", label: "Production" },
  { num: "03", label: "Scale" },
  { num: "04", label: "Goals" },
  { num: "05", label: "AI Setup" },
];

export default function OnboardingStepLayout({
  activeStep = 0,
  onBack,
  preview = {},
  children,
}) {
  const {
    roleCode = "YO",
    roleLabel = "Your role",
    locationLabel = "Where you're based",
    productionTitle = "Untitled",
    productionType = "Type",
    productionStatus = "Status",
    productionLocation = "Location",
    shootingDays = "—",
    crewSize = "—",
    locationsCount = "—",
    budgetLabel = "Not set yet",
    budgetValue = "—",
    language = "English",
    currency = "NGN",
    roleSelected = false,
    hasProductionTitle = false,
    hasScaleMetrics = false,
    workspaceModules = [
      { label: "Budget", status: "-" },
      { label: "Breakdown", status: "-" },
    ],
  } = preview;

  const currentStep = STEPS[activeStep] || STEPS[0];

  return (
    <main className="min-h-svh bg-palette-black text-palette-ivory wrap-break-word">
      <div className="grid min-h-svh w-full lg:grid-cols-[minmax(0,1.22fr)_minmax(0,1fr)]">
        {/* Left column: Navigation + Step Content */}
        <motion.section
          aria-label="Onboarding setup"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: DURATION.base, ease: EASE_OUT }}
          className="flex min-w-0 flex-col bg-palette-black"
        >
          <header className="flex flex-wrap items-center justify-between gap-4 border-b border-palette-graphite/70 px-6 py-4 sm:px-10 lg:px-12">
            <div className="flex flex-wrap items-center gap-5 sm:gap-7">
              <BrandHomeLink className="h-5 w-auto sm:h-6" />

              <nav aria-label="Onboarding steps" className="hidden items-center gap-2 text-xs sm:flex">
                {STEPS.map((step, index) => {
                  const completed = index < activeStep;
                  const active = index === activeStep;
                  return (
                    <div key={step.num} className="flex items-center gap-2">
                      {index > 0 && (
                        <span
                          aria-hidden="true"
                          className={`h-px w-3.5 transition-colors ${
                            index <= activeStep ? "bg-palette-apricot/55" : "bg-palette-graphite"
                          }`}
                        />
                      )}
                      <span
                        aria-current={active ? "step" : undefined}
                        className={`inline-flex items-center gap-1.5 font-mono text-[11px] tracking-tight transition-colors ${
                          active
                            ? "text-palette-ivory"
                            : completed
                            ? "text-palette-stone"
                            : "text-palette-gray"
                        }`}
                      >
                        {completed ? (
                          <span
                            aria-hidden="true"
                            className="inline-flex size-3.5 items-center justify-center rounded-full bg-palette-apricot/20 text-palette-apricot"
                          >
                            <Check strokeWidth={2.5} className="size-2.5" />
                          </span>
                        ) : (
                          <span className={active ? "font-semibold text-palette-apricot" : "text-palette-gray"}>
                            {step.num}
                          </span>
                        )}
                        <span className="font-sans">{step.label}</span>
                      </span>
                    </div>
                  );
                })}
              </nav>
            </div>

            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-palette-stone transition-colors hover:text-palette-ivory focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-palette-gold"
            >
              <ArrowLeft aria-hidden="true" className="size-3.5" />
              <span>Back</span>
            </button>
          </header>

          {/* Compact mobile step pill */}
          <div className="flex items-center justify-between border-b border-palette-graphite/50 px-6 py-2.5 text-xs sm:hidden">
            <span className="font-mono text-palette-stone">
              <span className="font-semibold text-palette-apricot">{currentStep.num}</span>{" "}
              {currentStep.label}
            </span>
            <span className="font-mono text-[11px] text-palette-gray">
              Step {activeStep + 1} of {STEPS.length}
            </span>
          </div>

          <div className="flex flex-1 flex-col justify-center px-6 py-8 sm:px-10 sm:py-10 lg:px-14 lg:py-12">
            {children}
          </div>
        </motion.section>

        {/* Right column: Live workspace preview */}
        <aside
          aria-label="Workspace preview"
          className="flex flex-col justify-center border-t border-palette-graphite/70 bg-palette-near-black/65 px-6 py-10 sm:px-10 lg:border-t-0 lg:border-l lg:px-12 lg:py-12"
        >
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: DURATION.base, delay: 0.12, ease: EASE_OUT }}
            className="mx-auto w-full max-w-[27.5rem]"
          >
            <div className="mb-3 flex items-center justify-between gap-2 font-mono text-xs">
              <span className="text-palette-stone">Workspace preview</span>
              <span className="inline-flex items-center gap-1.5 text-palette-stone">
                <span aria-hidden="true" className="size-1.5 rounded-full bg-palette-apricot motion-safe:animate-pulse" />
                <span>Building as you go</span>
              </span>
            </div>

            <div className="overflow-hidden rounded-xl border border-palette-graphite bg-palette-charcoal/55 shadow-2xl shadow-palette-black/50">
              {/* Preview Row 1: Role + Location + Language */}
              <div className="flex items-center justify-between gap-3 border-b border-palette-graphite/80 px-4 py-3.5">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-palette-graphite bg-palette-dark-gray font-mono text-xs font-medium text-palette-stone">
                    {roleCode}
                  </div>
                  <div className="min-w-0">
                    <p
                      className={`truncate text-sm font-medium ${
                        roleSelected ? "text-palette-ivory" : "text-palette-stone"
                      }`}
                    >
                      {roleLabel}
                    </p>
                    <p className="truncate text-xs text-palette-gray">{locationLabel}</p>
                  </div>
                </div>
                <span className="shrink-0 font-mono text-xs text-palette-stone">{language}</span>
              </div>

              {/* Preview Row 2: Production */}
              <div className="border-b border-palette-graphite/80 px-4 py-4">
                <p className="font-mono text-[11px] text-palette-gray">Production</p>
                <p
                  className={`mt-1 truncate text-2xl leading-8 font-medium tracking-[-0.03em] ${
                    hasProductionTitle ? "text-palette-ivory" : "text-palette-warm-gray"
                  }`}
                >
                  {productionTitle}
                </p>
                <p className="mt-1.5 truncate font-mono text-[11px] text-palette-gray">
                  {productionType} · {productionStatus} · {productionLocation}
                </p>
              </div>

              {/* Preview Row 3: 3-column metrics */}
              <dl className="grid grid-cols-3 border-b border-palette-graphite/80">
                {[
                  ["Shooting days", shootingDays],
                  ["Crew", crewSize],
                  ["Locations", locationsCount],
                ].map(([metric, val], idx) => (
                  <div
                    key={metric}
                    className={`px-4 py-3 ${idx > 0 ? "border-l border-palette-graphite/80" : ""}`}
                  >
                    <dt className="font-mono text-[11px] text-palette-gray">{metric}</dt>
                    <dd
                      className={`mt-1.5 font-mono text-sm tabular-nums ${
                        hasScaleMetrics ? "font-medium text-palette-ivory" : "text-palette-warm-gray"
                      }`}
                    >
                      {val}
                    </dd>
                  </div>
                ))}
              </dl>

              {/* Preview Row 4: Budget */}
              <div className="flex items-center justify-between border-b border-palette-graphite/80 px-4 py-3.5">
                <div>
                  <p className="font-mono text-[11px] text-palette-gray">
                    Budget · <span className="text-palette-stone">{currency}</span>
                  </p>
                  <p className="mt-0.5 text-xs text-palette-stone">{budgetLabel}</p>
                </div>
                <span className="font-mono text-sm tabular-nums text-palette-warm-gray">{budgetValue}</span>
              </div>

              {/* Preview Row 5: Workspace modules */}
              <div className="px-4 py-3.5">
                <p className="font-mono text-[11px] text-palette-gray">Workspace modules</p>
                <ul className="mt-2.5 space-y-2 text-xs text-palette-stone">
                  {workspaceModules.map((mod) => (
                    <li key={mod.label} className="flex items-center justify-between gap-2">
                      <span className={mod.active ? "text-palette-ivory" : "text-palette-stone"}>
                        {mod.label}
                      </span>
                      <span
                        className={`font-mono text-[11px] ${
                          mod.active ? "text-palette-apricot" : "text-palette-gray"
                        }`}
                      >
                        {mod.status}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <p className="mt-4 text-xs leading-5 text-palette-gray">
              Nothing is final. You&apos;ll review everything NKO prepares before it&apos;s added to your workspace.
            </p>
          </motion.div>
        </aside>
      </div>
    </main>
  );
}

