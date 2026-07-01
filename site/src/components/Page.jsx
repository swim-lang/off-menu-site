import Nav from './Nav'
import Footer from './Footer'
import { PAGES } from '../lib/site'

// Wraps a page with its nav + footer and sets the page brand color on --c.
// Home overrides --c per section; single-color pages inherit this.
export default function Page({ page = 'home', children }) {
  const { slug, c } = PAGES[page]
  return (
    <div style={{ '--c': c }}>
      <Nav slug={slug} color={c} />
      <main>{children}</main>
      <Footer slug={slug} color={c} />
    </div>
  )
}
