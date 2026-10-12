// Shared motion tokens and variants.
// Keeping easing, timing and distance in one place keeps every animation
// across the site consistent instead of each section inventing its own.

// Gentle ease-out curve. Fast to start, soft to settle — the "arrive" feel.
export const EASE_OUT = [0.22, 1, 0.36, 1];

export const DURATION = {
  fast: 0.18, // interaction feedback (press / hover)
  base: 0.45, // default content reveal
  slow: 0.6, // large surfaces (images, panels)
};

// Movement is intentionally small so content settles into place rather than
// sliding around. Anything larger starts to feel like a delay.
export const REVEAL_DISTANCE = 16;

// `once: true` means content animates in a single time and never re-animates
// when the user scrolls back, which keeps browsing uninterrupted.
export const VIEWPORT = {
  once: true,
  amount: 0.25,
  margin: "0px 0px -10% 0px",
};

export const fadeUp = {
  hidden: { opacity: 0, y: REVEAL_DISTANCE },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.base, ease: EASE_OUT },
  },
};

export const staggerContainer = (stagger = 0.08, delayChildren = 0) => ({
  hidden: {},
  visible: {
    transition: { staggerChildren: stagger, delayChildren },
  },
});
