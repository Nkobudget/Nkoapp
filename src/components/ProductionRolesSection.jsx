import { useId } from 'react';
import { Circle } from 'lucide-react';
import { Reveal, Stagger, StaggerItem } from './motion/Reveal';

const roles = [
  {
    id: 'producers',
    audience: 'Producers',
    title: 'See the whole picture.',
    description:
      'Track budget health across every production and approve big-ticket spend with real numbers, not last week’s spreadsheet.',
    benefits: [
      'Budget vs. actual at a glance',
      'Approvals on key spend',
      'Client-ready cost reports',
    ],
    dividerClass: '',
  },
  {
    id: 'managers',
    audience: 'Production Managers',
    title: 'Run the day-to-day.',
    description:
      'Turn the script into a breakdown and a schedule, then keep crew, locations and vendors aligned as plans change.',
    benefits: [
      'Breakdowns and schedules',
      'Purchase orders and vendors',
      'Daily cost tracking',
    ],
    dividerClass: 'border-t sm:border-t-0 sm:border-l',
  },
  {
    id: 'accountants',
    audience: 'Production Accountants',
    title: 'Close the books faster.',
    description:
      'Reconcile receipts against budget lines as they come in, run payroll and export clean reports at wrap.',
    benefits: [
      'Automatic receipt matching',
      'Payment runs and approvals',
      'Audit-ready exports',
    ],
    dividerClass: 'border-t lg:border-t-0 lg:border-l',
  },
  {
    id: 'teams',
    audience: 'Production Teams',
    title: 'Know what’s needed.',
    description:
      'Department heads see their allocation, submit expenses from set and always know the next call time.',
    benefits: [
      'Department budgets',
      'Expense capture from set',
      'Call times and schedules',
    ],
    dividerClass: 'border-t sm:border-l lg:border-t-0',
  },
];


export default function ProductionRolesSection({ className = '' }) {
  const sectionId = useId();

  return (
    <section
      aria-labelledby={`${sectionId}-heading`}
      className={`bg-palette-black px-5 text-palette-ivory sm:px-8 lg:px-12 ${className}`}
    >
      <div className="mx-auto max-w-[1280px] border-b border-palette-charcoal/60 py-14 sm:py-20 lg:py-28">
        <div className="mx-auto max-w-[1176px]">
          <Reveal
            as="h2"
            id={`${sectionId}-heading`}
            aria-label="One workspace. Every role."
            className="text-[clamp(1.875rem,4.1vw,3.5rem)] leading-[1.14] font-normal tracking-[-0.04em]"
          >
            <span className="block sm:inline">One workspace.</span>
            <span className="block text-palette-stone sm:inline">Every role.</span>
          </Reveal>

          <Stagger
            as="div"
            stagger={0.08}
            className="mt-10 grid overflow-hidden rounded-xl border border-palette-graphite/65 bg-palette-near-black/70 sm:mt-12 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4"
          >
            {roles.map(({ id, audience, title, description, benefits, dividerClass }) => (
              <StaggerItem
                as="article"
                key={id}
                aria-labelledby={`${sectionId}-${id}`}
                className={`flex min-w-0 flex-col border-palette-graphite/65 p-6 sm:p-7 ${dividerClass}`}
              >
                <p
                  id={`${sectionId}-${id}`}
                  className="text-[13px] leading-relaxed font-medium text-palette-apricot"
                >
                  {audience}
                </p>
                <h3 className="mt-6 text-xl leading-[1.3] font-normal tracking-[-0.02em] sm:mt-8">
                  {title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-palette-stone">
                  {description}
                </p>

                <div className="mt-auto pt-8">
                  <ul className="space-y-2 border-t border-palette-charcoal pt-6">
                    {benefits.map((benefit) => (
                      <li
                        key={benefit}
                        className="flex items-start gap-2 text-[13px] leading-relaxed text-palette-stone"
                      >
                        <Circle
                          aria-hidden="true"
                          size={3}
                          strokeWidth={0}
                          className="mt-2 shrink-0 fill-palette-stone"
                        />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}
