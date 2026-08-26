// @ts-check
const { test, expect } = require('@playwright/test');

test.setTimeout(60000);

async function gotoReady(page, path) {
  await page.goto(path, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => document.documentElement.classList.contains('page-ready'), null, {
    timeout: 20000,
  });
}

async function seedCheckoutCart(page) {
  await gotoReady(page, '/product/datejust-silver.html');
  await page.locator('#add-to-cart').click();
  await expect(page.locator('#cart-panel')).toHaveClass(/open/);
  // Close cart before navigation so overlays never block checkout controls.
  await page.locator('#cart-close').click();
  await expect(page.locator('#cart-panel')).not.toHaveClass(/open/);
  await gotoReady(page, '/checkout.html');
  await expect(page.locator('#order-summary .cart-item')).toBeVisible();
}

async function assertNoHorizontalOverflow(page) {
  const overflow = await page.evaluate(() => {
    const doc = document.documentElement;
    return {
      scrollWidth: doc.scrollWidth,
      clientWidth: doc.clientWidth,
    };
  });
  expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.clientWidth + 2);
}

async function openCatalogFiltersIfNeeded(page) {
  const openBtn = page.locator('#filters-open');
  if (await openBtn.isVisible()) {
    const expanded = await openBtn.getAttribute('aria-expanded');
    if (expanded !== 'true') await openBtn.click();
    await expect(page.locator('#filters-root')).toHaveClass(/open/);
    await expect(page.locator('#filters-panel')).toBeVisible();
  } else {
    await expect(page.locator('#filters-panel')).toBeVisible();
  }
}

async function closeCatalogFiltersIfNeeded(page) {
  const root = page.locator('#filters-root');
  if (await root.evaluate((el) => el.classList.contains('open')).catch(() => false)) {
    const apply = page.locator('#filters-apply');
    if (await apply.isVisible()) await apply.click();
    else await page.locator('#filters-close').click();
    await expect(root).not.toHaveClass(/open/);
  }
}

test.describe('CHRONOS static site', () => {
  test('homepage hero and sections', async ({ page }) => {
    await gotoReady(page, '/index.html');
    await expect(page.locator('.hero-cinematic')).toBeVisible();
    await expect(page.locator('.hero-content h1')).toBeVisible();
    await expect(page.locator('.marquee-strip')).toBeVisible();
    await expect(page.locator('.faq-item')).toHaveCount(4);
    await expect(page.locator('.cta-banner')).toBeVisible();
    await expect(page.locator('.logo-wrap .chronos-logo-mark')).toBeVisible();
    await expect(page.locator('.logo-wrap .chronos-logo-name')).toHaveText(/CHRONOS/i);
    await expect(page.locator('#hero-video')).toHaveCount(1);
    await expect(page.locator('.hero-poster')).toBeVisible();
    await assertNoHorizontalOverflow(page);
  });

  test('hero video respects reduced motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await gotoReady(page, '/index.html');
    await expect(page.locator('.hero-poster')).toBeVisible();
    const paused = await page.locator('#hero-video').evaluate((el) => /** @type {HTMLVideoElement} */ (el).paused);
    expect(paused).toBe(true);
  });

  test('responsive pages avoid horizontal overflow', async ({ page }) => {
    for (const path of ['/index.html', '/catalog.html', '/checkout.html', '/account.html', '/product/datejust-silver.html']) {
      await gotoReady(page, path);
      await expect(page.locator('main')).toBeVisible();
      await assertNoHorizontalOverflow(page);
    }
  });

  test('catalog sort dropdown appears above grid', async ({ page }) => {
    await gotoReady(page, '/catalog.html');
    await page.locator('#sort-select-btn').click();
    const menu = page.locator('#sort-select-menu');
    await expect(menu).toHaveClass(/open/);
    const box = await menu.boundingBox();
    expect(box?.height).toBeGreaterThan(80);
    await expect(menu.locator('[data-sort="luxury"]')).toBeVisible();
  });

  test('catalog filter does not re-animate cards', async ({ page }) => {
    await gotoReady(page, '/catalog.html');
    await page.waitForSelector('.product-card.no-reveal');
    const firstCard = page.locator('.product-card').first();
    await expect(firstCard).not.toHaveClass('reveal');
    await openCatalogFiltersIfNeeded(page);
    await page.locator('.filter-btn[data-style="classic"]').click();
    await expect(page.locator('.product-card').first()).not.toHaveClass('reveal');
  });

  test('catalog price range slider syncs numeric inputs and chips', async ({ page }) => {
    await gotoReady(page, '/catalog.html');
    await openCatalogFiltersIfNeeded(page);
    await expect(page.locator('#price-panel')).toBeVisible();
    await expect(page.locator('#price-min')).toBeVisible();

    await page.locator('#price-min-num').fill('40000');
    await page.locator('#price-min-num').dispatchEvent('change');
    await page.locator('#price-max-num').fill('90000');
    await page.locator('#price-max-num').dispatchEvent('change');

    await expect(page.locator('#price-min')).toHaveValue('40000');
    await expect(page.locator('#price-max')).toHaveValue('90000');
    await expect(page.locator('#active-filters')).toBeVisible();
    await expect(page.locator('#active-filters [data-clear-filter="price"]')).toBeVisible();
    await expect(page.locator('#catalog-count')).toContainText(/модел/);
    // Badge count must update on all viewports; visible only while mobile Filters CTA is shown.
    await expect(page.locator('#filters-badge')).toHaveText('1');
    await expect(page.locator('#filters-badge')).not.toHaveClass(/hidden/);
    if (await page.locator('#filters-open').isVisible()) {
      await expect(page.locator('#filters-open')).toHaveClass(/has-filters/);
      await expect(page.locator('#filters-badge')).toBeVisible();
    }

    await page.locator('#price-reset').click();
    await expect(page.locator('#price-min')).toHaveValue('0');
    await expect(page.locator('#price-max')).toHaveValue('130000');
    await expect(page.locator('#filters-badge')).toHaveClass(/hidden/);
  });

  test('catalog style chip and clear all filters keep sort', async ({ page }) => {
    await gotoReady(page, '/catalog.html');
    await page.locator('#sort-select-btn').click();
    await page.locator('[data-sort="luxury"]').click();
    await expect(page.locator('#sort-select-label')).toContainText(/люкс|Luxury|Lux/i);

    await openCatalogFiltersIfNeeded(page);
    await page.locator('.filter-btn[data-style="sport"]').click();
    await closeCatalogFiltersIfNeeded(page);
    await expect(page.locator('#active-filters [data-clear-filter="style"]')).toBeVisible();
    await expect(page).toHaveURL(/style=sport/);

    await page.locator('#catalog-search').fill('Datejust');
    await expect(page.locator('#active-filters [data-clear-filter="query"]')).toBeVisible({ timeout: 5000 });

    await page.locator('#active-filters [data-clear-filter="all"]').click();
    await expect(page.locator('#active-filters')).toHaveClass(/hidden/);
    await openCatalogFiltersIfNeeded(page);
    await expect(page.locator('.filter-btn[data-style=""]')).toHaveClass(/active/);
    await expect(page.locator('#sort-select-label')).toContainText(/люкс|Luxury|Lux/i);
  });

  test('mobile filters open as bottom sheet', async ({ page }) => {
    const width = page.viewportSize()?.width || 0;
    test.skip(width >= 900, 'Bottom sheet is mobile-only');
    await gotoReady(page, '/catalog.html');
    await expect(page.locator('#filters-open')).toBeVisible();
    await expect(page.locator('#filters-root')).not.toHaveClass(/open/);
    await page.locator('#filters-open').click();
    await expect(page.locator('#filters-root')).toHaveClass(/open/);
    await expect(page.locator('#filters-panel')).toBeVisible();
    await expect(page.locator('#style-filters')).toBeVisible();
    await expect(page.locator('#filters-apply')).toBeVisible();
    await page.locator('#filters-apply').click();
    await expect(page.locator('#filters-root')).not.toHaveClass(/open/);
  });

  test('wishlist heart does not open product page', async ({ page }) => {
    await gotoReady(page, '/catalog.html');
    const btn = page.locator('.product-card .wishlist-btn').first();
    await expect(btn).toBeVisible();
    await btn.click();
    await expect(page).toHaveURL(/catalog\.html/);
    await expect(btn).toHaveClass(/active/);
  });

  test('homepage wishlist heart does not open product page', async ({ page }) => {
    await gotoReady(page, '/index.html');
    const btn = page.locator('.product-card .wishlist-btn').first();
    await expect(btn).toBeVisible();
    await btn.click();
    await expect(page).not.toHaveURL(/product\//);
    await expect(btn).toHaveClass(/active/);
  });

  test('wishlist toggle persists', async ({ page }) => {
    await gotoReady(page, '/catalog.html');
    const btn = page.locator('.product-card [data-wishlist]').first();
    await expect(btn).toBeVisible();
    await btn.click();
    await expect(btn).toHaveClass(/active/);
    await expect(btn).toHaveAttribute('aria-pressed', 'true');
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => document.documentElement.classList.contains('page-ready'));
    await expect(page.locator('.product-card [data-wishlist]').first()).toHaveClass(/active/);
  });

  test('product page wishlist heart toggles without navigation', async ({ page }) => {
    await gotoReady(page, '/product/datejust-silver.html');
    const btn = page.locator('.product-actions [data-wishlist], .wishlist-btn-lg').first();
    await expect(btn).toBeVisible();
    await btn.click();
    await expect(page).toHaveURL(/product\/datejust-silver(\.html)?$/);
    await expect(btn).toHaveClass(/active/);
    await expect(page.locator('#wishlist-badge')).toBeVisible();
  });

  test('nav overlay stays above products and closes cleanly', async ({ page }) => {
    const width = page.viewportSize()?.width || 0;
    await gotoReady(page, '/catalog.html');

    const headerZ = await page.locator('#header').evaluate((el) => Number(getComputedStyle(el).zIndex));
    expect(headerZ).toBeGreaterThanOrEqual(300);

    if (width < 1024) {
      await page.locator('#menu-toggle').click();
      await expect(page.locator('#mobile-nav')).toHaveClass(/open/);
      await expect(page.locator('#mobile-nav-backdrop')).toHaveClass(/open/);
      const parent = await page.locator('#mobile-nav-backdrop').evaluate((el) => el.parentElement?.tagName);
      expect(parent).toBe('BODY');
      const navBox = await page.locator('#mobile-nav').boundingBox();
      const vh = page.viewportSize()?.height || 800;
      const tapY = Math.min(vh - 24, Math.max(12, (navBox?.y || 0) + (navBox?.height || 0) + 24));
      await page.locator('#mobile-nav-backdrop').click({
        position: { x: 16, y: tapY },
        force: true,
      });
      await expect(page.locator('#mobile-nav')).not.toHaveClass(/open/);
      return;
    }

    // Desktop: catalog dropdown must stack above product grid (regression: menu over products).
    await page.locator('#nav-dropdown-btn').click();
    await expect(page.locator('#nav-dropdown')).toHaveClass(/open/);
    const menu = page.locator('#nav-dropdown-menu');
    await expect(menu).toBeVisible();
    const stacking = await page.evaluate(() => {
      const dropdown = document.querySelector('#nav-dropdown-menu');
      const grid = document.querySelector('#catalog-grid, .product-grid, .catalog-main');
      if (!dropdown || !grid) return null;
      return {
        dropdownZ: Number(getComputedStyle(dropdown).zIndex),
        gridZ: Number(getComputedStyle(grid).zIndex) || 0,
        visibility: getComputedStyle(dropdown).visibility,
      };
    });
    expect(stacking).not.toBeNull();
    expect(stacking.dropdownZ).toBeGreaterThanOrEqual(320);
    expect(stacking.dropdownZ).toBeGreaterThan(stacking.gridZ);
    expect(stacking.visibility).toBe('visible');
    await page.keyboard.press('Escape');
    await expect(page.locator('#nav-dropdown')).not.toHaveClass(/open/);
  });

  test('cart add and checkout flow', async ({ page }) => {
    await gotoReady(page, '/product/datejust-silver.html');
    await page.locator('#add-to-cart').click();
    const panel = page.locator('#cart-panel');
    await expect(panel).toHaveClass(/open/);
    await expect(panel).toBeVisible();
    const layers = await page.evaluate(() => {
      const cart = document.querySelector('#cart-panel');
      const header = document.querySelector('#header');
      return {
        cartZ: Number(getComputedStyle(cart).zIndex),
        headerZ: Number(getComputedStyle(header).zIndex),
      };
    });
    expect(layers.cartZ).toBeGreaterThan(layers.headerZ);
    await page.locator('#cart-close').click();
    await expect(panel).not.toHaveClass(/open/);
    await gotoReady(page, '/checkout.html');
    await expect(page.locator('main')).toBeVisible();
    await expect(page.locator('#cart-panel.open')).toHaveCount(0);
  });

  test('checkout Nova Poshta delivery methods update delivery point field', async ({ page }) => {
    await seedCheckoutCart(page);
    await expect(page.locator('#cart-panel.open')).toHaveCount(0);
    await expect(page.locator('[data-delivery-method="branch"]')).toBeVisible();

    await expect(page.locator('[data-delivery-method="branch"]')).toHaveClass(/active/);
    await expect(page.locator('#delivery-point-label')).toHaveText('Відділення Нової Пошти');
    await expect(page.locator('#novaPoshta')).toHaveAttribute('placeholder', /Відділення №1/);

    await page.locator('[data-delivery-method="locker"]').click();
    await expect(page.locator('[data-delivery-method="locker"]')).toHaveClass(/active/);
    await expect(page.locator('#delivery-point-label')).toHaveText('Поштомат Нової Пошти');
    await expect(page.locator('#novaPoshta')).toHaveAttribute('placeholder', /Поштомат №12345/);

    await page.locator('[data-delivery-method="courier"]').click();
    await expect(page.locator('[data-delivery-method="courier"]')).toHaveClass(/active/);
    await expect(page.locator('#delivery-point-label')).toHaveText('Адреса доставки');
    await expect(page.locator('#novaPoshta')).toHaveAttribute('placeholder', /кв\. 5/);
  });

  test('checkout payment methods show honest payment notes', async ({ page }) => {
    await seedCheckoutCart(page);

    await expect(page.locator('.payment-option[data-payment="cod"]')).toHaveClass(/active/);
    await expect(page.locator('#payment-method-note')).toContainText('Комісію перевізника сплачує покупець');

    await page.locator('.payment-option[data-payment="card"]').click();
    await expect(page.locator('.payment-option[data-payment="card"]')).toHaveClass(/active/);
    await expect(page.locator('#payment-method-note')).toContainText('після підключення платіжного провайдера Shopify');
    await expect(page.locator('.payment-option[data-payment="card"] strong')).toHaveText('Онлайн-карткою');
  });

  test('checkout city autocomplete selects city', async ({ page }) => {
    await seedCheckoutCart(page);

    await page.locator('#city').fill('Ки');
    await expect(page.locator('#city-list')).toBeVisible();
    await page.locator('#city-list button', { hasText: 'Київ' }).click();
    await expect(page.locator('#city')).toHaveValue('Київ');
  });

  test('account page tabs', async ({ page }) => {
    await gotoReady(page, '/account.html');
    await expect(page.locator('.account-tab')).toHaveCount(2);
    await page.locator('.account-tab[data-tab="register"]').click();
    await expect(page.locator('#panel-register')).toHaveClass(/active/);
  });

  test('language switcher works repeatedly', async ({ page }) => {
    await gotoReady(page, '/index.html');
    const width = page.viewportSize()?.width || 0;
    const useMobileLang = width < 1024;

    if (useMobileLang) {
      await page.locator('#menu-toggle').click();
      await expect(page.locator('#mobile-nav')).toHaveClass(/open/);
    }

    const langBtn = page.locator(useMobileLang ? '#lang-btn-mobile' : '#lang-btn');
    const dropdown = page.locator(useMobileLang ? '#lang-dropdown-mobile' : '#lang-dropdown');

    await langBtn.click();
    await expect(dropdown).toHaveClass(/open/);
    await dropdown.locator('[data-lang="en"]').click();
    await expect(page.locator('.hero-content h1')).toContainText('Time is more');

    if (useMobileLang) {
      await page.locator('#menu-toggle').click();
      await expect(page.locator('#mobile-nav')).toHaveClass(/open/);
    }
    await langBtn.click();
    await dropdown.locator('[data-lang="uk"]').click();
    await expect(page.locator('.hero-content h1')).toContainText('Час');

    if (useMobileLang) {
      await page.locator('#menu-toggle').click();
      await expect(page.locator('#mobile-nav')).toHaveClass(/open/);
    }
    await langBtn.click();
    await dropdown.locator('[data-lang="de"]').click();
    await expect(page.locator('.hero-content h1')).toContainText('Zeit');
  });
});
