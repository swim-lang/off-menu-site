/* Off Menu — synthesized sound FX (ported from the React app's lib/sfx.js).
   No audio assets needed; a single AudioContext is unlocked on first gesture.
   playKey() on button hover (site-wide), playBell() on card hover ([data-sfx-bell]). */
(function () {
  'use strict';
  var _ac;
  function audioCtx() {
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    _ac = _ac || new AC();
    if (_ac.state === 'suspended') _ac.resume();
    return _ac;
  }

  // Diner "order up" tap-bell
  function playBell() {
    try {
      var ac = audioCtx(); if (!ac) return;
      var now = ac.currentTime;
      var out = ac.createGain(); out.gain.value = 0.12; out.connect(ac.destination);
      var nlen = Math.floor(ac.sampleRate * 0.03);
      var nb = ac.createBuffer(1, nlen, ac.sampleRate); var nd = nb.getChannelData(0);
      for (var i = 0; i < nlen; i++) nd[i] = Math.random() * 2 - 1;
      var click = ac.createBufferSource(); click.buffer = nb;
      var chp = ac.createBiquadFilter(); chp.type = 'highpass'; chp.frequency.value = 3800;
      var cg = ac.createGain(); click.connect(chp); chp.connect(cg); cg.connect(out);
      cg.gain.setValueAtTime(0.45, now); cg.gain.exponentialRampToValueAtTime(0.0001, now + 0.028);
      click.start(now); click.stop(now + 0.04);
      var fund = 2150, ratios = [1, 2.0, 2.97, 4.0], amps = [1, 0.45, 0.26, 0.13];
      ratios.forEach(function (rt, i) {
        var base = fund * rt, dur = 1.3 - i * 0.22;
        [-1, 1].forEach(function (det) {
          var o = ac.createOscillator(); o.type = 'sine'; o.frequency.value = base * (1 + det * 0.0018);
          var g = ac.createGain(); o.connect(g); g.connect(out);
          var peak = amps[i] * 0.32;
          g.gain.setValueAtTime(0.0001, now); g.gain.exponentialRampToValueAtTime(peak, now + 0.002);
          g.gain.exponentialRampToValueAtTime(0.0001, now + dur);
          o.start(now); o.stop(now + dur + 0.05);
        });
      });
    } catch (e) {}
  }

  // Crisp little click (button hover)
  function playKey() {
    try {
      var ac = audioCtx(); if (!ac) return;
      var now = ac.currentTime;
      var out = ac.createGain(); out.gain.value = 0.14; out.connect(ac.destination);
      var nlen = Math.floor(ac.sampleRate * 0.012);
      var nb = ac.createBuffer(1, nlen, ac.sampleRate); var nd = nb.getChannelData(0);
      for (var i = 0; i < nlen; i++) nd[i] = Math.random() * 2 - 1;
      var click = ac.createBufferSource(); click.buffer = nb;
      var hp = ac.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 1900;
      var cg = ac.createGain(); click.connect(hp); hp.connect(cg); cg.connect(out);
      cg.gain.setValueAtTime(0.6, now); cg.gain.exponentialRampToValueAtTime(0.0001, now + 0.012);
      click.start(now); click.stop(now + 0.02);
      var o = ac.createOscillator(); o.type = 'square';
      o.frequency.setValueAtTime(440, now); o.frequency.exponentialRampToValueAtTime(190, now + 0.018);
      var g = ac.createGain(); o.connect(g); g.connect(out);
      g.gain.setValueAtTime(0.0001, now); g.gain.exponentialRampToValueAtTime(0.1, now + 0.002);
      g.gain.exponentialRampToValueAtTime(0.0001, now + 0.025);
      o.start(now); o.stop(now + 0.035);
    } catch (e) {}
  }

  var SFX_SEL = 'button:not(.pdp-faq__q):not(.faq-card__btn):not(.pdp-science__tab):not(.faq-q), [role="button"], input[type="submit"], input[type="button"], a.hero__btn, a.story__btn, a.products__shop, a.pdp-btn, a.cart-btn, a.nav__chip, a.ship-reassure__cta, a.faq-hero__cta';
  var _hovered = null;

  function install() {
    if (!window.matchMedia || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    if (document.__sfxInstalled) return;
    document.__sfxInstalled = true;
    var unlock = function () {
      var ac = audioCtx(); if (ac && ac.state === 'suspended') ac.resume();
      ['pointerdown', 'keydown', 'touchstart'].forEach(function (ev) { window.removeEventListener(ev, unlock); });
    };
    ['pointerdown', 'keydown', 'touchstart'].forEach(function (ev) { window.addEventListener(ev, unlock, { passive: true }); });

    document.addEventListener('pointerover', function (e) {
      var bell = e.target.closest && e.target.closest('[data-sfx-bell]');
      if (bell && bell !== _hovered) { _hovered = bell; playBell(); return; }
      var el = e.target.closest && e.target.closest(SFX_SEL);
      if (el === _hovered) return;
      _hovered = el;
      if (el && !el.hasAttribute('data-no-sfx')) playKey();
    }, true);
  }

  if (document.readyState !== 'loading') install();
  else document.addEventListener('DOMContentLoaded', install);
  window.OffMenuSfx = { playBell: playBell, playKey: playKey };
})();
