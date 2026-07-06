import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart, money, SHIP_THRESHOLD, SHIP_FLAT } from '../lib/cart'
import './CartDrawer.css'

// Slide-out side cart. Opens when adding to cart (or via the nav cart chip),
// dims the rest of the site behind a dark overlay, and holds everything the
// full cart page has (minus the illustration).
export default function CartDrawer() {
  const {
    items, subscribe, setSubscribe, promo, applyPromo,
    setQty, removeItem, count, totals, isOpen, close,
  } = useCart()

  const [promoInput, setPromoInput] = useState('')
  const [promoError, setPromoError] = useState('')

  // Close on Escape and lock body scroll while the drawer is open.
  useEffect(() => {
    if (!isOpen) return
    const onKey = (e) => { if (e.key === 'Escape') close() }
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [isOpen, close])

  const onApplyPromo = (e) => {
    e.preventDefault()
    const res = applyPromo(promoInput)
    setPromoError(res.ok ? '' : res.error)
  }

  const empty = items.length === 0

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="cd" role="dialog" aria-modal="true" aria-label="Your cart">
          {/* Dark overlay so the drawer pops off the rest of the site */}
          <motion.button
            type="button"
            className="cd__overlay"
            aria-label="Close cart"
            onClick={close}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          />

          <motion.aside
            className="cd__panel"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', ease: [0.22, 1, 0.36, 1], duration: 0.36 }}
          >
            {/* Header */}
            <div className="cd__head">
              <span className="cd__title">Your Cart{count ? ` (${count})` : ''}</span>
              <button className="cd__close" onClick={close} aria-label="Close cart">✕</button>
            </div>

            {empty ? (
              <div className="cd__empty">
                <h3 className="cart-empty__title">Nothing on the menu yet.</h3>
                <p className="cart-empty__sub">Your cart is empty. Go pick a flavor. Your gut will thank you.</p>
                <Link className="cart-btn cart-btn--lg" to="/product" onClick={close}>Shop the chews →</Link>
              </div>
            ) : (
              <>
                {/* Free-shipping progress banner */}
                {totals.shipFree ? (
                  <div className="cart-ship cart-ship--done cd__ship">
                    <span className="cart-ship__msg"><strong>Free shipping unlocked.</strong> The kitchen's fully stocked.</span>
                    <div className="cart-ship__bar"><span style={{ width: '100%' }} /></div>
                  </div>
                ) : (
                  <div className="cart-ship cd__ship">
                    <span className="cart-ship__msg">
                      <strong>You're {money(SHIP_THRESHOLD - totals.subtotal)} away from free shipping.</strong> Add another bag and keep the kitchen stocked.
                    </span>
                    <div className="cart-ship__bar">
                      <span style={{ width: `${Math.min((totals.subtotal / SHIP_THRESHOLD) * 100, 100)}%` }} />
                    </div>
                  </div>
                )}

                {/* Scrollable body */}
                <div className="cd__scroll">
                  {items.map((it) => (
                    <div className="cart-line cd__line" key={it.id}>
                      <div className="cart-line__img" style={{ backgroundImage: `url(${it.img})` }} role="img" aria-label={it.name} />
                      <div className="cart-line__mid">
                        <h3 className="cart-line__name serif">{it.name}</h3>
                        <p className="cart-line__sub">{it.sub}</p>
                        <div className="cart-stepper" role="group" aria-label={`Quantity for ${it.name}`}>
                          <button className="cart-stepper__btn" onClick={() => setQty(it.id, -1)} aria-label="Decrease quantity">−</button>
                          <span className="cart-stepper__val" aria-live="polite">{it.qty}</span>
                          <button className="cart-stepper__btn" onClick={() => setQty(it.id, 1)} aria-label="Increase quantity">+</button>
                        </div>
                      </div>
                      <div className="cart-line__end">
                        <span className="cart-line__price">{money(it.price * it.qty)}</span>
                        <button className="cart-line__remove" onClick={() => removeItem(it.id)}>Remove</button>
                      </div>
                    </div>
                  ))}

                  {/* Subscribe & save */}
                  <div className={`cart-sub ${subscribe ? 'is-active' : ''}`}>
                    <div className="cart-sub__copy">
                      <div className="cart-sub__head">
                        <span className="cart-sub__title">Make it the usual.</span>
                        <span className="cart-sub__badge">Save 15%</span>
                      </div>
                      <span className="cart-sub__note">Daily fiber works best as a habit. Set it up once, then let the chews show up on schedule.</span>
                    </div>
                    <div className="cart-sub__control">
                      <span className="cart-sub__state">
                        {subscribe && (
                          <svg className="cart-sub__statecheck" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <path d="M4 12.5 L9.5 18 L20 5.5" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                        {subscribe ? 'Subscribing' : 'One-time'}
                      </span>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={subscribe}
                        aria-label="Subscribe and save 15%"
                        className={`cart-toggle ${subscribe ? 'is-on' : ''}`}
                        onClick={() => setSubscribe((s) => !s)}
                      >
                        <span className="cart-toggle__knob" />
                      </button>
                    </div>
                  </div>

                  {/* Promo */}
                  <form className="cart-promo" onSubmit={onApplyPromo}>
                    <input
                      className="cart-promo__input"
                      type="text"
                      placeholder="Promo code"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      aria-label="Promo code"
                    />
                    <button type="submit" className="cart-btn cart-promo__apply">Apply</button>
                  </form>
                  {promo && (
                    <p className="cart-promo__msg cart-promo__msg--ok">Code {promo.code} applied. {Math.round(promo.rate * 100)}% off.</p>
                  )}
                  {promoError && <p className="cart-promo__msg cart-promo__msg--err">{promoError}</p>}

                  {/* Summary rows */}
                  <div className="cd__summary">
                    <div className="cart-row">
                      <span className="cart-row__label">Subtotal</span>
                      <span className="cart-row__val">{money(totals.subtotal)}</span>
                    </div>
                    {subscribe && (
                      <div className="cart-row">
                        <span className="cart-row__label">Subscribe &amp; save (15%)</span>
                        <span className="cart-row__val cart-row__val--accent">−{money(totals.subDiscount)}</span>
                      </div>
                    )}
                    {promo && (
                      <div className="cart-row">
                        <span className="cart-row__label">Promo ({promo.code})</span>
                        <span className="cart-row__val cart-row__val--accent">−{money(totals.promoDiscount)}</span>
                      </div>
                    )}
                    <div className="cart-row">
                      <span className="cart-row__label">Shipping</span>
                      <span className="cart-row__val cart-row__val--accent">{totals.shipFree ? 'Free over $35' : money(SHIP_FLAT)}</span>
                    </div>
                    <div className="cart-row cart-row--tax">
                      <span className="cart-row__label">Estimated tax</span>
                      <span className="cart-row__val">{money(totals.tax)}</span>
                    </div>
                  </div>
                </div>

                {/* Sticky footer: total + checkout + trust */}
                <div className="cd__foot">
                  <div className="cart-row cart-row--total cd__total">
                    <span className="cart-total__label">Total</span>
                    <span className="cart-total__val">{money(totals.total)}</span>
                  </div>
                  <button className="cart-btn cart-btn--checkout">Secure Checkout →</button>
                  <ul className="cd__trust">
                    <li><span className="cart-trust__dot">●</span> Secure checkout</li>
                    <li><span className="cart-trust__dot">●</span> Skip or cancel anytime</li>
                    <li><span className="cart-trust__dot">●</span> 30-day money-back</li>
                  </ul>
                </div>
              </>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  )
}
