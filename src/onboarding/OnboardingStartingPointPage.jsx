import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import BrandHomeLink from "../components/BrandHomeLink";
import { DURATION, EASE_OUT, fadeUp, staggerContainer } from "../lib/motion";
import { BUDGET_ALLOCATIONS, toNumber } from "./saveOnboardingProduction.js";

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

// CHANGED: added the onOpenProduction prop.
export default function OnboardingStartingPointPage({ profile, onBack, onMakeChanges, onOpenProduction }) {
  const [budgetModalOpen, setBudgetModalOpen] = useState(false);
  const [breakdownModalOpen, setBreakdownModalOpen] = useState(false);
  const currency = profile?.currency || "NGN";
  const symbol = CURRENCY_SYMBOLS[currency] || `${currency} `;

  const parsedBudgetAmount = toNumber(profile?.budgetAmount) || (currency === 'NGN' ? 25000000 : 25000);
  const budgetTotal = `${symbol}${parsedBudgetAmount.toLocaleString()}`;
  const crewSize = profile?.crewSize || 24;
  const locations = profile?.locations || 3;
  const shootingDays = profile?.shootingDays || 10;
  const visibleDays = Array.from({ length: Math.min(Number(shootingDays) || 10, 10) }, (_, i) => i + 1);

  // Calculate preliminary budget breakdown according to the 12 core allocations
  let runningTotal = 0;
  const budgetBreakdownItems = BUDGET_ALLOCATIONS.map((alloc, idx) => {
    const isLast = idx === BUDGET_ALLOCATIONS.length - 1;
    const amount = isLast ? Math.max(0, parsedBudgetAmount - runningTotal) : Math.round(parsedBudgetAmount * alloc.pct);
    runningTotal += amount;
    return {
      ...alloc,
      amount,
      formattedAmount: `${symbol}${amount.toLocaleString()}`,
    };
  });

  // Calculate production breakdown: crew allocation, locations, and equipment
  const totalCrew = Number(crewSize) || 20;
  const crewBreakdown = [
    { name: "Camera", count: Math.max(1, Math.round(totalCrew * 0.20)) },
    { name: "Lighting & grip", count: Math.max(1, Math.round(totalCrew * 0.25)) },
    { name: "Sound", count: Math.max(1, Math.round(totalCrew * 0.10)) },
    { name: "Art department", count: Math.max(1, Math.round(totalCrew * 0.15)) },
    { name: "Wardrobe & makeup", count: Math.max(1, Math.round(totalCrew * 0.15)) },
    { name: "Locations & transport", count: Math.max(1, Math.round(totalCrew * 0.15)) },
  ];
  const allocatedCrewSum = crewBreakdown.slice(0, 5).reduce((s, c) => s + c.count, 0);
  crewBreakdown[5].count = Math.max(1, totalCrew - allocatedCrewSum);

  const baseLocations = [
    { name: "Primary set", tone: "#9E8262" },
    { name: "Exterior", tone: "#6D8176" },
    { name: "Studio", tone: "#75726B" },
  ];
  const locationsCount = Number(locations) || 3;
  const locationItems = Array.from({ length: locationsCount }, (_, i) => {
    if (i < baseLocations.length) return baseLocations[i];
    return { name: `Location ${i + 1}`, tone: i % 2 === 0 ? "#9E8262" : "#6D8176" };
  });

  const equipmentCategories = [
    "Camera",
    "Lenses",
    "Lighting",
    "Grip",
    "Sound",
    "Power",
    "Monitoring",
    "Data & storage",
  ];

  useEffect(() => {
    if (!budgetModalOpen && !breakdownModalOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") {
        setBudgetModalOpen(false);
        setBreakdownModalOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [budgetModalOpen, breakdownModalOpen]);

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
                onClick={() => setBudgetModalOpen(true)}
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
                onClick={() => setBreakdownModalOpen(true)}
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
                onClick={onOpenProduction}
                className="mt-6 flex w-full items-center justify-between border-t border-palette-graphite/70 pt-4 text-xs font-medium text-palette-ivory transition-colors hover:text-palette-apricot focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-palette-gold cursor-pointer"
              >
                <span>Review Schedule</span>
                <ArrowRight aria-hidden="true" className="size-3.5" />
              </button>
            </motion.section>
          </motion.div>

          {/* Bottom actions */}
          <motion.div variants={fadeUp} className="mt-8 flex flex-wrap items-center gap-3.5">
            {/* CHANGED: the button now calls onOpenProduction (sign in, then save and open the workspace). */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.985 }}
              transition={{ duration: DURATION.fast, ease: EASE_OUT }}
              onClick={onOpenProduction}
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

        </motion.div>
      </div>

      {/* Preliminary Budget Breakdown Modal */}
      <AnimatePresence>
        {budgetModalOpen && (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="preliminary-budget-title"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: DURATION.fast, ease: EASE_OUT }}
              onClick={() => setBudgetModalOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-xs"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              transition={{ duration: DURATION.fast, ease: EASE_OUT }}
              className="relative z-10 flex max-h-[92vh] w-full max-w-[32rem] flex-col rounded-2xl border border-palette-graphite bg-[#121214] p-5 sm:p-7 shadow-2xl text-palette-ivory"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2
                    id="preliminary-budget-title"
                    className="text-xl sm:text-2xl font-medium tracking-tight text-palette-ivory"
                  >
                    Preliminary budget
                  </h2>
                  <p className="mt-1 text-xs sm:text-sm text-palette-stone">
                    Drafted by NKO · Editable in your workspace
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setBudgetModalOpen(false)}
                  aria-label="Close"
                  className="flex size-8 items-center justify-center rounded-lg border border-palette-graphite bg-palette-near-black text-palette-stone transition-colors hover:border-palette-warm-gray hover:text-palette-ivory focus-visible:outline-2 focus-visible:outline-palette-gold cursor-pointer"
                >
                  <X aria-hidden="true" className="size-4" />
                </button>
              </div>

              {/* Table / Breakdown list */}
              <div className="mt-6 flex-1 overflow-y-auto pr-1">
                <div className="grid grid-cols-12 border-b border-palette-graphite/60 pb-2.5 text-xs text-palette-stone/75 font-sans">
                  <div className="col-span-6 text-left">Category</div>
                  <div className="col-span-2 text-center">Share</div>
                  <div className="col-span-4 text-right">Amount</div>
                </div>

                <div className="divide-y divide-palette-graphite/20">
                  {budgetBreakdownItems.map((item) => (
                    <div
                      key={item.name}
                      className="grid grid-cols-12 items-center py-2.5 sm:py-3 text-xs sm:text-sm"
                    >
                      <div className="col-span-6 font-medium text-palette-ivory">
                        {item.name}
                      </div>
                      <div className="col-span-2 text-center font-mono text-xs text-palette-stone tabular-nums">
                        {item.share}
                      </div>
                      <div className="col-span-4 text-right font-mono font-medium text-palette-ivory tabular-nums">
                        {item.formattedAmount}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="mt-5 flex items-center justify-between border-t border-palette-graphite/60 pt-4">
                <p className="text-xs text-palette-stone">
                  Nothing is final until you approve it.
                </p>

                <button
                  type="button"
                  onClick={() => setBudgetModalOpen(false)}
                  className="rounded-lg bg-palette-apricot px-5 py-2 text-xs font-semibold text-palette-black shadow-[0_2px_12px_rgba(255,179,71,0.25)] transition-all hover:brightness-105 focus-visible:outline-2 focus-visible:outline-palette-gold cursor-pointer"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Production Breakdown Modal */}
      <AnimatePresence>
        {breakdownModalOpen && (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="production-breakdown-title"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: DURATION.fast, ease: EASE_OUT }}
              onClick={() => setBreakdownModalOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-xs"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              transition={{ duration: DURATION.fast, ease: EASE_OUT }}
              className="relative z-10 flex max-h-[92vh] w-full max-w-[32rem] flex-col rounded-2xl border border-palette-graphite bg-[#121214] p-5 sm:p-7 shadow-2xl text-palette-ivory"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2
                    id="production-breakdown-title"
                    className="text-xl sm:text-2xl font-medium tracking-tight text-palette-ivory"
                  >
                    Production breakdown
                  </h2>
                  <p className="mt-1 text-xs sm:text-sm text-palette-stone">
                    Drafted by NKO · Editable in your workspace
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setBreakdownModalOpen(false)}
                  aria-label="Close"
                  className="flex size-8 items-center justify-center rounded-lg border border-palette-graphite bg-palette-near-black text-palette-stone transition-colors hover:border-palette-warm-gray hover:text-palette-ivory focus-visible:outline-2 focus-visible:outline-palette-gold cursor-pointer"
                >
                  <X aria-hidden="true" className="size-4" />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="mt-6 flex-1 overflow-y-auto pr-1">
                {/* Crew Breakdown Section */}
                <div className="divide-y divide-palette-graphite/20 border-b border-palette-graphite/40 pb-5">
                  {crewBreakdown.map((item) => (
                    <div
                      key={item.name}
                      className="flex items-center justify-between py-2.5 text-xs sm:text-sm"
                    >
                      <span className="font-medium text-palette-ivory">{item.name}</span>
                      <span className="font-mono text-xs text-palette-stone tabular-nums">
                        {item.count}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Locations Section */}
                <div className="pt-5 border-b border-palette-graphite/40 pb-5">
                  <div className="text-xs text-palette-stone font-sans mb-2">
                    Locations · {locationsCount}
                  </div>
                  <div className="divide-y divide-palette-graphite/20">
                    {locationItems.map((loc) => (
                      <div
                        key={loc.name}
                        className="flex items-center justify-between py-2.5 text-xs sm:text-sm"
                      >
                        <div className="flex items-center gap-2.5">
                          <span
                            aria-hidden="true"
                            style={{ backgroundColor: loc.tone }}
                            className="size-2 rounded-xs inline-block shrink-0"
                          />
                          <span className="font-medium text-palette-ivory">{loc.name}</span>
                        </div>
                        <span className="font-mono text-xs text-palette-stone/75 tabular-nums">
                          Address TBC
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Equipment Section */}
                <div className="pt-5">
                  <div className="text-xs text-palette-stone font-sans mb-3">
                    Equipment · {equipmentCategories.length} categories
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {equipmentCategories.map((eq) => (
                      <span
                        key={eq}
                        className="rounded-md border border-palette-graphite bg-palette-near-black px-3 py-1.5 font-mono text-xs text-palette-ivory"
                      >
                        {eq}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-5 flex items-center justify-between border-t border-palette-graphite/60 pt-4">
                <p className="text-xs text-palette-stone">
                  Nothing is final until you approve it.
                </p>

                <button
                  type="button"
                  onClick={() => setBreakdownModalOpen(false)}
                  className="rounded-lg bg-palette-apricot px-5 py-2 text-xs font-semibold text-palette-black shadow-[0_2px_12px_rgba(255,179,71,0.25)] transition-all hover:brightness-105 focus-visible:outline-2 focus-visible:outline-palette-gold cursor-pointer"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}