import { motion } from "framer-motion";
import { ArrowRight, Calendar, Film, Wallet } from "lucide-react";
import OnboardingStepLayout from "./OnboardingStepLayout";
import { DURATION, EASE_OUT, fadeUp, staggerContainer } from "../lib/motion";

const PREPARE_ITEMS = [
  {
    id: "budget",
    title: "Preliminary Budget",
    description: "Production departments and estimated costs",
    Icon: Wallet,
  },
  {
    id: "breakdown",
    title: "Production Breakdown",
    description: "Crew, equipment, locations and production requirements",
    Icon: Film,
  },
  {
    id: "schedule",
    title: "Schedule Framework",
    description: "A starting structure based on your production duration",
    Icon: Calendar,
  },
];

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

export default function OnboardingAISetupPage({ profile, onBack, onGenerate }) {

  const currency = profile?.currency || "NGN";
  const symbol = CURRENCY_SYMBOLS[currency] || `${currency} `;
  const productionName = profile?.productionName || "Untitled";
  const productionType = profile?.productionType || "Music Video";
  const shootingDays = profile?.shootingDays || 10;
  const shootingLocation = profile?.shootingLocation || profile?.locationLabel || "Lagos, Nigeria";
  const estimatedBudgetDisplay = profile?.budgetAmount
    ? `${symbol}${profile.budgetAmount}`
    : `${symbol}25M`;

  const selectedGoals = profile?.selectedGoals || [];
  const workspaceModules = [
    {
      label: "Budget",
      status: selectedGoals.includes("budget") ? "Selected" : "Available later",
      active: selectedGoals.includes("budget"),
    },
    {
      label: "Breakdown",
      status: selectedGoals.includes("breakdown") ? "Selected" : "Available later",
      active: selectedGoals.includes("breakdown"),
    },
  ];

  const preview = {
    roleCode: profile?.roleCode || "YO",
    roleLabel: profile?.roleLabel || "Executive Producer",
    roleSelected: Boolean(profile?.roleLabel),
    locationLabel: profile?.locationLabel || "Where you're based",
    productionTitle: productionName,
    hasProductionTitle: Boolean(profile?.productionName),
    productionType,
    productionStatus: profile?.productionStatus || "Planning",
    productionLocation: shootingLocation,
    shootingDays: String(shootingDays),
    crewSize: profile?.crewSize ? String(profile.crewSize) : "24",
    locationsCount: profile?.locations ? String(profile.locations) : "3",
    hasScaleMetrics: true,
    budgetLabel: profile?.budgetLabel || "Not set yet",
    budgetValue: profile?.budgetValue || "—",
    language: profile?.language || "English",
    currency,
    workspaceModules,
  };

  return (
    <OnboardingStepLayout activeStep={4} onBack={onBack} preview={preview}>
      <motion.div
        variants={staggerContainer(0.06, 0.04)}
        initial="hidden"
        animate="visible"
        className="mx-auto w-full max-w-[33rem]"
      >
        <motion.div variants={fadeUp}>
          <h1 className="text-[2rem] leading-[1.08] font-medium tracking-[-0.03em] text-palette-ivory sm:text-[2.375rem]">
            Let NKO do the heavy lifting.
          </h1>
          <p className="mt-2.5 max-w-[30rem] text-sm leading-6 text-palette-stone">
            Based on what you&apos;ve told us, NKO can create a starting point for your production. You&apos;ll be able to review and change everything before anything is finalized.
          </p>
        </motion.div>

        {/* Production Summary Card with subtle warm glow */}
        <motion.div variants={fadeUp} className="relative mt-7">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-3 rounded-2xl bg-palette-apricot/10 blur-2xl"
          />
          <div className="relative overflow-hidden rounded-xl border border-palette-graphite bg-palette-near-black/95 shadow-2xl shadow-palette-black/60">
            <div className="border-b border-palette-graphite/80 px-5 py-4">
              <p className="truncate text-xl leading-7 font-medium tracking-[-0.02em] text-palette-ivory sm:text-2xl">
                {productionName}
              </p>
              <p className="mt-0.5 text-xs text-palette-stone">{productionType}</p>
            </div>
            <dl className="grid grid-cols-3">
              <div className="px-5 py-3.5">
                <dt className="font-mono text-[11px] text-palette-gray">Shooting</dt>
                <dd className="mt-1 text-xs font-medium text-palette-ivory sm:text-sm">
                  {shootingDays} days
                </dd>
              </div>
              <div className="border-l border-palette-graphite/80 px-5 py-3.5">
                <dt className="font-mono text-[11px] text-palette-gray">Location</dt>
                <dd className="mt-1 truncate text-xs font-medium text-palette-ivory sm:text-sm">
                  {shootingLocation}
                </dd>
              </div>
              <div className="border-l border-palette-graphite/80 px-5 py-3.5">
                <dt className="font-mono text-[11px] text-palette-gray">Estimated budget</dt>
                <dd className="mt-1 font-mono text-xs font-semibold tabular-nums text-palette-apricot sm:text-sm">
                  {estimatedBudgetDisplay}
                </dd>
              </div>
            </dl>
          </div>
        </motion.div>

        {/* NKO can prepare list */}
        <motion.div variants={fadeUp} className="mt-7">
          <p className="mb-2 font-mono text-[11px] text-palette-gray">NKO can prepare</p>
          <ul className="divide-y divide-palette-graphite/60">
            {PREPARE_ITEMS.map(({ id, title, description, Icon }) => (
              <li key={id} className="flex items-start gap-3.5 py-3.5">
                <span
                  aria-hidden="true"
                  className="mt-0.5 flex size-5 shrink-0 items-center justify-center text-palette-apricot"
                >
                  <Icon strokeWidth={1.75} className="size-4" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-palette-ivory">{title}</p>
                  <p className="mt-0.5 text-xs leading-5 text-palette-stone">{description}</p>
                </div>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Primary CTA */}
        <motion.div variants={fadeUp} className="mt-7">
          <motion.button
            type="button"
            whileHover={{ scale: 1.015 }}
            whileTap={{ scale: 0.985 }}
            transition={{ duration: DURATION.fast, ease: EASE_OUT }}
            onClick={() => onGenerate?.(profile)}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-palette-apricot px-6 py-3 text-sm font-semibold text-palette-black shadow-[0_8px_28px_rgba(255,179,71,0.35)] transition-all hover:brightness-105 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-palette-gold cursor-pointer"
          >
            <span>Generate My Production Setup</span>
            <ArrowRight aria-hidden="true" className="size-4" />
          </motion.button>
        </motion.div>
      </motion.div>
    </OnboardingStepLayout>
  );
}

