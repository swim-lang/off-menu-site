import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Page from '../components/Page'
import Reveal from '../components/Reveal'
import Ill from '../components/Ill'
import { fadeUp, riseBig, stagger, stickerPop, inView } from '../lib/motion'
import './Ingredients.css'

const C = '#72441E'

const FLAVORS = [
  { name: 'Apple Ume Ginger', note: 'Bright apple, tart ume, and a little ginger warmth.' },
  { name: 'Watermelon Basil Lime', note: 'Juicy watermelon, fresh basil, and a clean lime finish.' },
  { name: 'Strawberry Fig Leaf Almond', note: 'Ripe strawberry, green fig leaf, and a soft almond note.' },
  { name: 'Cucumber Yuzu Mint', note: 'Cool cucumber, sharp yuzu, and a mint finish.' },
  { name: 'Carrot Date Tahini', note: 'Sweet carrot, rich date, and a little sesame depth.' },
  { name: 'Green Apple Shiso Lime', note: 'Crisp green apple, fresh shiso, and a bright lime edge.' },
  { name: 'Cherry Cola Spice', note: 'Dark cherry, nostalgic cola, and a warm spice finish.' },
  { name: 'Peach Chamomile Honey', note: 'Soft peach, calm chamomile, and a rounded honey finish.' },
  { name: 'Grapefruit Fennel Salt', note: 'Bright grapefruit, sweet fennel, and a tiny salt finish.' },
  { name: 'Concord Grape Verjus', note: 'Deep concord grape, tart verjus, and a clean wine-like finish.' },
]

// two produce clusters flanking the CHEF-INSPIRED lockup (per mockup)
const SCATTER = [
  // left cluster: cherry (upper-left), watermelon (upper, right of cherry), grapes (lower-left)
  { src: 'Illustrations/_red/Cherry.svg',     w: 84,  h: 126, css: { top: '34%', left: '2%' },   r: -8 },
  { src: 'Illustrations/_red/watermelon.svg', w: 164, h: 132, css: { top: '28%', left: '13%' },  r: 7 },
  { src: 'raw/grapes2.svg',                   w: 166, h: 170, css: { top: '59%', left: '7%' },   r: -5 },
  // right cluster: strawberry (top), carrot bundle (center), apple (right of carrots, lower)
  { src: 'raw/strawberry2.svg',               w: 78,  h: 140, css: { top: '18%', right: '16%' }, r: 9 },
  { src: 'raw/carrots-bundle.svg',            w: 132, h: 210, css: { top: '46%', right: '13%' }, r: 8 },
  { src: 'Illustrations/_red/apple.svg',      w: 108, h: 134, css: { top: '42%', right: '0%' },  r: 12 },
]

export default function Ingredients() {
  const [i, setI] = useState(0)
  const pad = (n) => String(n + 1).padStart(2, '0')
  const f = FLAVORS[i]

  return (
    <Page page="ingredients">
      {/* ===== HERO — lockup flanked by two produce clusters ===== */}
      <section data-review-id="ingredients-hero" className="ing-hero" style={{ color: C }}>
        {SCATTER.map((p, k) => (
          <motion.span
            key={k}
            className="ing-fruit"
            style={p.css}
            initial={{ opacity: 0, scale: 0.5, rotate: -18 }}
            animate={{ opacity: 1, scale: 1, rotate: p.r }}
            transition={{ type: 'spring', stiffness: 320, damping: 16, delay: k * 0.05 }}
            whileHover={{ scale: 1.14, rotate: p.r + 7, transition: { type: 'spring', stiffness: 400, damping: 12 } }}
          >
            <Ill src={p.src} w={p.w} h={p.h} />
          </motion.span>
        ))}
        <Reveal v={riseBig}><img className="ing-hero__lockup" src="raw/chef-inspired.svg" alt="Chef-inspired" /></Reveal>
        <Reveal as="p" className="ing-hero__cap serif">A pantry's worth of inspiration, not a candy aisle.</Reveal>
      </section>

      {/* ===== FLAVOR SLIDESHOW ===== */}
      <section data-review-id="ingredients-flavors" className="ing-flav" style={{ color: C }}>
        <Reveal as="span" className="ing-eyebrow">On the menu</Reveal>
        <Reveal as="h2" className="ing-flav__title">Flavor profiles</Reveal>
        <Reveal as="p" className="ing-flav__sub">Ten chef-inspired flavors, each a familiar anchor with a specific twist. Click through the menu.</Reveal>

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

        <span className="ing-eyebrow ing-menu__label">Flavors</span>
        <div className="ing-menu">
          {FLAVORS.map((fl, k) => (
            <button key={k} className={`ing-chip ${k === i ? 'is-on' : ''}`} onClick={() => setI(k)}>{fl.name}</button>
          ))}
        </div>
      </section>

      {/* ===== MORE MENU THAN CANDY AISLE — menu card ===== */}
      <section data-review-id="ingredients-menu-card" className="ing-intro" style={{ '--c': C, color: C }}>
        <Reveal className="ing-intro__wrap">
          <div className="ing-intro__menu">
            <span className="ing-intro__crest">✦ On the menu · Est. in the kitchen ✦</span>
            <span className="ing-intro__eyebrow">Flavor, plated</span>
            <h2 className="ing-intro__head">Chef’s menu, not the candy aisle.</h2>
            <div className="ing-intro__rule"><span className="ing-intro__rule-dot" /></div>
          </div>
        </Reveal>
      </section>
    </Page>
  )
}
