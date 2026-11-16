import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import OnboardingStepLayout from "./OnboardingStepLayout";
import { DURATION, EASE_OUT, fadeUp, staggerContainer } from "../lib/motion";

const GOALS = [
  { id: "budget", label: "Build my budget", moduleName: "Budget" },
  { id: "breakdown", label: "Break down my production", moduleName: "Breakdown" },
  { id: "schedule", label: "Plan my schedule", moduleName: "Schedule" },
  { id: "spending", label: "Track spending", moduleName: "Spending" },
  { id: "reconcile", label: "Reconcile expenses", moduleName: "Reconciliation" },
  { id: "payments", label: "Manage payments", moduleName: "Payments" },
  { id: "finances", label: "Understand my production finances", moduleName: "Finance Overview" },
];

export default function OnboardingGoalsPage({ profile, onBack, onContinue }) {
  const [selectedGoals, setSelectedGoals] = useState(profile?.selectedGoals || []);

  const allSelected = selectedGoals.length === GOALS.length;
  const isComplete = selectedGoals.length > 0;

  function toggleGoal(id) {
    setSelectedGoals((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }

  function toggleAll() {
    setSelectedGoals(allSelected ? [] : GOALS.map((g) => g.id));
  }

  function handleContinue(e) {
    e.preventDefault();
    if (!isComplete || typeof onContinue !== "function") return;
    onContinue({
      ...(profile || {}),
      selectedGoals,
    });
  }

  const extraSelectedModules = GOALS.filter(
    (g) => g.id !== "budget" && g.id !== "breakdown" && selectedGoals.includes(g.id)
  ).map((g) => ({
    label: g.moduleName,
    status: "Selected",
    active: true,
  }));

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
    ...extraSelectedModules,
  ];

  const currency = profile?.currency || "NGN";
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
    shootingDays: profile?.shootingDays ? String(profile.shootingDays) : "—",
    crewSize: profile?.crewSize ? String(profile.crewSize) : "—",
    locationsCount: profile?.locations ? String(profile.locations) : "—",
    hasScaleMetrics: Boolean(profile?.shootingDays || profile?.crewSize || profile?.locations),
    budgetLabel: profile?.budgetLabel || "Not set yet",
    budgetValue: profile?.budgetValue || "—",
    language: profile?.language || "English",
    currency,
    workspaceModules,
  };

  return (
    <OnboardingStepLayout activeStep={3} onBack={onBack} preview={preview}>
      <motion.form
        onSubmit={handleContinue}
        variants={staggerContainer(0.05, 0.04)}
        initial="hidden"
        animate="visible"
        className="mx-auto w-full max-w-[33rem]"
      >
        <motion.div variants={fadeUp}>
          <h1 className="text-[2rem] leading-[1.08] font-medium tracking-[-0.03em] text-palette-ivory sm:text-[2.375rem]">
            What do you want NKO to help with?
          </h1>
          <p className="mt-2.5 max-w-[29rem] text-sm leading-6 text-palette-stone">
            Select what you want to manage with NKO. You can add more later.
          </p>
        </motion.div>

        <motion.div variants={fadeUp} className="mt-7">
          <div className="mb-3 flex items-center justify-between gap-2 text-xs">
            <span className="font-mono text-palette-stone">
              {selectedGoals.length} selected
            </span>
            <button
              type="button"
              onClick={toggleAll}
              className="rounded px-1.5 py-0.5 font-medium text-palette-stone transition-colors hover:text-palette-ivory focus-visible:outline-2 focus-visible:outline-palette-gold"
            >
              {allSelected ? "Clear all" : "Select all"}
            </button>
          </div>

          <div className="space-y-2.5">
            {GOALS.map((goal) => {
              const checked = selectedGoals.includes(goal.id);
              return (
                <motion.button
                  key={goal.id}
                  type="button"
                  role="checkbox"
                  aria-checked={checked}
                  whileHover={{ scale: 1.006 }}
                  whileTap={{ scale: 0.994 }}
                  transition={{ duration: DURATION.fast, ease: EASE_OUT }}
                  onClick={() => toggleGoal(goal.id)}
                  className={`flex min-h-11 w-full items-center gap-3.5 rounded-xl border px-4 py-2.5 text-left text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-palette-gold ${
                    checked
                      ? "border-palette-apricot/80 bg-palette-apricot/8 text-palette-ivory"
                      : "border-palette-graphite bg-palette-near-black text-palette-stone hover:border-palette-warm-gray hover:text-palette-ivory"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`flex size-4 shrink-0 items-center justify-center rounded border transition-colors ${
                      checked
                        ? "border-palette-apricot bg-palette-apricot text-palette-black"
                        : "border-palette-warm-gray bg-transparent"
                    }`}
                  >
                    {checked && <Check strokeWidth={2.75} className="size-3" />}
                  </span>
                  <span className="font-medium">{goal.label}</span>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        <motion.div variants={fadeUp} className="mt-7 flex flex-wrap items-center gap-3">
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

          <div
            className={`inline-flex min-h-11 items-center rounded-xl border px-4 py-2.5 text-xs transition-colors ${
              isComplete
                ? "border-palette-apricot/40 bg-palette-apricot/8 text-palette-apricot"
                : "border-palette-graphite bg-palette-near-black/70 text-palette-stone"
            }`}
          >
            {isComplete ? `${selectedGoals.length} selected` : "Complete all fields to continue"}
          </div>
        </motion.div>
      </motion.form>
    </OnboardingStepLayout>
  );
}

