import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Page from '../components/Page'
import Reveal from '../components/Reveal'
import Ill from '../components/Ill'
import Seal from '../components/Seal'
import Testimonials from '../components/Testimonials'
import CtaSignup from '../components/CtaSignup'
import { fadeUp, riseBig, stagger, stickerPop, inView } from '../lib/motion'
import { playBell, playScribble, playPencil } from '../lib/sfx'
import './Home.css'

const C = '#C11209'

const TICKER = [
  ['apple', 'Daily fiber'], ['grape', '2g per serving'], ['Cherry', 'Soft chews'],
  ['strawberry', 'Chef-inspired flavor'], ['watermelon', 'No powder'], ['carrot', 'Good for your gut'],
]

const PRODUCTS = [
  { img: 'raw/3.png', kicker: 'Tart', q: 'Apple', name: 'Apple Ume Ginger', note: 'Bright apple, tart ume, a little ginger warmth.' },
  { img: 'raw/2.png', kicker: 'Bold', q: 'Cola', name: 'Cherry Cola Spice', note: 'Dark cherry, nostalgic cola, warm spice.' },
  { img: 'raw/1.png', kicker: 'Bright', q: 'Strawberry', name: 'Strawberry Fig Leaf', note: 'Ripe strawberry, green fig leaf, soft almond.' },
]

// The single flavor the client is launching with (matches the product page + shop).
const LAUNCH = { img: 'raw/new-bag.png', kicker: 'Punchy', q: 'Grape', name: 'Concord Grape Verjus', note: 'Concord grape, tart verjus.' }

const QUALIFIERS = [
  'Feel bloated after meals',
  'Know they need more fiber but hate powder',
  'Want a daily habit that does not feel like homework',
  'Prefer flavor over chalky obligation',
  'Want something easy to keep on the counter, in a bag, or at work',
]

// Slower, gentler row entrance than the shared fadeUp.
const rowRise = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
}

const MYTHS = [
  { m: '“Fiber is no big deal.”', r: "Most adults aren't getting enough fiber. It affects digestion, energy, fullness, gut health, and how you feel every day, not just when you're older." },
  { m: '“I eat pretty healthy, so I\'m probably getting enough.”', r: "Most people fall short of their daily fiber goal, even when they're eating well." },
  { m: '“Fiber supplements are gross.”', r: "We're with you. That's why we made one that doesn't taste like punishment." },
  { m: '“I\'ll just eat more vegetables.”', r: "You should. But let's be honest, you probably won't eat enough every single day. That's where a small daily fiber habit can help." },
  { m: '“Fiber will make me bloated.”', r: "A lack of fiber can be part of the problem. Consistent daily fiber helps support a healthier digestive routine." },
  { m: '“All fiber is the same.”', r: "Different fibers do different jobs. A steady daily habit can support digestion, fullness, and regularity over time." },
]

const FIBER101 = [
  { t: 'Soluble + insoluble', ill: 'Whisk', b: 'Two kinds of fiber, two jobs. Soluble fiber can help slow digestion and support fullness. Insoluble fiber adds bulk and helps keep things moving.' },
  { t: 'Prebiotic fiber', ill: 'spinach', b: 'Some fibers act as prebiotics, meaning they help feed the good bacteria in your gut microbiome.' },
  { t: 'Regular, less bloated', ill: 'Walking', b: 'A steady fiber habit can support regularity and a calmer digestive routine, so fewer days feel stuck, sluggish, or bloated.' },
  { t: 'Full and steady', ill: 'apple', b: 'Fiber can help you feel full longer, which is one reason it belongs in the everyday wellness conversation.' },
]

const FACTS = [
  { l: 'Fact 01 · Gut health', t: 'Your gut is home to about 100 trillion microbes, more than there are stars in the Milky Way.' },
  { l: 'Fact 02 · Immunity', t: 'Roughly 70% of your immune system lives in your gut.' },
  { l: 'Fact 03 · Mood', t: "Your gut makes about 95% of your body's serotonin, the feel-good chemical." },
  { l: 'Fact 04 · The gap', t: 'Most adults get only half the fiber they actually need each day.' },
  { l: 'Fact 05 · Fuel', t: "Fiber feeds your good gut bacteria. They're the real chefs down there." },
]
const FACT_ROT = [-2, 2.5, -3.5, 1.5, -1] // playful: each fact card sits at a different skew

function Card({ p }) {
  return (
    <motion.div className="card" variants={fadeUp} whileHover={{ y: -8 }}>
      <Link to="/product" className="card__link" aria-label={p.name}>
        <div className="card__photo"><img src={p.img} alt={p.name} /></div>
        <div className="card__meta">
          <span className="card__kicker">{p.kicker}</span>
          <span className="card__q serif">“{p.q}”</span>
          <span className="card__kicker">60 CT</span>
        </div>
        <div className="card__name serif">{p.name}</div>
        <div className="card__note">{p.note}</div>
      </Link>
    </motion.div>
  )
}

const MYTH_ROT = [-3, 2.4, -2.2, 3, -2.6, 2]
const REAL_ROT = [2.6, -2.2, 3, -2.6, 2, -3]
function MythRow({ pair, i }) {
  return (
    <Reveal className="why__pair">
      <div className="why__cell why__cell--myth">
        <div className="why__sticker why__sticker--myth" onMouseEnter={playScribble} style={{ transform: `rotate(${MYTH_ROT[i % MYTH_ROT.length]}deg)` }}>
          <span className="why__myth-q serif">{pair.m}</span>
        </div>
      </div>
      <div className="why__cell why__cell--real">
        <div className="why__sticker why__sticker--real" onMouseEnter={playScribble} style={{ transform: `rotate(${REAL_ROT[i % REAL_ROT.length]}deg)` }}>
          <p className="why__real-t">{pair.r}</p>
        </div>
      </div>
      <svg className="why__connector" viewBox="0 0 1000 120" preserveAspectRatio="none" aria-hidden="true"
        style={{ transform: i % 2 === 1 ? 'scaleY(-1)' : undefined }}>
        <path d="M 320 62 C 400 26, 458 26, 494 52 C 522 71, 502 98, 479 83 C 456 68, 494 42, 532 58 C 582 78, 612 64, 680 56" />
      </svg>
    </Reveal>
  )
}

export default function Home() {
  const [fi, setFi] = useState(0)
  const [checked, setChecked] = useState(() => new Set())
  const f = FACTS[fi]

  // Hover a box to check it off — a quick pencil scribble tick. Persists once
  // checked so the finished guest check reads like a filled-in order.
  const check = (i) => {
    if (checked.has(i)) return
    playPencil()
    setChecked((prev) => new Set(prev).add(i))
  }

  return (
    <Page page="home">
      {/* HERO */}
      <section data-review-id="home-hero" className="hero" style={{ color: C }}>
        <video className="hero__vid" src="Video/8626671-uhd_3840_2160_25fps.mp4" poster="raw/poster.jpg" autoPlay loop muted playsInline />
        <motion.img className="hero__tag" src="raw/Header-Tagline-rwhite.svg" alt="Fiber, re-plated"
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }} />
        <div className="hero__circle"><Seal shape="burst" size={140} rotate={0} label="New drop" color={C} /></div>
        <motion.div className="hero__stickers" initial="hidden" animate="show" variants={stagger(0.12, 0.3)}>
          <motion.span className="hero__sticker" variants={stickerPop} custom={-5}>Chef-led flavor</motion.span>
        </motion.div>
        <motion.div className="hero__cta-group"
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18, duration: 0.6 }}>
          <div className="hero__btns">
            <a className="hero__btn hero__btn--primary" href="#products">Order the chews →</a>
            <a className="hero__btn" href="/#/how-it-works">See how it works →</a>
          </div>
        </motion.div>
      </section>

      {/* TICKER */}
      <div data-review-id="home-ticker" className="ticker" style={{ '--c': C, color: C }}>
        <div className="ticker__track">
          {[0, 1].map((dup) => (
            <div className="ticker__group" key={dup} aria-hidden={dup === 1}>
              {TICKER.map(([ic, txt], i) => (
                <span className="ticker__item" key={i}>
                  <Ill src={`Illustrations/_red/${ic}.svg`} w={30} h={30} /><span className="ticker__txt">{txt}</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* PRODUCTS */}
      <section id="products" data-review-id="home-products" className="products" style={{ '--c': C, color: C }}>
        <Reveal as="div" className="products__head">
          <img className="products__title" src="raw/get-yours-today.svg" alt="Get yours today" />
          <span className="eyebrow">Daily fiber chews</span>
        </Reveal>
        <motion.div className="products__row products__row--single" variants={stagger(0.1)} initial="hidden" whileInView="show" viewport={inView}>
          <Card p={LAUNCH} />
        </motion.div>
      </section>

      {/* SOUND FAMILIAR — lead-in */}
      <section data-review-id="home-lead" className="lead" style={{ '--c': C, color: C }}>
        <div className="lead__text">
          <Reveal as="span" className="lead__eyebrow">Sound familiar?</Reveal>
          <Reveal as="h2" v={riseBig} className="lead__head">Ever feel fine in the morning, then weirdly puffy by lunch?</Reveal>
          <Reveal as="p" className="lead__body">
            We have all tried to solve that heavy, bloated feeling with more water, cleaner meals, another green
            thing, or just pretending our jeans did not fit differently two hours ago.
          </Reveal>
          <Reveal as="p" className="lead__body">
            Sometimes the simple answer is the one we overlook. A little more fiber, taken consistently, can help
            support digestion, regularity, fullness, and the daily rhythm of how you feel after eating.
          </Reveal>
          <Reveal as="p" className="lead__kicker serif">Small habit. Less bloat.</Reveal>
        </div>
        <motion.div className="lead__art" variants={stickerPop} initial="hidden" whileInView="show" viewport={inView} custom={-4}>
          <Ill src="Illustrations/Walking.svg" w={460} h={460} />
        </motion.div>
      </section>

      {/* INTRO — vintage menu card */}
      <section data-review-id="home-intro" className="intro" style={{ '--c': C, color: C }}>
        <motion.div
          className="intro__menu"
          variants={stickerPop}
          initial="hidden"
          whileInView="show"
          viewport={inView}
          custom={-1}
        >
          <span className="intro__crest serif">✶ Daily Fiber · Est. in the kitchen ✶</span>
          <span className="intro__eyebrow">Why Off Menu</span>
          <h2 className="intro__head">No scoop. No shaker. Just chew.</h2>
          <div className="intro__rule"><span className="intro__rule-dot" /></div>
          <p className="intro__body">Most fiber supplements make the habit feel like work. Powders, scoops, chalky citrus, and giant tubs with no respect for your counter space.</p>
          <p className="intro__body">Off Menu takes a simpler route: a soft chew with 2g fiber per serving and chef-inspired flavor, made to feel less like a chore and more like something you might actually remember.</p>
        </motion.div>
      </section>

      {/* MADE FOR PEOPLE WHO — guest check */}
      <section data-review-id="home-guest-check" className="foryou" style={{ '--c': C, color: C }}>
        <div className="foryou__inner">
          <div className="foryou__left">
            <Reveal as="span" className="foryou__eyebrow">Who it's for</Reveal>
            <Reveal as="h2" v={riseBig} className="foryou__head">Made for<br />people <em>who…</em></Reveal>
            <Reveal as="p" className="foryou__support">No two guts are the same. But if any of these sound like you, pull up a stool. You're in the right place.</Reveal>
            <Reveal><span className="foryou__sticker">★ Table for one? Perfect.</span></Reveal>
          </div>

          <motion.div className="foryou__ticket"
            initial={{ opacity: 0, y: 28, rotate: 2.5 }}
            whileInView={{ opacity: 1, y: 0, rotate: 2.5 }}
            viewport={inView}
            whileHover={{ y: -5, rotate: 3.4 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="foryou__tk-head">
              <div className="foryou__tk-row">
                <span className="foryou__tk-title">Guest Check</span>
                <span className="foryou__tk-table">Table · You</span>
              </div>
              <span className="foryou__tk-sub">Off Menu · Daily Fiber · Order No. 010</span>
            </div>
            <div className="foryou__tear" />
            <motion.div className="foryou__tk-rows"
              variants={stagger(0.28, 0.3)} initial="hidden" whileInView="show" viewport={inView}>
              {QUALIFIERS.map((q, i) => (
                <motion.div
                  className={`foryou__crow ${checked.has(i) ? 'is-checked' : ''}`}
                  key={q}
                  variants={rowRise}
                  onMouseEnter={() => check(i)}
                >
                  <span className="foryou__box">
                    <svg className="foryou__check" viewBox="0 0 40 40" fill="none" aria-hidden="true">
                      <path pathLength="1" d="M5 21 C 7.5 24, 10 27.5, 14 32.5 C 22 19, 33 5, 50 -9" strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <span className="foryou__ctext">{q}</span>
                </motion.div>
              ))}
            </motion.div>
            <div className="foryou__tear" />
            <div className="foryou__tk-foot">
              <div className="foryou__total-row">
                <span className="foryou__total-l">Total</span>
                <span className="foryou__total-r">2 daily chews</span>
              </div>
              <span className="foryou__foot-note">Checked even one box? Consider that a yes. This one's for you.</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* VIDEO TESTIMONIALS */}
      <Testimonials color={C} reviewId="home-testimonials" />

      {/* WHY FIBER */}
      <section data-review-id="home-myths" className="why" style={{ color: C }}>
        <div className="why__top">
          <Reveal as="h2" v={riseBig} className="why__head">Not your grandma's fiber</Reveal>
          <Reveal className="why__stat">
            <span className="why__stat-num">95%</span>
            <span className="why__stat-lead">of people don't get enough fiber.</span>
            <span className="why__stat-sub">Most already know they should get more. Off Menu just makes it a chew you'll actually look forward to.</span>
          </Reveal>
        </div>
        <div className="why__cols">
          <div className="why__divider" />
          <div className="why__track">
            <div className="why__mark-circle"><Ill src="Logo/Mark.svg" w={92} h={92} /></div>
          </div>
          <div className="why__mr">
            <div className="why__pair why__pair--head">
              <div className="why__cell why__cell--myth">
                <span className="why__kicker serif">They say</span>
                <span className="why__col-title">Myth</span>
                <span className="why__thumb"><Ill src="Illustrations/thumb.svg" w={26} h={26} style={{ transform: 'rotate(180deg)' }} /></span>
              </div>
              <div className="why__cell why__cell--real">
                <span className="why__kicker serif">The truth</span>
                <span className="why__col-title">Reality</span>
                <span className="why__thumb"><Ill src="Illustrations/thumb.svg" w={26} h={26} /></span>
              </div>
            </div>
            {MYTHS.map((pair, i) => <MythRow pair={pair} i={i} key={i} />)}
          </div>
        </div>
      </section>

      {/* FIBER 101 */}
      <section data-review-id="home-fiber101" className="f101" style={{ color: C }}>
        <Reveal as="span" className="f101__eyebrow">Fiber 101</Reveal>
        <Reveal as="h2" v={riseBig} className="f101__head">What good fiber actually does.</Reveal>
        <Reveal as="p" className="f101__intro">
          Fiber is the part of plants that keeps working as it moves through your system, and that's exactly the point.
          It helps keep digestion moving, feeds your gut, and supports fullness. Here's the quick version.
        </Reveal>
        <motion.div className="f101__grid" variants={stagger(0.08)} initial="hidden" whileInView="show" viewport={inView}>
          {FIBER101.map((c, i) => (
            <motion.div
              className="f101__card"
              key={c.t}
              variants={fadeUp}
              onMouseEnter={playBell}
              whileHover={{ y: -8 }}
            >
              <div className="f101__top">
                <span className="f101__badge"><Ill src={`Illustrations/${c.ill}.svg`} w={40} h={40} /></span>
                <span className="f101__num serif">{String(i + 1).padStart(2, '0')}</span>
              </div>
              <span className="f101__term">{c.t}</span>
              <p className="f101__body">{c.b}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* STORY */}
      <section data-review-id="home-story" className="story">
        <img className="story__bg" src="raw/story.jpg" alt="" />
        <div className="story__scrim" />
        <Reveal as="h2" className="story__head">The story behind the chew.</Reveal>
        <Link className="story__btn" to="/about">Learn more about us</Link>
        <motion.div className="story__card" initial={{ opacity: 0, y: 20, rotate: 10 }} whileInView={{ opacity: 1, y: 0, rotate: 10 }} viewport={inView} transition={{ duration: 0.5 }}>
          <span className="story__card-lbl"><span className="story__dot" /> Now serving fiber from</span>
          <span className="story__card-serif serif">Chef-inspired flavors</span>
          <div className="story__card-rule" />
          <div className="story__card-fine"><span>Daily Fiber</span><span>Soft Chews</span></div>
        </motion.div>
        <Seal className="story__seal story__seal--1" shape="burst" size={124} rotate={-9} label="Chef-led" color="#C11209" />
      </section>

      {/* FUN FACTS */}
      <section data-review-id="home-fun-facts" className="facts" style={{ color: C }}>
        <div className="facts__grid">
          <Reveal className="facts__art"><img src="raw/chef-fun-facts.svg" alt="" style={{ width: 300, height: 'auto' }} /></Reveal>
          <div className="facts__module">
            <span className="facts__kicker serif">Did you know?</span>
            <h2 className="facts__head">Chef Chewy's<br />Fun Facts</h2>
            <motion.div className="facts__card" key={fi} style={{ transform: `rotate(${FACT_ROT[fi]}deg)` }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
              <span className="facts__label">{f.l}</span>
              <span className="facts__text serif">{f.t}</span>
            </motion.div>
            <div className="facts__controls">
              <button className="facts__arrow" onClick={() => setFi((fi - 1 + FACTS.length) % FACTS.length)} aria-label="Previous fact">←</button>
              <button className="facts__arrow" onClick={() => setFi((fi + 1) % FACTS.length)} aria-label="Next fact">→</button>
              <span className="facts__counter">{String(fi + 1).padStart(2, '0')} / {String(FACTS.length).padStart(2, '0')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <CtaSignup color={C} reviewId="home-cta" />
    </Page>
  )
}
