import { useId } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Check, X } from 'lucide-react';
import { DURATION, EASE_OUT } from '../lib/motion';
import { Reveal, Stagger, StaggerItem } from './motion/Reveal';

const defaultSuggestion = {
  id: 'crane-day-reallocation',
  title: 'Move ₦300K from Contingency to Camera & Lighting',
  reason:
    'Unplanned crane day on Day 6. Contingency remains above 3% of total.',
  changes: [
    { department: 'Camera & lighting', before: 4_250_000, after: 4_550_000 },
    { department: 'Contingency', before: 1_250_000, after: 950_000 },
  ],
};

const defaultActivity = {
  initials: 'AO',
  name: 'Adaeze Okafor',
  role: 'Producer',
  action: 'approved',
  time: '14:32',
};

const amountFormatter = new Intl.NumberFormat('en-NG', {
  maximumFractionDigits: 0,
});
const formatAmount = (value) => `₦${amountFormatter.format(value)}`;


export default function AIControlSection({
  suggestion = defaultSuggestion,
  activity = defaultActivity,
  onApprove,
  onReject,
  isPending = false,
  className = '',
}) {
  const sectionId = useId();
  const reduceMotion = useReducedMotion();
  const buttonClass =
    'inline-flex min-h-11 items-center justify-center gap-1.5 rounded-md border px-3 text-[11px] leading-snug font-medium focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-palette-apricot disabled:cursor-default sm:min-h-8';

  return (
    <section
      aria-labelledby={`${sectionId}-heading`}
      className={`bg-palette-black px-5 text-palette-ivory sm:px-8 lg:px-8 ${className}`}
    >
      <div className="mx-auto max-w-[1280px]  py-16 sm:py-24 lg:pt-36 lg:pb-32">
        <div className="mx-auto max-w-[1176px]">
          <div className="grid items-center gap-6 lg:grid-cols-[1.45fr_1fr] lg:gap-16">
            <Reveal
              as="h2"
              id={`${sectionId}-heading`}
              className="text-[clamp(1.875rem,4.1vw,3.5rem)] leading-[1.14] font-normal tracking-[-0.04em]"
            >
              <span className="block">AI does the heavy lifting.{' '}</span>
              <span className="block text-palette-stone">
                You stay in control.
              </span>
            </Reveal>
            <Reveal
              as="p"
              delay={0.08}
              className="max-w-[28rem] text-sm leading-relaxed text-palette-stone sm:text-base lg:text-[17px]"
            >
              NKO never moves money or changes a locked budget on its own. Every
              suggestion waits for a person with the right permissions.
            </Reveal>
          </div>

          <Stagger
            as="div"
            stagger={0.09}
            className="mt-12 grid items-center gap-10 sm:mt-14 lg:mt-16 lg:grid-cols-[1fr_1.12fr_1fr]"
          >
            <StaggerItem
              as="article"
              aria-labelledby={`${sectionId}-suggest`}
              className="min-w-0"
            >
              <h3
                id={`${sectionId}-suggest`}
                className="text-2xl leading-tight font-normal tracking-[-0.025em] sm:text-[28px]"
              >
                Suggest
              </h3>
              <p className="mt-6 text-[13px] leading-relaxed text-palette-stone">
                NKO drafts budgets, spots variances and proposes changes, always
                with its reasoning attached.
              </p>
              <div className="mt-6 rounded-lg border border-palette-graphite/65 bg-palette-near-black/70 p-4">
                <p className="font-mono text-[10px] leading-relaxed text-palette-apricot">
                  Suggestion
                </p>
                <p className="mt-2 text-[13px] leading-snug">
                  {suggestion.title}
                </p>
                <p className="mt-3 text-[11px] leading-relaxed text-palette-stone">
                  {suggestion.reason}
                </p>
              </div>
            </StaggerItem>

            <StaggerItem
              as="article"
              aria-labelledby={`${sectionId}-review`}
              className="min-w-0 border-palette-charcoal/60 lg:border-l"
            >
              <h3
                id={`${sectionId}-review`}
                className="text-2xl leading-tight font-normal tracking-[-0.025em] sm:text-[28px]"
              >
                Review
              </h3>
              <p className="mt-6 text-[13px] leading-relaxed text-palette-stone">
                See exactly what changes, by how much and where. Edit any figure
                before it lands.
              </p>
              <dl className="mt-6 divide-y divide-palette-charcoal rounded-lg border border-palette-graphite/65 bg-palette-near-black/70 p-4">
                {suggestion.changes.map(({ department, before, after }) => (
                  <div
                    key={department}
                    className="py-2.5 first:pt-0 last:pb-0"
                  >
                    <dt className="text-xs leading-snug text-palette-stone">
                      {department}
                    </dt>
                    <dd className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[11px] leading-relaxed">
                      <span className="text-palette-stone">
                        <span className="sr-only">Before: </span>
                        {formatAmount(before)}
                      </span>
                      <ArrowRight
                        aria-hidden="true"
                        size={12}
                        strokeWidth={1.5}
                        className="shrink-0 text-palette-stone"
                      />
                      <span>
                        <span className="sr-only">After: </span>
                        {formatAmount(after)}
                      </span>
                    </dd>
                  </div>
                ))}
              </dl>
            </StaggerItem>

            <StaggerItem
              as="article"
              aria-labelledby={`${sectionId}-decide`}
              className="min-w-0 border-palette-charcoal/60 lg:border-l"
            >
              <h3
                id={`${sectionId}-decide`}
                className="text-2xl leading-tight font-normal tracking-[-0.025em] sm:text-[28px]"
              >
                Decide
              </h3>
              <p className="mt-6 text-[13px] leading-relaxed text-palette-stone">
                You approve, adjust or reject. Every decision is recorded with
                who made it and when.
              </p>
              <div className="mt-6 rounded-lg border border-palette-graphite/65 bg-palette-near-black/70 p-4">
                <div className="flex flex-wrap gap-2" aria-busy={isPending}>
                  <motion.button
                    type="button"
                    disabled={!onApprove || isPending}
                    onClick={() => onApprove?.(suggestion)}
                    aria-label="Approve the suggested budget change"
                    whileTap={reduceMotion ? undefined : { scale: 0.97 }}
                    transition={{ duration: DURATION.fast, ease: EASE_OUT }}
                    className={`${buttonClass} border-palette-apricot bg-palette-apricot text-palette-black enabled:hover:bg-palette-apricot/90`}
                  >
                    <Check aria-hidden="true" size={12} strokeWidth={2} />
                    Approve
                  </motion.button>
                  <motion.button
                    type="button"
                    disabled={!onReject || isPending}
                    onClick={() => onReject?.(suggestion)}
                    aria-label="Reject the suggested budget change"
                    whileTap={reduceMotion ? undefined : { scale: 0.97 }}
                    transition={{ duration: DURATION.fast, ease: EASE_OUT }}
                    className={`${buttonClass} border-palette-graphite text-palette-stone enabled:hover:border-palette-stone enabled:hover:text-palette-ivory`}
                  >
                    <X aria-hidden="true" size={12} strokeWidth={1.5} />
                    Reject
                  </motion.button>
                </div>

                {activity && (
                  <div className="mt-4 flex items-center gap-2 border-t border-palette-charcoal pt-3">
                    <span
                      aria-hidden="true"
                      className="flex size-6 shrink-0 items-center justify-center rounded-full bg-palette-charcoal font-mono text-[9px] text-palette-stone"
                    >
                      {activity.initials}
                    </span>
                    <p className="text-[11px] leading-relaxed text-palette-stone">
                      <span className="text-palette-ivory">{activity.name}</span>{' '}
                      {activity.role} · {activity.action}{' '}
                      <time dateTime={activity.time}>{activity.time}</time>
                    </p>
                  </div>
                )}
              </div>
            </StaggerItem>
          </Stagger>
        </div>
      </div>
    </section>
  );
}
