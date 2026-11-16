import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Minus, Plus } from "lucide-react";
import OnboardingStepLayout from "./OnboardingStepLayout";
import { DURATION, EASE_OUT, fadeUp, staggerContainer } from "../lib/motion";

const BUDGET_OPTIONS = [
  {
    id: "have_budget",
    title: "I have a budget",
    description: "Enter your total and NKO will structure it.",
  },
  {
    id: "need_help",
    title: "I need help creating one",
    description: "NKO will estimate a budget from your production scale.",
  },
];

function ScaleStepper({ id, label, value, onChange, min = 1, max = 999 }) {
  return (
    <div className="min-w-0">
      <label htmlFor={id} className="mb-2 block text-xs font-medium text-palette-stone">
        {label}
      </label>
      <div className="flex min-h-11 items-center justify-between rounded-xl border border-palette-graphite bg-palette-near-black px-2.5 py-1.5">
        <button
          type="button"
          aria-label={`Decrease ${label.toLowerCase()}`}
          disabled={value <= min}
          onClick={() => onChange(Math.max(min, value - 1))}
          className="flex size-7 items-center justify-center rounded-lg text-palette-stone transition-colors hover:bg-palette-dark-gray hover:text-palette-ivory focus-visible:outline-2 focus-visible:outline-palette-gold disabled:cursor-not-allowed disabled:opacity-35"
        >
          <Minus className="size-3.5" />
        </button>

        <input
          id={id}
          type="number"
          min={min}
          max={max}
          value={value}
          onChange={(e) => {
            const parsed = parseInt(e.target.value, 10);
            if (!Number.isNaN(parsed)) {
              onChange(Math.min(max, Math.max(min, parsed)));
            }
          }}
          className="w-12 bg-transparent text-center font-mono text-sm font-medium tabular-nums text-palette-ivory focus:outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        />

        <button
          type="button"
          aria-label={`Increase ${label.toLowerCase()}`}
          disabled={value >= max}
          onClick={() => onChange(Math.min(max, value + 1))}
          className="flex size-7 items-center justify-center rounded-lg text-palette-stone transition-colors hover:bg-palette-dark-gray hover:text-palette-ivory focus-visible:outline-2 focus-visible:outline-palette-gold disabled:cursor-not-allowed disabled:opacity-35"
        >
          <Plus className="size-3.5" />
        </button>
      </div>
    </div>
  );
}

export default function OnboardingScalePage({ profile, onBack, onContinue }) {
  const [shootingDays, setShootingDays] = useState(profile?.shootingDays || 10);
  const [crewSize, setCrewSize] = useState(profile?.crewSize || 24);
  const [locations, setLocations] = useState(profile?.locations || 3);
  const [budgetOption, setBudgetOption] = useState(profile?.budgetOption || "");
  const [budgetAmount, setBudgetAmount] = useState(profile?.budgetAmount || "");

  const currency = profile?.currency || "NGN";
  const hasEnteredAmount = budgetOption === "have_budget" && budgetAmount.trim().length > 0;
  const isComplete = Boolean(budgetOption);

  const budgetLabel =
    budgetOption === "need_help"
      ? "Estimated from scale"
      : hasEnteredAmount
      ? "Target budget set"
      : "Not set yet";
  const budgetValue = hasEnteredAmount ? `${currency} ${budgetAmount.trim()}` : "—";

  const preview = {
    roleCode: profile?.roleCode || "YO",
    roleLabel: profile?.roleLabel || "Executive Producer",
    roleSelected: Boolean(profile?.roleLabel),
    locationLabel: profile?.locationLabel || "Where you're based",
    productionTitle: profile?.productionName || "Untitled",
    hasProductionTitle: Boolean(profile?.productionName),
    productionType: profile?.productionType || "Type",
    productionStatus: profile?.productionStatus || "Status",
    productionLocation: profile?.shootingLocation || profile?.locationLabel || "Location",
    shootingDays: String(shootingDays),
    crewSize: String(crewSize),
    locationsCount: String(locations),
    hasScaleMetrics: true,
    budgetLabel,
    budgetValue,
    language: profile?.language || "English",
    currency,
  };

  function handleContinue(e) {
    e.preventDefault();
    if (!isComplete || typeof onContinue !== "function") return;
    onContinue({
      ...(profile || {}),
      shootingDays,
      crewSize,
      locations,
      budgetOption,
      budgetAmount: budgetAmount.trim(),
      budgetLabel,
      budgetValue,
    });
  }

  return (
    <OnboardingStepLayout activeStep={2} onBack={onBack} preview={preview}>
      <motion.form
        onSubmit={handleContinue}
        variants={staggerContainer(0.05, 0.04)}
        initial="hidden"
        animate="visible"
        className="mx-auto w-full max-w-[33rem]"
      >
        <motion.div variants={fadeUp}>
          <h1 className="text-[2rem] leading-[1.08] font-medium tracking-[-0.03em] text-palette-ivory sm:text-[2.375rem]">
            How big is this production?
          </h1>
          <p className="mt-2.5 max-w-[29rem] text-sm leading-6 text-palette-stone">
            Give NKO a sense of the production scale. You can change these details later.
          </p>
        </motion.div>

        {/* Scale Steppers */}
        <motion.div variants={fadeUp} className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <ScaleStepper
            id="onboarding-shooting-days"
            label="Shooting days"
            value={shootingDays}
            onChange={setShootingDays}
          />
          <ScaleStepper
            id="onboarding-crew-size"
            label="Crew size"
            value={crewSize}
            onChange={setCrewSize}
          />
          <ScaleStepper
            id="onboarding-locations"
            label="Locations"
            value={locations}
            onChange={setLocations}
          />
        </motion.div>

        {/* Budget Question */}
        <motion.fieldset variants={fadeUp} className="mt-7">
          <legend className="mb-2.5 text-xs font-medium text-palette-stone">
            Do you already have a production budget?
          </legend>
          <div className="space-y-2.5">
            {BUDGET_OPTIONS.map((opt) => {
              const checked = budgetOption === opt.id;
              return (
                <motion.button
                  key={opt.id}
                  type="button"
                  role="radio"
                  aria-checked={checked}
                  whileHover={{ scale: 1.008 }}
                  whileTap={{ scale: 0.992 }}
                  transition={{ duration: DURATION.fast, ease: EASE_OUT }}
                  onClick={() => setBudgetOption(opt.id)}
                  className={`flex w-full items-center gap-3.5 rounded-xl border px-4 py-3.5 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-palette-gold ${
                    checked
                      ? "border-palette-apricot/80 bg-palette-apricot/8 text-palette-ivory"
                      : "border-palette-graphite bg-palette-near-black text-palette-stone hover:border-palette-warm-gray hover:text-palette-ivory"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`flex size-4 shrink-0 items-center justify-center rounded-full border transition-colors ${
                      checked
                        ? "border-palette-apricot bg-palette-apricot/20"
                        : "border-palette-warm-gray bg-transparent"
                    }`}
                  >
                    {checked && <span className="size-1.5 rounded-full bg-palette-apricot" />}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-medium text-palette-ivory">{opt.title}</span>
                    <span className="mt-0.5 block text-xs leading-5 text-palette-stone">
                      {opt.description}
                    </span>
                  </span>
                </motion.button>
              );
            })}
          </div>
        </motion.fieldset>

        {/* Optional budget amount input when "I have a budget" is selected */}
        <AnimatePresence initial={false}>
          {budgetOption === "have_budget" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: DURATION.fast, ease: EASE_OUT }}
              className="overflow-hidden"
            >
              <div className="pt-4">
                <label
                  htmlFor="onboarding-budget-total"
                  className="mb-2 block text-xs font-medium text-palette-stone"
                >
                  Estimated total budget ({currency})
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 font-mono text-xs text-palette-stone">
                    {currency}
                  </span>
                  <input
                    id="onboarding-budget-total"
                    type="text"
                    inputMode="numeric"
                    value={budgetAmount}
                    onChange={(e) => setBudgetAmount(e.target.value)}
                    placeholder="e.g. 5,000,000"
                    className="min-h-11 w-full rounded-xl border border-palette-graphite bg-palette-near-black py-2.5 pr-4 pl-14 font-mono text-sm text-palette-ivory placeholder:text-palette-gray transition-colors focus:border-palette-apricot focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-palette-gold"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Continue button */}
        <motion.div variants={fadeUp} className="mt-8">
          <motion.button
            type="submit"
            disabled={!isComplete}
            whileHover={isComplete ? { scale: 1.015 } : undefined}
            whileTap={isComplete ? { scale: 0.985 } : undefined}
            transition={{ duration: DURATION.fast, ease: EASE_OUT }}
            className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-palette-gold ${
              isComplete
                ? "bg-palette-apricot text-palette-black shadow-[0_8px_24px_rgba(255,179,71,0.28)] hover:brightness-105 cursor-pointer"
                : "bg-palette-apricot/45 text-palette-black/80 cursor-not-allowed"
            }`}
          >
            <span>Continue</span>
            <ArrowRight aria-hidden="true" className="size-4" />
          </motion.button>
        </motion.div>
      </motion.form>
    </OnboardingStepLayout>
  );
}

