import { motion } from 'framer-motion'
import Page from '../components/Page'
import Reveal from '../components/Reveal'
import Ill from '../components/Ill'
import Seal from '../components/Seal'
import { fadeUp, riseBig, stickerPop, inView } from '../lib/motion'
import './About.css'

const C = '#D27400'

// Reusable rounded pill sticker: white fill, C border + text, C offset shadow,
// pops in like a hand-applied sticker and sits absolutely in the margin.
function Pill({ children, className, rotate = 0, style }) {
  return (
    <motion.div
      className={`ab-pill ${className || ''}`}
      style={style}
      variants={stickerPop}
      initial="hidden"
      whileInView="show"
      viewport={inView}
      custom={rotate}
      whileHover={{ scale: 1.06, rotate: rotate + 2 }}
    >
      {children}
    </motion.div>
  )
}

export default function About() {
  return (
    <Page page="about">
      <div className="ab" style={{ color: C }}>

        {/* HERO — Our story */}
        <section data-review-id="about-hero" className="ab-hero">
          <div className="ab-hero__text">
            <Reveal as="p" className="ab-kicker">Our story</Reveal>
            <Reveal v={riseBig}><img className="ab-hero__lockup" src="raw/fiber-deserved-better.svg" alt="Fiber deserved better" /></Reveal>
            <Reveal className="ab-hero__body">
              <p className="ab-lead">Off Menu started with a simple frustration: why does something so useful have to feel so joyless?</p>
              <p className="ab-lead">Fiber is one of those daily essentials people know they should get more of, but the category has made it feel clinical, messy, and easy to ignore.</p>
              <p className="ab-lead">So we built a different kind of supplement brand — one that borrows from chefs, menus, flavor notes, and the small pleasure of eating something made with care.</p>
            </Reveal>
          </div>
          <Reveal className="ab-hero__art" v={fadeUp}>
            <Ill src="Illustrations/Standing.svg" w={330} h={620} />
          </Reveal>

          {/* margin stickers */}
          <Pill className="ab-hero__pill" rotate={6}>No chalk, ever</Pill>
          <Seal className="ab-hero__seal-replated" shape="burst" size={124} rotate={-8} label="Re-plated" color={C} />
          <Seal className="ab-hero__seal-batch" shape="scallop" size={122} rotate={-8} label="Small batch" color={C} />
        </section>

        {/* POV — Our point of view */}
        <section data-review-id="about-pov" className="ab-pov">
          <Reveal className="ab-pov__art" v={fadeUp}>
            <div className="ab-illbox">
              <span className="ab-illbox__label">Illustration</span>
              <span className="ab-illbox__sub serif">to be added</span>
            </div>
          </Reveal>
          <div className="ab-pov__text">
            <Reveal as="p" className="ab-kicker ab-kicker--wide">Our point of view</Reveal>
            <Reveal v={riseBig}>
              <h2 className="ab-h2">If it goes in your mouth, flavor is part of the job.</h2>
            </Reveal>
            <Reveal className="ab-pov__copy">
              <p className="ab-body">Supplements do not need to feel like punishment. And they definitely do not need to taste like a pharmacy aisle.</p>
              <p className="ab-body">Better habits happen when the experience is easier to repeat. The format matters. The flavor matters. The ritual matters.</p>
              <p className="ab-pull serif">Off Menu starts with daily fiber, but the bigger idea is simple: take the things your body needs and make them worth coming back to.</p>
            </Reveal>
          </div>

          <Pill className="ab-pov__pill" rotate={7}>Taste matters</Pill>
          <Seal className="ab-pov__seal" shape="burst" size={120} rotate={-10} label="If you know you know" color={C} />
        </section>

        {/* WHY OFF MENU — centered pull-quote */}
        <section data-review-id="about-why" className="ab-why">
          <Reveal as="p" className="ab-kicker ab-kicker--wide">Why Off Menu</Reveal>
          <Reveal v={riseBig}>
            <p className="ab-why__quote">The best things are often the ones you had to know to ask for.</p>
          </Reveal>
          <Reveal className="ab-why__body">
            <p className="ab-body ab-center">Off Menu is our way of bringing that feeling to daily nutrition — a little more special, a little more considered, and a lot less like the usual supplement routine.</p>
          </Reveal>

          <Seal className="ab-why__seal-batch" shape="scallop" size={132} rotate={8} label="Small batch" color={C} />
          <Pill className="ab-why__pill" rotate={-8}>86 the powder</Pill>
        </section>

        {/* CHEF CHEWY — house voice */}
        <section data-review-id="about-chef" className="ab-chef">
          <Reveal className="ab-chef__art" v={fadeUp}>
            <Ill src="Illustrations/Walking.svg" w={312} h={560} />
          </Reveal>
          <div className="ab-chef__text">
            <Reveal as="p" className="ab-kicker ab-kicker--wide">Meet the house voice</Reveal>
            <Reveal v={riseBig}>
              <h2 className="ab-h2 ab-h2--big">Chef Chewy</h2>
            </Reveal>
            <Reveal className="ab-chef__copy">
              <p className="ab-body">Chef Chewy is the house voice of Off Menu.</p>
              <p className="ab-body">He's a little judgmental, a little nostalgic, and very serious about taste. He's here to 86 the powder, roast the orange tub, and remind you to take the chew — without making it a whole wellness performance.</p>
            </Reveal>
            <Reveal v={fadeUp}>
              <motion.div className="ab-says" whileHover={{ rotate: 0 }}>
                <span className="ab-says__label">Chef says</span>
                <span className="ab-says__quote serif">You're welcome. Now chew.</span>
              </motion.div>
            </Reveal>
          </div>

          <Pill className="ab-chef__pill" rotate={6}>★ Chef-led</Pill>
          <Seal className="ab-chef__seal" shape="burst" size={120} rotate={-11} label="Eat your chew" color={C} />
        </section>

      </div>
    </Page>
  )
}
