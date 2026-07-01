import Nav from './Nav'
import Footer from './Footer'
import { PAGES } from '../lib/site'

// A vintage Windows-style arrow cursor, filled with the page's brand color and
// outlined in white so it reads on any background. Tip (4,3) is the hotspot;
// `auto` is the fallback if SVG cursors aren't supported.
function cursorFor(color) {
  const svg =
    "<svg xmlns='http://www.w3.org/2000/svg' width='22' height='30' viewBox='0 0 22 30'>" +
    "<path d='M4 3L4 24L9.2 19L13 27L16 25.7L12.2 18L18.5 18Z' fill='" + color +
    "' stroke='#ffffff' stroke-width='1.8' stroke-linejoin='round'/></svg>"
  return 'url("data:image/svg+xml,' + encodeURIComponent(svg) + '") 4 3, auto'
}

// Wraps a page with its nav + footer and sets the page brand color on --c.
// Home overrides --c per section; single-color pages inherit this.
export default function Page({ page = 'home', children }) {
  const { slug, c } = PAGES[page]
  return (
    <div className="page-shell" style={{ '--c': c, cursor: cursorFor(c) }}>
      <Nav slug={slug} color={c} />
      <main>{children}</main>
      <Footer slug={slug} color={c} />
    </div>
  )
}
