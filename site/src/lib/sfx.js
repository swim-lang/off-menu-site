// Synthesized sound FX — no audio assets need to be hosted. A single shared
// AudioContext is created lazily and resumed on the first user gesture.
let _ac
function audioCtx() {
  const AC = window.AudioContext || window.webkitAudioContext
  if (!AC) return null
  _ac = _ac || new AC()
  if (_ac.state === 'suspended') _ac.resume()
  return _ac
}

// Classic diner "order up!" call-bell — a tapped vintage dome bell.
export function playBell() {
  try {
    const ac = audioCtx()
    if (!ac) return
    const now = ac.currentTime
    const out = ac.createGain()
    out.gain.value = 0.12 // quiet — about half the earlier level
    out.connect(ac.destination)

    // 1) strike transient — the little metallic "tick" of tapping the dome
    const nlen = Math.floor(ac.sampleRate * 0.03)
    const nb = ac.createBuffer(1, nlen, ac.sampleRate)
    const nd = nb.getChannelData(0)
    for (let i = 0; i < nlen; i++) nd[i] = Math.random() * 2 - 1
    const click = ac.createBufferSource()
    click.buffer = nb
    const chp = ac.createBiquadFilter()
    chp.type = 'highpass'
    chp.frequency.value = 3800
    const cg = ac.createGain()
    click.connect(chp)
    chp.connect(cg)
    cg.connect(out)
    cg.gain.setValueAtTime(0.45, now)
    cg.gain.exponentialRampToValueAtTime(0.0001, now + 0.028)
    click.start(now)
    click.stop(now + 0.04)

    // 2) the ring — bright, tight partials so it reads as a small tapped bell (not a big gong)
    const fund = 2150
    const ratios = [1, 2.0, 2.97, 4.0]
    const amps = [1, 0.45, 0.26, 0.13]
    ratios.forEach((rt, i) => {
      const base = fund * rt
      const dur = 1.3 - i * 0.22
      // two slightly detuned voices per partial → the shimmer/beat of real metal
      ;[-1, 1].forEach((det) => {
        const o = ac.createOscillator()
        o.type = 'sine'
        o.frequency.value = base * (1 + det * 0.0018)
        const g = ac.createGain()
        o.connect(g)
        g.connect(out)
        const peak = amps[i] * 0.32
        g.gain.setValueAtTime(0.0001, now)
        g.gain.exponentialRampToValueAtTime(peak, now + 0.002) // near-instant strike
        g.gain.exponentialRampToValueAtTime(0.0001, now + dur)
        o.start(now)
        o.stop(now + dur + 0.05)
      })
    })
  } catch (e) { /* audio unavailable — fail silently */ }
}

// Pencil "scribble" — a rapid run of short friction strokes, like graphite on paper.
export function playScribble() {
  try {
    const ac = audioCtx()
    if (!ac) return
    const now = ac.currentTime
    const total = 0.46 // kept under the 0.6s line-draw so it doesn't trail past the animation
    // shared white-noise buffer; each stroke plays a random slice of it
    const buf = ac.createBuffer(1, Math.floor(ac.sampleRate * total), ac.sampleRate)
    const data = buf.getChannelData(0)
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1

    const master = ac.createGain()
    master.gain.value = 0.4 // soft overall
    master.connect(ac.destination)

    // discrete back-and-forth strokes at irregular intervals = the scritch-scritch of scribbling
    let t = now + 0.01
    while (t < now + total - 0.04) {
      const src = ac.createBufferSource()
      src.buffer = buf
      const bp = ac.createBiquadFilter()
      bp.type = 'bandpass'
      bp.frequency.value = 1500 + Math.random() * 1700 // friction texture varies per stroke
      bp.Q.value = 1.1
      const hp = ac.createBiquadFilter()
      hp.type = 'highpass'
      hp.frequency.value = 800
      const g = ac.createGain()
      src.connect(bp)
      bp.connect(hp)
      hp.connect(g)
      g.connect(master)
      const stroke = 0.03 + Math.random() * 0.03 // 30–60ms scritch
      const fade = 1 - ((t - now) / total) * 0.35
      const peak = (0.05 + Math.random() * 0.045) * fade
      g.gain.setValueAtTime(0.0001, t)
      g.gain.exponentialRampToValueAtTime(peak, t + 0.004) // fast attack
      g.gain.exponentialRampToValueAtTime(0.0001, t + stroke) // quick decay
      const offset = Math.random() * (total - stroke - 0.01)
      src.start(t, offset, stroke + 0.02)
      t += stroke + 0.01 + Math.random() * 0.028 // irregular gaps between strokes
    }
  } catch (e) { /* audio unavailable — fail silently */ }
}

// Crisp little "click" — a short bright transient with a tiny switch-snap. No long thock.
export function playKey() {
  try {
    const ac = audioCtx()
    if (!ac) return
    const now = ac.currentTime
    const out = ac.createGain()
    out.gain.value = 0.14 // gentle, so hovering across buttons never gets harsh
    out.connect(ac.destination)

    // click — very short bright noise transient (the contact)
    const nlen = Math.floor(ac.sampleRate * 0.012)
    const nb = ac.createBuffer(1, nlen, ac.sampleRate)
    const nd = nb.getChannelData(0)
    for (let i = 0; i < nlen; i++) nd[i] = Math.random() * 2 - 1
    const click = ac.createBufferSource()
    click.buffer = nb
    const hp = ac.createBiquadFilter()
    hp.type = 'highpass'
    hp.frequency.value = 1900
    const cg = ac.createGain()
    click.connect(hp)
    hp.connect(cg)
    cg.connect(out)
    cg.gain.setValueAtTime(0.6, now)
    cg.gain.exponentialRampToValueAtTime(0.0001, now + 0.012) // snappy decay
    click.start(now)
    click.stop(now + 0.02)

    // tiny snap — a quick high blip for the "click" body (very short, subtle)
    const o = ac.createOscillator()
    o.type = 'square'
    o.frequency.setValueAtTime(440, now)
    o.frequency.exponentialRampToValueAtTime(190, now + 0.018)
    const g = ac.createGain()
    o.connect(g)
    g.connect(out)
    g.gain.setValueAtTime(0.0001, now)
    g.gain.exponentialRampToValueAtTime(0.1, now + 0.002)
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.025)
    o.start(now)
    o.stop(now + 0.035)
  } catch (e) { /* audio unavailable — fail silently */ }
}

// Apple "crunch" — a few quick filtered-noise bites in a row.
export function playCrunch() {
  try {
    const ac = audioCtx()
    if (!ac) return
    const now = ac.currentTime
    const out = ac.createGain()
    out.gain.value = 0.5
    out.connect(ac.destination)
    const buf = ac.createBuffer(1, Math.floor(ac.sampleRate * 0.26), ac.sampleRate)
    const d = buf.getChannelData(0)
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1
    ;[0, 0.07, 0.14].forEach((t0, k) => {
      const src = ac.createBufferSource()
      src.buffer = buf
      const bp = ac.createBiquadFilter()
      bp.type = 'bandpass'
      bp.frequency.value = 1100 + k * 600
      bp.Q.value = 0.6
      const g = ac.createGain()
      src.connect(bp)
      bp.connect(g)
      g.connect(out)
      const t = now + t0
      const peak = 0.5 - k * 0.12
      g.gain.setValueAtTime(0.0001, t)
      g.gain.exponentialRampToValueAtTime(peak, t + 0.004)
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.06)
      src.start(t, k * 0.05, 0.08)
    })
  } catch (e) { /* audio unavailable — fail silently */ }
}

// Little "yay!" — a quick bright ascending major arpeggio.
export function playCheer() {
  try {
    const ac = audioCtx()
    if (!ac) return
    const now = ac.currentTime
    const out = ac.createGain()
    out.gain.value = 0.13
    out.connect(ac.destination)
    const notes = [523.25, 659.25, 783.99, 1046.5] // C5 E5 G5 C6
    notes.forEach((f, k) => {
      const o = ac.createOscillator()
      o.type = 'triangle'
      o.frequency.value = f
      const g = ac.createGain()
      o.connect(g)
      g.connect(out)
      const t = now + k * 0.075
      g.gain.setValueAtTime(0.0001, t)
      g.gain.exponentialRampToValueAtTime(0.5, t + 0.012)
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.5)
      o.start(t)
      o.stop(t + 0.55)
    })
  } catch (e) { /* audio unavailable — fail silently */ }
}

// Play a click when the pointer ENTERS any button / button-styled link, site-wide.
// De-duped so it fires once per element-enter, not repeatedly while moving inside it.
// Only real buttons + explicitly button-styled CTA links. Everything else — the logo,
// product/bag cards, nav and content links — is intentionally left out (no click sound).
const SFX_SEL =
  'button:not(.pdp-faq__q):not(.faq-card__btn):not(.pdp-science__tab):not(.faq-q), [role="button"], input[type="submit"], input[type="button"], ' +
  'a.btn, a.hero__btn, a.sampler__btn, a.story__btn, a.products__shop, a.pdp-btn, a.cart-btn'
let _sfxHovered = null
export function installButtonSfx() {
  if (typeof document === 'undefined' || document.__sfxInstalled) return
  document.__sfxInstalled = true

  // Browsers block audio until a real user gesture (hovering doesn't count), so
  // unlock the AudioContext on the first click/tap/keypress anywhere on the page.
  const unlock = () => {
    const ac = audioCtx()
    if (ac && ac.state === 'suspended') ac.resume()
    ;['pointerdown', 'keydown', 'touchstart'].forEach((ev) => window.removeEventListener(ev, unlock))
  }
  ;['pointerdown', 'keydown', 'touchstart'].forEach((ev) =>
    window.addEventListener(ev, unlock, { passive: true })
  )

  document.addEventListener(
    'pointerover',
    (e) => {
      const el = e.target.closest && e.target.closest(SFX_SEL)
      if (el === _sfxHovered) return // still inside the same control — don't retrigger
      _sfxHovered = el
      if (el && !el.hasAttribute('data-no-sfx')) playKey()
    },
    true
  )
}
