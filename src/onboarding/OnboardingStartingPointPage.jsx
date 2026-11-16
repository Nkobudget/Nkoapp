import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import BrandHomeLink from "../components/BrandHomeLink";
import { DURATION, EASE_OUT, fadeUp, staggerContainer } from "../lib/motion";

const CURRENCY_SYMBOLS = {
  NGN: "₦",
  GHS: "₵",
  KES: "KSh ",
  ZAR: "R",
  UGX: "USh ",
  TZS: "TSh ",
  XOF: "Fr ",
  ETB: "Br ",
  USD: "$",
  GBP: "£",
  CAD: "CA$",
  EUR: "€",
};

const BUDGET_SEGMENTS = [
  "bg-palette-warm-gray/75",
  "bg-palette-stone/70",
  "bg-palette-stone/60",
  "bg-palette-warm-gray/85",
  "bg-palette-stone/55",
  "bg-palette-warm-gray/70",
  "bg-palette-stone/65",
  "bg-palette-warm-gray/60",
  "bg-palette-stone/75",
  "bg-palette-warm-gray/80",
  "bg-palette-stone/50",
  "bg-palette-warm-gray/65",
];

const BREAKDOWN_TAGS = [
  "Direction & production",
  "Camera",
  "Lighting & grip",
  "Sound",
];

export default function OnboardingStartingPointPage({ profile, onBack, onMakeChanges }) {
  const [previewNotice, setPreviewNotice] = useState("");

  const currency = profile?.currency || "NGN";
  const symbol = CURRENCY_SYMBOLS[currency] || `${currency} `;
  const budgetTotal = profile?.budgetAmount
    ? `${symbol}${profile.budgetAmount}`
    : `${symbol}25,000,000`;
  const crewSize = profile?.crewSize || 24;
  const locations = profile?.locations || 3;
  const shootingDays = profile?.shootingDays || 10;
  const visibleDays = Array.from({ length: Math.min(Number(shootingDays) || 10, 10) }, (_, i) => i + 1);

  return (
    <main className="min-h-svh bg-palette-black text-palette-ivory wrap-break-word">
      <div className="mx-auto flex min-h-svh w-full max-w-[68rem] flex-col px-6 sm:px-10">
        {/* Top bar */}
        <header className="flex items-center justify-between gap-4 border-b border-palette-graphite/70 py-5">
          <BrandHomeLink className="h-5 w-auto sm:h-6" />

          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-palette-stone transition-colors hover:text-palette-ivory focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-palette-gold"
          >
            <ArrowLeft aria-hidden="true" className="size-3.5" />
            <span>Back</span>
          </button>
        </header>

        {/* Main content */}
        <motion.div
          variants={staggerContainer(0.07, 0.04)}
          initial="hidden"
          animate="visible"
          className="flex flex-1 flex-col justify-center py-10 sm:py-14"
        >
          <motion.div variants={fadeUp}>
            <h1 className="text-[2rem] leading-[1.08] font-medium tracking-[-0.03em] text-palette-ivory sm:text-[2.75rem]">
              Here&apos;s your starting point.
            </h1>
            <p className="mt-3 max-w-[36rem] text-sm leading-6 text-palette-stone">
              NKO created a preliminary setup based on the information you provided. Review the details before entering your workspace.
            </p>
          </motion.div>

          {/* 3-card summary grid */}
          <motion.div
            variants={fadeUp}
            className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3"
          >
            {/* Card 1: Budget */}
            <motion.section
              aria-label="Budget summary"
              whileHover={{ y: -2 }}
              transition={{ duration: DURATION.fast, ease: EASE_OUT }}
              className="flex flex-col justify-between rounded-2xl border border-palette-graphite bg-palette-near-black/90 p-5 sm:p-6"
            >
              <div>
                <div className="flex items-center justify-between gap-2 font-mono text-xs">
                  <span className="text-palette-stone">Budget</span>
                  <span className="text-[11px] text-palette-apricot">Drafted</span>
                </div>

                <p className="mt-5 font-sans text-[1.75rem] leading-9 font-medium tracking-[-0.03em] tabular-nums text-palette-ivory sm:text-[2rem]">
                  {budgetTotal}
                </p>
                <p className="mt-1.5 font-mono text-[11px] text-palette-gray">
                  12 categories · AI estimate
                </p>

                <div aria-hidden="true" className="mt-4 flex gap-1">
                  {BUDGET_SEGMENTS.map((bg, idx) => (
                    <span key={idx} className={`h-1.5 flex-1 rounded-xs ${bg}`} />
                  ))}
                </div>

                <dl className="mt-5 space-y-2.5 text-xs">
                  {[
                    ["Production crew", "20%"],
                    ["Above the line", "12%"],
                    ["Post-production", "12%"],
                  ].map(([label, pct]) => (
                    <div key={label} className="flex items-center justify-between gap-2">
                      <dt className="text-palette-stone">{label}</dt>
                      <dd className="font-mono tabular-nums text-palette-ivory">{pct}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              <button
                type="button"
                onClick={() =>
                  setPreviewNotice("Budget review is a UI preview until workspace integration is connected.")
                }
                className="mt-6 flex w-full items-center justify-between border-t border-palette-graphite/70 pt-4 text-xs font-medium text-palette-ivory transition-colors hover:text-palette-apricot focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-palette-gold cursor-pointer"
              >
                <span>Review Budget</span>
                <ArrowRight aria-hidden="true" className="size-3.5" />
              </button>
            </motion.section>

            {/* Card 2: Production Breakdown */}
            <motion.section
              aria-label="Production Breakdown summary"
              whileHover={{ y: -2 }}
              transition={{ duration: DURATION.fast, ease: EASE_OUT }}
              className="flex flex-col justify-between rounded-2xl border border-palette-graphite bg-palette-near-black/90 p-5 sm:p-6"
            >
              <div>
                <div className="flex items-center justify-between gap-2 font-mono text-xs">
                  <span className="text-palette-stone">Production Breakdown</span>
                  <span className="text-[11px] text-palette-apricot">Drafted</span>
                </div>

                <dl className="mt-4 divide-y divide-palette-graphite/70">
                  {[
                    [crewSize, "crew members"],
                    [locations, "locations"],
                    [8, "equipment categories"],
                  ].map(([count, label]) => (
                    <div key={label} className="flex items-baseline gap-2.5 py-3">
                      <dt className="text-2xl leading-7 font-medium tabular-nums text-palette-ivory">
                        {count}
                      </dt>
                      <dd className="text-xs text-palette-stone">{label}</dd>
                    </div>
                  ))}
                </dl>

                <div className="mt-3.5 flex flex-wrap gap-1.5">
                  {BREAKDOWN_TAGS.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md border border-palette-graphite bg-palette-dark-gray px-2 py-1 font-mono text-[10px] text-palette-stone"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  setPreviewNotice("Breakdown review is a UI preview until workspace integration is connected.")
                }
                className="mt-6 flex w-full items-center justify-between border-t border-palette-graphite/70 pt-4 text-xs font-medium text-palette-ivory transition-colors hover:text-palette-apricot focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-palette-gold cursor-pointer"
              >
                <span>Review Breakdown</span>
                <ArrowRight aria-hidden="true" className="size-3.5" />
              </button>
            </motion.section>

            {/* Card 3: Schedule */}
            <motion.section
              aria-label="Schedule summary"
              whileHover={{ y: -2 }}
              transition={{ duration: DURATION.fast, ease: EASE_OUT }}
              className="flex flex-col justify-between rounded-2xl border border-palette-graphite bg-palette-near-black/90 p-5 sm:p-6"
            >
              <div>
                <div className="flex items-center justify-between gap-2 font-mono text-xs">
                  <span className="text-palette-stone">Schedule</span>
                  <span className="text-[11px] text-palette-apricot">Drafted</span>
                </div>

                <dl className="mt-5 flex items-start gap-10">
                  <div>
                    <dt className="text-2xl leading-7 font-medium tabular-nums text-palette-ivory sm:text-[1.75rem]">
                      {shootingDays}
                    </dt>
                    <dd className="mt-1 font-mono text-[11px] text-palette-stone">
                      shooting days
                    </dd>
                  </div>
                  <div>
                    <dt className="text-2xl leading-7 font-medium tabular-nums text-palette-ivory sm:text-[1.75rem]">
                      {locations}
                    </dt>
                    <dd className="mt-1 font-mono text-[11px] text-palette-stone">
                      locations
                    </dd>
                  </div>
                </dl>

                <div className="mt-6 grid grid-cols-10 gap-1">
                  {visibleDays.map((dayNum) => {
                    const tileTone =
                      dayNum <= 4
                        ? "bg-[#9E8262] text-palette-near-black"
                        : dayNum <= 7
                        ? "bg-[#6D8176] text-palette-near-black"
                        : "bg-[#75726B] text-palette-near-black";
                    return (
                      <div
                        key={dayNum}
                        className={`flex h-7 items-center justify-center rounded-xs font-mono text-[10px] font-medium tabular-nums ${tileTone}`}
                      >
                        {dayNum}
                      </div>
                    );
                  })}
                </div>

                <div className="mt-3.5 flex flex-wrap items-center gap-3 font-mono text-[10px] text-palette-stone">
                  <span className="inline-flex items-center gap-1.5">
                    <span aria-hidden="true" className="size-1.5 rounded-xs bg-[#9E8262]" />
                    Primary set
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <span aria-hidden="true" className="size-1.5 rounded-xs bg-[#6D8176]" />
                    Exterior
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <span aria-hidden="true" className="size-1.5 rounded-xs bg-[#75726B]" />
                    Studio
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  setPreviewNotice("Schedule review is a UI preview until workspace integration is connected.")
                }
                className="mt-6 flex w-full items-center justify-between border-t border-palette-graphite/70 pt-4 text-xs font-medium text-palette-ivory transition-colors hover:text-palette-apricot focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-palette-gold cursor-pointer"
              >
                <span>Review Schedule</span>
                <ArrowRight aria-hidden="true" className="size-3.5" />
              </button>
            </motion.section>
          </motion.div>

          {/* Bottom actions */}
          <motion.div variants={fadeUp} className="mt-8 flex flex-wrap items-center gap-3.5">
            <motion.button
              type="button"
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.985 }}
              transition={{ duration: DURATION.fast, ease: EASE_OUT }}
              onClick={() =>
                setPreviewNotice(
                  "Production starting point UI complete. Entering the live workspace will connect when authentication and backend setup are added."
                )
              }
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-palette-apricot px-6 py-3 text-sm font-semibold text-palette-black shadow-[0_8px_28px_rgba(255,179,71,0.35)] transition-all hover:brightness-105 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-palette-gold cursor-pointer"
            >
              <span>Looks Good Open My Production</span>
              <ArrowRight aria-hidden="true" className="size-4" />
            </motion.button>

            <motion.button
              type="button"
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.985 }}
              transition={{ duration: DURATION.fast, ease: EASE_OUT }}
              onClick={onMakeChanges}
              className="inline-flex min-h-12 items-center justify-center rounded-xl border border-palette-graphite bg-palette-near-black px-5 py-3 text-sm font-medium text-palette-ivory transition-colors hover:border-palette-warm-gray hover:bg-palette-dark-gray focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-palette-gold cursor-pointer"
            >
              Make Changes
            </motion.button>
          </motion.div>

          <AnimatePresence initial={false}>
            {previewNotice && (
              <motion.p
                role="status"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: DURATION.fast, ease: EASE_OUT }}
                className="mt-4 max-w-[38rem] rounded-xl border border-palette-apricot/30 bg-palette-apricot/10 px-4 py-3 text-xs leading-5 text-palette-ivory"
              >
                {previewNotice}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </main>
  );
}

