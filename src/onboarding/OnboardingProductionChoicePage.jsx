import { motion } from "framer-motion";
import { ArrowRight, Clapperboard, LayoutGrid } from "lucide-react";
import OnboardingStepLayout from "./OnboardingStepLayout";
import { DURATION, EASE_OUT, fadeUp, staggerContainer } from "../lib/motion";

export default function OnboardingProductionChoicePage({ profile, onBack, onSelectOption }) {

  const roleLabel = profile?.roleLabel || "Executive Producer";
  const roleCode = profile?.roleCode || "YO";
  const locationLabel = profile?.locationLabel || "Where you're based";
  const currency = profile?.currency || "NGN";
  const language = profile?.language || "English";

  const preview = {
    roleCode,
    roleLabel,
    roleSelected: Boolean(profile?.roleLabel),
    locationLabel,
    productionLocation: profile?.locationLabel || "Location",
    language,
    currency,
  };

  const options = [
    {
      id: "setup",
      title: "Yes, let's set it up",
      description:
        "About 2 minutes. NKO drafts a budget, breakdown and schedule for you to review.",
      Icon: Clapperboard,
      featured: true,
    },
    {
      id: "skip",
      title: "Not right now",
      description:
        "Go straight to your workspace. Create a production whenever you have one.",
      Icon: LayoutGrid,
      featured: false,
    },
  ];

  return (
    <OnboardingStepLayout activeStep={1} onBack={onBack} preview={preview}>
      <motion.div
        variants={staggerContainer(0.06, 0.04)}
        initial="hidden"
        animate="visible"
        className="mx-auto w-full max-w-[30rem]"
      >
        <motion.p variants={fadeUp} className="text-xs leading-5 text-palette-stone sm:text-sm">
          Thanks, {roleLabel.toLowerCase()}.
        </motion.p>

        <motion.h1
          variants={fadeUp}
          className="mt-2.5 text-[2rem] leading-[1.08] font-medium tracking-[-0.03em] text-palette-ivory sm:text-[2.375rem]"
        >
          Are you working on a production right now?
        </motion.h1>

        <motion.p variants={fadeUp} className="mt-3.5 text-sm leading-6 text-palette-stone">
          If you have one in development or on the way, NKO can set it up now. If not, that&apos;s fine your workspace is ready either way.
        </motion.p>

        <motion.div variants={fadeUp} className="mt-8 space-y-3.5">
          {options.map(({ id, title, description, Icon, featured }) => (
            <motion.button
              key={id}
              type="button"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              transition={{ duration: DURATION.fast, ease: EASE_OUT }}
              onClick={() => onSelectOption?.(id)}
              className={`group flex w-full items-center gap-4 rounded-xl border px-5 py-4 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-palette-gold ${
                featured
                  ? "border-palette-apricot/45 bg-palette-near-black hover:border-palette-apricot/80 hover:bg-palette-dark-gray/70"
                  : "border-palette-graphite bg-palette-near-black/75 hover:border-palette-warm-gray hover:bg-palette-near-black"
              }`}
            >
              <span
                aria-hidden="true"
                className={`flex size-10 shrink-0 items-center justify-center rounded-lg transition-colors ${
                  featured
                    ? "bg-palette-apricot text-palette-black"
                    : "border border-palette-graphite bg-palette-dark-gray text-palette-stone group-hover:text-palette-ivory"
                }`}
              >
                <Icon strokeWidth={1.75} className="size-4.5" />
              </span>

              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold text-palette-ivory">{title}</span>
                <span className="mt-0.5 block text-xs leading-5 text-palette-stone">
                  {description}
                </span>
              </span>

              <ArrowRight
                aria-hidden="true"
                className={`size-4 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 ${
                  featured ? "text-palette-apricot" : "text-palette-stone group-hover:text-palette-ivory"
                }`}
              />
            </motion.button>
          ))}
        </motion.div>
      </motion.div>
    </OnboardingStepLayout>
  );
}

