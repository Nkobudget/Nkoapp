import { motion, useReducedMotion } from "framer-motion";
import {
  DURATION,
  EASE_OUT,
  REVEAL_DISTANCE,
  VIEWPORT,
  fadeUp,
  staggerContainer,
} from "../../lib/motion";

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

export function StaggerItem({ as = "div", children, className, ...rest }) {
  const Component = motion[as] ?? motion.div;

  return (
    <Component className={className} variants={fadeUp} {...rest}>
      {children}
    </Component>
  );
}
