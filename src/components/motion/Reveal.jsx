import { motion, useReducedMotion } from "framer-motion";
import {
  DURATION,
  EASE_OUT,
  REVEAL_DISTANCE,
  VIEWPORT,
  fadeUp,
  staggerContainer,
} from "../../lib/motion";

/**
 * Reveals a single block as it scrolls into view.
 *
 * The `as` prop lets it render as any element (section, h2, p, figure…) so it
 * can be dropped onto existing markup without changing the structure.
 */
export function Reveal({
  as = "div",
  children,
  className,
  delay = 0,
  distance = REVEAL_DISTANCE,
  duration = DURATION.base,
  once = VIEWPORT.once,
  amount = VIEWPORT.amount,
  ...rest
}) {
  const reduceMotion = useReducedMotion();
  const Component = motion[as] ?? motion.div;

  return (
    <Component
      className={className}
      initial={{ opacity: 0, y: reduceMotion ? 0 : distance }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount, margin: VIEWPORT.margin }}
      transition={{
        duration: reduceMotion ? DURATION.fast : duration,
        ease: EASE_OUT,
        delay: reduceMotion ? 0 : delay,
      }}
      {...rest}
    >
      {children}
    </Component>
  );
}

/**
 * Container that reveals its <StaggerItem> children one after another.
 * Staggering is reserved for short, related lists so it reads as a sequence
 * rather than a queue of delays.
 */
export function Stagger({
  as = "div",
  children,
  className,
  stagger = 0.08,
  delayChildren = 0,
  once = VIEWPORT.once,
  amount = VIEWPORT.amount,
  ...rest
}) {
  const Component = motion[as] ?? motion.div;

  return (
    <Component
      className={className}
      variants={staggerContainer(stagger, delayChildren)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount, margin: VIEWPORT.margin }}
      {...rest}
    >
      {children}
    </Component>
  );
}

/**
 * Child of <Stagger>. Inherits the reveal animation from its parent so the
 * timing stays in sync with the surrounding group.
 */
export function StaggerItem({ as = "div", children, className, ...rest }) {
  const Component = motion[as] ?? motion.div;

  return (
    <Component className={className} variants={fadeUp} {...rest}>
      {children}
    </Component>
  );
}
