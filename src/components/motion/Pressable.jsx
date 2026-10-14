import { motion, useReducedMotion } from "framer-motion";
import { DURATION, EASE_OUT } from "../../lib/motion";

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
