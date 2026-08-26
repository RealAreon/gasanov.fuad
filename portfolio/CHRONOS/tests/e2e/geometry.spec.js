// @ts-check
const { test, expect } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

test.setTimeout(90000);

const ROUTES = [
  { name: 'home', path: '/index.html' },
  { name: 'catalog', path: '/catalog.html' },
  { name: 'product', path: '/product/datejust-silver.html' },
  { name: 'wishlist', path: '/index.html' }, // wishlist is overlay; still measure page chrome
  { name: 'cart', path: '/index.html' },
  { name: 'checkout', path: '/checkout.html' },
  { name: 'account', path: '/account.html' },
];

const VIEWPORTS = [
  { width: 320, height: 812 },
  { width: 360, height: 800 },
  { width: 375, height: 812 },
  { width: 390, height: 844 },
  { width: 414, height: 896 },
  { width: 430, height: 932 },
  { width: 768, height: 1024 },
  { width: 1024, height: 768 },
  { width: 1366, height: 768 },
  { width: 1440, height: 900 },
  { width: 1920, height: 1080 },
];

const SCREEN_DIR = path.join(__dirname, '..', '..', 'qa-screens', 'geometry');

async function gotoReady(page, routePath) {
  await page.goto(routePath, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => document.documentElement.classList.contains('page-ready'), null, {
    timeout: 20000,
  });
  // Header fades in after page-ready; measure only when chrome is actually visible.
  await page.waitForFunction(() => {
    const wrap = document.getElementById('site-header');
    if (!wrap) return false;
    const wrapCs = getComputedStyle(wrap);
    if (wrapCs.visibility === 'hidden' || Number.parseFloat(wrapCs.opacity || '0') <= 0.9) return false;
    const candidates = [
      document.getElementById('cart-btn'),
      document.getElementById('wishlist-btn'),
      document.getElementById('search-btn'),
      document.getElementById('menu-toggle'),
    ].filter(Boolean);
    return candidates.some((btn) => {
      const cs = getComputedStyle(btn);
      return cs.display !== 'none' && cs.visibility !== 'hidden' && btn.getBoundingClientRect().width > 0;
    });
  }, null, { timeout: 20000 });
}

async function measureOverflow(page) {
  return page.evaluate(() => {
    const doc = document.documentElement;
    return { scrollWidth: doc.scrollWidth, clientWidth: doc.clientWidth };
  });
}

async function measureNavbar(page) {
  return page.evaluate(() => {
    const logo = document.querySelector('.logo-wrap');
    if (!logo) return { ok: false, reason: 'no logo' };
    const lr = logo.getBoundingClientRect();
    const nodes = [
      document.querySelector('.menu-toggle'),
      ...document.querySelectorAll('.header-actions > *'),
    ].filter(Boolean);

    /** @type {{id:string,left:number,right:number,top:number,bottom:number,w:number,h:number}[]} */
    const boxes = [];
    for (const el of nodes) {
      const cs = getComputedStyle(el);
      if (cs.display === 'none') continue;
      const r = el.getBoundingClientRect();
      if (r.width < 1 || r.height < 1) continue;
      boxes.push({
        id: el.id || el.className.toString().slice(0, 32),
        left: r.left,
        right: r.right,
        top: r.top,
        bottom: r.bottom,
        w: r.width,
        h: r.height,
      });
    }
    boxes.push({
      id: 'logo',
      left: lr.left,
      right: lr.right,
      top: lr.top,
      bottom: lr.bottom,
      w: lr.width,
      h: lr.height,
    });

    /** @type {string[][]} */
    const intersections = [];
    for (let i = 0; i < boxes.length; i++) {
      for (let j = i + 1; j < boxes.length; j++) {
        const a = boxes[i];
        const b = boxes[j];
        const hit = !(a.right <= b.left + 0.5 || a.left >= b.right - 0.5 || a.bottom <= b.top + 0.5 || a.top >= b.bottom - 0.5);
        if (hit) intersections.push([a.id, b.id]);
      }
    }

    const mobile = window.innerWidth < 1024;
    const actionIds = boxes.filter((b) => b.id !== 'logo').map((b) => b.id);
    const smallTargets = boxes.filter((b) => b.id !== 'logo' && (b.w < 43.5 || b.h < 43.5));

    return {
      ok: intersections.length === 0,
      intersections,
      boxes,
      actionIds,
      smallTargets,
      mobile,
    };
  });
}

async function measurePricePanel(page) {
  const openBtn = page.locator('#filters-open');
  if (await openBtn.isVisible()) {
    const expanded = await openBtn.getAttribute('aria-expanded');
    if (expanded !== 'true') await openBtn.click();
    await expect(page.locator('#filters-panel')).toBeVisible();
  }

  return page.evaluate(() => {
    const container = document.querySelector('#filters-panel') || document.querySelector('.catalog-filters');
    const panel = document.querySelector('#price-panel');
    const dual = document.querySelector('.dual-range');
    const inputs = document.querySelector('.price-inputs');
    const reset = document.querySelector('#price-reset');
    if (!container || !panel) return { ok: false, reason: 'missing nodes' };

    const cr = container.getBoundingClientRect();
    const box = (el) => {
      const r = el.getBoundingClientRect();
      return { left: r.left, right: r.right, top: r.top, bottom: r.bottom, w: r.width };
    };
    const inside = (a, b, tol = 1.5) => a.left >= b.left - tol && a.right <= b.right + tol;

    const panelBox = box(panel);
    const dualBox = dual ? box(dual) : null;
    const inputsBox = inputs ? box(inputs) : null;
    const resetBox = reset ? box(reset) : null;
    const containerBox = { left: cr.left, right: cr.right, top: cr.top, bottom: cr.bottom, w: cr.width };

    const thumbSafe =
      dualBox &&
      dualBox.left >= panelBox.left - 1 &&
      dualBox.right <= panelBox.right + 1;

    return {
      ok:
        inside(panelBox, containerBox) &&
        (!dualBox || inside(dualBox, panelBox)) &&
        (!inputsBox || inside(inputsBox, panelBox)) &&
        (!resetBox || inside(resetBox, panelBox)) &&
        !!thumbSafe &&
        container.scrollWidth <= container.clientWidth + 2,
      panelInside: inside(panelBox, containerBox),
      dualInside: dualBox ? inside(dualBox, panelBox) : null,
      inputsInside: inputsBox ? inside(inputsBox, panelBox) : null,
      resetInside: resetBox ? inside(resetBox, panelBox) : null,
      thumbSafe,
      containerScroll: { sw: container.scrollWidth, cw: container.clientWidth },
      panelBox,
      containerBox,
    };
  });
}

test.describe('CHRONOS geometry', () => {
  test.beforeAll(() => {
    fs.mkdirSync(SCREEN_DIR, { recursive: true });
  });

  test.beforeEach(({}, testInfo) => {
    // Viewports are asserted inside tests; avoid multiplying across Playwright projects.
    test.skip(testInfo.project.name !== '375x812', 'Geometry suite owns its viewports');
  });

  for (const vp of VIEWPORTS) {
    test(`no page overflow @ ${vp.width}x${vp.height}`, async ({ page }) => {
      await page.setViewportSize(vp);
      for (const route of ROUTES) {
        await gotoReady(page, route.path);
        if (route.name === 'wishlist') {
          await page.locator('#wishlist-btn').click();
          await expect(page.locator('#wishlist-panel')).toHaveClass(/open/);
        }
        if (route.name === 'cart') {
          await page.locator('#cart-btn').click();
          await expect(page.locator('#cart-panel')).toHaveClass(/open/);
        }
        const overflow = await measureOverflow(page);
        expect(overflow.scrollWidth, `${route.name} @ ${vp.width}`).toBeLessThanOrEqual(overflow.clientWidth + 2);
        if (route.name === 'wishlist') await page.locator('#wishlist-close').click().catch(() => {});
        if (route.name === 'cart') await page.locator('#cart-close').click().catch(() => {});
      }
    });

    test(`navbar boxes @ ${vp.width}x${vp.height}`, async ({ page }) => {
      await page.setViewportSize(vp);
      await gotoReady(page, '/index.html');
      const nav = await measureNavbar(page);
      expect(nav.intersections, JSON.stringify(nav.intersections)).toEqual([]);
      expect(nav.smallTargets, JSON.stringify(nav.smallTargets)).toEqual([]);
      if (vp.width <= 430) {
        expect(nav.actionIds.filter((id) => id === 'menu-toggle')).toHaveLength(1);
        expect(nav.actionIds.some((id) => id.includes('wishlist'))).toBeTruthy();
        expect(nav.actionIds.some((id) => id.includes('cart'))).toBeTruthy();
        expect(nav.actionIds.some((id) => id.includes('search'))).toBeFalsy();
        expect(nav.actionIds.some((id) => id.includes('lang'))).toBeFalsy();
        expect(nav.actionIds.some((id) => id.includes('account') || id.includes('header-action'))).toBeFalsy();
      }
    });
  }

  test('home header visible in viewport at scrollY=0', async ({ page }) => {
    for (const vp of [
      { width: 320, height: 812 },
      { width: 375, height: 812 },
      { width: 390, height: 844 },
      { width: 414, height: 896 },
    ]) {
      await page.setViewportSize(vp);
      await gotoReady(page, '/index.html');
      await page.evaluate(() => window.scrollTo(0, 0));
      const header = await page.evaluate(() => {
        const wrap = document.getElementById('site-header');
        const site = document.querySelector('.site-header');
        const menu = document.getElementById('menu-toggle');
        const logo = document.querySelector('.logo-wrap');
        const wish = document.getElementById('wishlist-btn');
        const cart = document.getElementById('cart-btn');
        const box = (el) => {
          if (!el) return null;
          const r = el.getBoundingClientRect();
          const cs = getComputedStyle(el);
          return {
            top: r.top,
            bottom: r.bottom,
            left: r.left,
            right: r.right,
            w: r.width,
            h: r.height,
            opacity: Number.parseFloat(cs.opacity || '0'),
            visibility: cs.visibility,
            display: cs.display,
          };
        };
        const siteBox = box(site);
        const inViewport =
          !!siteBox &&
          siteBox.top >= -1 &&
          siteBox.bottom <= window.innerHeight + 1 &&
          siteBox.left >= -1 &&
          siteBox.right <= window.innerWidth + 1 &&
          siteBox.h >= 40;
        return {
          scrollY: window.scrollY,
          wrapOpacity: wrap ? Number.parseFloat(getComputedStyle(wrap).opacity || '0') : 0,
          site: siteBox,
          menu: box(menu),
          logo: box(logo),
          wish: box(wish),
          cart: box(cart),
          inViewport,
        };
      });
      expect(header.scrollY, JSON.stringify(header)).toBe(0);
      expect(header.wrapOpacity).toBeGreaterThan(0.95);
      expect(header.inViewport, JSON.stringify(header.site)).toBeTruthy();
      expect(header.site?.visibility).toBe('visible');
      expect(header.menu?.display).not.toBe('none');
      expect(header.menu?.w).toBeGreaterThanOrEqual(43.5);
      expect(header.menu?.h).toBeGreaterThanOrEqual(43.5);
      expect(header.wish?.w).toBeGreaterThanOrEqual(43.5);
      expect(header.cart?.w).toBeGreaterThanOrEqual(43.5);
      expect(header.logo?.w).toBeGreaterThan(20);
    }
  });

  test('hero overlay and text contrast are readable', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 812 });
    await gotoReady(page, '/index.html');
    const contrast = await page.evaluate(() => {
      const overlay = document.querySelector('.hero-overlay');
      const h1 = document.querySelector('.hero-cinematic h1');
      const text = document.querySelector('.hero-cinematic .hero-text');
      const stats = document.querySelector('.hero-cinematic .stat-label');
      const bg = overlay ? getComputedStyle(overlay).backgroundImage : '';
      const alphas = [...bg.matchAll(/rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*([0-9.]+)\s*\)/g)].map((m) =>
        Number(m[1])
      );
      const maxAlpha = alphas.length ? Math.max(...alphas) : 1;
      const h1Color = h1 ? getComputedStyle(h1).color : '';
      const textColor = text ? getComputedStyle(text).color : '';
      const statsColor = stats ? getComputedStyle(stats).color : '';
      const parseRgb = (c) => {
        const m = c.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([0-9.]+))?\)/);
        if (!m) return null;
        return { r: +m[1], g: +m[2], b: +m[3], a: m[4] == null ? 1 : +m[4] };
      };
      const lum = (c) => {
        const p = parseRgb(c);
        if (!p) return 0;
        return (0.299 * p.r + 0.587 * p.g + 0.114 * p.b) * p.a;
      };
      const secondaryHidden = (() => {
        const btn = document.querySelector('.hero-btn-secondary, .hero-btns .btn-ghost');
        if (!btn) return true;
        const cs = getComputedStyle(btn);
        return cs.display === 'none' || cs.visibility === 'hidden';
      })();
      return {
        maxAlpha,
        h1Lum: lum(h1Color),
        textLum: lum(textColor),
        statsLum: lum(statsColor),
        h1Shadow: h1 ? getComputedStyle(h1).textShadow : '',
        textShadow: text ? getComputedStyle(text).textShadow : '',
        secondaryHidden,
      };
    });
    expect(contrast.maxAlpha, JSON.stringify(contrast)).toBeLessThanOrEqual(0.7);
    expect(contrast.h1Lum).toBeGreaterThan(200);
    expect(contrast.textLum).toBeGreaterThan(180);
    expect(contrast.statsLum).toBeGreaterThan(150);
    expect(contrast.h1Shadow).not.toBe('none');
    expect(contrast.secondaryHidden).toBeTruthy();
  });

  test('filter footer does not intersect price inputs', async ({ page }) => {
    for (const vp of [
      { width: 320, height: 812 },
      { width: 390, height: 844 },
    ]) {
      await page.setViewportSize(vp);
      await gotoReady(page, '/catalog.html');
      await page.locator('#filters-open').click();
      await expect(page.locator('#filters-panel')).toBeVisible();
      await page.evaluate(() => {
        const body = document.getElementById('filters-panel-body');
        const reset = document.getElementById('price-reset');
        const footer = document.querySelector('.filters-sheet-footer');
        if (!body || !reset || !footer) return;
        // Scroll price block fully into the body viewport above the sticky footer.
        body.scrollTop = body.scrollHeight;
        const fr = footer.getBoundingClientRect();
        const rr = reset.getBoundingClientRect();
        if (rr.bottom > fr.top - 8) {
          body.scrollTop += rr.bottom - fr.top + 16;
        }
      });
      await page.waitForTimeout(200);
      const fixed = await page.evaluate(() => {
        const footer = document.querySelector('.filters-sheet-footer');
        const inputs = document.querySelector('.price-inputs');
        const min = document.getElementById('price-min-num');
        const max = document.getElementById('price-max-num');
        const reset = document.getElementById('price-reset');
        const body = document.getElementById('filters-panel-body');
        if (!footer || !inputs || !min || !max || !reset || !body) return { ok: false };
        const fr = footer.getBoundingClientRect();
        const br = body.getBoundingClientRect();
        const boxes = [inputs, min, max, reset].map((el) => el.getBoundingClientRect());
        const intersects = (a, b) => !(a.bottom <= b.top + 1 || a.top >= b.bottom - 1 || a.right <= b.left + 1 || a.left >= b.right - 1);
        const hit = boxes.some((b) => intersects(fr, b));
        return {
          ok: !hit && br.bottom <= fr.top + 1,
          footerTop: fr.top,
          bodyBottom: br.bottom,
          lowest: Math.max(...boxes.map((b) => b.bottom)),
          gap: fr.top - Math.max(...boxes.map((b) => b.bottom)),
        };
      });
      expect(fixed.ok, JSON.stringify(fixed)).toBeTruthy();
      expect(fixed.gap).toBeGreaterThanOrEqual(0);    }
  });

  test('price panel contained in filter (mobile + desktop)', async ({ page }) => {
    for (const vp of [
      { width: 320, height: 812 },
      { width: 390, height: 844 },
      { width: 1366, height: 768 },
    ]) {
      await page.setViewportSize(vp);
      await gotoReady(page, '/catalog.html');
      const measure = await measurePricePanel(page);
      expect(measure.ok, JSON.stringify(measure)).toBeTruthy();
    }
  });

  test('capture required geometry screenshots', async ({ page }) => {
    const shots = [
      { file: 'home-320x812.png', path: '/index.html', size: { width: 320, height: 812 } },
      { file: 'home-375x812.png', path: '/index.html', size: { width: 375, height: 812 } },
      { file: 'home-390x844.png', path: '/index.html', size: { width: 390, height: 844 } },
      { file: 'home-414x896.png', path: '/index.html', size: { width: 414, height: 896 } },
      { file: 'catalog-filter-320x812.png', path: '/catalog.html', size: { width: 320, height: 812 }, filters: true },
      { file: 'catalog-filter-390x844.png', path: '/catalog.html', size: { width: 390, height: 844 }, filters: true },
      { file: 'catalog-filter-desktop-1366x768.png', path: '/catalog.html', size: { width: 1366, height: 768 }, filters: true },
      {
        file: 'catalog-filter-price-320x812.png',
        path: '/catalog.html',
        size: { width: 320, height: 812 },
        filters: true,
        scrollPrice: true,
      },
    ];

    for (const shot of shots) {
      await page.setViewportSize(shot.size);
      await gotoReady(page, shot.path);
      await page.evaluate(() => window.scrollTo(0, 0));
      if (shot.filters) {
        const openBtn = page.locator('#filters-open');
        if (await openBtn.isVisible()) {
          await openBtn.click();
          await expect(page.locator('#filters-panel')).toBeVisible();
          await page.waitForTimeout(300);
        }
      }
      if (shot.scrollPrice) {
        await page.evaluate(() => {
          const body = document.getElementById('filters-panel-body');
          if (body) body.scrollTop = body.scrollHeight;
        });
        await page.waitForTimeout(250);
      }
      // Ensure header chrome is painted before home shots
      if (shot.path.includes('index')) {
        await page.waitForFunction(() => {
          const menu = document.getElementById('menu-toggle');
          if (!menu) return false;
          const r = menu.getBoundingClientRect();
          const cs = getComputedStyle(menu);
          return cs.visibility === 'visible' && cs.opacity !== '0' && r.width >= 44 && r.top >= 0;
        });
      }
      const abs = path.join(SCREEN_DIR, shot.file);
      await page.screenshot({ path: abs, fullPage: false });
      expect(fs.existsSync(abs)).toBeTruthy();
    }
  });
});
