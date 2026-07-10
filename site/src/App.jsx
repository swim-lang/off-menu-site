import { useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Ingredients from './pages/Ingredients'
import HowItWorks from './pages/HowItWorks'
import Product from './pages/Product'
import Shipping from './pages/Shipping'
import Contact from './pages/Contact'
import FAQ from './pages/FAQ'
import About from './pages/About'
import CartDrawer from './components/CartDrawer'
import { CartProvider } from './lib/cart'
import { installButtonSfx } from './lib/sfx'
import { initReview } from './lib/review'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

export default function App() {
  useEffect(() => { installButtonSfx(); initReview() }, [])
  return (
    <CartProvider>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        {/* Get now / shop is now the single product page; redirect any old /shop links */}
        <Route path="/shop" element={<Navigate to="/product" replace />} />
        <Route path="/product" element={<Product />} />
        <Route path="/ingredients" element={<Ingredients />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/about" element={<About />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/shipping" element={<Shipping />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
      <CartDrawer />
    </CartProvider>
  )
}
