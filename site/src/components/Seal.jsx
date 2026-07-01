import { motion } from 'framer-motion'
import { stickerPop, inView } from '../lib/motion'

/* Vintage seal/sticker shapes drawn inline as SVG so they recolor with currentColor
   and never clip. shape: 'burst' | 'scallop' | 'star'. White face, colored outline,
   colored offset shadow (a translated twin behind). Optional centered label. */

function shapePath(shape) {
  const pts = (n, outer, inner, cx = 100, cy = 100) => {
    const a = []
    for (let i = 0; i < n * 2; i++) {
      const ang = (Math.PI * i) / n - Math.PI / 2
      const r = i % 2 === 0 ? outer : inner
      a.push([cx + r * Math.cos(ang), cy + r * Math.sin(ang)])
    }
    return a
  }
  const poly = (a) => 'M ' + a.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(' L ') + ' Z'
  if (shape === 'burst') return poly(pts(16, 96, 72))
  if (shape === 'star') return poly(pts(5, 96, 40))
  // scallop (sized to fit a 222 box, centered at 111)
  const n = 13, R = 88, cx = 111, cy = 111
  const p = Array.from({ length: n }, (_, i) => {
    const ang = (2 * Math.PI * i) / n - Math.PI / 2
    return [cx + R * Math.cos(ang), cy + R * Math.sin(ang)]
  })
  const rr = R * Math.sin(Math.PI / n)
  let d = `M ${p[0][0].toFixed(1)} ${p[0][1].toFixed(1)} `
  for (let i = 1; i <= n; i++) { const q = p[i % n]; d += `A ${rr.toFixed(1)} ${rr.toFixed(1)} 0 0 1 ${q[0].toFixed(1)} ${q[1].toFixed(1)} ` }
  return d + 'Z'
}

export default function Seal({ shape = 'burst', size = 130, rotate = 0, label, lines, color, className, style }) {
  const vb = shape === 'scallop' ? 222 : 200
  const d = shapePath(shape)
  const text = lines || (label ? label.split(' ') : null)
  return (
    <motion.div
      className={`seal ${className || ''}`}
      style={{ width: size, height: size, color, ...style }}
      variants={stickerPop}
      initial="hidden"
      whileInView="show"
      viewport={inView}
      custom={rotate}
      whileHover={{ scale: 1.06, rotate: rotate + 2 }}
    >
      <svg viewBox={`0 0 ${vb} ${vb}`} width={size} height={size} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
        <path d={d} fill="currentColor" transform="translate(4,5)" />
        <path d={d} fill="#fff" stroke="currentColor" strokeWidth="4" strokeLinejoin="round" />
      </svg>
      {text && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 18%' }}>
          {text.map((w, i) => (
            <span key={i} style={{ fontWeight: 700, fontSize: size * 0.115, lineHeight: 1.05, textTransform: 'uppercase', letterSpacing: '0.02em', textAlign: 'center' }}>{w}</span>
          ))}
        </div>
      )}
    </motion.div>
  )
}
