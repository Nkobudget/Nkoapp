import { useId } from "react";
import { Activity, Clapperboard, Layers, Sparkles } from "lucide-react";

const features = [
  {
    title: "AI-Powered",
    description:
      "Draft budgets, flag overruns and ask questions about your production in plain language.",
    Icon: Sparkles,
  },
  {
    title: "One Workspace",
    description:
      "Budgets, breakdowns, schedules, spending and payments, connected, not copied between files.",
    Icon: Layers,
  },
  {
    title: "Real-Time Visibility",
    description:
      "See actual, committed and remaining spend the moment it changes, by department and by day.",
    Icon: Activity,
  },
  {
    title: "Built for Production",
    description:
      "Designed around shoot days, departments and crew, not generic ledgers.",
    Icon: Clapperboard,
  },
];

export default function ProductionFeatures({ id, className = "" }) {
  const headingId = useId();

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={`border-t border-palette-graphite/60 bg-palette-black text-palette-ivory wrap-break-word ${className}`}
    >
      <div className="bg-palette-near-black/35">
        <div className="relative mx-auto max-w-[90rem] px-6 py-16 sm:px-10 sm:py-20 lg:px-[clamp(4rem,6.4vw,5.75rem)] lg:pb-40 lg:pt-[9.25rem]">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.56fr)_minmax(0,1fr)] lg:gap-12">
            <h2
              id={headingId}
              className="min-w-0 text-[2rem] leading-[1.06] font-medium tracking-[-0.035em] sm:text-[2.5rem] lg:text-[clamp(2.25rem,3.9vw,3.5rem)] lg:leading-[1.14]"
            >
              Everything your production
              <br className="hidden sm:block" />
              {" "}needs.{" "}
              <span className="text-palette-stone">One workspace.</span>
            </h2>

            <p className="max-w-[29rem] text-base leading-[1.65] text-palette-stone lg:pt-4 lg:text-[1.0625rem]">
              From the first budget draft to the final crew payment, every
              number and every decision lives in one place your whole team
              can trust.
            </p>
          </div>

          <ul
            role="list"
            className="mt-10 grid list-none grid-cols-1 items-start gap-y-8 p-0 sm:grid-cols-2 sm:gap-x-8 lg:mt-16 lg:max-w-[77rem] lg:grid-cols-4 lg:gap-x-0"
          >
            {features.map(({ title, description, Icon }) => (
              <li
                key={title}
                className="min-w-0 border-l border-palette-graphite/60 pl-4 lg:pr-7 lg:pl-5"
              >
                <Icon
                  aria-hidden="true"
                  focusable="false"
                  strokeWidth={1.6}
                  className="mb-4 size-5 text-palette-gold lg:mb-5"
                />
                <h3 className="mb-3 text-lg leading-7 font-normal lg:mb-4 lg:text-xl">
                  {title}
                </h3>
                <p className="max-w-[19rem] text-sm leading-6 text-palette-stone lg:text-[0.9375rem]">
                  {description}
                </p>
              </li>
            ))}
          </ul>

          <div
            aria-hidden="true"
            className="absolute inset-x-4 bottom-0 border-t border-palette-graphite/60 sm:inset-x-8 lg:inset-x-[clamp(3rem,5.3vw,4.75rem)]"
          />
        </div>
      </div>
    </section>
  );
}
