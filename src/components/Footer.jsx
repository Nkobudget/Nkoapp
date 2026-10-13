import { useId, useState } from 'react';
import { Circle } from 'lucide-react';
import { Reveal, Stagger, StaggerItem } from './motion/Reveal';

const navigationGroups = [
  {
    title: 'Product',
    items: [
      { key: 'aiBudgeting', label: 'AI Budgeting' },
      { key: 'budgets', label: 'Budgets' },
      { key: 'breakdown', label: 'Breakdown' },
      { key: 'schedules', label: 'Schedules' },
      { key: 'reconciliation', label: 'Reconciliation' },
      { key: 'payments', label: 'Payments' },
    ],
  },
  {
    title: 'Company',
    items: [
      { key: 'about', label: 'About' },
      { key: 'contact', label: 'Contact' },
      { key: 'careers', label: 'Careers' },
    ],
  },
  {
    title: 'Resources',
    items: [
      { key: 'helpCenter', label: 'Help Center' },
      { key: 'guides', label: 'Guides' },
      { key: 'productionResources', label: 'Production Resources' },
    ],
  },
  {
    title: 'Legal',
    items: [
      { key: 'privacy', label: 'Privacy' },
      { key: 'terms', label: 'Terms' },
    ],
  },
];

function BrandLogo({ src }) {
  const [status, setStatus] = useState(src ? 'loading' : 'missing');
  const showPlaceholder = !src || status === 'error';

  return (
    <span className="relative block h-8 w-16" aria-hidden="true">
      {src && status !== 'error' && (
        <img
          src={src}
          alt=""
          width={64}
          height={32}
          loading="lazy"
          decoding="async"
          onLoad={() => setStatus('loaded')}
          onError={() => setStatus('error')}
          className={`size-full object-contain object-left ${status === 'loaded' ? '' : 'invisible'}`}
        />
      )}

      {showPlaceholder && (
        <span
          data-logo-placeholder="nko"
          className="flex h-full items-center gap-1 font-serif text-2xl leading-none font-bold tracking-[-0.04em] text-palette-ivory"
        >
          NK
          <span className="relative mt-0.5 inline-flex text-palette-gold">
            <span className="absolute -top-1 left-0 h-0.5 w-3 rotate-12 bg-palette-gold" />
            <Circle size={16} strokeWidth={2.5} />
          </span>
        </span>
      )}
    </span>
  );
}



export default function Footer({
  logoSrc = '',
  homeHref = '/',
  linkHrefs = {},
  year = new Date().getFullYear(),
  className = '',
}) {
  const footerId = useId();
  const imageSrc = typeof logoSrc === 'string' ? logoSrc.trim() : '';
  const focusClass =
    'rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-palette-apricot';

  return (
    <footer
      aria-label="Site footer"
      className={`bg-palette-black px-5 pt-12 pb-10 text-palette-stone sm:px-8 sm:pt-16 sm:pb-12 lg:px-12 ${className}`}
    >
      <div className="mx-auto max-w-[1280px]">
        <Stagger
          as="div"
          stagger={0.06}
          className="mx-auto grid max-w-[1176px] grid-cols-2 gap-x-8 gap-y-10 pb-12 sm:gap-y-12 sm:pb-16 lg:grid-cols-[minmax(0,2.05fr)_repeat(3,minmax(0,1fr))_minmax(0,0.8fr)] lg:gap-x-0 lg:pb-20"
        >
          <StaggerItem as="div" className="col-span-2 min-w-0 lg:col-span-1">
            <a
              href={homeHref}
              aria-label="NKO home"
              className={`inline-flex ${focusClass}`}
            >
              <BrandLogo key={imageSrc} src={imageSrc} />
            </a>
            <p className="mt-5 max-w-sm text-xl leading-snug tracking-[-0.015em] text-palette-ivory sm:text-[22px]">
              Production, intelligently managed.
            </p>
          </StaggerItem>

          {navigationGroups.map(({ title, items }, groupIndex) => {
            const headingId = `${footerId}-group-${groupIndex}`;

            return (
              <StaggerItem
                as="nav"
                key={title}
                aria-labelledby={headingId}
                className="min-w-0"
              >
                <h2
                  id={headingId}
                  className="text-xs leading-5 font-normal text-palette-ivory"
                >
                  {title}
                </h2>
                <ul className="mt-4 space-y-2 text-sm leading-5 sm:mt-5 sm:space-y-4">
                  {items.map(({ key, label }) => {
                    const href =
                      typeof linkHrefs[key] === 'string'
                        ? linkHrefs[key].trim()
                        : '';
                    const itemClass =
                      'inline-flex min-h-11 max-w-full items-center break-words sm:min-h-5';

                    return (
                      <li key={key}>
                        {href ? (
                          <a
                            href={href}
                            className={`${itemClass} ${focusClass} hover:text-palette-ivory motion-safe:transition-colors`}
                          >
                            {label}
                          </a>
                        ) : (
                          <span className={itemClass}>{label}</span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </StaggerItem>
            );
          })}
        </Stagger>

        <Reveal
          as="div"
          className="flex flex-col gap-3 border-t border-palette-charcoal pt-6 text-xs leading-relaxed sm:flex-row sm:items-start sm:justify-between sm:gap-8 sm:pr-12 lg:pr-24"
        >
          <p>© {year} NKO Technologies Ltd. All rights reserved.</p>
          <p>Made for the people who make films.</p>
        </Reveal>
      </div>
    </footer>
  );
}
