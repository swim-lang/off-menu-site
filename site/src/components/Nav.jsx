import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { asset } from '../lib/site'
import { useCart } from '../lib/cart'
import './Nav.css'

// Full-screen overlay menu — matches the Paper "Menu (overlay)" artboard exactly.
// Always brand red (#C11209) regardless of which page opened it.
const MENU = [
  { title: 'Shop', items: [['Home', '/'], ['Get now', '/shop'], ['Ingredients & flavors', '/ingredients']] },
  { title: 'Learn', items: [['How it works', '/how-it-works'], ['Our story', '/about']] },
  { title: 'Help', items: [['FAQ', '/faq'], ['Shipping & returns', '/shipping'], ['Support', '/contact']] },
]

export default function Nav({ slug = 'red', color = '#C11209' }) {
  const [open, setOpen] = useState(false)
  const loc = useLocation()
  const { count, open: openCart } = useCart()
  useEffect(() => { setOpen(false) }, [loc.pathname])

  return (
    <header className="nav" style={{ '--c': color }}>
      <div className="nav__band" style={{ backgroundImage: `url(${asset.pattern(slug)})` }}>
        <button className="nav__chip nav__menu" onClick={() => setOpen(true)} aria-label="Open menu">
          <span className="nav__burger"><i /><i /><i /></span>
          Menu
        </button>
        <div className="nav__actions">
          <Link to="/shop" className="nav__chip">Get now</Link>
          <button type="button" className="nav__chip" onClick={openCart}>Cart <span className="nav__count">({count})</span></button>
        </div>
      </div>

      <Link to="/" className="nav__logo" aria-label="Off Menu home">
        <img src={asset.logo(slug)} alt="Off Menu" />
      </Link>

      <AnimatePresence>
        {open && (
          <motion.div className="menu" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            <div className="menu__top">
              <img className="menu__logo" src="Logo/_paper/Logo-clean-red.svg" alt="Off Menu" />
              <button className="menu__close" onClick={() => setOpen(false)}><span>✕</span> Close</button>
            </div>

            <div className="menu__groups">
              {MENU.map((g, gi) => (
                <div className="menu__col" key={g.title}>
                  <span className="menu__title">{g.title}</span>
                  {g.items.map(([label, to], li) => (
                    <motion.div key={label}
                      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.08 + gi * 0.05 + li * 0.05, ease: [0.22, 1, 0.36, 1] }}>
                      <Link className="menu__link" to={to} onClick={() => setOpen(false)}>{label}</Link>
                    </motion.div>
                  ))}
                </div>
              ))}
            </div>

            <motion.img className="menu__lockup" src="raw/eat-your-chew.svg" alt="Eat your chew"
              initial={{ opacity: 0, scale: 0.9, rotate: -3 }} animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ delay: 0.18, type: 'spring', stiffness: 220, damping: 18 }} />
            <img className="menu__mark" src="raw/Dude-c11209.svg" alt="" />
            <div className="menu__hounds" style={{ backgroundImage: 'url(Pattern/_paper/PatternNEW-c11209.svg)' }} />
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
