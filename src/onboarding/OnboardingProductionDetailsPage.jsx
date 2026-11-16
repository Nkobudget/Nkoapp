import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import OnboardingStepLayout from "./OnboardingStepLayout";
import { DURATION, EASE_OUT, fadeUp, staggerContainer } from "../lib/motion";

const PRODUCTION_TYPES = [
  "Feature Film",
  "Short Film",
  "TV / Series",
  "Commercial",
  "Music Video",
  "Documentary",
  "Digital / Social Content",
  "Other",
];

const PRODUCTION_STATUSES = [
  "Planning",
  "Pre-production",
  "Production",
  "Post-production",
];

export default function OnboardingProductionDetailsPage({ profile, onBack, onContinue }) {
  const [productionName, setProductionName] = useState(profile?.productionName || "");
  const [productionType, setProductionType] = useState(profile?.productionType || "");
  const [productionStatus, setProductionStatus] = useState(profile?.productionStatus || "");
  const [shootingLocation, setShootingLocation] = useState(profile?.shootingLocation || "");

  const trimmedName = productionName.trim();
  const trimmedLocation = shootingLocation.trim();
  const isComplete = Boolean(trimmedName && productionType && productionStatus && trimmedLocation);

  const missingPrompt = !trimmedName
    ? "Enter a production name to continue"
    : !productionType
    ? "Select a production type to continue"
    : !productionStatus
    ? "Select a production status to continue"
    : !trimmedLocation
    ? "Enter a shooting location to continue"
    : "All fields complete";

  const preview = {
    roleCode: profile?.roleCode || "YO",
    roleLabel: profile?.roleLabel || "Executive Producer",
    roleSelected: Boolean(profile?.roleLabel),
    locationLabel: profile?.locationLabel || "Where you're based",
    productionTitle: trimmedName || "Untitled",
    hasProductionTitle: Boolean(trimmedName),
    productionType: productionType || "Type",
    productionStatus: productionStatus || "Status",
    productionLocation: trimmedLocation || profile?.locationLabel || "Location",
    language: profile?.language || "English",
    currency: profile?.currency || "NGN",
  };

  function handleContinue(e) {
    e.preventDefault();
    if (!isComplete || typeof onContinue !== "function") return;
    onContinue({
      ...(profile || {}),
      productionName: trimmedName,
      productionType,
      productionStatus,
      shootingLocation: trimmedLocation,
    });
  }

  return (
    <OnboardingStepLayout activeStep={1} onBack={onBack} preview={preview}>
      <motion.form
        onSubmit={handleContinue}
        variants={staggerContainer(0.05, 0.04)}
        initial="hidden"
        animate="visible"
        className="mx-auto w-full max-w-[33rem]"
      >
        <motion.div variants={fadeUp}>
          <h1 className="text-[2rem] leading-[1.08] font-medium tracking-[-0.03em] text-palette-ivory sm:text-[2.375rem]">
            Now, what are you making?
          </h1>
          <p className="mt-2.5 max-w-[29rem] text-sm leading-6 text-palette-stone">
            Tell us about the production you&apos;re working on. NKO uses this to build the right workspace around it.
          </p>
        </motion.div>

        {/* Production name */}
        <motion.div variants={fadeUp} className="mt-7">
          <label
            htmlFor="onboarding-production-name"
            className="mb-2 block text-xs font-medium text-palette-stone"
          >
            Production name
          </label>
          <input
            id="onboarding-production-name"
            type="text"
            value={productionName}
            onChange={(e) => setProductionName(e.target.value)}
            onInput={(e) => setProductionName(e.currentTarget.value)}
            placeholder="e.g. The Last Summer"
            className="w-full border-b border-palette-graphite/80 bg-transparent py-1.5 text-xl font-medium tracking-[-0.02em] text-palette-ivory placeholder:text-palette-gray transition-colors focus:border-palette-apricot focus:outline-none sm:text-2xl"
          />
        </motion.div>

        {/* Production type */}
        <motion.fieldset variants={fadeUp} className="mt-6">
          <legend className="mb-2.5 text-xs font-medium text-palette-stone">
            Production type
          </legend>
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {PRODUCTION_TYPES.map((type) => {
              const checked = productionType === type;
              return (
                <motion.button
                  key={type}
                  type="button"
                  role="radio"
                  aria-checked={checked}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  transition={{ duration: DURATION.fast, ease: EASE_OUT }}
                  onClick={() => setProductionType(type)}
                  className={`flex min-h-11 items-center gap-3 rounded-xl border px-4 py-2.5 text-left text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-palette-gold ${
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
                  <span className="font-medium">{type}</span>
                </motion.button>
              );
            })}
          </div>
        </motion.fieldset>

        {/* Production status */}
        <motion.fieldset variants={fadeUp} className="mt-6">
          <legend className="mb-2.5 text-xs font-medium text-palette-stone">
            Production status
          </legend>
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {PRODUCTION_STATUSES.map((status) => {
              const checked = productionStatus === status;
              return (
                <motion.button
                  key={status}
                  type="button"
                  role="radio"
                  aria-checked={checked}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  transition={{ duration: DURATION.fast, ease: EASE_OUT }}
                  onClick={() => setProductionStatus(status)}
                  className={`flex min-h-11 items-center gap-3 rounded-xl border px-4 py-2.5 text-left text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-palette-gold ${
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
                  <span className="font-medium">{status}</span>
                </motion.button>
              );
            })}
          </div>
        </motion.fieldset>

        {/* Where are you shooting? */}
        <motion.div variants={fadeUp} className="mt-6">
          <label
            htmlFor="onboarding-shooting-location"
            className="mb-2 block text-xs font-medium text-palette-stone"
          >
            Where are you shooting?
          </label>
          <input
            id="onboarding-shooting-location"
            type="text"
            value={shootingLocation}
            onChange={(e) => setShootingLocation(e.target.value)}
            onInput={(e) => setShootingLocation(e.currentTarget.value)}
            placeholder="e.g. Lagos, Nigeria"
            className="min-h-11 w-full rounded-xl border border-palette-graphite bg-palette-near-black px-4 py-2.5 text-sm text-palette-ivory placeholder:text-palette-gray transition-colors focus:border-palette-apricot focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-palette-gold"
          />
        </motion.div>

        {/* Continue row */}
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
            {missingPrompt}
          </div>
        </motion.div>
      </motion.form>
    </OnboardingStepLayout>
  );
}

