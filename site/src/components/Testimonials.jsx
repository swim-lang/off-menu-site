import { useRef } from 'react'
import { motion } from 'framer-motion'
import Reveal from './Reveal'
import { fadeUp, stagger, inView } from '../lib/motion'
import './Testimonials.css'

// Placeholder influencer clips — swap thumb/handle/quote for real videos later.
const CLIPS = [
  { thumb: 'raw/poster.jpg',       handle: '@plantbasedpaige', name: 'Paige R.',  quote: 'I would actually remember to take this.', dur: '0:42' },
  { thumb: 'raw/story.jpg',        handle: '@guthealthgreg',   name: 'Greg M.',   quote: "Finally a fiber I don't dread. Two seconds, done.", dur: '0:51' },
  { thumb: 'raw/cta-candy.jpg',    handle: '@snacksbysam',     name: 'Sam K.',    quote: 'Tastes like a treat, works like a supplement.', dur: '0:33' },
  { thumb: 'raw/sampler-photo.png',handle: '@themorningchew',  name: 'Devon L.',  quote: 'I stopped pretending I was going to use the powder.', dur: '1:04' },
  { thumb: 'raw/story-candy.png',  handle: '@dietitian.dana',  name: 'Dana P.',   quote: 'An easy daily habit people could actually keep.', dur: '0:48' },
  { thumb: 'raw/story-bg.jpg',     handle: '@thechewcrew',     name: 'Mateo S.',  quote: 'Looks like deli candy — but make it fiber.', dur: '0:29' },
]

export default function Testimonials({ color = '#C11209', reviewId }) {
  const rowRef = useRef(null)
  const drag = useRef({ down: false, x: 0, left: 0, moved: false })

  const down = (e) => {
    const row = rowRef.current
    drag.current = { down: true, x: e.pageX, left: row.scrollLeft, moved: false }
    row.classList.add('is-grabbing')
  }
  const move = (e) => {
    if (!drag.current.down) return
    e.preventDefault()
    const dx = e.pageX - drag.current.x
    if (Math.abs(dx) > 4) drag.current.moved = true
    rowRef.current.scrollLeft = drag.current.left - dx
  }
  const up = () => {
    drag.current.down = false
    rowRef.current && rowRef.current.classList.remove('is-grabbing')
  }
  const nudge = (dir) => rowRef.current.scrollBy({ left: dir * 360, behavior: 'smooth' })

  return (
    <section data-review-id={reviewId} className="vt" style={{ '--c': color, color }}>
      <div className="vt-head">
        <Reveal as="span" className="vt-eyebrow">Word of mouth</Reveal>
        <Reveal as="h2" className="vt-title">Early notes from the first batch.</Reveal>
        <Reveal as="p" className="vt-sub">People are already talking.</Reveal>
        <div className="vt-arrows">
          <button className="vt-arrow" onClick={() => nudge(-1)} aria-label="Previous">←</button>
          <button className="vt-arrow" onClick={() => nudge(1)} aria-label="Next">→</button>
        </div>
      </div>

      <motion.div
        className="vt-row" ref={rowRef}
        onMouseDown={down} onMouseMove={move} onMouseUp={up} onMouseLeave={up}
        variants={stagger(0.08)} initial="hidden" whileInView="show" viewport={inView}
      >
        {CLIPS.map((c) => (
          <motion.article className="vt-card" key={c.handle} variants={fadeUp}>
            <div className="vt-media" style={{ backgroundImage: `url(${c.thumb})` }} role="img" aria-label={`${c.name} testimonial`} draggable="false">
              <span className="vt-handle">{c.handle}</span>
              <span className="vt-play" aria-hidden="true">▶</span>
              <span className="vt-dur">{c.dur}</span>
            </div>
            <div className="vt-cap">
              <span className="vt-name">{c.name}</span>
              <p className="vt-quote">“{c.quote}”</p>
            </div>
          </motion.article>
        ))}
      </motion.div>
    </section>
  )
}
