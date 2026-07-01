// Shared Framer Motion variants. Bold & playful, but grounded in the brand rule:
// default reveals are a subtle 10-20px fade-up; bigger moves are opt-in per section.

export const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
}

// Pop-in for stickers/seals — a little overshoot + rotate for the hand-applied feel.
export const stickerPop = {
  hidden: { opacity: 0, scale: 0.5, rotate: -18 },
  show: (r = 0) => ({
    opacity: 1, scale: 1, rotate: r,
    transition: { type: 'spring', stiffness: 320, damping: 16 },
  }),
}

// Big editorial reveal for oversized numerals / display type.
export const riseBig = {
  hidden: { opacity: 0, y: 60 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
}

// Stagger container.
export const stagger = (gap = 0.1, delay = 0) => ({
  hidden: {},
  show: { transition: { staggerChildren: gap, delayChildren: delay } },
})

// Common viewport config so things animate once when ~20% on screen.
export const inView = { once: true, amount: 0.25 }
