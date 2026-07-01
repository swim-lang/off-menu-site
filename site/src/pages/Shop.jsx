import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Page from '../components/Page'
import Reveal from '../components/Reveal'
import { fadeUp, stagger, inView } from '../lib/motion'
import './Shop.css'

const C = '#C11209'

// All ten chews. Bag renders cycle through the 3 we have as stand-ins until real art lands.
const CHEWS = [
  { img: 'raw/3.png', kicker: 'Tart',  q: 'Apple',        name: 'Apple Ume Ginger',       note: 'Bright apple, tart ume, a little ginger.' },
  { img: 'raw/1.png', kicker: 'Bright', q: 'Blueberry',    name: 'Blueberry Meyer Lemon',  note: 'Wild blueberry, bright Meyer lemon.' },
  { img: 'raw/2.png', kicker: 'Cozy',  q: 'Pear',         name: 'Pear Cardamom',          note: 'Soft pear, warm cardamom.' },
  { img: 'raw/3.png', kicker: 'Tart',  q: 'Pomegranate',  name: 'Pomegranate Hibiscus',   note: 'Tart pomegranate, floral hibiscus.' },
  { img: 'raw/1.png', kicker: 'Bright', q: 'Strawberry',   name: 'Strawberry Shiso',       note: 'Ripe strawberry, cool shiso.' },
  { img: 'raw/2.png', kicker: 'Juicy', q: 'Plum',         name: 'Plum Honey Ginger',      note: 'Juicy plum, honey, a ginger kick.' },
  { img: 'raw/3.png', kicker: 'Zesty', q: 'Blood orange', name: 'Blood Orange Chamomile', note: 'Zesty blood orange, soft chamomile.' },
  { img: 'raw/1.png', kicker: 'Dark',  q: 'Blackberry',   name: 'Blackberry Sage',        note: 'Dark blackberry, earthy sage.' },
  { img: 'raw/2.png', kicker: 'Lush',  q: 'Mango',        name: 'Mango Yuzu',             note: 'Lush mango, bright yuzu.' },
  { img: 'raw/3.png', kicker: 'Bold',  q: 'Cola',         name: 'Cherry Cola Spice',      note: 'Cherry cola, a little warm spice.' },
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
      <section className="shop-hero" style={{ color: C }}>
        <Reveal as="span" className="shop-eyebrow">The full lineup · daily fiber chews</Reveal>
        <Reveal><img className="shop-title" src="raw/pick-your-chew.svg" alt="Pick your chew" /></Reveal>
        <Reveal as="p" className="shop-sub">Ten chef-built flavors. One soft chew a day. Pick your favorites — or grab the sampler and taste the whole menu.</Reveal>
      </section>

      <motion.div className="shop-grid" variants={stagger(0.08)} initial="hidden" whileInView="show" viewport={inView}>
        {CHEWS.map((p) => <Chew key={p.name} p={p} />)}
      </motion.div>

      <section className="shop-sampler" style={{ color: C }}>
        <div className="shop-sampler__card">
          <span className="shop-eyebrow">Can't decide?</span>
          <h2 className="shop-sampler__head">Taste the whole menu.</h2>
          <p className="shop-sampler__body">All ten flavors, one box. The chef's orders — try everything before you commit.</p>
          <a className="btn shop-sampler__btn">Shop the sampler</a>
        </div>
      </section>
    </Page>
  )
}
