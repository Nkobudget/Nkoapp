import irisLogo from '../iris-gold-128.png'

export default function IrisLoader({
  message = 'Loading your workspace…',
  subMessage,
  className = '',
  size = 80,
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex flex-col items-center justify-center text-center select-none ${className}`}
    >
      {/* Glowing Iris Container */}
      <div
        className="relative flex items-center justify-center"
        style={{ width: size * 1.75, height: size * 1.75 }}
      >
        {/* Ambient radial gold glow behind logo */}
        <div
          aria-hidden="true"
          className="nko-iris-aura absolute inset-0 rounded-full pointer-events-none"
          style={{
            background:
              'radial-gradient(circle, rgba(254, 237, 97, 0.28) 0%, rgba(212, 175, 55, 0.12) 48%, transparent 72%)',
          }}
        />

        {/* The iris-gold-128 Logo */}
        <img
          src={irisLogo}
          alt="NKÒ"
          width={size}
          height={size}
          loading="eager"
          decoding="async"
          className="nko-iris-glowing-logo relative z-10 block object-contain"
          style={{ width: size, height: size }}
        />
      </div>

      {/* Status Text */}
      <div className="mt-4 flex flex-col items-center gap-1.5">
        <p className="text-sm font-medium tracking-tight text-palette-ivory/90 sm:text-base">
          {message}
        </p>
        {subMessage && (
          <p className="text-xs text-palette-stone">
            {subMessage}
          </p>
        )}

        {/* Subtle breathing golden brand pill */}
        <div aria-hidden="true" className="mt-2 flex items-center gap-1.5">
          <span className="nko-live-dot-gold" />
          <span className="text-[11px] uppercase tracking-widest text-palette-gold/75 font-mono">
            NKÒ
          </span>
        </div>
      </div>
    </div>
  )
}
