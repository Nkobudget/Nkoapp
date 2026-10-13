import { motion, useReducedMotion } from "framer-motion";
import { DURATION, EASE_OUT } from "../../lib/motion";

/**
 * Wraps an interactive element with subtle press / hover feedback.
 *
 * It is a wrapper rather than a replacement so the existing button styling
 * (shadows, colour transitions) is untouched — the wrapper owns only the
 * transform, which avoids fighting the CSS transitions underneath.
 */
export default function Pressable({
  children,
  className = "inline-flex",
  hover = false,
  hoverScale = 1.01,
  tapScale = 0.97,
  ...rest
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      whileHover={hover && !reduceMotion ? { scale: hoverScale } : undefined}
      whileTap={reduceMotion ? undefined : { scale: tapScale }}
      transition={{ duration: DURATION.fast, ease: EASE_OUT }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
