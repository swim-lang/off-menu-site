import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Page from '../components/Page'
import Reveal from '../components/Reveal'
import Ill from '../components/Ill'
import Testimonials from '../components/Testimonials'
import { fadeUp, riseBig, stickerPop, stagger, inView } from '../lib/motion'
import './Product.css'

const C = '#694078'

const PLANS = {
  once: { label: 'One-time', sub: '30 chews · one bag', price: 24, badge: null },
  sub: { label: 'Subscribe & save', sub: '30 chews · ships monthly, skip anytime', price: 20, badge: 'Save 15%' },
}

const BULLETS = [
  '1g fiber per serving',
  'Supports digestive health & regularity',
  'Helps support fullness',
  '30 individually wrapped chews',
]

const STATS = [
  { big: '10', label: 'Chef-led flavors' },
  { big: '100%', label: 'Real fruit & botanicals' },
  { big: 'Small batch', label: 'Made fresh, never sterile' },
]

const SCIENCE = [
  { t: 'Digestion & regularity', b: 'Fiber adds bulk and helps move things through — the foundation of comfortable, regular digestion.' },
  { t: 'A fed gut microbiome', b: 'Prebiotic fibers feed the beneficial bacteria in your gut, which researchers increasingly link to whole-body health.' },
  { t: 'Fullness & appetite', b: 'Soluble fiber slows digestion, helping you feel full and steadier between meals instead of running on empty.' },
  { t: 'Steadier energy', b: 'By slowing how quickly sugars are absorbed, fiber helps smooth out the spikes and crashes across your day.' },
  { t: 'Heart & cholesterol', b: 'Soluble fiber is among the most-studied nutrients for supporting already-healthy cholesterol as part of a balanced diet.' },
]

const RELATED = [
  { img: 'raw/3.png', tag: 'Punchy', quote: '“Grape”', name: 'Concord Verjus Grape', note: 'Concord grape, a little verjus.' },
  { img: 'raw/2.png', tag: 'Bold', quote: '“Cola”', name: 'Cherry Cola Spice', note: 'Cherry cola, a little spice.' },
  { img: 'raw/1.png', tag: 'Bright', quote: '“Strawberry”', name: 'Strawberry Fig Leaf', note: 'Strawberry, fig leaf, almond.' },
]

const REVIEWS = [
  { quote: "The first fiber I've ever wanted to eat. The grape one is genuinely dangerous.", who: '— Dana R.' },
  { quote: 'Replaced three sad cabinet supplements with one bag I\'m excited about.', who: '— Marcus L.' },
  { quote: 'Looks like something off a deli wall and tastes like a treat. Sold.', who: '— Priya N.' },
]

const FAQS = [
  {
    q: 'What is it?',
    a: 'Off Menu Daily Fiber is a soft chew supplement with 1g fiber per serving, made to help support digestive health, regularity, and fullness as part of your daily routine.',
  },
  { q: 'How do I take it?', a: 'Take one chew daily. No scoop, no shaker, no water required — just unwrap and eat.' },
  { q: 'When should I take it?', a: 'Any time that fits your routine. Many people pair it with breakfast or an evening wind-down.' },
  { q: 'What does it taste like?', a: 'Concord grape with a little verjus — chef-developed for real flavor, not a punishment.' },
  { q: 'Is this a candy?', a: 'No. It is a fiber supplement that happens to taste good. Flavor names describe taste, not candy.' },
  {
    q: 'Does it replace fruits and vegetables?',
    a: 'No. It is a supplement to support a balanced diet, not a substitute for whole fruits and vegetables.',
  },
]

export default function Product() {
  const [plan, setPlan] = useState('sub')
  const [openFaq, setOpenFaq] = useState(0)
  const [lesson, setLesson] = useState(0)
  const price = PLANS[plan].price

  return (
    <Page page="product">
      {/* ===== HERO / BUY BOX ===== */}
      <section className="pdp-hero" style={{ color: C }}>
        <Reveal className="pdp-hero__media">
          <img className="pdp-hero__photo" src="raw/pdp-hero.jpg" alt="Concord Verjus Grape daily fiber chews" />
        </Reveal>

        <div className="pdp-hero__info">
          <Reveal as="span" className="pdp-pill">Punchy · Daily fiber soft chews</Reveal>
          <Reveal as="h1" v={riseBig} className="pdp-hero__title serif">Concord Verjus Grape</Reveal>
          <Reveal as="div" className="pdp-hero__rating">
            <span className="pdp-stars">★★★★★</span>
            <span className="pdp-hero__rcount">4.9 · 1,204 reviews</span>
          </Reveal>
          <Reveal as="div" className="pdp-hero__price serif">${price}</Reveal>
          <Reveal as="p" className="pdp-hero__desc">
            1g fiber in one chef-inspired soft chew — concord grape with a little verjus — made for daily use
            without the powder, scoop, shaker, or orange tub.
          </Reveal>

          <Reveal as="div" className="pdp-plans">
            {Object.entries(PLANS).map(([key, p]) => (
              <button
                key={key}
                className={`pdp-plan ${plan === key ? 'is-on' : ''}`}
                onClick={() => setPlan(key)}
                type="button"
              >
                <div className="pdp-plan__left">
                  <div className="pdp-plan__head">
                    <span className="pdp-plan__label">{p.label}</span>
                    {p.badge && <span className="pdp-plan__badge">{p.badge}</span>}
                  </div>
                  <span className="pdp-plan__sub serif">{p.sub}</span>
                </div>
                <span className="pdp-plan__price">${p.price}</span>
              </button>
            ))}
          </Reveal>

          <motion.button
            className="pdp-cart"
            type="button"
            whileTap={{ y: 7, boxShadow: `0 0 0 ${C}` }}
          >
            Add to cart — ${price}
          </motion.button>

          <Reveal as="ul" className="pdp-bullets">
            {BULLETS.map((b) => (
              <li key={b} className="pdp-bullet"><span className="pdp-dot" />{b}</li>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ===== STAT BAND ===== */}
      <section className="pdp-stats">
        {STATS.map((s, i) => (
          <Reveal as="div" key={s.label} className="pdp-stat" style={{ transitionDelay: `${i * 40}ms` }}>
            <div className="pdp-stat__big">{s.big}</div>
            <div className="pdp-stat__label">{s.label}</div>
          </Reveal>
        ))}
      </section>

      {/* ===== THE SCIENCE — class with Chef Chewy ===== */}
      <section className="pdp-science" style={{ color: C }}>
        <div className="pdp-science__inner">
          <div className="pdp-science__head-wrap">
            <Reveal as="span" className="pdp-science__eyebrow">Fiber class with Chef Chewy</Reveal>
            <Reveal as="h2" v={riseBig} className="pdp-science__head">Fiber, demystified.</Reveal>
            <Reveal as="p" className="pdp-science__intro">
              Fiber is one of the most-studied nutrients in nutrition science, and the research keeps pointing the same
              way: most of us don't get enough, and getting more — consistently — supports how we feel from head to gut.
            </Reveal>
            <motion.div
              className="pdp-science__chef"
              variants={stickerPop}
              initial="hidden"
              whileInView="show"
              viewport={inView}
              custom={-3}
            >
              <Ill src="Illustrations/Arms-Crossed.svg" w={150} h={228} className="pdp-science__chef-img" />
              <div className="pdp-science__bubble">
                <span className="pdp-science__bubble-name serif">Chef Chewy</span>
                <p className="pdp-science__bubble-text">Pull up a stool — class is in session.</p>
              </div>
            </motion.div>
          </div>

          <div className="pdp-science__viewer">
            <div className="pdp-science__tabs">
              {SCIENCE.map((s, i) => (
                <button
                  key={s.t}
                  type="button"
                  className={`pdp-science__tab ${lesson === i ? 'is-on' : ''}`}
                  onClick={() => setLesson(i)}
                  aria-label={`Lesson ${i + 1}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={lesson}
                className="pdp-science__panel"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                <span className="pdp-science__num serif">{String(lesson + 1).padStart(2, '0')}</span>
                <h3 className="pdp-science__t">{SCIENCE[lesson].t}</h3>
                <p className="pdp-science__b">{SCIENCE[lesson].b}</p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <Reveal as="p" className="pdp-science__fine">
          These statements describe the role of dietary fiber generally and have not been evaluated by the FDA. Off Menu
          is a supplement to a balanced diet, not a treatment, cure, or replacement for whole foods.
        </Reveal>
      </section>

      {/* ===== MADE FOR YOUR GUT ===== */}
      <section className="pdp-made" style={{ color: C }}>
        <div className="pdp-made__inner">
          <div className="pdp-made__text">
            <Reveal as="h2" v={riseBig} className="pdp-made__head">Made for your gut, not the cabinet.</Reveal>
            <Reveal as="p" className="pdp-made__body">
              Most fiber supplements taste like a punishment, so they end up forgotten in a drawer. We re-plated
              the whole thing: chef-developed recipes, real ingredients, and a chew you'll actually want to take.
              Two a day keeps the kitchen moving.
            </Reveal>
            <Reveal as="p" className="pdp-made__serif serif">A little order for your insides.</Reveal>
          </div>
          <motion.div
            className="pdp-made__art"
            variants={stickerPop}
            initial="hidden"
            whileInView="show"
            viewport={inView}
            custom={-3}
          >
            <Ill src="Illustrations/tummy.svg" w={360} h={304} />
          </motion.div>
        </div>
      </section>

      {/* ===== RELATED ===== */}
      <section className="pdp-related" style={{ color: C }}>
        <Reveal as="span" className="pdp-related__eyebrow">More from the menu</Reveal>
        <motion.div
          className="pdp-related__grid"
          variants={stagger(0.08)}
          initial="hidden"
          whileInView="show"
          viewport={inView}
        >
          {RELATED.map((r) => (
            <motion.a key={r.name} className="pdp-card" variants={fadeUp} href="#">
              <div className="pdp-card__media">
                <img src={r.img} alt={r.name} className="pdp-card__img" />
              </div>
              <div className="pdp-card__meta">
                <span className="pdp-card__tag">{r.tag}</span>
                <span className="pdp-card__quote serif">{r.quote}</span>
                <span className="pdp-card__ct">30 CT</span>
              </div>
              <h3 className="pdp-card__name serif">{r.name}</h3>
              <p className="pdp-card__note">{r.note}</p>
            </motion.a>
          ))}
        </motion.div>
        <Reveal className="pdp-related__cta-wrap">
          <a href="#" className="pdp-btn pdp-btn--wide">Shop all 10 flavors →</a>
        </Reveal>
      </section>

      {/* ===== VIDEO TESTIMONIALS ===== */}
      <Testimonials color={C} />

      {/* ===== PRODUCT FAQ ===== */}
      <section className="pdp-faq" style={{ color: C }}>
        <Reveal as="span" className="pdp-faq__eyebrow">Good to know</Reveal>
        <Reveal as="h2" v={riseBig} className="pdp-faq__head">Questions, answered.</Reveal>
        <div className="pdp-faq__list">
          {FAQS.map((f, i) => {
            const open = openFaq === i
            return (
              <div key={f.q} className={`pdp-faq__item ${open ? 'is-open' : ''}`}>
                <button
                  className="pdp-faq__q"
                  type="button"
                  onClick={() => setOpenFaq(open ? -1 : i)}
                  aria-expanded={open}
                >
                  <span>{f.q}</span>
                  <span className="pdp-faq__sign">{open ? '−' : '+'}</span>
                </button>
                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div
                      className="pdp-faq__a-wrap"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <p className="pdp-faq__a">{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </section>

      {/* ===== REVIEWS ===== */}
      <section className="pdp-reviews" style={{ color: C }}>
        <Reveal as="h2" v={riseBig} className="pdp-reviews__head">People are talking taste.</Reveal>
        <Reveal as="p" className="pdp-reviews__sub">★ 4.9 / 5 · 1,204 reviews · 98% would recommend</Reveal>
        <motion.div
          className="pdp-reviews__grid"
          variants={stagger(0.08)}
          initial="hidden"
          whileInView="show"
          viewport={inView}
        >
          {REVIEWS.map((rv) => (
            <motion.div key={rv.who} className="pdp-review" variants={fadeUp}>
              <span className="pdp-stars pdp-stars--sm">★★★★★</span>
              <p className="pdp-review__quote serif">"{rv.quote}"</p>
              <span className="pdp-review__who">{rv.who}</span>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </Page>
  )
}
