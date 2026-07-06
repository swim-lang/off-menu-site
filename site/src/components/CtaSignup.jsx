import Reveal from './Reveal'
import { riseBig } from '../lib/motion'
import './CtaSignup.css'

// Shared launch signup CTA — used at the bottom of the home and shop pages.
// Always brand red; the houndstooth bands use the red pattern.
const HOUNDS = 'url(Pattern/_paper/PatternNEW-c11209.svg)'

export default function CtaSignup({ color = '#C11209', reviewId = 'cta' }) {
  return (
    <section data-review-id={reviewId} className="cta" style={{ '--c': color, color }}>
      <div className="cta__hounds" style={{ backgroundImage: HOUNDS }} />
      <div className="cta__body">
        <Reveal as="span" className="cta__pill u-skew">★ Chef's orders</Reveal>
        <Reveal v={riseBig}><img className="cta__head-img" src="raw/get-yours-today.svg" alt="Get yours today" /></Reveal>
        <Reveal as="p" className="cta__sub">Join the list for launch access, first-batch flavors, and the occasional chef's note.</Reveal>
        <Reveal as="form" className="cta__form" onSubmit={(e) => e.preventDefault()}>
          <input type="email" placeholder="you@email.com" aria-label="Email" />
          <button className="btn" type="submit">Get on the list</button>
        </Reveal>
      </div>
      <div className="cta__hounds" style={{ backgroundImage: HOUNDS }} />
    </section>
  )
}
