import { useId, useState } from "react";
import { motion } from "framer-motion";
import { Image as ImageIcon } from "lucide-react";
import BrandHomeLink from "../components/BrandHomeLink";
import { DURATION, EASE_OUT } from "../lib/motion";

export function ProductionPreview({
  imageSrc = "/assets/product-complex2.png",
  imageAlt = "Production crew working on a film set",
  project,
}) {
  const [imageFailed, setImageFailed] = useState(false);
  const projectId = useId();
  const preview = {
    title: "Untitled",
    scene: "01",
    take: "01",
    date: "03 Oct",
    ...project,
  };

  return (
    <aside
      aria-label="Production preview"
      className="relative flex min-h-[21rem] flex-col justify-end overflow-hidden border-t border-palette-graphite/60 bg-palette-dark-gray sm:min-h-[25rem] lg:min-h-[43rem] lg:border-t-0 lg:border-l"
    >
      {imageSrc && !imageFailed ? (
        <motion.img
          src={imageSrc}
          alt={imageAlt}
          decoding="async"
          onError={() => setImageFailed(true)}
          initial={{ opacity: 0, scale: 1.03 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: DURATION.slow, ease: EASE_OUT }}
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <div
          role="img"
          aria-label="Production image placeholder"
          className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-linear-to-br from-palette-graphite via-palette-dark-gray to-palette-black p-6 pb-56 text-center text-palette-stone lg:pb-6"
        >
          <ImageIcon aria-hidden="true" focusable="false" strokeWidth={1.25} className="size-12" />
          <span className="text-sm leading-6">Production image</span>
        </div>
      )}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-linear-to-t from-palette-black/90 via-palette-black/30 to-palette-black/15"
      />

      <div className="relative z-10 px-6 pb-8 sm:px-10 sm:pb-10 lg:px-12 lg:pb-12">
        <motion.section
          aria-labelledby={projectId}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: DURATION.base, delay: 0.14, ease: EASE_OUT }}
          className="@container max-w-[26rem] overflow-hidden rounded-lg border border-palette-graphite/80 bg-palette-near-black/90 backdrop-blur-sm"
        >
          <div className="px-4 py-3.5">
            <p className="text-[0.6875rem] leading-4 text-palette-stone">Production</p>
            <h2 id={projectId} className="mt-0.5 text-xl leading-7 font-medium tracking-[-0.04em] text-palette-ivory sm:text-2xl sm:leading-8">
              {preview.title}
            </h2>
          </div>
          <dl className="grid grid-cols-1 border-t border-palette-graphite/80 @min-[14rem]:grid-cols-3">
            {[
              ["Scene", preview.scene],
              ["Take", preview.take],
              ["Date", preview.date],
            ].map(([label, value]) => (
              <div
                key={label}
                className="min-w-0 px-4 py-3 not-first:border-t not-first:border-palette-graphite/80 @min-[14rem]:not-first:border-t-0 @min-[14rem]:not-first:border-l"
              >
                <dt className="text-[0.6875rem] leading-4 text-palette-stone">{label}</dt>
                <dd className="mt-0.5 font-mono text-sm leading-6 font-medium tabular-nums text-palette-ivory">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </motion.section>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: DURATION.base, delay: 0.24, ease: EASE_OUT }}
          className="mt-5 max-w-[26rem] text-xs leading-5 text-palette-stone"
        >
          Every production starts with a first slate. Yours starts here.
        </motion.p>
      </div>
    </aside>
  );
}

export default function AuthSplitLayout({
  ariaLabelledBy,
  headerRight,
  heroImageSrc = "/assets/product-complex2.png",
  heroImageAlt = "Production crew working on a film set",
  projectPreview,
  className = "",
  children,
}) {
  return (
    <main
      aria-labelledby={ariaLabelledBy}
      className={`min-h-svh bg-palette-black text-palette-ivory wrap-break-word ${className}`}
    >
      <div className="flex min-h-svh items-center justify-center bg-palette-near-black/35 px-4 py-6 sm:px-8 sm:py-10 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: DURATION.base, ease: EASE_OUT }}
          className="grid w-full max-w-[78rem] overflow-hidden rounded-2xl border border-palette-graphite/60 bg-palette-black shadow-2xl shadow-palette-black/60 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.02fr)]"
        >
          <div className="flex min-w-0 flex-col">
            <header className="flex min-h-[4.25rem] items-center justify-between gap-4 border-b border-palette-graphite/50 px-6 py-4 sm:px-10 lg:px-12">
              <BrandHomeLink className="h-6 w-auto" />
              {headerRight}
            </header>

            <div className="flex flex-1 flex-col justify-center px-6 py-9 sm:px-10 sm:py-12 lg:px-12 lg:py-14">
              <div className="mx-auto w-full max-w-[26.5rem]">
                {children}
              </div>
            </div>
          </div>

          <ProductionPreview
            key={heroImageSrc || "production-placeholder"}
            imageSrc={heroImageSrc}
            imageAlt={heroImageAlt}
            project={projectPreview}
          />
        </motion.div>
      </div>
    </main>
  );
}

