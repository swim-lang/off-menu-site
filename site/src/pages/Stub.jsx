import Page from '../components/Page'
import Reveal from '../components/Reveal'
import Seal from '../components/Seal'
import { PAGES } from '../lib/site'

// Temporary placeholder for pages still being ported from Paper.
export default function Stub({ page }) {
  const { label, c } = PAGES[page]
  return (
    <Page page={page}>
      <section style={{ minHeight: '58vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 18, padding: '120px 40px', textAlign: 'center', color: c }}>
        <Seal shape="burst" size={120} rotate={-8} label="Coming soon" color={c} />
        <Reveal as="h1" style={{ fontSize: 'clamp(40px,7vw,72px)', textTransform: 'uppercase', letterSpacing: '-0.015em', lineHeight: 0.98 }}>{label}</Reveal>
        <Reveal as="p" style={{ maxWidth: 460, fontSize: 17, color: 'var(--ink)' }}>
          This page is designed in Paper and is next in the build queue.
        </Reveal>
      </section>
    </Page>
  )
}
