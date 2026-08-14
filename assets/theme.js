/* Off Menu — theme interactions (menu overlay + cart drawer shell).
   Section-specific behaviour (accordions, tickers, sliders, the chef-chop
   video filter) is added per section as those pages are ported. */
(function () {
  'use strict';

  var body = document.body;

  function lockScroll(on) { body.style.overflow = on ? 'hidden' : ''; }

  /* ===== Full-screen menu overlay ===== */
  var menu = document.querySelector('[data-menu]');
  function openMenu() { if (menu) { menu.hidden = false; lockScroll(true); } }
  function closeMenu() { if (menu) { menu.hidden = true; lockScroll(false); } }

  document.addEventListener('click', function (e) {
    if (e.target.closest('[data-menu-open]')) { openMenu(); }
    else if (e.target.closest('[data-menu-close]')) { closeMenu(); }
    else if (e.target.closest('[data-cart-open]')) { e.preventDefault(); openCart(); }
    else if (e.target.closest('[data-cart-close]')) { closeCart(); }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { closeMenu(); closeCart(); }
  });

  /* ===== Cart drawer (Shopify AJAX cart) ===== */
  var drawer = document.querySelector('[data-cart-drawer]');
  var SHIP_THRESHOLD = 3500; // cents ($35 free-shipping bar)

  function openCart() { if (drawer) { drawer.removeAttribute('hidden'); lockScroll(true); } }
  function closeCart() { if (drawer) { drawer.setAttribute('hidden', ''); lockScroll(false); } }

  function money(cents) { return '$' + (cents / 100).toFixed(2); }
  function sizedImg(src) { return src ? src.replace(/(\.(?:png|jpe?g|webp|gif))(\?.*)?$/i, '_240x$1') : ''; }

  function renderCart(cart) {
    var title = drawer && drawer.querySelector('.cd__title');
    if (title) title.textContent = 'Your Cart' + (cart.item_count ? ' (' + cart.item_count + ')' : '');
    var totalEl = drawer && drawer.querySelector('[data-cart-total]');
    if (totalEl) totalEl.textContent = money(cart.total_price);
    var body = drawer && drawer.querySelector('[data-cart-body]');
    if (!body) return;

    if (!cart.item_count) {
      body.innerHTML = '<div class="cd__empty"><h3 class="cart-empty__title">Nothing on the menu yet.</h3>' +
        '<p class="cart-empty__sub">Your cart is empty. Go pick a flavor.</p></div>';
      return;
    }

    var ship = cart.total_price >= SHIP_THRESHOLD
      ? '<div class="cart-ship cart-ship--done cd__ship"><span class="cart-ship__msg"><strong>Free shipping unlocked.</strong> The kitchen&rsquo;s fully stocked.</span><div class="cart-ship__bar"><span style="width:100%"></span></div></div>'
      : '<div class="cart-ship cd__ship"><span class="cart-ship__msg"><strong>You&rsquo;re ' + money(SHIP_THRESHOLD - cart.total_price) + ' away from free shipping.</strong> Add another bag and keep the kitchen stocked.</span><div class="cart-ship__bar"><span style="width:' + Math.min(cart.total_price / SHIP_THRESHOLD * 100, 100) + '%"></span></div></div>';

    var lines = cart.items.map(function (it, i) {
      var sub = (it.variant_title && it.variant_title !== 'Default Title') ? it.variant_title : 'Daily fiber chews';
      return '<div class="cart-line cd__line" data-line="' + (i + 1) + '">' +
        '<div class="cart-line__img" style="background-image:url(' + sizedImg(it.image) + ')" role="img" aria-label="' + it.product_title + '"></div>' +
        '<div class="cart-line__mid"><h3 class="cart-line__name serif">' + it.product_title + '</h3>' +
        '<p class="cart-line__sub">' + sub + '</p>' +
        '<div class="cart-stepper"><button type="button" class="cart-stepper__btn" data-qty-dec aria-label="Decrease">&minus;</button>' +
        '<span class="cart-stepper__val">' + it.quantity + '</span>' +
        '<button type="button" class="cart-stepper__btn" data-qty-inc aria-label="Increase">+</button></div></div>' +
        '<div class="cart-line__end"><span class="cart-line__price">' + money(it.final_line_price) + '</span>' +
        '<button type="button" class="cart-line__remove" data-remove>Remove</button></div></div>';
    }).join('');

    var summary = '<div class="cd__summary"><div class="cart-row"><span class="cart-row__label">Subtotal</span>' +
      '<span class="cart-row__val">' + money(cart.items_subtotal_price) + '</span></div>' +
      '<div class="cart-row"><span class="cart-row__label">Shipping</span>' +
      '<span class="cart-row__val cart-row__val--accent">' + (cart.total_price >= SHIP_THRESHOLD ? 'Free over $35' : 'Calculated at checkout') + '</span></div></div>';

    body.innerHTML = ship + lines + summary;
  }

  function refreshCart() { return fetch('/cart.js', { headers: { 'Accept': 'application/json' } }).then(function (r) { return r.json(); }).then(renderCart); }

  // qty +/- and remove (event delegation inside the drawer)
  if (drawer) {
    drawer.addEventListener('click', function (e) {
      var line = e.target.closest('[data-line]');
      if (!line) return;
      var idx = parseInt(line.getAttribute('data-line'), 10);
      var cur = parseInt(line.querySelector('.cart-stepper__val').textContent, 10);
      var qty = null;
      if (e.target.closest('[data-remove]')) qty = 0;
      else if (e.target.closest('[data-qty-inc]')) qty = cur + 1;
      else if (e.target.closest('[data-qty-dec]')) qty = Math.max(0, cur - 1);
      if (qty === null) return;
      fetch('/cart/change.js', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify({ line: idx, quantity: qty }) })
        .then(function (r) { return r.json(); }).then(renderCart);
    });
  }

  // Add-to-cart forms (PDP + any product form) -> add, refresh, open drawer
  document.addEventListener('submit', function (e) {
    var form = e.target.closest('form[action$="/cart/add"], form[data-product-form]');
    if (!form) return;
    e.preventDefault();
    var btn = form.querySelector('[type="submit"]');
    if (btn) btn.setAttribute('aria-busy', 'true');
    fetch('/cart/add.js', { method: 'POST', headers: { 'Accept': 'application/json' }, body: new FormData(form) })
      .then(function (r) { return r.json(); })
      .then(function () { return refreshCart(); })
      .then(function () { openCart(); })
      .catch(function () {})
      .then(function () { if (btn) btn.removeAttribute('aria-busy'); });
  });

  refreshCart();

  /* ===== Scroll reveal ===== */
  function initReveal(root) {
    var els = (root || document).querySelectorAll('[data-reveal]:not(.is-in)');
    if (!('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('is-in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.2 });
    els.forEach(function (el) { io.observe(el); });
  }
  initReveal(document);
  // Re-scan when sections are re-rendered in the theme editor
  document.addEventListener('shopify:section:load', function (e) { initReveal(e.target); });

  window.OffMenu = { openCart: openCart, closeCart: closeCart, initReveal: initReveal };
})();
