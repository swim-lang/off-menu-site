import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Page from '../components/Page'
import Reveal from '../components/Reveal'
import Ill from '../components/Ill'
import Seal from '../components/Seal'
import Testimonials from '../components/Testimonials'
import { fadeUp, riseBig, stagger, stickerPop, inView } from '../lib/motion'
import { playBell, playScribble } from '../lib/sfx'
import './Home.css'

const C = '#C11209'

const TICKER = [
  ['apple', 'Daily Fiber'], ['grape', 'Eat Your Chew'], ['strawberry', 'From The Kitchen'],
  ['Cherry', 'Re-Plated'], ['watermelon', 'Chew On This'], ['carrot', 'Good For Your Gut'],
]

const PRODUCTS = [
  { img: 'raw/3.png', kicker: 'Tart', q: 'Apple', name: 'Concord Verjus Grape', note: 'Crisp apple, ume, a little ginger.' },
  { img: 'raw/2.png', kicker: 'Bright', q: 'Blueberry', name: 'Cherry Cola Spice', note: 'Wild blueberry, Meyer lemon.' },
  { img: 'raw/1.png', kicker: 'Cozy', q: 'Pear', name: 'Strawberry Fig Leaf', note: 'Soft pear, warm cardamom.' },
]

const MYTHS = [
  { m: '“Fiber is for old people.”', r: "Most adults aren't getting enough fiber. It affects digestion, energy, fullness, gut health, and how you feel every day — not just when you're older." },
  { m: '“I eat pretty healthy, so I\'m probably getting enough.”', r: "Most people fall short of their daily fiber goal, even when they're eating well." },
  { m: '“Fiber supplements are gross.”', r: "We're with you. That's why we made one that doesn't taste like punishment." },
  { m: '“I\'ll just eat more vegetables.”', r: "You should. But let's be honest — you probably won't eat enough every single day. That's where we come in." },
  { m: '“Fiber will make me bloated.”', r: "A lack of fiber can be part of the problem. Consistent daily fiber helps support a healthier digestive routine." },
  { m: '“All fiber is the same.”', r: "Different fibers do different jobs — a steady daily habit supports digestion, fullness, and regularity in ways a one-off snack can't." },
]

const FIBER101 = [
  { t: 'Soluble + insoluble', ill: 'Whisk', b: 'Two kinds of fiber, two jobs. Soluble fiber slows digestion and helps you feel full; insoluble fiber adds bulk and keeps things moving.' },
  { t: 'Prebiotic fiber', ill: 'spinach', b: 'Some fibers act as prebiotics — food for the good bacteria in your gut microbiome, the crew behind smooth digestion.' },
  { t: 'Regular, less bloated', ill: 'Walking', b: 'A steady fiber habit supports regularity and a calmer gut, so fewer days feel stuck, sluggish, or bloated.' },
  { t: 'Full and steady', ill: 'apple', b: 'Fiber slows how fast you digest, so you stay full longer and your energy holds steadier between meals.' },
]

const FACTS = [
  { l: 'Fact 01 · Gut health', t: 'Your gut is home to about 100 trillion microbes — more than there are stars in the Milky Way.' },
  { l: 'Fact 02 · Immunity', t: 'Roughly 70% of your immune system lives in your gut.' },
  { l: 'Fact 03 · Mood', t: "Your gut makes about 95% of your body's serotonin — the feel-good chemical." },
  { l: 'Fact 04 · The gap', t: 'Most adults get only half the fiber they actually need each day.' },
  { l: 'Fact 05 · Fuel', t: "Fiber feeds your good gut bacteria — they're the real chefs down there." },
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
          <span className="card__kicker">30 CT</span>
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
  const f = FACTS[fi]

  return (
    <Page page="home">
      {/* HERO */}
      <section className="hero" style={{ color: C }}>
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
      <div className="ticker" style={{ '--c': C, color: C }}>
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

      {/* SOUND FAMILIAR — lead-in */}
      <section className="lead" style={{ '--c': C, color: C }}>
        <div className="lead__text">
          <Reveal as="span" className="lead__eyebrow">Sound familiar?</Reveal>
          <Reveal as="h2" v={riseBig} className="lead__head">Bloated, sluggish, kitchen backed up?</Reveal>
          <Reveal as="p" className="lead__body">
            It often comes back to one quiet culprit: fiber. Most of us get nowhere near enough, and our bodies keep
            the receipts — bloating after meals, digestion that feels stuck one day and frantic the next, and energy
            that dips when it shouldn't.
          </Reveal>
          <Reveal as="p" className="lead__body">
            Fiber is what keeps your gut moving, fed, and balanced. The fix isn't a dramatic cleanse or a daily
            chore — it's a little more fiber, consistently, woven into an ordinary day.
          </Reveal>
          <Reveal as="p" className="lead__kicker serif">Small habit. Calmer gut.</Reveal>
        </div>
        <motion.div className="lead__art" variants={stickerPop} initial="hidden" whileInView="show" viewport={inView} custom={-4}>
          <Ill src="Illustrations/Walking.svg" w={460} h={460} />
        </motion.div>
      </section>

      {/* INTRO — vintage menu card */}
      <section className="intro" style={{ '--c': C, color: C }}>
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
          <h2 className="intro__head">A better way to take fiber.</h2>
          <div className="intro__rule"><span className="intro__rule-dot" /></div>
          <p className="intro__body">Most fiber supplements ask you to tolerate them. Powders. Scoops. Chalky citrus. Giant tubs with no respect for your counter space.</p>
          <p className="intro__body">Off Menu starts with the thing your body actually needs — and treats it like something worth tasting.</p>
        </motion.div>
      </section>

      {/* PRODUCTS */}
      <section id="products" className="products" style={{ '--c': C, color: C }}>
        <Reveal as="div" className="products__head">
          <img className="products__title" src="raw/pick-your-chew.svg" alt="Pick your chew" />
          <span className="eyebrow">The lineup · daily fiber chews</span>
        </Reveal>
        {[0, 1].map((row) => (
          <motion.div className="products__row" key={row} variants={stagger(0.1)} initial="hidden" whileInView="show" viewport={inView}>
            {PRODUCTS.map((p) => <Card key={p.name + row} p={p} />)}
          </motion.div>
        ))}
        <Reveal><Link className="products__shop" to="/shop">Shop all 10 flavors →</Link></Reveal>
      </section>

      {/* SAMPLER */}
      <section className="sampler" style={{ color: C }}>
        <img className="sampler__bg" src="raw/section1-hounds.svg" alt="" />
        <div className="sampler__copy">
          <img className="sampler__title" src="raw/sampler-title.svg" alt="The sampler box" />
          <div className="sampler__card">All ten flavors, one box. The chef's orders — taste the whole menu before you commit.</div>
          <a className="sampler__btn">Shop the sampler</a>
        </div>
        <div className="sampler__photo"><img src="raw/sampler-photo.png" alt="Holding Off Menu chews" /></div>
      </section>

      {/* WHY FIBER */}
      <section className="why" style={{ color: C }}>
        <Reveal as="h2" v={riseBig} className="why__head">Not your grandma's fiber</Reveal>
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
      <section className="f101" style={{ color: C }}>
        <Reveal as="span" className="f101__eyebrow">Fiber 101</Reveal>
        <Reveal as="h2" v={riseBig} className="f101__head">What good fiber actually does.</Reveal>
        <Reveal as="p" className="f101__intro">
          Fiber is the part of plants your body can't fully break down — and that's exactly the point.
          It's what keeps digestion moving, feeds your gut, and helps you feel full. Here's the quick version.
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
      <section className="story">
        <img className="story__bg" src="raw/story.jpg" alt="" />
        <div className="story__scrim" />
        <Reveal as="h2" className="story__head">Made by people who take fiber very seriously.</Reveal>
        <a className="story__btn">Learn more about us</a>
        <motion.div className="story__card" initial={{ opacity: 0, y: 20, rotate: 10 }} whileInView={{ opacity: 1, y: 0, rotate: 10 }} viewport={inView} transition={{ duration: 0.5 }}>
          <span className="story__card-lbl"><span className="story__dot" /> Now serving fiber from</span>
          <span className="story__card-serif serif">Real fruit &amp; botanicals</span>
          <div className="story__card-rule" />
          <div className="story__card-fine"><span>Made Fresh</span><span>In Small Batches</span></div>
        </motion.div>
        <Seal className="story__seal story__seal--1" shape="burst" size={124} rotate={-9} label="Chef-led" color="#C11209" />
      </section>

      {/* FUN FACTS */}
      <section className="facts" style={{ color: C }}>
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

      {/* VIDEO TESTIMONIALS */}
      <Testimonials color={C} />

      {/* CTA */}
      <section className="cta" style={{ '--c': C, color: C }}>
        <div className="cta__hounds" style={{ backgroundImage: 'url(Pattern/_paper/PatternNEW-c11209.svg)' }} />
        <div className="cta__body">
          <Reveal as="span" className="cta__pill u-skew">★ Chef's orders</Reveal>
          <Reveal v={riseBig}><img className="cta__head-img" src="raw/get-yours-today.svg" alt="Get yours today" /></Reveal>
          <Reveal as="p" className="cta__sub">Join the list for the launch, early flavors, and the occasional chef's note.</Reveal>
          <Reveal as="form" className="cta__form" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="you@email.com" aria-label="Email" />
            <button className="btn" type="submit">Get on the list</button>
          </Reveal>
        </div>
        <div className="cta__hounds" style={{ backgroundImage: 'url(Pattern/_paper/PatternNEW-c11209.svg)' }} />
      </section>
    </Page>
  )
}
