export default function BrandLogo({
  alt = "NKO",
  className = "",
  loading = "eager",
  style,
}) {
  return (
    <img
      src="/assets/logo.png"
      alt={alt}
      width={72}
      height={28}
      loading={loading}
      decoding="async"
      className={`block max-w-full object-contain ${className}`}
      style={style}
    />
  );
}
