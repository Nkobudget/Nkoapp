import { useId, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Image as ImageIcon } from 'lucide-react';
import { DURATION, EASE_OUT, VIEWPORT } from '../lib/motion';
import { Stagger, StaggerItem } from './motion/Reveal';

function StudioBackdrop({ src }) {
  const [status, setStatus] = useState(src ? 'loading' : 'missing');
  const showPlaceholder = !src || status === 'error';

  return (
    <motion.div
      aria-hidden="true"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={VIEWPORT}
      transition={{ duration: DURATION.slow, ease: EASE_OUT }}
      className="pointer-events-none absolute inset-0"
    >
      {src && status !== 'error' && (
        <img
          src={src}
          alt=""
          loading="lazy"
          decoding="async"
          onLoad={() => setStatus('loaded')}
          onError={() => setStatus('error')}
          className={`absolute inset-0 size-full object-cover object-[65%_center] ${status === 'loaded' ? '' : 'invisible'}`}
        />
      )}

      {showPlaceholder && (
        <div
          data-image-placeholder="studio"
          className="absolute inset-0 bg-linear-to-br from-palette-near-black via-palette-dark-gray to-palette-black"
        />
      )}

      {/* Readability overlays are part of the banner, not the placeholder. */}
      <div className="absolute inset-0 bg-palette-black/40" />
      <div className="absolute inset-0 bg-linear-to-r from-palette-black/85 via-palette-black/50 to-palette-black/10" />

      {showPlaceholder && (
        <div className="absolute inset-y-0 right-0 hidden w-[42%] flex-col items-center justify-center gap-3 sm:flex">
          <ImageIcon
            size={40}
            strokeWidth={1}
            className="text-palette-stone/40"
          />
          <span className="text-xs tracking-wide text-palette-stone/60">
            Production studio image
          </span>
        </div>
      )}
    </motion.div>
  );
}

function CTAAction({ href, onClick, className, children }) {
  const actionClass =
    'inline-flex min-h-13 w-full items-center justify-center gap-2 rounded-2xl border px-6 py-3 text-sm leading-5 font-medium focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-palette-apricot motion-safe:transition-colors disabled:cursor-default sm:w-auto';

  if (href) {
    return (
      <a href={href} onClick={onClick} className={`${actionClass} ${className}`}>
        {children}
      </a>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!onClick}
      className={`${actionClass} ${className}`}
    >
      {children}
    </button>
  );
}

/**
 * Drop-in CTA banner using the existing Tailwind v4 palette and project font.
 * Supply backgroundImage for the decorative studio photo. A missing or failed
 * image renders the placeholder; successful images replace the whole placeholder.
 * Provide hrefs for navigation, or callbacks for app actions. Without either,
 * the corresponding button is disabled until it is connected to your app.
 */
export default function ProductionCTASection({
  backgroundImage = '',
  createHref,
  contactHref,
  onCreate,
  onContact,
  className = '',
}) {
  const sectionId = useId();
  const imageSrc =
    typeof backgroundImage === 'string' ? backgroundImage.trim() : '';

  return (
    <section
      aria-labelledby={`${sectionId}-heading`}
      className={`bg-palette-black px-5 py-12 text-palette-ivory sm:px-8 sm:py-16 lg:px-12 lg:py-[86px] ${className}`}
    >
      <div className="relative isolate mx-auto flex min-h-[440px] max-w-[1232px] items-center overflow-hidden rounded-2xl border border-palette-charcoal bg-palette-black px-6 py-14 sm:min-h-[540px] sm:px-10 sm:py-20 lg:min-h-[690px]">
        <StudioBackdrop key={imageSrc} src={imageSrc} />

        <Stagger
          as="div"
          stagger={0.08}
          className="relative z-10 w-full max-w-[640px]"
        >
          <StaggerItem
            as="h2"
            id={`${sectionId}-heading`}
            className="text-[clamp(2rem,4.3vw,3.75rem)] leading-[1.3] font-normal tracking-[-0.045em]"
          >
            <span className="block">Your next production{' '}</span>
            <span className="block">starts here.</span>
          </StaggerItem>

          <StaggerItem
            as="p"
            className="mt-7 max-w-[29rem] text-sm leading-[1.75] text-palette-stone sm:text-base"
          >
            Build your budget. Organize your production. Keep every moving part
            connected with NKO.
          </StaggerItem>

          <StaggerItem
            as="div"
            className="mt-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:gap-10"
          >
            <div className="relative isolate w-full sm:w-auto">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -inset-x-2 -inset-y-1 -z-10 rounded-2xl bg-palette-apricot/30 blur-xl"
              />
              <CTAAction
                href={createHref}
                onClick={onCreate}
                className="border-palette-apricot bg-palette-apricot text-palette-black enabled:hover:bg-palette-apricot/90 [&:is(a)]:hover:bg-palette-apricot/90"
              >
                Create Your Production
                <ArrowRight aria-hidden="true" size={16} strokeWidth={1.75} />
              </CTAAction>
            </div>

            <CTAAction
              href={contactHref}
              onClick={onContact}
              className="border-palette-graphite/75 bg-palette-black/20 text-palette-ivory enabled:hover:border-palette-stone enabled:hover:bg-palette-charcoal [&:is(a)]:hover:border-palette-stone [&:is(a)]:hover:bg-palette-charcoal"
            >
              Talk to our team
            </CTAAction>
          </StaggerItem>
        </Stagger>
      </div>
    </section>
  );
}
