import { Link } from 'react-router-dom'
import { asset } from '../lib/site'
import './Footer.css'

export default function Footer({ slug = 'red', color = '#C11209' }) {
  return (
    <footer className="footer" style={{ '--c': color, color }}>
      <nav className="footer__links">
        {[['Home', '/'], ['Shop', '/shop'], ['Ingredients & flavors', '/ingredients'], ['How it works', '/how-it-works'], ['Our story', '/about'], ['FAQ', '/faq'], ['Shipping & returns', '/shipping'], ['Support', '/contact']].map(([label, to]) => (
          <Link key={to + label} to={to} className="footer__link">{label}</Link>
        ))}
      </nav>

      <img className="footer__logo" src={asset.logo(slug)} alt="Off Menu" />

      <div className="footer__pill">· Supports gut and digestive health ·</div>

      <p className="footer__fine">
        Fiber soft chews · 30 per bag · Chef-inspired daily supplements. &nbsp;·&nbsp; © Off Menu. Re-plating daily supplements.
      </p>

      <div className="footer__legal">
        <span>Flavor names describe taste profiles. They do not always mean the product contains whole fruits, vegetables, herbs, or spices named in the flavor. See the ingredient list for full details.</span>
        <span>Fiber supports a balanced diet and daily routine. These statements have not been evaluated by the FDA.</span>
      </div>
    </footer>
  )
}
