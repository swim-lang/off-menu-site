// Off Menu revision/review system — ported from Arc88's vanilla widget and
// adapted for this React + HashRouter SPA. Talks to Supabase's REST API
// directly (no SDK). Activated by adding ?review=comment (or ?review=browse)
// to the URL, e.g. https://…/?review=comment#/. Sections opt in with a
// data-review-id="<pagePrefix>-<name>" attribute.
import './review.css'
import { REVIEW_CONFIG } from './reviewConfig'

// pagePrefix (first token of a review id) → hash route + friendly label.
const PAGE_ROUTES = {
  home: '/', shop: '/shop', product: '/product', ingredients: '/ingredients',
  howitworks: '/how-it-works', about: '/about', faq: '/faq',
  shipping: '/shipping', contact: '/contact', cart: '/cart',
}
const PAGE_LABELS = {
  home: 'Home', shop: 'Shop', product: 'Product', ingredients: 'Ingredients',
  howitworks: 'How It Works', about: 'About', faq: 'FAQ',
  shipping: 'Shipping', contact: 'Contact', cart: 'Cart',
}

let started = false

export function initReview() {
  if (started) return
  started = true

  const REVIEW_TABLE = REVIEW_CONFIG.table || 'offmenu_review_comments'
  const REVIEW_PROJECT = REVIEW_CONFIG.project || 'off-menu'
  const REVIEW_MODE_KEY = 'offmenu-review-mode'
  const REVIEW_URL = (REVIEW_CONFIG.supabaseUrl || '').replace(/\/$/, '')
  const REVIEW_KEY = REVIEW_CONFIG.supabaseAnonKey || ''
  const HAS_SUPABASE = Boolean(REVIEW_URL && REVIEW_KEY)

  const params = new URLSearchParams(window.location.search)
  const reviewParam = params.get('review')
  const reviewRequested = params.has('review')

  // Only activate for a shared ?review link or once a mode is in this session.
  if (!reviewRequested && !window.sessionStorage.getItem(REVIEW_MODE_KEY)) return

  // A valid ?review=<mode> jumps straight in; a bare ?review always shows the
  // Browse/Review chooser (ignores any stored mode); otherwise resume session.
  const validParamMode = ['browse', 'comment', 'view'].includes(reviewParam) ? reviewParam : ''
  const state = {
    mode: validParamMode || (reviewRequested ? '' : window.sessionStorage.getItem(REVIEW_MODE_KEY) || ''),
    comments: [],
    activeTarget: null,
    panelOpen: false,
    commentTab: 'open',
    notice: '',
    syncWarning: HAS_SUPABASE ? '' : 'Supabase review database is not configured yet. Comments cannot be saved.',
  }

  const layer = document.createElement('div')
  layer.className = 'review-layer'
  document.body.appendChild(layer)
  // Pins live in their own layer so they aren't wiped by render()'s innerHTML.
  const pinLayer = document.createElement('div')
  pinLayer.className = 'review-pins'
  document.body.appendChild(pinLayer)
  let noticeTimer = 0
  let pendingJump = null
  let pinRaf = 0

  // ---- routing helpers (hash-based) ----------------------------------------
  const currentRoute = () => {
    const raw = (window.location.hash || '#/').replace(/^#/, '')
    const path = raw.split('?')[0].replace(/\/+$/, '') || '/'
    return path || '/'
  }
  const prefixForRoute = (route) => {
    for (const key in PAGE_ROUTES) if (PAGE_ROUTES[key] === route) return key
    return 'home'
  }
  const pageName = () => prefixForRoute(currentRoute())
  const prefixOf = (reviewId) => (reviewId || '').split('-')[0]
  const routeForComment = (item) => PAGE_ROUTES[prefixOf(item.reviewId)] || '/'
  const commentPageLabel = (item) => PAGE_LABELS[prefixOf(item.reviewId)] || 'Home'

  const textQuote = (el) => (el.innerText || el.textContent || '')
    .replace(/\s+/g, ' ').trim().slice(0, 240)

  const escapeHtml = (value) => String(value == null ? '' : value)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;')

  // ---- Supabase row <-> comment mapping (matches the SQL schema) ------------
  const toComment = (row) => ({
    id: row.id, project: row.project, page: row.page, path: row.path,
    reviewId: row.review_id, selector: row.selector, textQuote: row.text_quote || '',
    comment: row.comment, status: row.status || 'open', viewport: row.viewport || null,
    createdAt: row.created_at, resolvedAt: row.resolved_at || null,
    reply: row.reply || '', replyAt: row.reply_at || null, replyAck: !!row.reply_ack,
  })
  const toRow = (item) => ({
    id: item.id, project: item.project, page: item.page, path: item.path,
    review_id: item.reviewId, selector: item.selector, text_quote: item.textQuote,
    comment: item.comment, status: item.status, viewport: item.viewport,
    created_at: item.createdAt, resolved_at: item.resolvedAt || null,
  })

  const request = async (path, options = {}) => {
    const res = await fetch(`${REVIEW_URL}/rest/v1/${path}`, {
      ...options,
      headers: {
        apikey: REVIEW_KEY,
        Authorization: `Bearer ${REVIEW_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=representation',
        ...(options.headers || {}),
      },
    })
    if (!res.ok) throw new Error(await res.text())
    if (res.status === 204) return []
    return res.json()
  }

  const openComments = () => state.comments.filter((c) => c.status !== 'resolved')
  const unrepliedComments = () => openComments().filter((c) => !c.reply)
  const repliedComments = () => openComments().filter((c) => c.reply)
  const resolvedComments = () => state.comments.filter((c) => c.status === 'resolved')
  const visibleComments = () => {
    if (state.commentTab === 'resolved') return resolvedComments()
    if (state.commentTab === 'reviewed') return repliedComments()
    return unrepliedComments()
  }

  const setMode = (mode) => {
    state.mode = mode
    state.activeTarget = null
    window.sessionStorage.setItem(REVIEW_MODE_KEY, mode)
    document.documentElement.dataset.reviewMode = mode || ''
    render()
    if (mode === 'browse' || mode === 'comment') loadComments()
  }

  const showNotice = (message) => {
    state.notice = message
    window.clearTimeout(noticeTimer)
    noticeTimer = window.setTimeout(() => { state.notice = ''; render() }, 2800)
    render()
  }

  const markCommentedSections = () => {
    document.querySelectorAll('[data-review-id]').forEach((node) => {
      const hasComment = state.comments.some((c) => c.status !== 'resolved' && c.reviewId === node.dataset.reviewId)
      node.classList.toggle('has-review-comment', hasComment)
    })
    renderPins()
  }

  // A numbered pin anchored to each commented section's box, tracking it on
  // scroll/resize so you always see where each note lives. Click → open panel.
  const renderPins = () => {
    pinLayer.innerHTML = ''
    if (state.mode !== 'browse' && state.mode !== 'comment') return
    const counts = {}
    openComments().forEach((c) => { counts[c.reviewId] = (counts[c.reviewId] || 0) + 1 })
    document.querySelectorAll('[data-review-id]').forEach((node) => {
      const n = counts[node.dataset.reviewId]
      if (!n) return
      const rect = node.getBoundingClientRect()
      if (rect.bottom < 8 || rect.top > window.innerHeight - 8) return // off-screen
      const pin = document.createElement('button')
      pin.type = 'button'
      pin.className = 'review-pin'
      pin.textContent = String(n)
      pin.title = `${n} comment${n > 1 ? 's' : ''} · ${node.dataset.reviewId}`
      // Anchor to the section's top-left corner — clear of the right-side panel.
      pin.style.left = `${Math.max(20, Math.min(window.innerWidth - 20, rect.left + 18))}px`
      pin.style.top = `${Math.max(20, Math.min(window.innerHeight - 20, rect.top + 18))}px`
      pin.addEventListener('click', () => {
        state.panelOpen = true
        state.commentTab = 'open'
        render()
        highlightCommentTarget(node.dataset.reviewId)
      })
      pinLayer.appendChild(pin)
    })
  }

  const schedulePins = () => {
    if (pinRaf) return
    pinRaf = requestAnimationFrame(() => { pinRaf = 0; renderPins() })
  }

  const loadComments = async () => {
    if (!HAS_SUPABASE) {
      state.syncWarning = 'Supabase review database is not configured yet. Comments cannot be saved.'
      render()
      return
    }
    try {
      const rows = await request(`${REVIEW_TABLE}?project=eq.${REVIEW_PROJECT}&select=*&order=created_at.desc`)
      state.comments = rows.map(toComment)
      state.syncWarning = ''
      markCommentedSections()
      render()
    } catch (error) {
      console.warn('Could not load Off Menu review comments.', error)
      state.syncWarning = 'Could not connect to the Supabase review database.'
      render()
    }
  }

  const highlightCommentTarget = (reviewId) => {
    const target = document.querySelector(`[data-review-id="${CSS.escape(reviewId)}"]`)
    if (!target) return false
    target.scrollIntoView({ behavior: 'smooth', block: 'center' })
    target.classList.add('review-jump')
    window.setTimeout(() => target.classList.remove('review-jump'), 1800)
    return true
  }

  const jumpToComment = (item) => {
    const route = routeForComment(item)
    if (route === currentRoute()) {
      if (highlightCommentTarget(item.reviewId)) return
    }
    // SPA nav: change the hash route; re-mark + highlight on hashchange.
    pendingJump = item.reviewId
    window.location.hash = route
  }

  const completePendingJump = () => {
    if (!pendingJump) return
    const reviewId = pendingJump
    pendingJump = null
    window.setTimeout(() => {
      if (!highlightCommentTarget(reviewId)) showNotice('That section could not be found on this page.')
    }, 140)
  }

  const resolveComment = async (id) => {
    if (!HAS_SUPABASE) { showNotice('Supabase is required to resolve comments.'); return }
    try {
      const resolvedAt = new Date().toISOString()
      const rows = await request(`${REVIEW_TABLE}?id=eq.${encodeURIComponent(id)}&project=eq.${REVIEW_PROJECT}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: 'resolved', resolved_at: resolvedAt }),
      })
      const saved = rows[0] ? toComment(rows[0]) : null
      state.comments = state.comments.map((c) => (c.id === id ? saved || { ...c, status: 'resolved', resolvedAt } : c))
      markCommentedSections()
      showNotice('Comment resolved.')
      render()
    } catch (error) {
      console.warn('Could not resolve comment.', error)
      showNotice('Could not resolve in Supabase.')
    }
  }

  // Reopen a resolved comment (e.g. resolved by accident). Returns it to Open,
  // or Reviewed if it already has a reply.
  const unresolveComment = async (id) => {
    if (!HAS_SUPABASE) { showNotice('Supabase is required to reopen comments.'); return }
    try {
      const rows = await request(`${REVIEW_TABLE}?id=eq.${encodeURIComponent(id)}&project=eq.${REVIEW_PROJECT}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: 'open', resolved_at: null }),
      })
      const saved = rows[0] ? toComment(rows[0]) : null
      state.comments = state.comments.map((c) => (c.id === id ? saved || { ...c, status: 'open', resolvedAt: null } : c))
      markCommentedSections()
      showNotice('Comment reopened.')
      render()
    } catch (error) {
      console.warn('Could not reopen comment.', error)
      showNotice('Could not reopen in Supabase.')
    }
  }

  // Team reply to a client comment. Sets reply + resets reply_ack so the client
  // has to review it. Re-replying (updating) also re-flags it for review.
  const addReply = async (id, text) => {
    const reply = (text || '').trim()
    if (!reply) return
    if (!HAS_SUPABASE) { showNotice('Supabase is required to reply.'); return }
    try {
      const replyAt = new Date().toISOString()
      const rows = await request(`${REVIEW_TABLE}?id=eq.${encodeURIComponent(id)}&project=eq.${REVIEW_PROJECT}`, {
        method: 'PATCH',
        body: JSON.stringify({ reply, reply_at: replyAt, reply_ack: false }),
      })
      const saved = rows[0] ? toComment(rows[0]) : null
      state.comments = state.comments.map((c) => (c.id === id ? (saved || { ...c, reply, replyAt, replyAck: false }) : c))
      showNotice('Reply sent — client will see it to review.')
      render()
    } catch (error) {
      console.warn('Could not save reply.', error)
      showNotice('Could not save reply. Has the reply column been added?')
    }
  }

  // Client acknowledges they have read the team reply.
  const acknowledgeReply = async (id) => {
    if (!HAS_SUPABASE) { showNotice('Supabase is required.'); return }
    try {
      const rows = await request(`${REVIEW_TABLE}?id=eq.${encodeURIComponent(id)}&project=eq.${REVIEW_PROJECT}`, {
        method: 'PATCH',
        body: JSON.stringify({ reply_ack: true }),
      })
      const saved = rows[0] ? toComment(rows[0]) : null
      state.comments = state.comments.map((c) => (c.id === id ? (saved || { ...c, replyAck: true }) : c))
      showNotice('Marked as reviewed.')
      render()
    } catch (error) {
      console.warn('Could not acknowledge reply.', error)
      showNotice('Could not update.')
    }
  }

  const saveComment = async (event) => {
    event.preventDefault()
    const textarea = layer.querySelector('[data-review-draft]')
    const draft = textarea ? textarea.value.trim() : ''
    if (!state.activeTarget || !draft) return
    if (!HAS_SUPABASE) {
      state.syncWarning = 'Supabase review database is not configured. This comment was not saved.'
      showNotice('Supabase is required to save comments.')
      return
    }
    const item = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      project: REVIEW_PROJECT,
      page: pageName(),
      path: window.location.hash || '#/',
      reviewId: state.activeTarget.reviewId,
      selector: state.activeTarget.selector,
      textQuote: state.activeTarget.textQuote,
      comment: draft,
      status: 'open',
      viewport: { width: window.innerWidth, height: window.innerHeight },
      createdAt: new Date().toISOString(),
      resolvedAt: null,
    }
    try {
      const rows = await request(REVIEW_TABLE, { method: 'POST', body: JSON.stringify(toRow(item)) })
      state.comments = [rows[0] ? toComment(rows[0]) : item, ...state.comments]
      state.activeTarget = null
      state.panelOpen = true
      state.syncWarning = ''
      markCommentedSections()
      showNotice('Comment saved.')
      render()
    } catch (error) {
      console.warn('Could not save comment.', error)
      state.syncWarning = 'Could not save to the Supabase review database.'
      showNotice('Comment was not saved.')
      render()
    }
  }

  const exportComments = () => {
    const blob = new Blob([JSON.stringify(state.comments, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `off-menu-review-comments-${new Date().toISOString().slice(0, 10)}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  // ---- markup --------------------------------------------------------------
  const toolbarMarkup = () => `
    <div class="review-toolbar" role="toolbar" aria-label="Off Menu review tools">
      <button type="button" data-review-mode="browse" class="${state.mode === 'browse' ? 'active' : ''}">Browse</button>
      <button type="button" data-review-mode="comment" class="${state.mode === 'comment' ? 'active' : ''}">Comment</button>
      <button type="button" data-review-panel>Comments <span class="review-count">${openComments().length}</span></button>
      <button type="button" data-review-export>Export</button>
      <button type="button" data-review-close aria-label="Close review tools">Close</button>
    </div>`

  const choiceMarkup = () => `
    <div class="review-mode-choice" role="dialog" aria-modal="true" aria-labelledby="reviewChoiceTitle">
      <div class="review-mode-card">
        <span>Off Menu private review</span>
        <h2 id="reviewChoiceTitle">Open the site for review.</h2>
        <p>Preview normally, or switch into comment mode to leave notes on any section. Comments save to Supabase and show up in the task list.</p>
        <div class="review-mode-actions">
          <button type="button" data-review-mode="browse">Preview website</button>
          <button type="button" data-review-mode="comment">Leave revisions</button>
        </div>
        ${state.syncWarning ? `<p class="review-warning">${state.syncWarning}</p>` : ''}
      </div>
    </div>`

  const popoverMarkup = () => state.activeTarget ? `
    <form class="review-popover" style="top:${state.activeTarget.top}px;left:${state.activeTarget.left}px" data-review-popover>
      <span class="review-popover-meta">${state.activeTarget.reviewId}</span>
      <p>${state.activeTarget.textQuote || 'Selected section'}</p>
      <textarea data-review-draft placeholder="Leave a revision note" autofocus></textarea>
      ${state.syncWarning ? `<small>${state.syncWarning}</small>` : ''}
      <div class="review-popover-actions">
        <button type="button" data-review-cancel>Cancel</button>
        <button type="submit">Save comment</button>
      </div>
    </form>` : ''

  const panelMarkup = () => state.panelOpen ? `
    <aside class="review-panel" aria-label="Review comments">
      <div class="review-panel-header">
        <span>Review comments</span>
        <button type="button" data-review-panel-close aria-label="Close comments panel">Close</button>
      </div>
      ${state.syncWarning ? `<p class="review-warning">${state.syncWarning}</p>` : ''}
      <div class="review-panel-tabs" role="tablist" aria-label="Comment status">
        <button type="button" data-review-tab="open" class="${state.commentTab === 'open' ? 'active' : ''}">Open <span>${unrepliedComments().length}</span></button>
        <button type="button" data-review-tab="reviewed" class="${state.commentTab === 'reviewed' ? 'active' : ''}">Reviewed <span>${repliedComments().length}</span></button>
        <button type="button" data-review-tab="resolved" class="${state.commentTab === 'resolved' ? 'active' : ''}">Resolved <span>${resolvedComments().length}</span></button>
      </div>
      <div class="review-panel-list">
        ${visibleComments().length ? visibleComments().map((item) => `
          <article class="${item.status === 'resolved' ? 'is-resolved' : ''} ${item.reply && !item.replyAck && item.status !== 'resolved' ? 'needs-review' : ''}">
            <div class="review-panel-meta">${commentPageLabel(item)} · ${escapeHtml(item.reviewId)}${item.reply && !item.replyAck ? ' · <span class="review-flag">Awaiting client review</span>' : ''}</div>
            <p>${escapeHtml(item.comment)}</p>
            ${item.textQuote ? `<blockquote>${escapeHtml(item.textQuote)}</blockquote>` : ''}
            ${item.reply ? `
              <div class="review-reply ${item.replyAck ? 'is-ack' : 'is-pending'}">
                <span class="review-reply-label">Reply from the team</span>
                <p>${escapeHtml(item.reply)}</p>
                ${item.replyAck
                  ? '<span class="review-reply-status">✓ Reviewed by client</span>'
                  : `<button type="button" data-review-ack="${item.id}">Mark as reviewed</button>`}
              </div>` : ''}
            <form class="review-reply-form" data-review-reply-form="${item.id}">
              <textarea data-review-reply-input placeholder="${item.reply ? 'Update the reply…' : 'Reply to this comment…'}"></textarea>
              <button type="submit">${item.reply ? 'Update reply' : 'Reply'}</button>
            </form>
            <div class="review-panel-actions">
              <button type="button" data-review-jump="${item.id}">Jump</button>
              ${item.status !== 'resolved'
                ? `<button type="button" data-review-resolve="${item.id}">Resolve</button>`
                : `<button type="button" data-review-unresolve="${item.id}">Reopen</button>`}
            </div>
          </article>`).join('') : `<p>No ${state.commentTab} comments yet.</p>`}
      </div>
    </aside>` : ''

  const render = () => {
    document.documentElement.dataset.reviewMode = state.mode || ''
    layer.innerHTML = [
      !state.mode ? choiceMarkup() : '',
      state.mode ? toolbarMarkup() : '',
      popoverMarkup(),
      panelMarkup(),
      state.notice ? `<div class="review-toast">${state.notice}</div>` : '',
    ].join('')
  }

  // ---- events --------------------------------------------------------------
  layer.addEventListener('click', (event) => {
    const modeButton = event.target.closest('button[data-review-mode]')
    if (modeButton) { setMode(modeButton.dataset.reviewMode); return }
    if (event.target.closest('[data-review-panel]')) { state.panelOpen = true; render(); return }
    if (event.target.closest('[data-review-panel-close]')) { state.panelOpen = false; render(); return }
    const tabButton = event.target.closest('button[data-review-tab]')
    if (tabButton) { state.commentTab = tabButton.dataset.reviewTab; render(); return }
    if (event.target.closest('[data-review-cancel]')) { state.activeTarget = null; render(); return }
    if (event.target.closest('[data-review-export]')) { exportComments(); return }
    if (event.target.closest('[data-review-close]')) {
      state.mode = ''; state.activeTarget = null; state.panelOpen = false
      window.sessionStorage.removeItem(REVIEW_MODE_KEY)
      document.documentElement.dataset.reviewMode = ''
      layer.remove()
      pinLayer.remove()
      started = false
      return
    }
    const jumpButton = event.target.closest('[data-review-jump]')
    if (jumpButton) {
      const comment = state.comments.find((c) => c.id === jumpButton.dataset.reviewJump)
      if (comment) jumpToComment(comment)
      else showNotice('That comment could not be found.')
      return
    }
    const ackButton = event.target.closest('[data-review-ack]')
    if (ackButton) { acknowledgeReply(ackButton.dataset.reviewAck); return }
    const resolveButton = event.target.closest('[data-review-resolve]')
    if (resolveButton) { resolveComment(resolveButton.dataset.reviewResolve); return }
    const unresolveButton = event.target.closest('[data-review-unresolve]')
    if (unresolveButton) unresolveComment(unresolveButton.dataset.reviewUnresolve)
  })

  layer.addEventListener('submit', (event) => {
    const replyForm = event.target.closest('[data-review-reply-form]')
    if (replyForm) {
      event.preventDefault()
      const input = replyForm.querySelector('[data-review-reply-input]')
      addReply(replyForm.dataset.reviewReplyForm, input ? input.value : '')
      return
    }
    saveComment(event)
  })

  // Click a section in comment mode → open the note popover.
  document.addEventListener('click', (event) => {
    if (state.mode !== 'comment') return
    if (event.target.closest('.review-layer, .review-pins, .review-toolbar, .review-panel, .review-popover, .review-mode-choice')) return
    const target = event.target.closest('[data-review-id]')
    if (!target) return
    event.preventDefault()
    event.stopPropagation()
    const rect = target.getBoundingClientRect()
    state.activeTarget = {
      reviewId: target.dataset.reviewId,
      selector: `[data-review-id="${target.dataset.reviewId}"]`,
      textQuote: textQuote(target),
      top: Math.min(window.innerHeight - 280, Math.max(16, rect.top + 16)),
      left: Math.min(window.innerWidth - 396, Math.max(16, rect.left + 16)),
    }
    render()
  }, true)

  // SPA route changes swap the DOM — re-mark sections and finish any jump.
  window.addEventListener('hashchange', () => {
    window.setTimeout(() => {
      document.documentElement.dataset.reviewMode = state.mode || ''
      markCommentedSections()
      completePendingJump()
    }, 60)
  })

  // Keep pins glued to their sections as the page scrolls or resizes.
  window.addEventListener('scroll', schedulePins, { passive: true })
  window.addEventListener('resize', schedulePins)

  render()
  if (state.mode === 'browse' || state.mode === 'comment') loadComments()
}
