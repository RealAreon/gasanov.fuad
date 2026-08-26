const Wishlist = {
  KEY: 'chronos_wishlist',

  getIds() {
    try {
      const raw = JSON.parse(localStorage.getItem(this.KEY) || '[]');
      return Array.isArray(raw) ? raw.filter((id) => typeof id === 'string' && id) : [];
    } catch {
      return [];
    }
  },

  saveIds(ids) {
    localStorage.setItem(this.KEY, JSON.stringify([...new Set(ids)]));
    window.dispatchEvent(new Event('wishlist-updated'));
  },

  has(watchId) {
    return this.getIds().includes(watchId);
  },

  add(watchId) {
    if (!watchId || this.has(watchId)) return;
    this.saveIds([...this.getIds(), watchId]);
  },

  remove(watchId) {
    this.saveIds(this.getIds().filter((id) => id !== watchId));
  },

  toggle(watchId) {
    if (!watchId) return false;
    if (this.has(watchId)) {
      this.remove(watchId);
      return false;
    }
    this.add(watchId);
    return true;
  },

  count() {
    return this.getIds().length;
  },

  clear() {
    this.saveIds([]);
  },
};

function wishlistBtnHtml(watchId) {
  const active = Wishlist.has(watchId);
  const heart = typeof icon === 'function' ? icon('heart') : '♥';
  return `<button type="button" class="wishlist-btn${active ? ' active' : ''}" data-wishlist="${watchId}" aria-label="${active ? 'Прибрати з обраного' : 'Додати в обране'}" aria-pressed="${active ? 'true' : 'false'}">${heart}</button>`;
}

function updateWishlistUI() {
  document.querySelectorAll('[data-wishlist]').forEach((btn) => {
    const id = btn.dataset.wishlist;
    const active = Wishlist.has(id);
    btn.classList.toggle('active', active);
    if (btn.classList.contains('wishlist-btn') || btn.matches('button[data-wishlist]')) {
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
      btn.setAttribute('aria-label', active ? 'Прибрати з обраного' : 'Додати в обране');
    }
  });
  const badge = document.getElementById('wishlist-badge');
  if (badge) {
    const n = Wishlist.count();
    badge.textContent = String(n);
    badge.classList.toggle('hidden', n === 0);
  }
}

function handleWishlistClick(e) {
  const btn = e.target.closest('[data-wishlist]');
  if (!btn) return;
  e.preventDefault();
  e.stopPropagation();
  if (typeof e.stopImmediatePropagation === 'function') e.stopImmediatePropagation();
  const id = btn.dataset.wishlist;
  if (!id) return;
  Wishlist.toggle(id);
  updateWishlistUI();
  if (typeof updateWishlistPanel === 'function') updateWishlistPanel();
}

document.addEventListener('click', handleWishlistClick, true);
document.addEventListener('DOMContentLoaded', updateWishlistUI);
window.addEventListener('wishlist-updated', updateWishlistUI);
window.addEventListener('storage', (e) => {
  if (e.key === Wishlist.KEY) updateWishlistUI();
});

window.Wishlist = Wishlist;
window.wishlistBtnHtml = wishlistBtnHtml;
window.updateWishlistUI = updateWishlistUI;
