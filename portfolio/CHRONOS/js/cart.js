const Cart = {
  KEY: 'chronos_cart',

  getItems() {
    try { return JSON.parse(localStorage.getItem(this.KEY) || '[]'); }
    catch { return []; }
  },

  saveItems(items) {
    localStorage.setItem(this.KEY, JSON.stringify(items));
    window.dispatchEvent(new Event('cart-updated'));
  },

  add(watchId, qty = 1) {
    const items = this.getItems();
    const existing = items.find(i => i.id === watchId);
    if (existing) existing.qty += qty;
    else items.push({ id: watchId, qty });
    this.saveItems(items);
  },

  remove(watchId) {
    this.saveItems(this.getItems().filter(i => i.id !== watchId));
  },

  updateQty(watchId, qty) {
    if (qty <= 0) { this.remove(watchId); return; }
    const items = this.getItems();
    const item = items.find(i => i.id === watchId);
    if (item) item.qty = qty;
    this.saveItems(items);
  },

  clear() { this.saveItems([]); },

  totalItems() {
    return this.getItems().reduce((s, i) => s + i.qty, 0);
  },

  totalPrice() {
    return this.getItems().reduce((s, i) => {
      const w = getWatchById(i.id);
      return s + (w ? w.price * i.qty : 0);
    }, 0);
  },

  getDetailedItems() {
    return this.getItems().map(i => ({ watch: getWatchById(i.id), qty: i.qty })).filter(i => i.watch);
  }
};
