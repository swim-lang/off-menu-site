import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Page from '../components/Page'
import Reveal from '../components/Reveal'
import CtaSignup from '../components/CtaSignup'
import { fadeUp, stagger, inView } from '../lib/motion'
import './Shop.css'

const C = '#C11209'

// All ten chews. Bag renders cycle through the 3 we have as stand-ins until real art lands.
const CHEWS = [
  { img: 'raw/3.png', kicker: 'Tart',   q: 'Apple',       name: 'Apple Ume Ginger',           note: 'Bright apple, tart ume, a little ginger.' },
  { img: 'raw/1.png', kicker: 'Fresh',  q: 'Watermelon',  name: 'Watermelon Basil Lime',      note: 'Juicy watermelon, basil, clean lime.' },
  { img: 'raw/2.png', kicker: 'Bright', q: 'Strawberry',  name: 'Strawberry Fig Leaf Almond', note: 'Ripe strawberry, fig leaf, almond.' },
  { img: 'raw/3.png', kicker: 'Cool',   q: 'Cucumber',    name: 'Cucumber Yuzu Mint',         note: 'Cool cucumber, yuzu, mint.' },
  { img: 'raw/1.png', kicker: 'Rich',   q: 'Carrot',      name: 'Carrot Date Tahini',         note: 'Sweet carrot, date, tahini.' },
  { img: 'raw/2.png', kicker: 'Green',  q: 'Apple',       name: 'Green Apple Shiso Lime',     note: 'Crisp apple, shiso, bright lime.' },
  { img: 'raw/3.png', kicker: 'Bold',   q: 'Cola',        name: 'Cherry Cola Spice',          note: 'Cherry cola, warm spice.' },
  { img: 'raw/1.png', kicker: 'Soft',   q: 'Peach',       name: 'Peach Chamomile Honey',      note: 'Soft peach, chamomile, honey.' },
  { img: 'raw/2.png', kicker: 'Zesty',  q: 'Grapefruit',  name: 'Grapefruit Fennel Salt',     note: 'Grapefruit, fennel, tiny salt.' },
  { img: 'raw/3.png', kicker: 'Punchy', q: 'Grape',       name: 'Concord Grape Verjus',       note: 'Concord grape, tart verjus.' },
]

function Chew({ p }) {
  return (
    <motion.div className="shop-card" variants={fadeUp} whileHover={{ y: -8 }}>
      <Link to="/product" className="shop-card__link" aria-label={p.name}>
        <div className="shop-card__photo"><img src={p.img} alt={p.name} /></div>
        <div className="shop-card__meta">
          <span className="shop-card__kicker">{p.kicker}</span>
          <span className="shop-card__q serif">“{p.q}”</span>
          <span className="shop-card__kicker">30 CT</span>
        </div>
        <div className="shop-card__name serif">{p.name}</div>
        <div className="shop-card__note">{p.note}</div>
      </Link>
    </motion.div>
  )
}

export default function Shop() {
  return (
    <Page page="shop">
      <section data-review-id="shop-hero" className="shop-hero" style={{ color: C }}>
        <Reveal as="span" className="shop-eyebrow">The full lineup · daily fiber chews</Reveal>
        <Reveal><img className="shop-title" src="raw/pick-your-chew.svg" alt="Pick your chew" /></Reveal>
        <Reveal as="p" className="shop-sub">Ten chef-inspired flavors. One soft chew a day. Pick your favorites — or grab the sampler and taste the whole menu.</Reveal>
      </section>

      <motion.div data-review-id="shop-grid" className="shop-grid" variants={stagger(0.08)} initial="hidden" whileInView="show" viewport={inView}>
        {CHEWS.map((p) => <Chew key={p.name} p={p} />)}
      </motion.div>

      <CtaSignup color={C} reviewId="shop-cta" />
    </Page>
  )
}
