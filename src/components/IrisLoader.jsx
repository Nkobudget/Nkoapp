import irisLogo from '../iris-gold-128.png'

export default function IrisLoader({
  message = 'Loading your workspace…',
  className = '',
  size = 84,
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex flex-col items-center justify-center text-center select-none ${className}`}
    >
      {/* Visually hidden screen-reader announcement preserves accessibility and tests */}
      <span className="sr-only">{message}</span>

      {/* Breathing & Glowing Iris Logo */}
      <div
        className="relative flex items-center justify-center"
        style={{ width: size * 1.8, height: size * 1.8 }}
      >
        {/* Ambient radial gold glow: blooms when enlarged, completely fades when scaled down */}
        <div
          aria-hidden="true"
          className="nko-iris-aura absolute inset-0 rounded-full pointer-events-none"
          style={{
            background:
              'radial-gradient(circle, rgba(254, 237, 97, 0.35) 0%, rgba(212, 175, 55, 0.15) 45%, transparent 70%)',
          }}
        />

        {/* The iris-gold-128 Logo: scales up to show actual gold color, scales down to remove gold */}
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
    </div>
  )
}
