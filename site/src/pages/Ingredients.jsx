import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Page from '../components/Page'
import Reveal from '../components/Reveal'
import Ill from '../components/Ill'
import { fadeUp, riseBig, stagger, stickerPop, inView } from '../lib/motion'
import './Ingredients.css'

const C = '#72441E'

const FLAVORS = [
  { name: 'Apple Ume Ginger', note: 'Bright apple, tart ume, and a little ginger warmth — familiar fruit with a quiet, considered twist.' },
  { name: 'Blueberry Meyer Lemon', note: 'Ripe blueberry lifted by bright Meyer lemon.' },
  { name: 'Pear Cardamom', note: 'Soft pear and warm, aromatic cardamom.' },
  { name: 'Pomegranate Hibiscus', note: 'Tart pomegranate with a floral hibiscus edge.' },
  { name: 'Strawberry Shiso', note: 'Sweet strawberry with a cool, herbal shiso note.' },
  { name: 'Plum Honey Ginger', note: 'Juicy plum, mellow honey, and a little ginger kick.' },
  { name: 'Blood Orange Chamomile', note: 'Zesty blood orange softened with chamomile.' },
  { name: 'Blackberry Sage', note: 'Dark blackberry with an earthy sage backbone.' },
  { name: 'Mango Yuzu', note: 'Lush mango and bright, citrusy yuzu.' },
  { name: 'Cherry Cola Spice', note: 'Cherry cola with a little warm baking spice.' },
]

const COMPOSITION = [
  ['carrot', 96], ['apple', 84], ['Cherry', 78], ['strawberry', 64],
  ['grape', 90], ['spinach', 100], ['watermelon', 86], ['cucumber', 74],
]

export default function Ingredients() {
  const [i, setI] = useState(0)
  const pad = (n) => String(n + 1).padStart(2, '0')
  const f = FLAVORS[i]

  return (
    <Page page="ingredients">
      {/* ===== HERO ===== */}
      <section className="ing-hero" style={{ color: C }}>
        <Reveal as="h1" v={riseBig} className="ing-hero__head">Chef-inspired.</Reveal>
      </section>

      {/* ===== COMPOSITION ===== */}
      <section className="ing-comp" style={{ color: C }}>
        <motion.div className="ing-comp__row" variants={stagger(0.07)} initial="hidden" whileInView="show" viewport={inView}>
          {COMPOSITION.map(([name, h], k) => (
            <motion.span key={k} variants={stickerPop} custom={k % 2 ? 6 : -6} style={{ display: 'inline-flex' }}>
              <Ill src={`Illustrations/_red/${name}.svg`} w={h * 0.8} h={h} />
            </motion.span>
          ))}
        </motion.div>
        <Reveal as="p" className="ing-comp__cap serif">A pantry's worth of inspiration — not a candy aisle.</Reveal>
      </section>

      {/* ===== FLAVOR MATH ===== */}
      <section className="ing-math" style={{ color: C }}>
        <Reveal as="span" className="ing-eyebrow">Flavor math</Reveal>
        <Reveal as="h2" v={riseBig} className="ing-math__head">Familiar anchor + specific twist = premium simplicity.</Reveal>
        <Reveal as="p" className="ing-math__body">
          The familiar ingredient gives you an easy way in. The twist makes it feel considered, culinary, and worth remembering.
        </Reveal>
      </section>

      {/* ===== FLAVOR SLIDESHOW ===== */}
      <section className="ing-flav" style={{ color: C }}>
        <Reveal as="span" className="ing-eyebrow">On the menu</Reveal>
        <Reveal as="h2" className="ing-flav__title">Flavor profiles</Reveal>
        <Reveal as="p" className="ing-flav__sub">Ten chef-built flavors — each a familiar anchor with a specific twist. Click through the menu.</Reveal>

        <div className="ing-carousel">
          <button className="ing-arrow" onClick={() => setI((i - 1 + FLAVORS.length) % FLAVORS.length)} aria-label="Previous flavor">←</button>

          <div className="ing-card">
            <div className="ing-card__photo" style={{ backgroundImage: 'url(Pattern/_paper/PatternNEW-brown.svg)' }}>
              <span className="ing-card__ph">Photo<em>coming soon</em></span>
            </div>
            <div className="ing-card__info">
              <AnimatePresence mode="wait">
                <motion.div key={i}
                  initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }}
                  transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}>
                  <div className="ing-card__idx"><b>{pad(i)}</b><span>/ {FLAVORS.length}</span></div>
                  <h3 className="ing-card__name serif">{f.name}</h3>
                  <p className="ing-card__note">{f.note}</p>
                  <span className="ing-card__tag">Anchor + twist</span>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <button className="ing-arrow" onClick={() => setI((i + 1) % FLAVORS.length)} aria-label="Next flavor">→</button>
        </div>

        <div className="ing-dots">
          {FLAVORS.map((_, k) => (
            <button key={k} className={`ing-dot ${k === i ? 'is-on' : ''}`} onClick={() => setI(k)} aria-label={`Flavor ${k + 1}`} />
          ))}
        </div>

        <span className="ing-eyebrow ing-menu__label">The full menu</span>
        <div className="ing-menu">
          {FLAVORS.map((fl, k) => (
            <button key={k} className={`ing-chip ${k === i ? 'is-on' : ''}`} onClick={() => setI(k)}>{fl.name}</button>
          ))}
        </div>
      </section>

      {/* ===== INGREDIENT NOTE ===== */}
      <section className="ing-note" style={{ color: C }}>
        <div className="ing-note__inner">
          <span className="ing-eyebrow" style={{ opacity: 0.7 }}>Ingredient note</span>
          <p>Flavor names describe taste profiles. They do not always mean the product contains whole fruits, vegetables, herbs, or spices named in the flavor. See the ingredients list for full details.</p>
        </div>
      </section>
    </Page>
  )
}
