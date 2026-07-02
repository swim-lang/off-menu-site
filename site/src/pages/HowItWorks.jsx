import { motion } from 'framer-motion'
import Page from '../components/Page'
import Reveal from '../components/Reveal'
import Ill from '../components/Ill'
import { fadeUp, riseBig, inView } from '../lib/motion'
import { playBellHit } from '../lib/sfx'
import './HowItWorks.css'

const C = '#C42E6A'

// Every step plays the recorded bell hit on hover.
const STEP_SOUNDS = [playBellHit, playBellHit, playBellHit]

const STEPS = [
  { n: '01', kicker: 'Step', title: 'Take one chew daily.', body: 'No mixing, no measuring, no orange dust on your counter. Just unwrap, chew, and move on with your day.', ill: 'apple' },
  { n: '02', kicker: 'Step', title: 'Add a little fiber.', body: 'Each serving gives you 2g fiber to help support digestive health, regularity, and fullness as part of your daily routine.', ill: 'spinach' },
  { n: '03', kicker: 'Step', title: 'Come back tomorrow.', body: 'That is the whole point. A supplement does not matter much if you hate taking it, so we made fiber easier to repeat.', ill: 'grape' },
]

function Step({ s, i }) {
  return (
    <motion.div className="hiw-step" variants={fadeUp} initial="hidden" whileInView="show" viewport={inView} whileHover={{ y: -8 }} onMouseEnter={() => STEP_SOUNDS[i % STEP_SOUNDS.length]()}>
      <span className="hiw-kicker">{s.kicker}</span>
      <motion.span
        className="hiw-num"
        initial={{ opacity: 0, y: 46, scale: 0.55 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={inView}
        transition={{ type: 'spring', stiffness: 240, damping: 15, delay: i * 0.08 }}
      >
        {s.n}
      </motion.span>
      <Ill className="hiw-step__ill" src={`Illustrations/_red/${s.ill}.svg`} w={98} h={114} />
      <h3 className="hiw-step__title">{s.title}</h3>
      <p className="hiw-step__body">{s.body}</p>
    </motion.div>
  )
}

export default function HowItWorks() {
  return (
    <Page page="howitworks">
      {/* HERO */}
      <section data-review-id="howitworks-hero" className="hiw-hero" style={{ color: C }}>
        <Reveal v={riseBig}><img className="hiw-hero__lockup" src="raw/one-chew-lockup.svg" alt="One chew. Daily fiber." /></Reveal>
        <Reveal v={fadeUp}><img className="hiw-hero__whisk" src="raw/chef-whisk.svg" alt="" /></Reveal>
        <Reveal as="h1" v={riseBig} className="hiw-hero__head">Better odds you'll actually take it.</Reveal>
        <Reveal as="p" className="hiw-hero__sub">Fiber works best when it becomes a habit. So we made the habit easier, softer, and a lot more enjoyable to taste. Three small moves, on repeat.</Reveal>
      </section>

      {/* ROUTE */}
      <section data-review-id="howitworks-steps" className="hiw-route" style={{ color: C }}>
        <div className="hiw-steps">
          {STEPS.map((s, k) => <Step key={s.n} s={s} i={k} />)}
        </div>
      </section>

      {/* FORMAT MENU */}
      <section data-review-id="howitworks-format-menu" className="hiw-menu-sec" style={{ color: C }}>
        <Reveal as="span" className="hiw-eyebrow">Why a chew</Reveal>
        <Reveal as="h2" v={riseBig} className="hiw-menu__head">Two formats, crossed off the menu.</Reveal>
        <Reveal as="p" className="hiw-menu__intro">The habit was hard because the format was bad. So we took the worst offenders off the menu and kept the one that fits into an actual day.</Reveal>
        <Reveal className="hiw-card">
          <div className="hiw-card__title serif">✦ The Format Menu ✦</div>
          <div className="hiw-rule" />
          <div className="hiw-row hiw-row--off"><span className="hiw-item">Powder</span><span className="hiw-dots" /><span className="hiw-desc">Messy, dusty, easy to skip ✕</span></div>
          <div className="hiw-row hiw-row--off"><span className="hiw-item">Capsule</span><span className="hiw-dots" /><span className="hiw-desc">Clinical, easy to dread ✕</span></div>
          <div className="hiw-rule" />
          <div className="hiw-row hiw-row--special">
            <span className="hiw-tag">★ Today's Special ★</span>
            <div className="hiw-special-item">
              <span className="hiw-item hiw-item--big">Soft chew</span>
              <span className="hiw-dots" />
              <span className="hiw-desc hiw-desc--on">Easy, portable, satisfying ✓</span>
            </div>
          </div>
        </Reveal>
      </section>

      {/* SPLASH */}
      <section data-review-id="howitworks-splash" className="hiw-splash" style={{ color: C }}>
        <Reveal as="span" className="hiw-eyebrow">The Off Menu rule</Reveal>
        <Reveal as="h2" v={riseBig} className="hiw-splash__head u-skew">Make the thing you should take taste like the thing you want.</Reveal>
        <Reveal v={fadeUp}><img className="hiw-splash__chef" src="raw/chef-chop.svg" alt="" /></Reveal>
      </section>
    </Page>
  )
}
