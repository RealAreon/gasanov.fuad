const ITEMS_PER_PAGE = 8;
const SORT_OPTIONS = ['economy', 'luxury', 'new', 'old'];
const PRICE_MIN = 0;
const PRICE_MAX = 130000;
const PRICE_STEP = 5000;
const STYLE_LABEL_KEYS = {
  classic: 'nav.classic',
  sport: 'nav.sport',
  dress: 'nav.dress',
};

const FACETS = (() => {
  const styles = [];
  const materials = new Set();
  const movements = new Set();
  (typeof WATCHES !== 'undefined' ? WATCHES : []).forEach((w) => {
    if (w.style && !styles.includes(w.style)) styles.push(w.style);
    if (w.specifications?.case) materials.add(w.specifications.case);
    if (w.specifications?.movement) movements.add(w.specifications.movement);
  });
  return {
    styles,
    materials: [...materials].sort((a, b) => a.localeCompare(b, 'uk')),
    movements: [...movements].sort((a, b) => a.localeCompare(b, 'uk')),
  };
})();

let state = {
  style: '',
  material: '',
  movement: '',
  sort: 'economy',
  page: 1,
  minPrice: PRICE_MIN,
  maxPrice: PRICE_MAX,
  query: '',
  facet: '',
};

let renderToken = 0;

function clampPrice(value, fallback) {
  if (value === null || value === undefined || value === '') return fallback;
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(PRICE_MAX, Math.max(PRICE_MIN, Math.round(n / PRICE_STEP) * PRICE_STEP));
}

function hasPriceFilter() {
  return state.minPrice > PRICE_MIN || state.maxPrice < PRICE_MAX;
}

function activeFilterCount() {
  let n = 0;
  if (state.style) n += 1;
  if (state.material) n += 1;
  if (state.movement) n += 1;
  if (state.facet) n += 1;
  if (hasPriceFilter()) n += 1;
  if (state.query) n += 1;
  return n;
}

function hasActiveFilters() {
  return activeFilterCount() > 0;
}

function getFiltered() {
  let list = [...WATCHES];
  const q = state.query.trim().toLowerCase();

  if (state.style) list = list.filter((w) => w.style === state.style);
  if (state.material) list = list.filter((w) => w.specifications?.case === state.material);
  if (state.movement) list = list.filter((w) => w.specifications?.movement === state.movement);
  list = list.filter((w) => w.price >= state.minPrice && w.price <= state.maxPrice);

  if (state.facet === 'new') list = list.filter((w) => Boolean(w.isNew));
  if (state.facet === 'sale') list = list.filter((w) => Boolean(w.originalPrice));

  if (q) {
    list = list.filter((w) => {
      const styleLabel = t(STYLE_LABEL_KEYS[w.style] || '').toLowerCase();
      const features = (w.features || []).join(' ').toLowerCase();
      return (
        w.name.toLowerCase().includes(q) ||
        w.brand.toLowerCase().includes(q) ||
        w.description.toLowerCase().includes(q) ||
        (w.longDescription || '').toLowerCase().includes(q) ||
        w.style.toLowerCase().includes(q) ||
        styleLabel.includes(q) ||
        features.includes(q) ||
        String(w.price).includes(q) ||
        (w.specifications?.movement || '').toLowerCase().includes(q) ||
        (w.specifications?.diameter || '').toLowerCase().includes(q) ||
        (w.specifications?.case || '').toLowerCase().includes(q)
      );
    });
  }

  switch (state.sort) {
    case 'economy': list.sort((a, b) => a.price - b.price); break;
    case 'luxury': list.sort((a, b) => b.price - a.price); break;
    case 'new': list.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0)); break;
    case 'old': list.sort((a, b) => (a.isNew ? 1 : 0) - (b.isNew ? 1 : 0)); break;
  }
  return list;
}

function syncUrl() {
  const params = new URLSearchParams();
  if (state.style) params.set('style', state.style);
  if (state.material) params.set('material', state.material);
  if (state.movement) params.set('movement', state.movement);
  if (state.sort && state.sort !== 'economy') params.set('sort', state.sort);
  if (state.page > 1) params.set('page', String(state.page));
  if (state.minPrice > PRICE_MIN) params.set('min', String(state.minPrice));
  if (state.maxPrice < PRICE_MAX) params.set('max', String(state.maxPrice));
  if (state.query) params.set('q', state.query);
  if (state.facet) params.set('facet', state.facet);
  const qs = params.toString();
  history.replaceState(null, '', qs ? `catalog.html?${qs}` : 'catalog.html');
}

function updateSortDropdownUI() {
  const label = document.getElementById('sort-select-label');
  const active = document.querySelector(`#sort-select-menu [data-sort="${state.sort}"]`);
  if (label && active) label.textContent = active.textContent;
  document.querySelectorAll('#sort-select-menu [data-sort]').forEach((btn) => {
    const selected = btn.dataset.sort === state.sort;
    btn.classList.toggle('active', selected);
    btn.setAttribute('aria-selected', selected ? 'true' : 'false');
  });
}

function setSort(value) {
  if (!SORT_OPTIONS.includes(value)) return;
  state.sort = value;
  state.page = 1;
  updateSortDropdownUI();
  const menu = document.getElementById('sort-select-menu');
  const btn = document.getElementById('sort-select-btn');
  menu?.classList.remove('open');
  btn?.setAttribute('aria-expanded', 'false');
  renderCatalog();
}

function setupSortDropdown() {
  const btn = document.getElementById('sort-select-btn');
  const menu = document.getElementById('sort-select-menu');
  if (!btn || !menu || btn.dataset.ready) return;
  btn.dataset.ready = '1';

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const open = menu.classList.toggle('open');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  menu.querySelectorAll('[data-sort]').forEach((opt) => {
    opt.setAttribute('role', 'option');
    opt.addEventListener('click', () => setSort(opt.dataset.sort));
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('#sort-select-wrap')) {
      menu.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      menu.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    }
  });
}

function updatePriceUI() {
  const minInput = document.getElementById('price-min');
  const maxInput = document.getElementById('price-max');
  const minNum = document.getElementById('price-min-num');
  const maxNum = document.getElementById('price-max-num');
  const rangeLabel = document.getElementById('price-range-label');
  const fill = document.getElementById('price-range-fill');

  if (minInput) minInput.value = String(state.minPrice);
  if (maxInput) maxInput.value = String(state.maxPrice);
  if (minNum) minNum.value = String(state.minPrice);
  if (maxNum) maxNum.value = String(state.maxPrice);
  if (rangeLabel) rangeLabel.textContent = `${formatPrice(state.minPrice)} – ${formatPrice(state.maxPrice)}`;
  if (fill) {
    const left = ((state.minPrice - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100;
    const right = ((state.maxPrice - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100;
    fill.style.left = `${left}%`;
    fill.style.width = `${Math.max(0, right - left)}%`;
  }
}

function setPriceRange(min, max, { from = 'slider' } = {}) {
  let nextMin = clampPrice(min, state.minPrice);
  let nextMax = clampPrice(max, state.maxPrice);
  if (nextMin > nextMax) {
    if (from === 'min') nextMax = nextMin;
    else nextMin = nextMax;
  }
  state.minPrice = nextMin;
  state.maxPrice = nextMax;
  state.page = 1;
  updatePriceUI();
  renderCatalog();
}

function updateFiltersBadge() {
  const n = activeFilterCount();
  const badge = document.getElementById('filters-badge');
  const openBtn = document.getElementById('filters-open');
  const applyCount = document.getElementById('filters-apply-count');
  if (badge) {
    badge.textContent = String(n);
    badge.classList.toggle('hidden', n === 0);
  }
  openBtn?.classList.toggle('has-filters', n > 0);
  if (applyCount) applyCount.textContent = String(getFiltered().length);
}

function updateFacetUI() {
  document.querySelectorAll('[data-facet]').forEach((btn) => {
    const active = (btn.dataset.facet || '') === state.facet;
    btn.classList.toggle('active', active);
    btn.setAttribute('aria-pressed', active ? 'true' : 'false');
  });
}

function updateStyleUI() {
  document.querySelectorAll('[data-style]').forEach((btn) => {
    const active = (btn.dataset.style || '') === state.style;
    btn.classList.toggle('active', active);
    btn.setAttribute('aria-pressed', active ? 'true' : 'false');
  });
}

function updateSelectUI() {
  const material = document.getElementById('filter-material');
  const movement = document.getElementById('filter-movement');
  if (material) material.value = state.material;
  if (movement) movement.value = state.movement;
}

function renderActiveChips() {
  const wrap = document.getElementById('active-filters');
  if (!wrap) return;

  const chips = [];
  if (state.style) {
    chips.push({ key: 'style', label: t(STYLE_LABEL_KEYS[state.style] || 'catalog.collection') });
  }
  if (state.material) chips.push({ key: 'material', label: state.material });
  if (state.movement) chips.push({ key: 'movement', label: state.movement });
  if (state.facet === 'new') chips.push({ key: 'facet', label: t('badge.new') });
  if (state.facet === 'sale') chips.push({ key: 'facet', label: t('badge.sale') });
  if (hasPriceFilter()) {
    chips.push({ key: 'price', label: `${formatPrice(state.minPrice)} – ${formatPrice(state.maxPrice)}` });
  }
  if (state.query) chips.push({ key: 'query', label: `“${state.query}”` });

  if (!chips.length) {
    wrap.innerHTML = '';
    wrap.classList.add('hidden');
    return;
  }

  wrap.classList.remove('hidden');
  wrap.innerHTML = `
    <div class="active-filters-row" role="list" aria-label="${t('catalog.activeFilters')}">
      ${chips.map((chip) => `
        <button type="button" class="filter-chip" role="listitem" data-clear-filter="${chip.key}" aria-label="${t('catalog.removeFilter')}: ${chip.label}">
          <span>${chip.label}</span>
          <span aria-hidden="true">×</span>
        </button>`).join('')}
      <button type="button" class="filter-chip filter-chip-clear" data-clear-filter="all">${t('catalog.clear')}</button>
    </div>`;

  wrap.querySelectorAll('[data-clear-filter]').forEach((btn) => {
    btn.addEventListener('click', () => clearFilter(btn.dataset.clearFilter));
  });
}

function clearFilter(key) {
  if (key === 'style') state.style = '';
  if (key === 'material') state.material = '';
  if (key === 'movement') state.movement = '';
  if (key === 'facet') state.facet = '';
  if (key === 'price') {
    state.minPrice = PRICE_MIN;
    state.maxPrice = PRICE_MAX;
  }
  if (key === 'query') {
    state.query = '';
    const input = document.getElementById('catalog-search');
    if (input) input.value = '';
  }
  if (key === 'all') {
    state.style = '';
    state.material = '';
    state.movement = '';
    state.facet = '';
    state.query = '';
    state.minPrice = PRICE_MIN;
    state.maxPrice = PRICE_MAX;
    const input = document.getElementById('catalog-search');
    if (input) input.value = '';
  }
  state.page = 1;
  updateSortDropdownUI();
  updatePriceUI();
  updateFacetUI();
  updateStyleUI();
  updateSelectUI();
  renderCatalog();
}

function clearFilters() {
  clearFilter('all');
}

function renderCatalog() {
  const token = ++renderToken;
  const grid = document.getElementById('catalog-grid');
  if (grid) {
    grid.setAttribute('aria-busy', 'true');
    grid.classList.add('is-filtering');
  }

  const filtered = getFiltered();
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE) || 1;
  if (state.page > totalPages) state.page = totalPages;
  const pageItems = filtered.slice((state.page - 1) * ITEMS_PER_PAGE, state.page * ITEMS_PER_PAGE);

  const countEl = document.getElementById('catalog-count');
  if (countEl) {
    countEl.textContent = `${filtered.length} ${t('catalog.models')}`;
  }

  updateStyleUI();
  updateFacetUI();
  updateSelectUI();
  updatePriceUI();
  renderActiveChips();
  updateFiltersBadge();
  syncUrl();

  const paint = () => {
    if (token !== renderToken || !grid) return;
    const prevMinHeight = grid.style.minHeight;
    grid.style.minHeight = `${Math.max(grid.offsetHeight, 240)}px`;

    if (pageItems.length === 0) {
      grid.innerHTML = `<div class="catalog-empty"><p>${t('catalog.notFound')}</p><button type="button" class="btn btn-outline" id="clear-filters">${t('catalog.clear')}</button></div>`;
      document.getElementById('clear-filters')?.addEventListener('click', clearFilters);
    } else {
      grid.innerHTML = pageItems.map((w) => productCardHtml(w)).join('');
      if (typeof updateWishlistUI === 'function') updateWishlistUI();
    }

    renderPagination(totalPages);
    grid.classList.remove('is-filtering');
    grid.setAttribute('aria-busy', 'false');
    requestAnimationFrame(() => {
      if (token === renderToken) grid.style.minHeight = prevMinHeight || '';
    });
  };

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) paint();
  else requestAnimationFrame(paint);
}

function renderPagination(totalPages) {
  const pag = document.getElementById('pagination');
  if (!pag) return;
  if (totalPages <= 1) { pag.innerHTML = ''; return; }

  const pages = [];
  const current = state.page;
  pages.push(1);
  if (current > 3) pages.push('…');
  for (let i = Math.max(2, current - 1); i <= Math.min(totalPages - 1, current + 1); i++) pages.push(i);
  if (current < totalPages - 2) pages.push('…');
  if (totalPages > 1) pages.push(totalPages);

  let html = `<button class="pag-arrow" ${current === 1 ? 'disabled' : ''} id="prev-page" aria-label="${t('catalog.prev') || 'Previous'}">‹</button>`;
  pages.forEach((p) => {
    if (p === '…') html += `<span class="pag-dots" aria-hidden="true">…</span>`;
    else html += `<button class="${current === p ? 'active' : ''}" data-page="${p}" aria-label="Page ${p}" ${current === p ? 'aria-current="page"' : ''}>${p}</button>`;
  });
  html += `<button class="pag-arrow" ${current === totalPages ? 'disabled' : ''} id="next-page" aria-label="${t('catalog.next') || 'Next'}">›</button>`;
  pag.innerHTML = html;

  pag.querySelectorAll('[data-page]').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.page = +btn.dataset.page;
      renderCatalog();
      document.querySelector('.catalog-toolbar')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
  document.getElementById('prev-page')?.addEventListener('click', () => { if (state.page > 1) { state.page--; renderCatalog(); } });
  document.getElementById('next-page')?.addEventListener('click', () => { if (state.page < totalPages) { state.page++; renderCatalog(); } });
}

function productCardHtml(w) {
  const badge = w.originalPrice
    ? `<span class="badge badge-sale">${t('badge.sale')}</span>`
    : w.isNew ? `<span class="badge badge-new">${t('badge.new')}</span>` : '';
  const orig = w.originalPrice ? `<span class="price-old">${formatPrice(w.originalPrice)}</span>` : '';
  const wish = typeof wishlistBtnHtml === 'function' ? wishlistBtnHtml(w.id) : '';
  return `<article class="product-card no-reveal">
    <div class="product-card-media">
      <a href="product/${w.id}.html" aria-label="${w.name}">
      <div class="product-image">
        <img src="${typeof mediaUrl === 'function' ? mediaUrl(w.images[0]) : w.images[0]}" alt="${w.name}" loading="lazy" decoding="async" width="600" height="600">${badge}
      </div>
      </a>
      ${wish}
    </div>
    <a href="product/${w.id}.html" class="product-link">
      <div class="product-info">
        <p class="product-brand">${w.brand}</p>
        <h3 class="product-name">${w.name}</h3>
        <p class="product-desc">${w.description}</p>
        <div class="product-prices"><span class="price">${formatPrice(w.price)}</span>${orig}</div>
      </div>
    </a>
    <button class="btn btn-dark btn-full" data-add-cart="${w.id}">${t('product.addToCart')}</button>
  </article>`;
}

function setupPriceControls() {
  const minInput = document.getElementById('price-min');
  const maxInput = document.getElementById('price-max');
  const minNum = document.getElementById('price-min-num');
  const maxNum = document.getElementById('price-max-num');
  const resetBtn = document.getElementById('price-reset');

  document.getElementById('price-panel')?.classList.remove('hidden');

  minInput?.addEventListener('input', () => setPriceRange(+minInput.value, state.maxPrice, { from: 'min' }));
  maxInput?.addEventListener('input', () => setPriceRange(state.minPrice, +maxInput.value, { from: 'max' }));

  const commitNum = (which) => {
    const min = which === 'min' ? +(minNum?.value || state.minPrice) : state.minPrice;
    const max = which === 'max' ? +(maxNum?.value || state.maxPrice) : state.maxPrice;
    setPriceRange(min, max, { from: which });
  };
  minNum?.addEventListener('change', () => commitNum('min'));
  maxNum?.addEventListener('change', () => commitNum('max'));
  resetBtn?.addEventListener('click', () => {
    state.minPrice = PRICE_MIN;
    state.maxPrice = PRICE_MAX;
    state.page = 1;
    updatePriceUI();
    renderCatalog();
  });
}

function isMobileFilters() {
  return window.matchMedia('(max-width: 899px)').matches;
}

function openFiltersSheet() {
  const root = document.getElementById('filters-root');
  const panel = document.getElementById('filters-panel');
  const openBtn = document.getElementById('filters-open');
  if (!root || !panel) return;
  root.classList.add('open');
  document.body.classList.add('filters-sheet-open');
  panel.setAttribute('aria-modal', isMobileFilters() ? 'true' : 'false');
  openBtn?.setAttribute('aria-expanded', 'true');
  updateFiltersBadge();
  const closeBtn = document.getElementById('filters-close');
  closeBtn?.focus();
}

function closeFiltersSheet() {
  const root = document.getElementById('filters-root');
  const panel = document.getElementById('filters-panel');
  const openBtn = document.getElementById('filters-open');
  if (!root) return;
  root.classList.remove('open');
  document.body.classList.remove('filters-sheet-open');
  panel?.setAttribute('aria-modal', 'false');
  openBtn?.setAttribute('aria-expanded', 'false');
  openBtn?.focus();
}

function setupFiltersSheet() {
  const openBtn = document.getElementById('filters-open');
  if (openBtn?.dataset.ready) return;
  if (openBtn) openBtn.dataset.ready = '1';

  openBtn?.addEventListener('click', () => {
    if (document.getElementById('filters-root')?.classList.contains('open')) closeFiltersSheet();
    else openFiltersSheet();
  });
  document.getElementById('filters-close')?.addEventListener('click', closeFiltersSheet);
  document.getElementById('filters-backdrop')?.addEventListener('click', closeFiltersSheet);
  document.getElementById('filters-apply')?.addEventListener('click', closeFiltersSheet);
  document.getElementById('filters-reset-all')?.addEventListener('click', () => clearFilters());

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && document.getElementById('filters-root')?.classList.contains('open') && isMobileFilters()) {
      closeFiltersSheet();
    }
  });

  window.addEventListener('resize', () => {
    if (!isMobileFilters()) {
      document.body.classList.remove('filters-sheet-open');
      document.getElementById('filters-root')?.classList.remove('open');
      document.getElementById('filters-open')?.setAttribute('aria-expanded', 'false');
    }
  });
}

function setupCatalogSearch() {
  const input = document.getElementById('catalog-search');
  if (!input || input.dataset.ready) return;
  input.dataset.ready = '1';
  input.value = state.query;
  let timer;
  input.addEventListener('input', () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      state.query = input.value.trim();
      state.page = 1;
      renderCatalog();
    }, 160);
  });
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      input.value = '';
      state.query = '';
      state.page = 1;
      renderCatalog();
    }
  });
}

function buildFacetControls() {
  const styleWrap = document.getElementById('style-filters');
  if (styleWrap && !styleWrap.dataset.ready) {
    styleWrap.dataset.ready = '1';
    const buttons = [
      { style: '', labelKey: 'catalog.all' },
      ...FACETS.styles.map((style) => ({ style, labelKey: STYLE_LABEL_KEYS[style] })),
    ];
    styleWrap.innerHTML = buttons.map((b) => `
      <button type="button" class="filter-btn${b.style === state.style ? ' active' : ''}" data-style="${b.style}" data-i18n="${b.labelKey}" aria-pressed="${b.style === state.style ? 'true' : 'false'}">${t(b.labelKey)}</button>
    `).join('');
    styleWrap.querySelectorAll('[data-style]').forEach((btn) => {
      btn.addEventListener('click', () => {
        state.style = btn.dataset.style || '';
        state.page = 1;
        renderCatalog();
      });
    });
  }

  const material = document.getElementById('filter-material');
  if (material && !material.dataset.ready) {
    material.dataset.ready = '1';
    material.innerHTML = `<option value="">${t('catalog.all')}</option>` +
      FACETS.materials.map((m) => `<option value="${m.replace(/"/g, '&quot;')}">${m}</option>`).join('');
    material.addEventListener('change', () => {
      state.material = material.value;
      state.page = 1;
      renderCatalog();
    });
  }

  const movement = document.getElementById('filter-movement');
  if (movement && !movement.dataset.ready) {
    movement.dataset.ready = '1';
    movement.innerHTML = `<option value="">${t('catalog.all')}</option>` +
      FACETS.movements.map((m) => `<option value="${m.replace(/"/g, '&quot;')}">${m}</option>`).join('');
    movement.addEventListener('change', () => {
      state.movement = movement.value;
      state.page = 1;
      renderCatalog();
    });
  }

  document.querySelectorAll('[data-facet]').forEach((btn) => {
    if (btn.dataset.bound) return;
    btn.dataset.bound = '1';
    btn.addEventListener('click', () => {
      const value = btn.dataset.facet || '';
      state.facet = state.facet === value ? '' : value;
      state.page = 1;
      renderCatalog();
    });
  });
}

function readStateFromUrl() {
  const params = new URLSearchParams(location.search);
  state.style = params.get('style') || '';
  const material = params.get('material') || '';
  state.material = FACETS.materials.includes(material) ? material : '';
  const movement = params.get('movement') || '';
  state.movement = FACETS.movements.includes(movement) ? movement : '';
  const sort = params.get('sort');
  if (SORT_OPTIONS.includes(sort)) state.sort = sort;
  state.page = Math.max(1, parseInt(params.get('page') || '1', 10) || 1);
  state.minPrice = clampPrice(params.get('min'), PRICE_MIN);
  state.maxPrice = clampPrice(params.get('max'), PRICE_MAX);
  if (state.minPrice > state.maxPrice) {
    state.minPrice = PRICE_MIN;
    state.maxPrice = PRICE_MAX;
  }
  state.query = params.get('q') || '';
  const facet = params.get('facet') || '';
  state.facet = facet === 'new' || facet === 'sale' ? facet : '';
}

document.addEventListener('DOMContentLoaded', () => {
  readStateFromUrl();
  buildFacetControls();
  setupSortDropdown();
  setupPriceControls();
  setupCatalogSearch();
  setupFiltersSheet();
  if (typeof applyTranslations === 'function') applyTranslations();
  updateSortDropdownUI();
  updatePriceUI();
  updateFacetUI();
  updateStyleUI();
  updateSelectUI();
  updateFiltersBadge();
  renderCatalog();
});

window.addEventListener('lang-changed', () => {
  const styleWrap = document.getElementById('style-filters');
  if (styleWrap) delete styleWrap.dataset.ready;
  ['filter-material', 'filter-movement'].forEach((id) => {
    const el = document.getElementById(id);
    if (el) delete el.dataset.ready;
  });
  buildFacetControls();
  if (typeof applyTranslations === 'function') applyTranslations();
  updateSortDropdownUI();
  updateSelectUI();
  renderCatalog();
});

window.renderCatalog = renderCatalog;
window.updateSortDropdownUI = updateSortDropdownUI;
window.clearFilters = clearFilters;
