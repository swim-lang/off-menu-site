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
  once: { label: 'One-time', sub: '60 chews · one bag', price: 24, badge: null },
  sub: { label: 'Subscribe & save', sub: 'Ships monthly · skip or cancel anytime', price: 20, badge: 'Save 15%' },
}

const BULLETS = [
  'Secure checkout',
  'Ships in 3–5 business days',
  '60 daily chews',
  'Skip or cancel anytime',
  'Questions? support@offmenu.com',
]

const FORYOU = [
  'You feel bloated, sluggish, or off after meals',
  'You want more fiber but hate powders',
  'You want something easier than mixing, measuring, or remembering another capsule',
  'You care about taste as much as the habit',
  'You want a small daily step that is easy to repeat',
]

const SCIENCE = [
  { t: 'Digestion and regularity', b: 'Fiber helps support the daily rhythm of digestion, so things feel less stuck and more consistent.' },
  { t: 'A fed gut microbiome', b: 'Some fibers act as food for the good bacteria in your gut, which is one reason fiber keeps showing up in the gut health conversation.' },
  { t: 'Fullness and appetite', b: 'Fiber can help you feel fuller, which makes it a useful part of a daily routine instead of another random supplement.' },
  { t: 'Steadier days', b: 'Fiber helps slow digestion, which can support a steadier feeling between meals.' },
  { t: 'The long game', b: 'Fiber is not flashy. It is foundational, which is exactly why it deserves a better format.' },
]

const RELATED = [
  { img: 'raw/3.png', tag: 'Punchy', quote: '“Grape”', name: 'Concord Verjus Grape', note: 'Concord grape, a little verjus.' },
  { img: 'raw/2.png', tag: 'Bold', quote: '“Cola”', name: 'Cherry Cola Spice', note: 'Cherry cola, a little spice.' },
  { img: 'raw/1.png', tag: 'Bright', quote: '“Strawberry”', name: 'Strawberry Fig Leaf', note: 'Strawberry, fig leaf, almond.' },
]

const REVIEWS = [
  { quote: 'The first fiber I have ever wanted to eat. The grape one is genuinely dangerous.', who: 'Dana R.' },
  { quote: 'I finally stopped pretending I was going to use the powder.', who: 'Marcus L.' },
  { quote: 'Tastes like something I would buy for the flavor first. The fiber is the win.', who: 'Priya N.' },
]

const FAQS = [
  {
    q: 'What is it?',
    a: 'Off Menu Daily Fiber is a soft chew supplement with 2g fiber per serving, made to help support digestive health, regularity, and fullness as part of your daily routine.',
  },
  { q: 'How do I take it?', a: 'Take one chew daily. No scoop, no shaker, no mixing. Just unwrap and eat.' },
  { q: 'When should I take it?', a: 'Any time that fits your routine. A lot of people pair it with breakfast, lunch, or an evening wind-down.' },
  { q: 'What does it taste like?', a: 'Concord grape with a little verjus. It is chef-developed for real flavor, not that chalky supplement thing.' },
  { q: 'Is this a candy?', a: 'No. It is a fiber supplement that happens to taste good.' },
]

export default function Product() {
  const [plan, setPlan] = useState('sub')
  const [openFaq, setOpenFaq] = useState(0)
  const [lesson, setLesson] = useState(0)
  const price = PLANS[plan].price

  return (
    <Page page="product">
      {/* ===== HERO / BUY BOX ===== */}
      <section data-review-id="product-buybox" className="pdp-hero" style={{ color: C }}>
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
            A chef-inspired soft chew with 2g fiber for the days your gut feels bloated, sluggish, or just a little
            off. Less powder routine. More small daily habit you can actually stick with.
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

          {plan === 'sub' && (
            <p className="pdp-subnote">
              <strong>Make it the usual.</strong> Fiber works best when it becomes part of your routine. Subscribe so the chews keep showing up before you have to think about it.
            </p>
          )}

          <motion.button
            className="pdp-cart"
            type="button"
            whileTap={{ y: 7, boxShadow: `0 0 0 ${C}` }}
          >
            Add to cart · ${price}
          </motion.button>

          <Reveal as="ul" className="pdp-bullets">
            {BULLETS.map((b) => {
              const at = b.indexOf('@')
              if (at === -1) return <li key={b} className="pdp-bullet"><span className="pdp-dot" />{b}</li>
              const sp = b.lastIndexOf(' ', at)
              const label = b.slice(0, sp + 1)
              const email = b.slice(sp + 1)
              return (
                <li key={b} className="pdp-bullet">
                  <span className="pdp-dot" />{label}
                  <a className="pdp-bullet__email" href={`mailto:${email}`}>{email}</a>
                </li>
              )
            })}
          </Reveal>
        </div>
      </section>

      {/* ===== "FOR YOU IF" TICKER ===== */}
      <section data-review-id="product-ticker" className="pdp-ticker" aria-label="This chew is for you if…">
        <div className="pdp-ticker__track">
          {[0, 1].map((dup) => (
            <div className="pdp-ticker__group" key={dup} aria-hidden={dup === 1}>
              <span className="pdp-ticker__cell pdp-ticker__cell--lead">
                <span className="pdp-ticker__star" aria-hidden="true">✦</span>
                <span className="pdp-ticker__lead serif">This chew is for you if…</span>
              </span>
              {FORYOU.map((t, i) => (
                <span className="pdp-ticker__cell" key={i}>
                  <span className="pdp-ticker__star" aria-hidden="true">✦</span>
                  <span className="pdp-ticker__txt">{t}</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ===== THE SCIENCE — class with Chef Chewy ===== */}
      <section data-review-id="product-science" className="pdp-science" style={{ color: C }}>
        <div className="pdp-science__inner">
          <div className="pdp-science__head-wrap">
            <Reveal as="span" className="pdp-science__eyebrow">Fiber class with Chef Chewy</Reveal>
            <Reveal as="h2" v={riseBig} className="pdp-science__head">Fiber, demystified.</Reveal>
            <Reveal as="p" className="pdp-science__intro">
              Fiber is one of those simple things that can make a real difference when you take it consistently. Most
              of us do not get enough, and that can show up as bloating, sluggish digestion, and feeling off after meals.
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
                <p className="pdp-science__bubble-text">Pull up a stool. We'll keep this simple.</p>
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

        <Reveal className="pdp-honest">
          <h3 className="pdp-honest__title serif">A small daily fiber habit.</h3>
          <p className="pdp-honest__body">
            Each chew adds 2g fiber to your day. It's not here to replace fruits, vegetables, grains, nuts, or seeds. It's here to make getting a little more fiber feel easier, better-tasting, and more repeatable.
          </p>
        </Reveal>
      </section>

      {/* ===== MADE FOR YOUR GUT ===== */}
      <section data-review-id="product-made" className="pdp-made" style={{ color: C }}>
        <div className="pdp-made__inner">
          <div className="pdp-made__text">
            <Reveal as="h2" v={riseBig} className="pdp-made__head">Made for the days you feel off.</Reveal>
            <Reveal as="p" className="pdp-made__body">
              Bloating, sluggish digestion, and that heavy after-meal feeling are easy to ignore until they become
              part of your routine. Off Menu makes fiber easier to work into the day with chef-inspired flavor, a
              soft chew format, and none of the powder drama.
            </Reveal>
            <Reveal as="p" className="pdp-made__serif serif">A little easier on the gut. A lot easier to take.</Reveal>
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
      <section data-review-id="product-related" className="pdp-related" style={{ color: C }}>
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
                <span className="pdp-card__ct">60 CT</span>
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
      <Testimonials color={C} reviewId="product-testimonials" />

      {/* ===== PRODUCT FAQ ===== */}
      <section data-review-id="product-faq" className="pdp-faq" style={{ color: C }}>
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
      <section data-review-id="product-reviews" className="pdp-reviews" style={{ color: C }}>
        <Reveal as="h2" v={riseBig} className="pdp-reviews__head">Early notes on taste.</Reveal>
        <Reveal as="p" className="pdp-reviews__sub">First-batch feedback from people who tried the chew.</Reveal>
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
