import { useId } from 'react';
import { motion } from 'framer-motion';
import { Circle } from 'lucide-react';
import { DURATION, EASE_OUT, VIEWPORT } from '../lib/motion';
import { Reveal, Stagger, StaggerItem } from './motion/Reveal';

const defaultStages = [
  {
    id: 'production',
    label: 'Production',
    value: 'Lagos Nights',
    details: ['Commercial · 10 days'],
  },
  {
    id: 'budget',
    label: 'Budget',
    value: '₦25.0M',
    details: ['9 accounts · v3', 'locked'],
  },
  {
    id: 'breakdown',
    label: 'Breakdown',
    value: '18 scenes',
    details: ['142 elements'],
  },
  {
    id: 'schedule',
    label: 'Schedule',
    value: '10 shoot days',
    details: ['Nov 8 – Nov 17'],
  },
  {
    id: 'spending',
    label: 'Spending',
    value: '₦13.8M',
    details: ['Actual to date'],
  },
  {
    id: 'reconciliation',
    label: 'Reconciliation',
    value: '86%',
    details: ['Matched this week'],
  },
  {
    id: 'payments',
    label: 'Payments',
    value: '₦3.4M',
    details: ['Awaiting release'],
  },
];


export default function ProductionOverviewSection({
  stages = defaultStages,
  className = '',
}) {
  const headingId = useId();

  return (
    <section
      aria-labelledby={headingId}
      className={`bg-palette-black px-5 text-palette-ivory sm:px-8 lg:px-12 ${className}`}
    >
      <div className="mx-auto max-w-[1280px] border-b border-palette-charcoal/60 py-14 sm:py-20 lg:py-28">
        <div className="mx-auto max-w-[1176px]">
          <div className="grid items-center gap-6 lg:grid-cols-[1.45fr_1fr] lg:gap-16">
            <Reveal
              as="h2"
              id={headingId}
              className="text-[clamp(1.875rem,4.1vw,3.5rem)] leading-[1.14] font-normal tracking-[-0.04em]"
            >
              <span className="block">One production.{' '}</span>
              <span className="block text-palette-stone">
                Every moving part.
              </span>
            </Reveal>
            <Reveal
              as="p"
              delay={0.08}
              className="max-w-[29rem] text-sm leading-relaxed text-palette-stone sm:text-base lg:text-[17px]"
            >
              Each stage feeds the next. Change the schedule and the budget
              forecast updates. Log a receipt and reconciliation knows. Approve
              a payment and the cost report is already current.
            </Reveal>
          </div>

          <div className="relative mt-10 sm:mt-12 lg:mt-16">
            <motion.div
              aria-hidden="true"
              style={{ transformOrigin: 'left' }}
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={VIEWPORT}
              transition={{ duration: DURATION.slow, ease: EASE_OUT }}
              className="pointer-events-none absolute inset-x-0 top-[5px] hidden h-px bg-palette-gold/60 lg:block"
            />
            <Stagger
              as="ol"
              role="list"
              aria-label="Connected production stages"
              stagger={0.05}
              className="grid items-start gap-6 lg:grid-cols-7 lg:gap-3"
            >
              {stages.map(({ id, label, value, details }, index) => (
                <StaggerItem
                  as="li"
                  key={id}
                  className="relative min-w-0 pl-7 lg:pl-0"
                >
                  {index < stages.length - 1 && (
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute top-6 left-1 h-[calc(100%+1.5rem)] w-px bg-palette-gold/60 lg:hidden"
                    />
                  )}
                  <Circle
                    aria-hidden="true"
                    size={10}
                    strokeWidth={0}
                    className="absolute top-5 left-0 z-10 shrink-0 fill-palette-apricot lg:static"
                  />
                  <dl
                    className={`rounded-lg border border-palette-graphite/50 bg-palette-near-black/70 p-4 lg:mt-8 lg:p-3 xl:p-4 ${
                      details.length > 1 ? 'min-h-[132px]' : 'min-h-28'
                    }`}
                  >
                    <dt className="font-mono text-[10px] leading-relaxed tracking-[0.04em] text-palette-stone">
                      {label}
                    </dt>
                    <dd className="mt-3 text-base leading-snug tracking-[-0.025em] text-palette-ivory xl:text-lg">
                      {value}
                    </dd>
                    <dd className="mt-1 text-[11px] leading-relaxed text-palette-stone">
                      {details.map((line, lineIndex) => (
                        <span key={lineIndex} className="block">
                          {line}
                        </span>
                      ))}
                    </dd>
                  </dl>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </div>
      </div>
    </section>
  );
}
