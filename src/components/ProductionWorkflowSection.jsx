import { useId, useState } from 'react';
import {
  CalendarRange,
  Clapperboard,
  CreditCard,
  Minus,
  ReceiptText,
  Wallet,
} from 'lucide-react';
import { DURATION } from '../lib/motion';
import { Reveal } from './motion/Reveal';

const features = [
  {
    key: 'budgeting',
    category: 'AI Budgeting',
    title: 'Build budgets without starting from scratch.',
    description:
      'Start from an AI draft, a template, or a past production. NKO fills amounts with realistic rates and explains every suggestion.',
    benefits: [
      'Industry-standard account structure',
      'Naira budgeting with AI guidance',
      'Prep, overtime and contingency built in',
    ],
    imageLabel: 'Budget preview',
    imageAlt:
      'Production budget with department line items and an AI rate suggestion',
    aspectClass: 'aspect-[165/104]',
    width: 660,
    height: 416,
    Icon: Wallet,
  },
  {
    key: 'breakdown',
    category: 'Production Breakdown',
    title: 'Turn your production into a clear plan.',
    description:
      'Break every scene into cast, props, vehicles, equipment and permits, and see what each element costs before the shoot.',
    benefits: [
      'Scene-by-scene elements',
      'Costs roll straight into budget lines',
      'Shared with every department',
    ],
    imageLabel: 'Production breakdown preview',
    imageAlt:
      'Scene breakdown listing cast, vehicles, props, equipment and permits',
    aspectClass: 'aspect-[165/92]',
    width: 660,
    height: 368,
    Icon: Clapperboard,
  },
  {
    key: 'schedule',
    category: 'Schedule',
    title: 'Know what happens next.',
    description:
      'Plan prep, shoot and wrap on one timeline. When a day moves, crew, locations and costs move with it.',
    benefits: [
      'Spreadsheet and timeline views',
      'Call sheets and daily plans',
      'Schedule changes update forecasts',
    ],
    imageLabel: 'Production schedule preview',
    imageAlt:
      'Production timeline covering pre-production, scouting, preparation, photography and wrap',
    aspectClass: 'aspect-[165/126]',
    width: 660,
    height: 504,
    Icon: CalendarRange,
  },
  {
    key: 'reconciliation',
    category: 'Reconciliation',
    title: 'Know where the money went.',
    description:
      'Match receipts and transactions to budget lines as they happen, so variance is visible on the day, not at wrap.',
    benefits: [
      'Receipts matched to line items',
      'Automatic matching to budget lines',
      'Variance flags by department',
    ],
    imageLabel: 'Reconciliation preview',
    imageAlt:
      'Receipt reconciliation showing transaction matches and budget variance statuses',
    aspectClass: 'aspect-[165/100]',
    width: 660,
    height: 400,
    Icon: ReceiptText,
  },
  {
    key: 'payments',
    category: 'Payments',
    title: 'Keep payments under control.',
    description:
      'Build payment runs for crew and vendors, route them for approval and release with a full record of who signed off.',
    benefits: [
      'Crew and vendor payment runs',
      'Multi-step approvals',
      'Complete audit trail',
    ],
    imageLabel: 'Payment run preview',
    imageAlt:
      'Crew and vendor payment run showing approval stages, recipient amounts and release status',
    aspectClass: 'aspect-[165/119]',
    width: 660,
    height: 476,
    Icon: CreditCard,
  },
];

function WorkflowPreview({ feature, src }) {
  const { Icon, imageLabel, imageAlt, aspectClass, width, height } = feature;
  const imageSrc = typeof src === 'string' ? src.trim() : '';
  const [imageStatus, setImageStatus] = useState(
    imageSrc ? 'loading' : 'missing',
  );
  const showFallback = !imageSrc || imageStatus === 'error';

  return (
    <div className="relative isolate min-w-0">
      {feature.key === 'budgeting' && showFallback && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-3 -bottom-3 -z-10 h-1/2 w-1/2 rounded-full bg-palette-apricot/10 blur-2xl"
        />
      )}
      <div
        className={`relative w-full ${aspectClass} ${
          showFallback
            ? 'overflow-hidden rounded-xl border border-palette-graphite bg-palette-near-black'
            : ''
        }`}
      >
        {!showFallback ? (
          <img
            src={imageSrc}
            alt={imageAlt}
            width={width}
            height={height}
            loading="lazy"
            decoding="async"
            onLoad={() => setImageStatus('loaded')}
            onError={() => setImageStatus('error')}
            className={`absolute inset-0 h-full w-full object-contain ${
              imageStatus === 'loaded' ? 'visible' : 'invisible'
            }`}
          />
        ) : (
          <div
            role="img"
            aria-label={`${imageLabel} image placeholder`}
            className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-linear-to-br from-palette-graphite/50 via-palette-near-black to-palette-black px-5 text-center text-palette-stone"
          >
            <Icon aria-hidden="true" size={36} strokeWidth={1} />
            <span className="text-xs leading-relaxed tracking-wide sm:text-sm">
              {imageLabel}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProductionWorkflowSection({
  images = {},
  className = '',
}) {
  const sectionId = useId();

  return (
    <section
      aria-labelledby={`${sectionId}-heading`}
      className={`isolate overflow-hidden bg-palette-black px-5 text-palette-ivory sm:px-8 lg:px-12 ${className}`}
    >
      <div className="mx-auto max-w-[1320px] border-b border-palette-charcoal/60 py-16 sm:py-24 lg:py-36">
        <div className="mx-auto max-w-[1200px]">
          <Reveal
            as="h2"
            id={`${sectionId}-heading`}
            className="text-[clamp(1.75rem,4.1vw,3.5rem)] leading-[1.08] font-normal tracking-[-0.04em]"
          >
            <span className="block">From idea to production,{' '}</span>
            <span className="block text-palette-stone">
              NKO keeps everything moving.
            </span>
          </Reveal>

          <div className="mt-14 space-y-20 sm:mt-20 sm:space-y-28 lg:mt-24 lg:space-y-36">
            {features.map((feature, index) => {
              const reversed = index % 2 === 1;
              const headingId = `${sectionId}-${feature.key}`;

              return (
                <article
                  key={feature.key}
                  aria-labelledby={headingId}
                  className={`grid items-center gap-7 sm:gap-10 lg:gap-16 ${
                    reversed
                      ? 'lg:grid-cols-[1fr_0.69fr]'
                      : 'lg:grid-cols-[0.69fr_1fr]'
                  }`}
                >
                  <Reveal
                    as="div"
                    className={`min-w-0 ${reversed ? 'lg:order-2' : 'lg:order-1'}`}
                  >
                    <p className="text-xs leading-relaxed font-medium text-palette-apricot">
                      {feature.category}
                    </p>
                    <h3
                      id={headingId}
                      className="mt-3 text-[clamp(1.5rem,2.7vw,2.25rem)] leading-[1.1] font-normal tracking-[-0.035em]"
                    >
                      {feature.title}
                    </h3>
                    <p className="mt-4 text-sm leading-relaxed text-palette-stone sm:text-base">
                      {feature.description}
                    </p>
                    <ul className="mt-6 sm:mt-7">
                      {feature.benefits.map((benefit) => (
                        <li
                          key={benefit}
                          className="flex items-start gap-2.5 border-t border-palette-charcoal py-2.5 text-xs leading-relaxed text-palette-stone sm:text-sm"
                        >
                          <Minus
                            aria-hidden="true"
                            size={12}
                            strokeWidth={1.5}
                            className="mt-1 shrink-0 text-palette-apricot"
                          />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </Reveal>

                  <Reveal
                    as="div"
                    delay={0.08}
                    distance={24}
                    duration={DURATION.slow}
                    className={`min-w-0 ${reversed ? 'lg:order-1' : 'lg:order-2'}`}
                  >
                    <WorkflowPreview
                      key={images[feature.key] || feature.key}
                      feature={feature}
                      src={images[feature.key]}
                    />
                  </Reveal>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
