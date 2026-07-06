import { createContext, useContext, useState, useMemo, useCallback } from 'react'

// ===== Cart pricing rules (used by the slide-out drawer) =====
export const SUB_LINE = 'Daily fiber chews · Chef-led flavor · 60 ct'
export const SHIP_THRESHOLD = 35
export const SHIP_FLAT = 5.95
const SUB_DISCOUNT = 0.15
const TAX_RATE = 0.0825
const PROMOS = { OFFMENU10: 0.1, CHEWY15: 0.15 }

export const money = (n) => `$${n.toFixed(2)}`

// Products that can be added to the cart (Add to cart on the PDP uses `verjus`).
export const CATALOG = {
  verjus: { id: 'verjus', name: 'Concord Verjus Grape', sub: SUB_LINE, price: 24, img: 'raw/1.png' },
  cherry: { id: 'cherry', name: 'Cherry Cola Spice', sub: SUB_LINE, price: 24, img: 'raw/2.png' },
}

// Cart starts empty; it only holds what the shopper actually adds.
const INITIAL = []

const CartCtx = createContext(null)

export function CartProvider({ children }) {
  const [items, setItems] = useState(INITIAL)
  const [subscribe, setSubscribe] = useState(true)
  const [promo, setPromo] = useState(null) // { code, rate } | null
  const [isOpen, setIsOpen] = useState(false)

  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])

  // Add a catalog item; if it's already in the cart, bump its quantity.
  const addItem = useCallback((item, qty = 1) => {
    setItems((cur) => {
      const found = cur.find((it) => it.id === item.id)
      if (found) return cur.map((it) => (it.id === item.id ? { ...it, qty: it.qty + qty } : it))
      return [...cur, { ...item, qty }]
    })
  }, [])

  const setQty = useCallback(
    (id, delta) =>
      setItems((cur) =>
        cur.map((it) => (it.id === id ? { ...it, qty: Math.max(1, it.qty + delta) } : it))
      ),
    []
  )

  const removeItem = useCallback((id) => setItems((cur) => cur.filter((it) => it.id !== id)), [])

  // Returns { ok, error } so callers can surface a message.
  const applyPromo = useCallback((code) => {
    const c = (code || '').trim().toUpperCase()
    if (!c) return { ok: false, error: '' }
    if (PROMOS[c]) {
      setPromo({ code: c, rate: PROMOS[c] })
      return { ok: true, error: '' }
    }
    setPromo(null)
    return { ok: false, error: 'That code isn’t valid. Try OFFMENU10.' }
  }, [])

  const count = useMemo(() => items.reduce((n, it) => n + it.qty, 0), [items])

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

  const value = {
    items, subscribe, setSubscribe, promo, applyPromo,
    addItem, setQty, removeItem,
    count, totals,
    isOpen, open, close,
  }

  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>
}

export function useCart() {
  const ctx = useContext(CartCtx)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
