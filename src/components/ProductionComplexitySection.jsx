import { useId } from 'react';
import { FileSpreadsheet, Image as ImageIcon, MessageSquare } from 'lucide-react';

const painPoints = [
  {
    category: 'Fragmentation',
    title: 'Too many versions',
    description:
      'Spreadsheet copies, texts, WhatsApp, email. No single source of truth.',
  },
  {
    category: 'Data silos',
    title: 'Plans change. Data doesn’t.',
    description:
      'Schedules change, but it doesn’t flow through to the budget.',
  },
  {
    category: 'Team handoffs',
    title: 'Expenses get scattered',
    description:
      'Receipts and spending updates are spread across disconnected tools.',
  },
  {
    category: 'Financial gaps',
    title: 'Payments aren’t connected',
    description:
      'Transactions tell you what was paid, but not always what it was for or what’s still outstanding.',
  },
];

function ImagePlaceholder({ label, alignLeft = false }) {
  return (
    <div
      role="img"
      aria-label={`${label} placeholder`}
      className={`absolute inset-0 flex flex-col justify-center gap-3 bg-linear-to-br from-palette-graphite/70 via-palette-near-black to-palette-black text-palette-stone ${alignLeft ? 'items-start pl-6 sm:pl-8' : 'items-center'}`}
    >
      <ImageIcon aria-hidden="true" size={32} strokeWidth={1} />
      <span className="text-xs tracking-wide sm:text-sm">{label}</span>
    </div>
  );
}

/**
 * Drop-in section. Keep your existing Tailwind v4 stylesheet and theme imports.
 * Empty image props render local, CSS-only placeholders; no remote assets.
 * The three status cards are static illustration content, not live account data.
 */
export default function ProductionComplexitySection({
  productionImage = '',
  workspaceImage = '',
  productionImageAlt = 'Film crew working on a warmly lit production set',
  workspaceImageAlt = 'Production planning desk with a laptop and paperwork',
  className = '',
}) {
  const headingId = useId();
  const illustrationId = useId();
  const cardStyle =
    'rounded-lg border border-palette-graphite bg-palette-near-black p-3 shadow-xl shadow-palette-black/40 sm:p-4';

  return (
    <section
      aria-labelledby={headingId}
      className={`bg-palette-black px-5 text-palette-ivory sm:px-8 lg:px-12 ${className}`}
    >
      <div className="mx-auto max-w-[1320px] border-y border-palette-charcoal/60 py-16 sm:py-24 lg:py-36">
        <div className="mx-auto max-w-[1200px]">
          <div className="grid items-center gap-6 lg:grid-cols-[1.42fr_1fr] lg:gap-8">
            <h2
              id={headingId}
              className="text-[clamp(1.875rem,4.1vw,3.625rem)] leading-[1.14] font-normal tracking-[-0.045em]"
            >
              <span className="block">Production is complex.</span>
              <span className="block text-palette-stone">
                Your tools shouldn’t be.
              </span>
            </h2>
            <p className="max-w-[29rem] text-sm leading-relaxed text-palette-stone sm:text-base">
              Most productions run on a patchwork of spreadsheets, shared docs,
              chat threads and banking apps. Every handoff is a chance for
              information to go stale, and on a shoot, stale information costs
              real money.
            </p>
          </div>

          <div className="mt-10 grid items-start gap-10 sm:mt-14 lg:mt-20 lg:grid-cols-[1.42fr_1fr] lg:gap-6">
            <figure
              aria-labelledby={illustrationId}
              className="relative isolate m-0 min-w-0 pb-3"
            >
              <figcaption id={illustrationId} className="sr-only">
                An illustration of disconnected production information:
                separate budget files, spend totals and team messages.
              </figcaption>

              <div className="relative aspect-[10/11] min-h-[380px] w-full overflow-hidden rounded-lg border border-palette-charcoal sm:min-h-0">
                {productionImage ? (
                  <img
                    src={productionImage}
                    alt={productionImageAlt}
                    width={680}
                    height={748}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : (
                  <ImagePlaceholder label="Production image" alignLeft />
                )}
              </div>

              <div
                className={`absolute top-4 left-4 w-[min(64%,15.5rem)] sm:top-6 sm:left-6 ${cardStyle}`}
              >
                <div className="flex items-center gap-3">
                  <FileSpreadsheet
                    aria-hidden="true"
                    size={19}
                    strokeWidth={1.5}
                    className="shrink-0 text-palette-stone"
                  />
                  <div className="min-w-0">
                    <p className="break-all text-[11px] leading-snug font-medium sm:text-[13px]">
                      Budget_FINAL_v3.xlsx
                    </p>
                    <p className="mt-1 text-[11px] leading-snug text-palette-stone">
                      Last edited 2 hours ago
                    </p>
                  </div>
                </div>
                <p className="mt-3 flex items-center gap-2 border-t border-palette-graphite pt-2 text-[10px] leading-snug tracking-[0.08em] text-palette-apricot sm:text-[11px]">
                  <span
                    aria-hidden="true"
                    className="size-1.5 shrink-0 rounded-sm bg-palette-apricot"
                  />
                  BUDGET LOCKED
                </p>
              </div>

              <dl
                className={`absolute top-[45%] right-4 w-[min(46%,12.5rem)] sm:right-6 ${cardStyle}`}
              >
                <dt className="text-[10px] leading-snug tracking-[0.06em] text-palette-stone sm:text-[11px]">
                  TOTAL SPEND
                </dt>
                <dd className="mt-2 text-2xl leading-none font-medium tracking-[-0.04em] sm:text-3xl">
                  ₦1.2M
                </dd>
                <dd className="mt-2 text-[11px] leading-snug text-palette-stone">
                  Awaiting reconciliation
                </dd>
              </dl>

              <div
                className={`absolute right-4 bottom-0 w-[min(68%,15.5rem)] sm:right-6 ${cardStyle}`}
              >
                <div className="flex items-center gap-2 text-[11px] text-palette-stone">
                  <MessageSquare aria-hidden="true" size={13} strokeWidth={1.5} />
                  <span>Catering</span>
                  <span className="ml-auto">12:41</span>
                </div>
                <p className="mt-2 text-xs leading-snug">
                  Still waiting on approval for Day 3 meals. Who do I confirm
                  numbers with?
                </p>
              </div>
            </figure>

            <div className="min-w-0">
              <div className="relative aspect-[3/2] overflow-hidden rounded-lg border border-palette-charcoal">
                {workspaceImage ? (
                  <img
                    src={workspaceImage}
                    alt={workspaceImageAlt}
                    width={480}
                    height={320}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : (
                  <ImagePlaceholder label="Workspace image" />
                )}
              </div>

              <dl className="mt-6">
                {painPoints.map(({ category, title, description }) => (
                  <div
                    key={category}
                    className="grid grid-cols-[6.5rem_minmax(0,1fr)] gap-x-4 border-t border-palette-charcoal py-4 sm:grid-cols-[7rem_minmax(0,1fr)] sm:gap-x-5"
                  >
                    <dt className="pt-0.5 text-[10px] leading-relaxed tracking-[0.08em] text-palette-stone uppercase sm:text-[11px]">
                      {category}
                    </dt>
                    <dd className="min-w-0">
                      <p className="text-sm leading-snug font-medium text-palette-ivory">
                        {title}
                      </p>
                      <p className="mt-2 text-xs leading-relaxed text-palette-stone sm:text-[13px]">
                        {description}
                      </p>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
