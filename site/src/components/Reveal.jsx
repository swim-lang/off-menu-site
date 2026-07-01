import { motion } from 'framer-motion'
import { fadeUp, inView } from '../lib/motion'

// Drop-in scroll reveal. `as` lets it be a section/div/etc, `v` overrides the variant.
export default function Reveal({ as = 'div', v = fadeUp, className, style, children, ...rest }) {
  const M = motion[as] || motion.div
  return (
    <M
      className={className}
      style={style}
      variants={v}
      initial="hidden"
      whileInView="show"
      viewport={inView}
      {...rest}
    >
      {children}
    </M>
  )
}
