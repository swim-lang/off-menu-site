import { useState } from 'react'
import Page from '../components/Page'
import Reveal from '../components/Reveal'
import { fadeUp, riseBig, stagger, inView } from '../lib/motion'
import './Contact.css'

const C = '#1F5F68'

const HELP_TOPICS = [
  'Order status',
  'Shipping',
  'Returns or refunds',
  'Subscription changes',
  'Product questions',
  'Ingredient questions',
  'Wholesale or press',
]

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', order: '', message: '' })
  const [sent, setSent] = useState(false)

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const onSubmit = (e) => {
    e.preventDefault()
    setSent(true)
  }

  return (
    <Page page="contact">
      {/* HERO */}
      <section data-review-id="contact-hero" className="cn-hero" style={{ color: C }}>
        <Reveal as="span" className="cn-eyebrow">Contact · Support</Reveal>
        <Reveal as="h1" v={riseBig} className="cn-hero__head">
          Need help? <br />We&rsquo;ve got you.
        </Reveal>
        <Reveal as="p" className="cn-hero__sub">
          Questions about your order, subscription, shipping, ingredients, or daily
          fiber routine? Send us a note and we&rsquo;ll get back to you.
        </Reveal>
      </section>

      {/* BODY */}
      <section data-review-id="contact-body" className="cn-body" style={{ color: C }}>
        <div className="cn-grid">
          {/* LEFT — form */}
          <Reveal as="div" className="cn-card">
            <h2 className="cn-card__title">Send us a note</h2>

            {sent ? (
              <div className="cn-success" role="status">
                <span className="cn-success__mark">✓</span>
                <p className="cn-success__text">Thanks — we&rsquo;ll be in touch.</p>
              </div>
            ) : (
              <form className="cn-form" onSubmit={onSubmit}>
                <label className="cn-field">
                  <span className="cn-label">Name</span>
                  <input
                    className="cn-input"
                    type="text"
                    value={form.name}
                    onChange={set('name')}
                    placeholder="Your name"
                  />
                </label>

                <label className="cn-field">
                  <span className="cn-label">Email</span>
                  <input
                    className="cn-input"
                    type="email"
                    value={form.email}
                    onChange={set('email')}
                    placeholder="you@email.com"
                  />
                </label>

                <label className="cn-field">
                  <span className="cn-label">Order number (if applicable)</span>
                  <input
                    className="cn-input"
                    type="text"
                    value={form.order}
                    onChange={set('order')}
                    placeholder="#OM-00000"
                  />
                </label>

                <label className="cn-field">
                  <span className="cn-label">What can we help with?</span>
                  <textarea
                    className="cn-input cn-textarea"
                    value={form.message}
                    onChange={set('message')}
                    placeholder="Tell us a little about what you need…"
                  />
                </label>

                <button className="cn-submit" type="submit">
                  Send message →
                </button>
              </form>
            )}
          </Reveal>

          {/* RIGHT — info */}
          <Reveal as="div" className="cn-aside">
            <div className="cn-info">
              <div className="cn-info__block">
                <span className="cn-info__label">Email us</span>
                <span className="cn-info__email">support@offmenu.com</span>
              </div>
              <div className="cn-info__block">
                <span className="cn-info__label">Response time</span>
                <span className="cn-info__value">
                  We typically respond within 1–2 business days.
                </span>
              </div>
            </div>

            <div className="cn-help">
              <h3 className="cn-help__title">What we can help with</h3>
              <Reveal v={stagger(0.05)} className="cn-chips">
                {HELP_TOPICS.map((t) => (
                  <Reveal as="span" key={t} v={fadeUp} className="cn-chip">
                    {t}
                  </Reveal>
                ))}
              </Reveal>
            </div>

            <p className="cn-note">
              For medical questions, please speak with your healthcare provider. We
              can help with product information, but we can&rsquo;t provide medical
              advice.
            </p>
          </Reveal>
        </div>
      </section>
    </Page>
  )
}
