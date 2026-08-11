/**
 * Framer Motion variant'lari — hero va boshqa marketing bo'limlarida
 * takrorlanadigan kirish animatsiyalari.
 */

const easeOut = [0.22, 1, 0.36, 1] as const;

/** Fon rejimida animatsiya to'xtasa ham kontent ko'rinishi uchun — faqat `y`, `opacity` yo'q. */
export const fadeUpSafe = {
  initial: { y: 20 },
  animate: {
    y: 0,
    transition: { duration: 0.65, ease: easeOut },
  },
};

export const scaleInSafe = {
  initial: { scale: 0.97 },
  animate: {
    scale: 1,
    transition: { duration: 0.7, ease: easeOut },
  },
};

export const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};
