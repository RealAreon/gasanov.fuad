(function () {
  'use strict';

  document.documentElement.classList.add('page-loading', 'animate-pending');

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function ensurePreloader() {
    if (document.getElementById('site-preloader')) return;
    const el = document.createElement('div');
    el.id = 'site-preloader';
    el.setAttribute('aria-hidden', 'true');
    el.innerHTML = `
      <div class="preloader-inner">
        <div class="preloader-watch">
          <svg class="preloader-watch-svg" viewBox="0 0 100 100" aria-hidden="true">
            <circle cx="50" cy="50" r="44" fill="none" stroke="currentColor" stroke-width="1.2" opacity="0.25"/>
            <circle cx="50" cy="50" r="38" fill="none" stroke="currentColor" stroke-width="0.6" opacity="0.15"/>
            <line x1="50" y1="10" x2="50" y2="14" stroke="currentColor" stroke-width="1.5" opacity="0.5"/>
            <line x1="50" y1="86" x2="50" y2="90" stroke="currentColor" stroke-width="1.5" opacity="0.5"/>
            <line x1="10" y1="50" x2="14" y2="50" stroke="currentColor" stroke-width="1.5" opacity="0.5"/>
            <line x1="86" y1="50" x2="90" y2="50" stroke="currentColor" stroke-width="1.5" opacity="0.5"/>
            <g class="preloader-hand-hour"><line x1="50" y1="50" x2="50" y2="30" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></g>
            <g class="preloader-hand-minute"><line x1="50" y1="50" x2="50" y2="20" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></g>
            <g class="preloader-hand-second"><line x1="50" y1="54" x2="50" y2="16" stroke="var(--gold)" stroke-width="1" stroke-linecap="round"/></g>
            <circle cx="50" cy="50" r="3" fill="currentColor"/>
          </svg>
        </div>
        <p class="preloader-brand">CHRONOS</p>
      </div>`;
    document.body.prepend(el);
  }

  ensurePreloader();

  function injectBgDecor() {
    if (document.querySelector('.bg-decor-layer')) return;
    const watchSvg = typeof icon === 'function' ? icon('watch') : '';
    const layer = document.createElement('div');
    layer.className = 'bg-decor-layer';
    layer.setAttribute('aria-hidden', 'true');
    layer.innerHTML = `
      <div class="bg-orb bg-orb-1" data-parallax="0.06"></div>
      <div class="bg-orb bg-orb-2" data-parallax="-0.04"></div>
      <div class="bg-orb bg-orb-3" data-parallax="0.08"></div>
      <div class="bg-line bg-line-1"></div>
      <div class="bg-line bg-line-2"></div>
      <div class="bg-dot bg-dot-1"></div>
      <div class="bg-dot bg-dot-2"></div>
      <div class="bg-dot bg-dot-3"></div>
      <div class="bg-dot bg-dot-4"></div>
      <div class="bg-float-icon bg-float-1">${watchSvg}</div>
      <div class="bg-float-icon bg-float-2">${watchSvg}</div>
      <div class="bg-float-icon bg-float-3">${watchSvg}</div>`;
    document.body.prepend(layer);
  }

  function hidePreloader() {
    const preloader = document.getElementById('site-preloader');
    if (!preloader) {
      finishPageReady();
      return;
    }
    preloader.classList.add('preloader-hide');
    setTimeout(() => {
      preloader.remove();
      finishPageReady();
    }, prefersReducedMotion ? 0 : 180);
  }

  function finishPageReady() {
    document.documentElement.classList.remove('page-loading');
    document.documentElement.classList.add('page-ready');
    requestAnimationFrame(() => {
      document.documentElement.classList.remove('animate-pending');
    });
  }

  function initPageTransition() {
    const revealWhenReady = () => {
      hidePreloader();
      requestAnimationFrame(() => initReveal());
    };

    const delay = prefersReducedMotion ? 0 : 80;
    if (document.readyState === 'complete') {
      setTimeout(revealWhenReady, delay);
    } else {
      window.addEventListener('load', () => setTimeout(revealWhenReady, delay), { once: true });
    }

    if (prefersReducedMotion) return;

    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href]');
      if (!link || !isInternalLink(link)) return;
      if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
      if (link.closest('.cart-panel, .search-panel, .lang-dropdown, .custom-select-menu')) return;
      e.preventDefault();
      document.documentElement.classList.add('page-leaving');
      setTimeout(() => { window.location.href = link.href; }, 380);
    });
  }

  function isInternalLink(a) {
    const href = a.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('tel:') || href.startsWith('mailto:') || href.startsWith('javascript:')) return false;
    if (a.target === '_blank' || a.hasAttribute('download')) return false;
    if (href.includes('://') && !href.includes(window.location.pathname.split('/').pop() || 'index.html')) {
      try {
        const url = new URL(href, window.location.href);
        if (url.protocol === 'file:' || url.origin === window.location.origin) return true;
        return false;
      } catch { return false; }
    }
    return /\.html|^\.\.?\/|^[a-z0-9_-]+\.html/i.test(href);
  }

  let revealObserver;

  function setupRevealObserver() {
    if (revealObserver) return revealObserver;
    if (prefersReducedMotion) {
      revealObserver = { observe() {}, unobserve() {} };
      return revealObserver;
    }
    revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );
    return revealObserver;
  }

  function refreshReveal(selector, immediate) {
    const els = document.querySelectorAll(selector || '.reveal:not(.revealed)');
    if (immediate) {
      els.forEach((el) => el.classList.add('reveal', 'revealed'));
      return;
    }
    const parent = els[0]?.closest('.products-grid, .testimonials-grid, .testimonials-scroll, .trust-grid, .categories-grid, .hero-stats');
    els.forEach((el, i) => {
      el.classList.remove('revealed');
      el.classList.add('reveal');
      if (parent) el.style.setProperty('--reveal-delay', `${i * 90}ms`);
      setupRevealObserver().observe(el);
    });
  }

  window.refreshReveal = refreshReveal;

  const REVEAL_SELECTORS = [
    '.section-header',
    '.product-card:not(.no-reveal)',
    '.category-card',
    '.testimonial-card',
    '.trust-item',
    '.stat-item',
    '.hero-content > *',
    '.hero-stats',
    '.account-card',
    '.page-header',
    '.filters-bar',
    '.brand-story-grid > *',
    '.faq-item',
    '.cta-banner',
    '.marquee-strip',
  ].join(',');

  function initReveal() {
    const staggerParents = '.products-grid, .testimonials-grid, .testimonials-scroll, .trust-grid, .categories-grid, .hero-stats';

    document.querySelectorAll(REVEAL_SELECTORS).forEach((el) => {
      if (el.classList.contains('reveal')) return;
      el.classList.add('reveal');
      const parent = el.closest(staggerParents);
      if (parent) {
        const index = [...parent.children].indexOf(el);
        el.style.setProperty('--reveal-delay', `${index * 90}ms`);
      }
    });

    if (prefersReducedMotion) {
      document.querySelectorAll('.reveal').forEach((el) => el.classList.add('revealed'));
      document.documentElement.classList.remove('animate-pending');
      return;
    }

    const observer = setupRevealObserver();
    const els = document.querySelectorAll('.reveal:not(.revealed)');

    els.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.classList.add('revealed');
      } else {
        observer.observe(el);
      }
    });

    document.documentElement.classList.remove('animate-pending');
  }

  function initParallax() {
    if (prefersReducedMotion) return;

    document.querySelectorAll('.hero-image').forEach((el) => {
      if (!el.dataset.parallax) el.dataset.parallax = '0.05';
    });

    document.querySelectorAll('.category-card').forEach((el) => {
      if (!el.dataset.parallax) el.dataset.parallax = '0.025';
    });

    const items = document.querySelectorAll('[data-parallax]');
    if (!items.length) return;

    let ticking = false;

    function update() {
      items.forEach((el) => {
        const speed = parseFloat(el.dataset.parallax) || 0.1;
        const rect = el.getBoundingClientRect();
        const offset = (rect.top + rect.height / 2 - window.innerHeight / 2) * speed;
        el.style.transform = `translate3d(0, ${offset}px, 0)`;
      });
      ticking = false;
    }

    window.addEventListener(
      'scroll',
      () => {
        if (!ticking) {
          requestAnimationFrame(update);
          ticking = true;
        }
      },
      { passive: true }
    );
    update();
  }

  function flyToCart(fromBtn) {
    const cartBtn = document.getElementById('cart-btn');
    if (!cartBtn || !fromBtn || prefersReducedMotion) return Promise.resolve();

    const from = fromBtn.getBoundingClientRect();
    const to = cartBtn.getBoundingClientRect();

    const flyer = document.createElement('div');
    flyer.className = 'fly-to-cart';
    flyer.innerHTML = typeof icon === 'function' ? icon('watch') : '';
    document.body.appendChild(flyer);

    const startX = from.left + from.width / 2;
    const startY = from.top + from.height / 2;
    const endX = to.left + to.width / 2;
    const endY = to.top + to.height / 2;
    const dx = endX - startX;
    const dy = endY - startY;

    Object.assign(flyer.style, {
      left: `${startX}px`,
      top: `${startY}px`,
    });

    const anim = flyer.animate(
      [
        { transform: 'translate(-50%, -50%) scale(1) rotate(0deg)', opacity: 1 },
        { transform: `translate(calc(-50% + ${dx * 0.5}px), calc(-50% + ${dy * 0.3}px)) scale(0.7) rotate(180deg)`, opacity: 1, offset: 0.5 },
        { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(0.2) rotate(360deg)`, opacity: 0 },
      ],
      { duration: 800, easing: 'cubic-bezier(0.4, 0, 0.2, 1)', fill: 'forwards' }
    );

    return anim.finished
      .then(() => {
        flyer.remove();
        cartBtn.classList.add('cart-pulse');
        setTimeout(() => cartBtn.classList.remove('cart-pulse'), 600);
      })
      .catch(() => flyer.remove());
  }

  window.flyToCart = flyToCart;

  document.addEventListener('DOMContentLoaded', () => {
    injectBgDecor();
    initPageTransition();
    initParallax();
    initCounters();
    initFaq();
  });

  function initCounters() {
    const counters = document.querySelectorAll('[data-count]');
    if (!counters.length || prefersReducedMotion) {
      counters.forEach(el => { el.textContent = (el.dataset.count || '') + (el.dataset.countSuffix || ''); });
      return;
    }
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.dataset.count, 10);
        const suffix = el.dataset.countSuffix || '';
        const duration = 1200;
        const start = performance.now();
        function tick(now) {
          const p = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(target * eased) + suffix;
          if (p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        obs.unobserve(el);
      });
    }, { threshold: 0.5 });
    counters.forEach(el => obs.observe(el));
  }

  function initFaq() {
    document.querySelectorAll('.faq-question').forEach(btn => {
      btn.addEventListener('click', () => {
        const item = btn.closest('.faq-item');
        const open = item.classList.toggle('open');
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
    });
  }
})();
