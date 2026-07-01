import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import Page from '../components/Page'
import Reveal from '../components/Reveal'
import Ill from '../components/Ill'
import { fadeUp, riseBig, stagger, inView } from '../lib/motion'
import './Cart.css'

const C = '#4C9E3C'

const SUB_LINE = 'Daily fiber chews · Chef-led flavor · 30 ct'
const SHIP_THRESHOLD = 35
const SUB_DISCOUNT = 0.15
const TAX_RATE = 0.0825

const INITIAL = [
  { id: 'verjus', name: 'Concord Verjus Grape', sub: SUB_LINE, price: 24, qty: 2, img: 'raw/1.png' },
  { id: 'cherry', name: 'Cherry Cola Spice', sub: SUB_LINE, price: 24, qty: 1, img: 'raw/2.png' },
]

// Valid promo codes → fractional discount
const PROMOS = { OFFMENU10: 0.1, CHEWY15: 0.15 }

const money = (n) => `$${n.toFixed(2)}`

export default function Cart() {
  const [items, setItems] = useState(INITIAL)
  const [subscribe, setSubscribe] = useState(true)
  const [promoInput, setPromoInput] = useState('')
  const [promo, setPromo] = useState(null) // { code, rate } | null
  const [promoError, setPromoError] = useState('')

  const setQty = (id, delta) =>
    setItems((cur) =>
      cur.map((it) => (it.id === id ? { ...it, qty: Math.max(1, it.qty + delta) } : it))
    )

  const removeItem = (id) => setItems((cur) => cur.filter((it) => it.id !== id))

  const applyPromo = (e) => {
    e.preventDefault()
    const code = promoInput.trim().toUpperCase()
    if (!code) return
    if (PROMOS[code]) {
      setPromo({ code, rate: PROMOS[code] })
      setPromoError('')
    } else {
      setPromo(null)
      setPromoError('That code isn’t valid — try OFFMENU10.')
    }
  }

  const totals = useMemo(() => {
    const subtotal = items.reduce((sum, it) => sum + it.price * it.qty, 0)
    const subDiscount = subscribe ? subtotal * SUB_DISCOUNT : 0
    const promoDiscount = promo ? (subtotal - subDiscount) * promo.rate : 0
    const taxable = subtotal - subDiscount - promoDiscount
    const tax = taxable * TAX_RATE
    const shipFree = subtotal >= SHIP_THRESHOLD
    const total = taxable + tax
    return { subtotal, subDiscount, promoDiscount, tax, total, shipFree }
  }, [items, subscribe, promo])

  const empty = items.length === 0

  return (
    <Page page="cart">
      {/* ===== HEADER ART ROW ===== */}
      <section className="cart-head" style={{ color: C }}>
        <Reveal v={riseBig}>
          <img className="cart-head__lockup" src="raw/your-cart-lockup.svg" alt="Your cart" />
        </Reveal>
        <Reveal as="div" className="cart-head__mascot" v={fadeUp}>
          <img className="cart-head__dude" src="raw/dude-bag-green.svg" alt="" />
        </Reveal>
      </section>

      {empty ? (
        <section className="cart-empty" style={{ color: C }}>
          <Reveal as="h2" className="cart-empty__title">Nothing on the menu yet.</Reveal>
          <Reveal as="p" className="cart-empty__sub">
            Your cart is empty. Go pick a flavor — your gut will thank you.
          </Reveal>
          <Reveal as="a" className="cart-btn cart-btn--lg" href="/product">
            Shop the chews →
          </Reveal>
        </section>
      ) : (
        <section className="cart-body" style={{ color: C }}>
          {/* ===== LEFT: LINE ITEMS ===== */}
          <motion.div
            className="cart-items"
            variants={stagger(0.1)}
            initial="hidden"
            whileInView="show"
            viewport={inView}
          >
            {items.map((it) => (
              <motion.div className="cart-line" key={it.id} variants={fadeUp}>
                <div
                  className="cart-line__img"
                  style={{ backgroundImage: `url(${it.img})` }}
                  role="img"
                  aria-label={it.name}
                />
                <div className="cart-line__mid">
                  <h3 className="cart-line__name serif">{it.name}</h3>
                  <p className="cart-line__sub">{it.sub}</p>
                  <div className="cart-stepper" role="group" aria-label={`Quantity for ${it.name}`}>
                    <button
                      className="cart-stepper__btn"
                      onClick={() => setQty(it.id, -1)}
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <span className="cart-stepper__val" aria-live="polite">{it.qty}</span>
                    <button
                      className="cart-stepper__btn"
                      onClick={() => setQty(it.id, 1)}
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="cart-line__end">
                  <span className="cart-line__price">{money(it.price * it.qty)}</span>
                  <button className="cart-line__remove" onClick={() => removeItem(it.id)}>
                    Remove
                  </button>
                </div>
              </motion.div>
            ))}

            {/* Subscribe & save banner */}
            <motion.div className="cart-sub" variants={fadeUp}>
              <div className="cart-sub__copy">
                <span className="cart-sub__title">Make it the usual</span>
                <span className="cart-sub__note">
                  Daily fiber works best as a habit. Ship on your schedule — skip, pause, or cancel anytime.
                </span>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={subscribe}
                aria-label="Subscribe and save"
                className={`cart-toggle ${subscribe ? 'is-on' : ''}`}
                onClick={() => setSubscribe((s) => !s)}
              >
                <span className="cart-toggle__knob" />
              </button>
            </motion.div>

            {/* Promo code */}
            <motion.form className="cart-promo" variants={fadeUp} onSubmit={applyPromo}>
              <input
                className="cart-promo__input"
                type="text"
                placeholder="Promo code"
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value)}
                aria-label="Promo code"
              />
              <button type="submit" className="cart-btn cart-promo__apply">
                Apply
              </button>
            </motion.form>
            {promo && (
              <p className="cart-promo__msg cart-promo__msg--ok">
                Code {promo.code} applied — {Math.round(promo.rate * 100)}% off.
              </p>
            )}
            {promoError && <p className="cart-promo__msg cart-promo__msg--err">{promoError}</p>}
          </motion.div>

          {/* ===== RIGHT: ORDER SUMMARY ===== */}
          <Reveal as="div" className="cart-summary" v={fadeUp}>
            <h2 className="cart-summary__head">Order Summary</h2>

            <div className="cart-row">
              <span className="cart-row__label">Subtotal</span>
              <span className="cart-row__val">{money(totals.subtotal)}</span>
            </div>

            {subscribe && (
              <div className="cart-row">
                <span className="cart-row__label">Subscribe &amp; save (15%)</span>
                <span className="cart-row__val cart-row__val--accent">
                  −{money(totals.subDiscount)}
                </span>
              </div>
            )}

            {promo && (
              <div className="cart-row">
                <span className="cart-row__label">Promo ({promo.code})</span>
                <span className="cart-row__val cart-row__val--accent">
                  −{money(totals.promoDiscount)}
                </span>
              </div>
            )}

            <div className="cart-row">
              <span className="cart-row__label">Shipping</span>
              <span className="cart-row__val cart-row__val--accent">
                {totals.shipFree ? 'Free over $35' : money(5.95)}
              </span>
            </div>

            <div className="cart-row cart-row--tax">
              <span className="cart-row__label">Estimated tax</span>
              <span className="cart-row__val">{money(totals.tax)}</span>
            </div>

            <div className="cart-summary__rule" />

            <div className="cart-row cart-row--total">
              <span className="cart-row__label cart-total__label">Total</span>
              <span className="cart-total__val">{money(totals.total)}</span>
            </div>

            <button className="cart-btn cart-btn--checkout">Secure Checkout →</button>

            <ul className="cart-trust">
              {[
                'Secure, encrypted checkout',
                'Free shipping on orders over $35',
                'Skip or cancel your plan anytime',
                'Questions? hello@offmenu.com',
              ].map((t) => (
                <li className="cart-trust__item" key={t}>
                  <span className="cart-trust__dot">●</span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </section>
      )}
    </Page>
  )
}
