function getBase() {
  return document.body.dataset.base || '';
}

function mediaUrl(src) {
  if (!src) return '';
  if (/^(https?:|data:|blob:)/i.test(src)) return src;
  const base = getBase();
  return base + String(src).replace(/^\//, '');
}

function pageUrl(page) {
  const base = getBase();
  if (page === 'home') return base + 'index.html';
  if (page === 'catalog') return base + 'catalog.html';
  if (page === 'checkout') return base + 'checkout.html';
  if (page === 'account') return base + 'account.html';
  if (page === 'privacy') return base + 'privacy.html';
  if (page === 'cookies') return base + 'cookies.html';
  if (page === 'terms') return base + 'terms.html';
  if (page === 'offer') return base + 'offer.html';
  if (page.startsWith('product/')) return base + page + '.html';
  if (page.startsWith('catalog?')) return base + 'catalog.html?' + page.split('?')[1];
  return base + page;
}

function chronosLogoHtml(variant = 'full') {
  // Circular C + dial mark only (from brand reference) — no black plate screenshot.
  const mark = `<img class="chronos-logo-mark" src="${getBase()}public/logo-mark.png" alt="" width="64" height="64" decoding="async" aria-hidden="true" />`;
  if (variant === 'mark') {
    return `<span class="chronos-logo chronos-logo--mark">${mark}<span class="sr-only">CHRONOS</span></span>`;
  }
  if (variant === 'wordmark') {
    return `<span class="chronos-logo chronos-logo--wordmark"><span class="chronos-logo-name">CHRONOS</span><span class="chronos-logo-rule" aria-hidden="true"></span><span class="chronos-logo-sub">EST. MMXXVI</span></span>`;
  }
  return `<span class="chronos-logo chronos-logo--full">${mark}<span class="chronos-logo-text"><span class="chronos-logo-name">CHRONOS</span><span class="chronos-logo-sub">Swiss Timepieces</span></span></span>`;
}

function renderHeader() {
  const base = getBase();
  const el = document.getElementById('site-header');
  if (!el) return;

  el.innerHTML = `
    <header class="site-header" id="header">
      <div class="container header-inner">
        <nav class="nav-desktop">
          <div class="nav-dropdown" id="nav-dropdown">
            <button class="nav-dropdown-btn" type="button" id="nav-dropdown-btn" aria-expanded="false" aria-haspopup="true">${t('nav.catalog')} ▾</button>
            <div class="nav-dropdown-menu" id="nav-dropdown-menu">
              <a href="${pageUrl('catalog?style=classic')}"><strong>${t('nav.classic')}</strong><small>${t('nav.classic.desc')}</small><span class="category-line" aria-hidden="true"></span></a>
              <a href="${pageUrl('catalog?style=sport')}"><strong>${t('nav.sport')}</strong><small>${t('nav.sport.desc')}</small><span class="category-line" aria-hidden="true"></span></a>
              <a href="${pageUrl('catalog?style=dress')}"><strong>${t('nav.dress')}</strong><small>${t('nav.dress.desc')}</small><span class="category-line" aria-hidden="true"></span></a>
              <a href="${pageUrl('catalog?sort=new')}"><strong>${t('nav.new')}</strong><small>${t('nav.new.desc')}</small><span class="category-line" aria-hidden="true"></span></a>
              <a class="nav-dropdown-all" href="${pageUrl('catalog')}"><strong style="color:var(--gold);text-align:center;display:block;padding:.5rem">${t('nav.viewAll')}</strong></a>
            </div>
          </div>
        </nav>
        <button class="icon-btn menu-toggle" id="menu-toggle" aria-label="Menu" aria-expanded="false" aria-controls="mobile-nav">${icon('menu')}</button>
        <a href="${pageUrl('home')}" class="logo-wrap" aria-label="CHRONOS">
          ${chronosLogoHtml('full')}
        </a>
        <div class="header-actions">
          <div class="header-action-desktop">${typeof langSwitcherHtml === 'function' ? langSwitcherHtml() : ''}</div>
          <button class="icon-btn header-action-desktop" id="search-btn" aria-label="${t('search.title')}" style="position:relative">${icon('search')}</button>
          <button class="icon-btn" id="wishlist-btn" aria-label="${t('wishlist.title')}" style="position:relative">
            ${icon('heart')}
            <span class="cart-badge hidden" id="wishlist-badge">0</span>
          </button>
          <a href="${pageUrl('account')}" class="icon-btn header-action-desktop" aria-label="${t('account.title')}">${icon('user')}</a>
          <button class="icon-btn" id="cart-btn" aria-label="${t('cart.title')}" style="position:relative">
            ${icon('shopping-bag')}
            <span class="cart-badge hidden" id="cart-badge">0</span>
          </button>
        </div>
      </div>
      <div class="mobile-nav-backdrop" id="mobile-nav-backdrop"></div>
      <nav class="mobile-nav" id="mobile-nav">
        <a href="${pageUrl('catalog?style=classic')}">${t('nav.classic')}</a>
        <a href="${pageUrl('catalog?style=sport')}">${t('nav.sport')}</a>
        <a href="${pageUrl('catalog?style=dress')}">${t('nav.dress')}</a>
        <a href="${pageUrl('catalog?sort=new')}">${t('nav.new')}</a>
        <a href="${pageUrl('catalog')}" style="color:var(--gold);text-align:center;margin-top:.5rem">${t('nav.viewAllCatalog')}</a>
        <div class="mobile-nav-tools">
          <button type="button" class="mobile-nav-tool" id="mobile-search-btn">${icon('search')}<span>${t('search.title')}</span></button>
          <a class="mobile-nav-tool" href="${pageUrl('account')}">${icon('user')}<span>${t('account.title')}</span></a>
          <div class="mobile-nav-lang">${typeof langSwitcherHtml === 'function' ? langSwitcherHtml('mobile') : ''}</div>
        </div>
      </nav>
    </header>`;

  // Drawer + backdrop must live on <body>: header backdrop-filter creates a containing block for fixed children.
  ['mobile-nav-backdrop', 'mobile-nav'].forEach((id) => {
    const el = document.getElementById(id);
    if (el && el.parentElement !== document.body) {
      document.body.appendChild(el);
    }
  });

  const setMobileNav = (open) => {
    const nav = document.getElementById('mobile-nav');
    const backdrop = document.getElementById('mobile-nav-backdrop');
    const toggle = document.getElementById('menu-toggle');
    nav?.classList.toggle('open', open);
    backdrop?.classList.toggle('open', open);
    toggle?.setAttribute('aria-expanded', open ? 'true' : 'false');
    document.body.style.overflow = open ? 'hidden' : '';
  };

  document.getElementById('menu-toggle')?.addEventListener('click', () => {
    const open = !document.getElementById('mobile-nav')?.classList.contains('open');
    setMobileNav(open);
  });
  document.getElementById('mobile-nav-backdrop')?.addEventListener('click', () => setMobileNav(false));
  document.getElementById('mobile-nav')?.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => setMobileNav(false));
  });

  const dropdown = document.getElementById('nav-dropdown');
  const dropdownBtn = document.getElementById('nav-dropdown-btn');
  const closeNavDropdown = () => {
    dropdown?.classList.remove('open');
    dropdownBtn?.setAttribute('aria-expanded', 'false');
  };
  dropdownBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    const open = !dropdown?.classList.contains('open');
    dropdown?.classList.toggle('open', open);
    dropdownBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  if (!window.__chronosNavDropdownOutsideBound) {
    window.__chronosNavDropdownOutsideBound = true;
    document.addEventListener('click', (e) => {
      if (!dropdown?.classList.contains('open')) return;
      if (dropdown.contains(e.target)) return;
      closeNavDropdown();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    setMobileNav(false);
    closeNavDropdown();
  });

  document.getElementById('search-btn')?.addEventListener('click', openSearch);
  document.getElementById('mobile-search-btn')?.addEventListener('click', () => {
    setMobileNav(false);
    openSearch();
  });
  document.getElementById('wishlist-btn')?.addEventListener('click', openWishlist);
  document.getElementById('cart-btn')?.addEventListener('click', openCart);

  const syncHeaderScroll = () => {
    document.getElementById('header')?.classList.toggle('scrolled', window.scrollY > 40);
  };
  syncHeaderScroll();
  if (!window.__chronosHeaderScrollBound) {
    window.__chronosHeaderScrollBound = true;
    window.addEventListener('scroll', syncHeaderScroll, { passive: true });
  }

  if (typeof updateWishlistUI === 'function') updateWishlistUI();
}

function renderFooter() {
  const el = document.getElementById('site-footer');
  if (!el) return;
  el.innerHTML = `
    <footer class="site-footer">
      <div class="container footer-grid">
        <div class="footer-brand">
          ${chronosLogoHtml('full')}
          <p>${t('footer.desc')}</p>
          <div class="footer-socials">
            <a class="footer-social" href="https://instagram.com/" target="_blank" rel="noopener noreferrer">${icon('instagram')} Instagram</a>
            <a class="footer-social" href="https://t.me/" target="_blank" rel="noopener noreferrer">${icon('telegram')} Telegram</a>
          </div>
        </div>
        <div class="footer-col">
          <h4>${t('footer.nav')}</h4>
          <a href="${pageUrl('catalog')}">${t('nav.catalog')}</a>
          <a href="${pageUrl('catalog?style=classic')}">${t('nav.classic')}</a>
          <a href="${pageUrl('catalog?style=sport')}">${t('nav.sport')}</a>
          <a href="${pageUrl('catalog?style=dress')}">${t('nav.dress')}</a>
        </div>
        <div class="footer-col">
          <h4>${t('footer.contacts')}</h4>
          <a href="tel:+380930259157">${icon('phone')} +380 93 025 91 57</a>
          <a href="mailto:areon.softer@gmail.com">✉ areon.softer@gmail.com</a>
          <p>📍 Kyiv, Ukraine</p>
        </div>
        <div class="footer-col">
          <h4>${t('footer.schedule')}</h4>
          <p>${t('footer.hours')}</p>
          <p>${t('footer.support24')}</p>
          <p style="color:var(--gold);margin-top:1rem;font-size:.8rem">${t('footer.freeDelivery')}</p>
        </div>
      </div>
      <div class="container footer-bottom">
        <p>${t('footer.copyright')}</p>
        <div class="footer-links">
          <a href="${pageUrl('privacy')}">${t('footer.privacy')}</a>
          <a href="${pageUrl('cookies')}">${t('footer.cookies')}</a>
          <a href="${pageUrl('terms')}">${t('footer.terms')}</a>
          <a href="${pageUrl('offer')}">${t('footer.offer')}</a>
        </div>
      </div>
    </footer>`;
}

function initCookieBanner() {
  try {
    if (localStorage.getItem('chronos_cookies_accepted') === '1') return;
  } catch (_) { /* ignore */ }
  if (document.getElementById('cookie-banner')) return;

  const banner = document.createElement('div');
  banner.id = 'cookie-banner';
  banner.className = 'cookie-banner';
  banner.setAttribute('role', 'dialog');
  banner.setAttribute('aria-live', 'polite');
  banner.innerHTML = `
    <p>${t('cookie.text')} <a href="${pageUrl('cookies')}">${t('cookie.more')}</a></p>
    <div class="cookie-banner-actions">
      <button type="button" class="btn btn-gold" id="cookie-accept">${t('cookie.accept')}</button>
    </div>`;
  document.body.appendChild(banner);
  document.getElementById('cookie-accept')?.addEventListener('click', () => {
    try { localStorage.setItem('chronos_cookies_accepted', '1'); } catch (_) { /* ignore */ }
    banner.remove();
  });
}

function renderCartOverlay() {
  const overlay = document.getElementById('cart-overlay');
  if (!overlay) return;
  overlay.innerHTML = `
    <div class="overlay" id="cart-backdrop"></div>
    <aside class="cart-panel" id="cart-panel">
      <div class="cart-header">
        <h2 class="cart-title">${icon('shopping-bag')} ${t('cart.title')} (<span id="cart-count-label">0</span>)</h2>
        <button class="icon-btn" id="cart-close" aria-label="Close">${icon('x')}</button>
      </div>
      <div class="cart-body" id="cart-body"></div>
      <div class="cart-footer hidden" id="cart-footer">
        <div class="cart-total"><span>${t('cart.total')}</span><strong id="cart-total-price">0 ₴</strong></div>
        <div class="cart-footer-actions">
          <button type="button" class="btn btn-outline btn-full" id="cart-continue-btn">${t('cart.continue')}</button>
          <a href="${pageUrl('checkout')}" class="btn btn-gold btn-full" id="cart-checkout-btn">${t('cart.checkout')}</a>
        </div>
      </div>
    </aside>`;

  document.getElementById('cart-close')?.addEventListener('click', closeCart);
  document.getElementById('cart-backdrop')?.addEventListener('click', closeCart);
  document.getElementById('cart-continue-btn')?.addEventListener('click', closeCart);
}

function renderSearchOverlay() {
  const overlay = document.getElementById('search-overlay');
  if (!overlay) return;
  overlay.innerHTML = `
    <div class="overlay" id="search-backdrop"></div>
    <div class="search-panel" id="search-panel">
      <button class="icon-btn" id="search-close" style="float:right" aria-label="Закрити">${icon('x')}</button>
      <h2 style="margin-bottom:1rem;font-family:var(--font-serif)">${t('search.title')}</h2>
      <input type="search" class="search-input" id="search-input" placeholder="${t('search.placeholder')}">
      <div class="search-results" id="search-results"></div>
    </div>`;

  document.getElementById('search-close')?.addEventListener('click', closeSearch);
  document.getElementById('search-backdrop')?.addEventListener('click', closeSearch);
  document.getElementById('search-input')?.addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase().trim();
    const results = document.getElementById('search-results');
    if (!q) { results.innerHTML = ''; return; }
    const found = WATCHES.filter((w) => {
      const styleMap = { classic: 'nav.classic', sport: 'nav.sport', dress: 'nav.dress' };
      const styleLabel = (typeof t === 'function' ? t(styleMap[w.style] || '') : '').toLowerCase();
      const features = (w.features || []).join(' ').toLowerCase();
      return (
        w.name.toLowerCase().includes(q) ||
        w.brand.toLowerCase().includes(q) ||
        w.description.toLowerCase().includes(q) ||
        (w.longDescription || '').toLowerCase().includes(q) ||
        w.style.toLowerCase().includes(q) ||
        styleLabel.includes(q) ||
        features.includes(q) ||
        (w.specifications?.movement || '').toLowerCase().includes(q) ||
        (w.specifications?.diameter || '').toLowerCase().includes(q) ||
        (w.specifications?.case || '').toLowerCase().includes(q)
      );
    }).slice(0, 8);
    results.innerHTML = found.map((w) => `
      <a href="${pageUrl('product/' + w.id)}">
        <img src="${mediaUrl(w.images[0])}" alt="${w.name}" width="48" height="48">
        <div>
          <strong>${w.name}</strong><br>
          <small>${w.brand} · ${typeof t === 'function' ? t({ classic: 'nav.classic', sport: 'nav.sport', dress: 'nav.dress' }[w.style] || '') : w.style} · ${formatPrice(w.price)}</small>
        </div>
      </a>`).join('') || `<p style="color:var(--muted-fg);padding:1rem 0">${t('search.empty')}</p>`;
    if (found.length) {
      results.insertAdjacentHTML('beforeend', `<a href="${pageUrl('catalog')}?q=${encodeURIComponent(e.target.value.trim())}" style="display:block;text-align:center;padding:.75rem;color:var(--gold);font-size:.8rem;letter-spacing:.08em;text-transform:uppercase">Усі результати в каталозі →</a>`);
    }
  });
}

function updateCartUI() {
  const count = Cart.totalItems();
  const badge = document.getElementById('cart-badge');
  const label = document.getElementById('cart-count-label');
  if (badge) {
    badge.textContent = count;
    badge.classList.toggle('hidden', count === 0);
  }
  if (label) label.textContent = count;

  const body = document.getElementById('cart-body');
  const footer = document.getElementById('cart-footer');
  const totalEl = document.getElementById('cart-total-price');
  if (!body) return;

  const items = Cart.getDetailedItems();
  if (items.length === 0) {
    body.innerHTML = `<div class="cart-empty"><p>${t('cart.empty')}</p><button class="btn btn-outline" onclick="closeCart()">${t('cart.continue')}</button></div>`;
    footer?.classList.add('hidden');
    return;
  }

  body.innerHTML = items.map(({ watch, qty }) => `
    <div class="cart-item">
      <img src="${mediaUrl(watch.images[0])}" alt="${watch.name}">
      <div class="cart-item-info">
        <p class="product-brand">${watch.brand}</p>
        <p class="cart-item-name">${watch.name}</p>
        <p class="price">${formatPrice(watch.price)}</p>
        <div style="display:flex;align-items:center;margin-top:.5rem">
          <div class="cart-qty">
            <button type="button" data-cart-minus="${watch.id}">−</button>
            <span>${qty}</span>
            <button type="button" data-cart-plus="${watch.id}">+</button>
          </div>
          <button class="cart-remove" data-cart-remove="${watch.id}">${t('cart.remove')}</button>
        </div>
      </div>
    </div>`).join('');

  if (totalEl) totalEl.textContent = formatPrice(Cart.totalPrice());
  footer?.classList.remove('hidden');

  body.querySelectorAll('[data-cart-minus]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.cartMinus;
      const item = Cart.getItems().find(i => i.id === id);
      if (item) Cart.updateQty(id, item.qty - 1);
    });
  });
  body.querySelectorAll('[data-cart-plus]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.cartPlus;
      const item = Cart.getItems().find(i => i.id === id);
      if (item) Cart.updateQty(id, item.qty + 1);
    });
  });
  body.querySelectorAll('[data-cart-remove]').forEach(btn => {
    btn.addEventListener('click', () => Cart.remove(btn.dataset.cartRemove));
  });
}

function openCart() {
  updateCartUI();
  document.getElementById('cart-backdrop')?.classList.add('open');
  document.getElementById('cart-panel')?.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeCart() {
  document.getElementById('cart-backdrop')?.classList.remove('open');
  document.getElementById('cart-panel')?.classList.remove('open');
  document.body.style.overflow = '';
}
function openSearch() {
  document.getElementById('search-backdrop')?.classList.add('open');
  document.getElementById('search-panel')?.classList.add('open');
  document.getElementById('search-input')?.focus();
  document.body.style.overflow = 'hidden';
}
function closeSearch() {
  document.getElementById('search-backdrop')?.classList.remove('open');
  document.getElementById('search-panel')?.classList.remove('open');
  document.body.style.overflow = '';
}

function openWishlist() {
  const panel = document.getElementById('wishlist-panel');
  if (!panel) return;
  updateWishlistPanel();
  document.getElementById('wishlist-backdrop')?.classList.add('open');
  panel.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeWishlist() {
  document.getElementById('wishlist-backdrop')?.classList.remove('open');
  document.getElementById('wishlist-panel')?.classList.remove('open');
  document.body.style.overflow = '';
}

function renderWishlistOverlay() {
  let overlay = document.getElementById('wishlist-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'wishlist-overlay';
    document.body.appendChild(overlay);
  }
  overlay.innerHTML = `
    <div class="overlay" id="wishlist-backdrop"></div>
    <aside class="cart-panel" id="wishlist-panel">
      <div class="cart-header">
        <h2 class="cart-title">${icon('heart')} ${t('wishlist.title')} (<span id="wishlist-count-label">0</span>)</h2>
        <button class="icon-btn" id="wishlist-close" aria-label="Close">${icon('x')}</button>
      </div>
      <div class="cart-body" id="wishlist-body"></div>
      <div class="cart-footer hidden" id="wishlist-footer">
        <a href="${pageUrl('catalog')}" class="btn btn-outline btn-full" onclick="closeWishlist()">${t('cart.continue')}</a>
      </div>
    </aside>`;
  document.getElementById('wishlist-close')?.addEventListener('click', closeWishlist);
  document.getElementById('wishlist-backdrop')?.addEventListener('click', closeWishlist);
}

function updateWishlistPanel() {
  const body = document.getElementById('wishlist-body');
  const footer = document.getElementById('wishlist-footer');
  const label = document.getElementById('wishlist-count-label');
  if (!body || typeof Wishlist === 'undefined') return;

  const ids = Wishlist.getIds();
  if (label) label.textContent = ids.length;

  if (ids.length === 0) {
    body.innerHTML = `<div class="cart-empty"><p>${t('wishlist.empty')}</p><button class="btn btn-outline" onclick="closeWishlist()">${t('cart.continue')}</button></div>`;
    footer?.classList.add('hidden');
    return;
  }

  body.innerHTML = ids.map(id => {
    const w = WATCHES.find(x => x.id === id);
    if (!w) return '';
    return `<div class="cart-item">
      <a href="${pageUrl('product/' + w.id)}"><img src="${mediaUrl(w.images[0])}" alt="${w.name}"></a>
      <div class="cart-item-info">
        <p class="product-brand">${w.brand}</p>
        <p class="cart-item-name"><a href="${pageUrl('product/' + w.id)}">${w.name}</a></p>
        <p class="price">${formatPrice(w.price)}</p>
        <div style="display:flex;gap:.5rem;margin-top:.5rem;flex-wrap:wrap">
          <button class="btn btn-dark" data-add-cart="${w.id}" style="padding:.5rem 1rem;font-size:.65rem">${t('product.addToCart')}</button>
          <button class="cart-remove" data-wishlist="${w.id}">${t('wishlist.remove')}</button>
        </div>
      </div>
    </div>`;
  }).join('');
  footer?.classList.remove('hidden');
}

function initStaticProductWishlist() {
  document.querySelectorAll('.product-card').forEach((card) => {
    if (card.querySelector('.wishlist-btn')) return;
    const addBtn = card.querySelector('[data-add-cart]');
    const id = addBtn?.dataset.addCart;
    if (!id || typeof wishlistBtnHtml !== 'function') return;

    // Prefer media wrapper; never insert the heart inside a product <a>.
    let host = card.querySelector('.product-card-media');
    if (!host || host.closest('a')) {
      host = card;
    }
    host.insertAdjacentHTML('beforeend', wishlistBtnHtml(id));
  });
  if (typeof updateWishlistUI === 'function') updateWishlistUI();
}

function initProductPageWishlist() {
  const addBtn = document.getElementById('add-to-cart');
  const actions = document.querySelector('.product-actions');
  if (!addBtn || !actions || actions.querySelector('[data-wishlist]')) return;
  if (typeof wishlistBtnHtml !== 'function') return;
  const id = addBtn.dataset.watchId;
  if (!id) return;
  actions.insertAdjacentHTML('beforeend', wishlistBtnHtml(id).replace('class="wishlist-btn', 'class="wishlist-btn wishlist-btn-lg'));
  if (typeof updateWishlistUI === 'function') updateWishlistUI();
}

document.addEventListener('click', async (e) => {
  const addBtn = e.target.closest('[data-add-cart]');
  if (addBtn) {
    e.preventDefault();
    Cart.add(addBtn.dataset.addCart);
    if (typeof flyToCart === 'function') {
      await flyToCart(addBtn);
    }
    openCart();
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const productLayout = document.querySelector('.product-page .product-layout');
  if (productLayout && !document.querySelector('.back-to-catalog')) {
    productLayout.insertAdjacentHTML(
      'beforebegin',
      '<div class="container back-to-catalog-wrap"><a class="btn btn-outline back-to-catalog" href="../catalog.html" aria-label="Повернутися до каталогу">← Повернутися до каталогу</a></div>',
    );
  }
  renderHeader();
  renderFooter();
  renderCartOverlay();
  renderSearchOverlay();
  renderWishlistOverlay();
  updateCartUI();
  initStaticProductWishlist();
  initProductPageWishlist();
  initHeroVideo();
  initCookieBanner();
  if (typeof updateWishlistUI === 'function') updateWishlistUI();
  if (typeof applyTranslations === 'function') applyTranslations();
  window.addEventListener('cart-updated', updateCartUI);
  window.addEventListener('wishlist-updated', () => {
    if (typeof updateWishlistUI === 'function') updateWishlistUI();
    updateWishlistPanel();
  });
  window.addEventListener('lang-changed', () => {
    renderHeader();
    renderFooter();
    renderCartOverlay();
    renderSearchOverlay();
    renderWishlistOverlay();
    updateCartUI();
    initStaticProductWishlist();
    initProductPageWishlist();
    if (typeof updateWishlistUI === 'function') updateWishlistUI();
    applyTranslations();
    if (typeof updateLangSwitcherUI === 'function') updateLangSwitcherUI();
    if (typeof updateSortDropdownUI === 'function') updateSortDropdownUI();
    const cookieText = document.querySelector('#cookie-banner p');
    if (cookieText) {
      cookieText.innerHTML = `${t('cookie.text')} <a href="${pageUrl('cookies')}">${t('cookie.more')}</a>`;
      const accept = document.getElementById('cookie-accept');
      if (accept) accept.textContent = t('cookie.accept');
    }
  });
});

function initHeroVideo() {
  const wrap = document.querySelector('.hero-bg');
  const video = document.getElementById('hero-video');
  if (!wrap || !video) return;

  const base = (typeof getBase === 'function' ? getBase() : '') || '';
  const heroSrc = `${base}public/media/hero-chrono.mp4`;

  const ensureSource = () => {
    const current = video.getAttribute('data-active-src');
    if (current === heroSrc) return;
    video.setAttribute('data-active-src', heroSrc);
    while (video.firstChild) video.removeChild(video.firstChild);
    video.src = heroSrc;
    video.load();
  };

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const stopVideo = () => {
    video.pause();
    video.removeAttribute('autoplay');
    video.classList.add('is-static');
    wrap.classList.remove('is-playing');
  };
  const playVideo = () => {
    ensureSource();
    video.muted = true;
    video.defaultMuted = true;
    video.setAttribute('muted', '');
    video.setAttribute('playsinline', '');
    video.playsInline = true;
    video.setAttribute('webkit-playsinline', '');
    video.loop = true;
    const attempt = video.play();
    if (attempt && typeof attempt.then === 'function') {
      attempt
        .then(() => wrap.classList.add('is-playing'))
        .catch(() => wrap.classList.remove('is-playing'));
    }
  };

  ensureSource();

  if (reduce.matches) {
    stopVideo();
  } else {
    playVideo();
  }

  if (typeof reduce.addEventListener === 'function') {
    reduce.addEventListener('change', (e) => {
      if (e.matches) stopVideo();
      else playVideo();
    });
  }

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (reduce.matches) return;
      const next = isMobile() ? mobileSrc : desktopSrc;
      if (video.getAttribute('data-active-src') !== next) playVideo();
    }, 200);
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) video.pause();
    else if (!reduce.matches) playVideo();
  });
}

window.openCart = openCart;
window.closeCart = closeCart;
window.openSearch = openSearch;
window.closeSearch = closeSearch;
window.openWishlist = openWishlist;
window.closeWishlist = closeWishlist;
