import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Page from '../components/Page'
import Reveal from '../components/Reveal'
import Ill from '../components/Ill'
import Seal from '../components/Seal'
import { fadeUp, riseBig, inView } from '../lib/motion'
import './FAQ.css'

const C = '#86335F'

const PRODUCT = [
  {
    q: 'What is Off Menu Daily Fiber?',
    a: 'A chef-led daily fiber soft chew, designed to support digestive health, regularity, fullness, and daily fiber intake, without powders, mixing, or capsules.',
  },
  {
    q: 'Who is it for?',
    a: 'Anyone looking for an easy, repeatable way to add a little fiber to their daily routine without powders, mixing, or capsules.',
  },
  {
    q: 'How much fiber does it have?',
    a: 'Each serving gives you 2g of fiber to help support digestive health, regularity, and fullness.',
  },
  {
    q: 'How often should I take it?',
    a: 'Take one chew daily as part of your routine. Consistency is what makes fiber work. The habit matters.',
  },
  {
    q: 'When should I take it?',
    a: 'Whenever it fits your day. Many people pair it with a meal or a moment they already remember, so it becomes easy to repeat.',
  },
  {
    q: 'How soon will I feel it?',
    a: 'Everyone is different. Fiber works best as a daily habit over time rather than as a one-off, so give your routine a few weeks.',
  },
  {
    q: 'Should I drink water with it?',
    a: 'Staying hydrated is always a good idea and helps fiber do its job, so enjoy your chew with a glass of water when you can.',
  },
  {
    q: 'Can I take an extra serving?',
    a: 'Stick to the serving size on the label. If you have questions about your routine, check in with your healthcare provider.',
  },
  {
    q: 'Is this a laxative?',
    a: 'No. Off Menu is a daily fiber supplement designed to support digestive health and regularity, not a laxative.',
  },
  {
    q: 'Does it replace eating fiber-rich foods?',
    a: 'No. It is a supplement to support your daily fiber intake, meant to complement a balanced diet of fiber-rich foods, not replace it.',
  },
  {
    q: 'Is this medical advice?',
    a: 'No. Off Menu is a dietary supplement, not medical advice or treatment. If you are pregnant, nursing, managing a medical condition, taking medication, or have questions about fiber, check with your healthcare provider.',
  },
]

const FLAVOR = [
  {
    q: 'Is it made with real fruit?',
    a: 'Our chef-inspired flavors are built around taste profiles. Flavor names may describe inspiration rather than whole-fruit ingredients, so always check the label for the full ingredient list.',
  },
  {
    q: 'Do the flavors contain the actual fruits and ingredients named?',
    a: 'Flavor names describe taste profiles. Some ingredients may come from natural flavors or other sources rather than whole fruits, vegetables, herbs, or spices. Always check the label for the full ingredient list.',
  },
  {
    q: 'Why chef-inspired flavors?',
    a: 'Function gets you to buy it. Flavor gets you to come back. We work on flavor like a kitchen would, so a daily habit feels like a treat.',
  },
  {
    q: 'Is this candy?',
    a: 'No. It is a fiber supplement that happens to taste good. The chew format is just the easiest way to make fiber a habit you keep.',
  },
  {
    q: 'Is it vegan?',
    a: 'We are still finalizing this. Full details will be confirmed on the label and here soon.',
    tag: 'TBD',
  },
  {
    q: 'Is it gluten-free?',
    a: 'We are still finalizing this. Full details will be confirmed on the label and here soon.',
    tag: 'TBD',
  },
  {
    q: 'Does it contain allergens?',
    a: 'We are still finalizing this. Always check the most recent label for the full ingredient and allergen information.',
    tag: 'TBD',
  },
]

function Accordion({ title, items, groupKey, open, setOpen }) {
  return (
    <div className="faq-group">
      <Reveal className="faq-group__head">
        <h2 className="faq-group__title">{title}</h2>
      </Reveal>
      <div className="faq-list">
        {items.map((it, i) => {
          const isOpen = open === i
          return (
            <Reveal key={it.q} className="faq-item-wrap">
              <div className={`faq-item ${isOpen ? 'is-open' : ''}`}>
                <button
                  type="button"
                  className="faq-q"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? -1 : i)}
                >
                  <span className="faq-q__label">
                    {it.q}
                    {it.tag && <span className="faq-tag">{it.tag}</span>}
                  </span>
                  <span className="faq-q__icon" aria-hidden="true">{isOpen ? '−' : '+'}</span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      className="faq-a-wrap"
                      key="a"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <p className="faq-a">{it.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Reveal>
          )
        })}
      </div>
    </div>
  )
}

export default function FAQ() {
  // First Product item starts open (as Paper shows); Flavor group starts closed.
  const [openProduct, setOpenProduct] = useState(0)
  const [openFlavor, setOpenFlavor] = useState(-1)

  return (
    <Page page="faq">
      {/* HERO */}
      <section data-review-id="faq-hero" className="faq-hero" style={{ color: C }}>
        <Reveal as="span" className="faq-eyebrow">Help · FAQ</Reveal>
        <Reveal as="h1" v={riseBig} className="faq-hero__head">Frequently asked questions</Reveal>
        <Reveal as="p" className="faq-hero__sub">
          Everything about the chews, your routine, and what's inside. Still stuck? Reach out directly to the chef at chefchewy@offmenu.health.
        </Reveal>
      </section>

      {/* BODY */}
      <section data-review-id="faq-body" className="faq-body" style={{ color: C }}>
        <div className="faq-grid">
          <div className="faq-col">
            <Accordion title="Product" items={PRODUCT} groupKey="p" open={openProduct} setOpen={setOpenProduct} />
            <Accordion title="Ingredients & Flavor" items={FLAVOR} groupKey="f" open={openFlavor} setOpen={setOpenFlavor} />
          </div>

          <aside className="faq-rail">
            <Seal shape="scallop" size={168} label="Off Menu" color={C} className="faq-seal" />
            <Ill className="faq-rail__ill" src="Illustrations/_red/apple.svg" w={96} h={126} />
            <Ill className="faq-rail__ill" src="Illustrations/_red/grape.svg" w={120} h={120} />
            <Reveal className="faq-card">
              <div className="faq-card__title serif">Still have questions?</div>
              <p className="faq-card__sub">We're happy to help. Drop us a note.</p>
              <button type="button" className="faq-card__btn">Contact us</button>
            </Reveal>
            <Ill className="faq-rail__ill" src="Illustrations/_red/carrot.svg" w={115} h={126} />
          </aside>
        </div>
      </section>
    </Page>
  )
}
