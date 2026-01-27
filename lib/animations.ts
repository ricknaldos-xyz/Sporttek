import type { Variants, Transition } from 'framer-motion'

// === TRANSITION PRESETS ===

export const liquidTransition: Transition = {
  type: 'spring',
  stiffness: 300,
  damping: 30,
}

export const smoothTransition: Transition = {
  duration: 0.4,
  ease: [0.4, 0, 0.2, 1],
}

export const bounceTransition: Transition = {
  type: 'spring',
  stiffness: 400,
  damping: 17,
}

export const gentleTransition: Transition = {
  type: 'spring',
  stiffness: 200,
  damping: 25,
}

// === ENTRANCE ANIMATIONS ===

export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
}

export const fadeInUp: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
}

export const fadeInDown: Variants = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 10 },
}

export const fadeInScale: Variants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.98 },
}

export const slideInFromRight: Variants = {
  initial: { opacity: 0, x: 50 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -30 },
}

export const slideInFromLeft: Variants = {
  initial: { opacity: 0, x: -50 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 30 },
}

// === STAGGER ANIMATIONS ===

export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
}

export const staggerContainerFast: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.05,
    },
  },
}

export const staggerItem: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
}

export const staggerItemScale: Variants = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
}

// === HOVER ANIMATIONS ===

export const glassHover: Variants = {
  rest: {
    scale: 1,
    y: 0,
  },
  hover: {
    scale: 1.02,
    y: -2,
    transition: liquidTransition,
  },
  tap: {
    scale: 0.98,
  },
}

export const liftHover: Variants = {
  rest: {
    y: 0,
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06)',
  },
  hover: {
    y: -4,
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
    transition: liquidTransition,
  },
}

export const glowHover: Variants = {
  rest: {
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06)',
  },
  hover: {
    boxShadow:
      '0 8px 32px rgba(0, 0, 0, 0.08), 0 0 40px rgba(99, 102, 241, 0.15)',
    transition: smoothTransition,
  },
}

// === SPECIAL EFFECTS ===

export const pulseGlow: Variants = {
  animate: {
    boxShadow: [
      '0 0 20px rgba(99, 102, 241, 0.2)',
      '0 0 40px rgba(99, 102, 241, 0.4)',
      '0 0 20px rgba(99, 102, 241, 0.2)',
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
}

export const floatAnimation: Variants = {
  animate: {
    y: [0, -8, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
}

export const shimmer: Variants = {
  animate: {
    backgroundPosition: ['200% 0', '-200% 0'],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'linear',
    },
  },
}

// === PAGE TRANSITIONS ===

export const pageTransition: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
}

export const pageSlide: Variants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0, transition: smoothTransition },
  exit: { opacity: 0, x: -20, transition: { duration: 0.2 } },
}

// === MODAL ANIMATIONS ===

export const modalOverlay: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
}

export const modalContent: Variants = {
  initial: { opacity: 0, scale: 0.95, y: 10 },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: liquidTransition,
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    y: 5,
    transition: { duration: 0.15 },
  },
}

// === SKELETON LOADING ===

export const skeletonPulse: Variants = {
  animate: {
    opacity: [0.5, 1, 0.5],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
}
