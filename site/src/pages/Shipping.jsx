import Page from '../components/Page'
import Reveal from '../components/Reveal'
import Seal from '../components/Seal'
import Ill from '../components/Ill'
import { riseBig } from '../lib/motion'
import './Shipping.css'

const C = '#1F33B9'

// Policy sections — content reproduced verbatim from the artboard. Bracketed
// placeholders are intentionally kept as-is.
const SECTIONS = [
  {
    title: 'Shipping',
    body: [
      'Orders are processed within [X to X] business days. Once your order ships, you will receive tracking information by email.',
      'Shipping timelines may vary depending on location, carrier delays, weather, and order volume.',
    ],
  },
  {
    title: 'Returns',
    body: [
      'We want you to feel good about your order. If something arrives damaged, incorrect, or missing, contact us at [support email] within [X] days of delivery.',
      'Because Off Menu is an ingestible product, we may not be able to accept returns on opened bags. If you have an issue, reach out and we will do our best to help.',
    ],
  },
  {
    title: 'Refunds',
    body: [
      'Approved refunds will be issued to the original payment method. Processing time may vary depending on your bank or payment provider.',
    ],
  },
  {
    title: 'Damaged Orders',
    body: ['If your order arrives damaged, email us with:'],
    list: [
      'Your order number',
      'A photo of the product',
      'A photo of the shipping box',
      'A short description of the issue',
    ],
  },
  {
    title: 'Subscription Changes',
    body: [
      'If subscriptions are offered, customers can manage, pause, skip, or cancel through their account portal before the next billing date.',
    ],
  },
]

export default function Shipping() {
  return (
    <Page page="shipping">
      {/* PAGE HEADER */}
      <section className="ship-header" style={{ color: C }}>
        <Reveal as="div" className="ship-eyebrow">Help · Off Menu policies</Reveal>
        <Reveal as="h1" v={riseBig} className="ship-title">Shipping &amp; Returns</Reveal>
        <Reveal as="p" className="ship-sub">
          Everything you need to know about getting your chews — and what to do if something's off.
        </Reveal>
      </section>

      {/* REASSURANCE */}
      <section className="ship-reassure" style={{ color: C }}>
        <Reveal className="ship-reassure__card">
          <h2 className="ship-reassure__title u-skew">Something off?</h2>
          <p className="ship-reassure__body">If your order arrives damaged, incorrect, or missing, send us a note. We'll take a look and help make it right.</p>
        </Reveal>
      </section>

      {/* CONTENT */}
      <section className="ship-content" style={{ color: C }}>
        {/* Decorative vintage seals + fruit in the wide margins */}
        <div className="ship-decor" aria-hidden="true">
          <Seal className="ship-seal ship-seal--ships" shape="burst" size={132} rotate={7} label="Ships fresh" color={C} />
          <Ill className="ship-fruit ship-fruit--watermelon" src="Illustrations/_red/watermelon.svg" w={137} h={110} />
          <Seal className="ship-seal ship-seal--gotyou" shape="scallop" size={134} rotate={-6} label="We got you" color={C} />
          <div className="ship-pill">Keep it moving</div>
          <Ill className="ship-fruit ship-fruit--strawberry" src="Illustrations/_red/strawberry.svg" w={81} h={120} />
          <Ill className="ship-fruit ship-fruit--grape" src="Illustrations/_red/grape.svg" w={121} h={120} />
        </div>

        <div className="ship-col">
          {SECTIONS.map((s) => (
            <Reveal as="div" key={s.title} className="ship-section">
              <div className="ship-section__head">
                <h2 className="ship-section__title">{s.title}</h2>
              </div>
              {s.body.map((p, i) => (
                <p key={i} className="ship-section__body">{p}</p>
              ))}
              {s.list && (
                <ul className="ship-list">
                  {s.list.map((item, i) => (
                    <li key={i} className="ship-list__item">
                      <span className="ship-list__bullet">●</span>
                      <span className="ship-list__text">{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </Reveal>
          ))}
        </div>
      </section>
    </Page>
  )
}
