// Per-page brand color + asset slug. `c` is the CSS color; `slug` maps to the
// recolored asset variants (PatternNEW-<slug>.svg, Logo-clean-<slug>.svg, etc).
export const PAGES = {
  home:        { path: '/',             label: 'Home',                c: '#C11209', slug: 'red' },
  shop:        { path: '/shop',         label: 'Shop',                c: '#C11209', slug: 'red' },
  product:     { path: '/product',      label: 'Shop the chews',      c: '#A7241E', slug: 'darkred' },
  ingredients: { path: '/ingredients',  label: 'Ingredients & flavors', c: '#6b2503', slug: 'brown' },
  howitworks:  { path: '/how-it-works', label: 'How it works',        c: '#C42E6A', slug: 'pink' },
  about:       { path: '/about',        label: 'Our story',           c: '#ff4801', slug: 'orange' },
  faq:         { path: '/faq',          label: 'FAQ',                 c: '#86335F', slug: 'magenta' },
  shipping:    { path: '/shipping',     label: 'Shipping & returns',  c: '#1F33B9', slug: 'blue' },
  contact:     { path: '/contact',      label: 'Contact & support',   c: '#1F5F68', slug: 'teal' },
  cart:        { path: '/cart',         label: 'Cart & checkout',     c: '#4C9E3C', slug: 'green' },
}

// Grouped links for the nav dropdown.
export const NAV_GROUPS = [
  { title: 'Shop', items: ['product', 'ingredients', 'cart'] },
  { title: 'Discover', items: ['howitworks', 'about'] },
  { title: 'Help', items: ['faq', 'shipping', 'contact'] },
]

export const asset = {
  pattern: (slug) => `Pattern/_paper/PatternNEW-${slug}.svg`,
  logo: (slug) => `Logo/_paper/Logo-clean-${slug}.svg`,
}
