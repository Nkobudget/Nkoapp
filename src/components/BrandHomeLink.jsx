import { Link } from "react-router";
import BrandLogo from "./BrandLogo";

// The NKO logo, linked to the landing page. Use this anywhere the brand mark
// appears outside an existing home link so the logo always leads back to "/".
export default function BrandHomeLink({ className = "", linkClassName = "", style, linkStyle }) {
  return (
    <Link
      to="/"
      aria-label="NKO home"
      className={`inline-flex shrink-0 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-palette-gold ${linkClassName}`}
      style={linkStyle}
    >
      <BrandLogo alt="" className={className} style={style} />
    </Link>
  );
}
