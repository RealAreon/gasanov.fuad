const CITIES = ['Київ','Харків','Одеса','Дніпро','Львів','Запоріжжя','Кривий Ріг','Миколаїв','Вінниця','Херсон','Полтава','Чернігів','Черкаси','Житомир','Суми','Хмельницький','Рівне','Івано-Франківськ','Тернопіль','Луцьк','Ужгород'];

const DELIVERY_POINT_CONFIG = {
  branch: {
    label: 'Відділення Нової Пошти',
    placeholder: 'Відділення №1, вул. Хрещатик, 1',
  },
  locker: {
    label: 'Поштомат Нової Пошти',
    placeholder: 'Поштомат №12345, вул. Шевченка, 10',
  },
  courier: {
    label: 'Адреса доставки',
    placeholder: 'вул. Хрещатик, 1, кв. 5',
  },
};

const PAYMENT_NOTES = {
  cod: 'Накладений платіж: сплата під час отримання у Новій Пошті. Комісію перевізника сплачує покупець.',
  card: 'Оплата карткою: безпечна онлайн-оплата буде доступна після підключення платіжного провайдера Shopify.',
};

let payment = 'cod';
let deliveryMethod = 'branch';

function renderOrderSummary() {
  const items = Cart.getDetailedItems();
  const summary = document.getElementById('order-summary');
  const submitBtn = document.getElementById('submit-order');
  if (!summary) return;

  if (items.length === 0) {
    summary.innerHTML = '<div class="text-center" style="padding:2rem 0"><p style="color:var(--muted-fg);margin-bottom:1rem">Кошик порожній</p><a href="catalog.html" class="btn btn-outline">Перейти до каталогу</a></div>';
    if (submitBtn) submitBtn.disabled = true;
    return;
  }

  summary.innerHTML = items.map(({ watch, qty }) => `
    <div class="cart-item" style="margin-bottom:1rem">
      <img src="${typeof mediaUrl === 'function' ? mediaUrl(watch.images[0]) : watch.images[0]}" alt="">
      <div class="cart-item-info">
        <p class="product-brand">${watch.brand}</p>
        <p class="cart-item-name">${watch.name}</p>
        <p class="price">${formatPrice(watch.price)}</p>
        <div class="cart-qty" style="margin-top:.5rem">
          <button type="button" data-qty-minus="${watch.id}">−</button>
          <span>${qty}</span>
          <button type="button" data-qty-plus="${watch.id}">+</button>
        </div>
      </div>
    </div>`).join('') +
    `<div style="padding:1rem 0;border-top:1px solid var(--border)">
      <div style="display:flex;justify-content:space-between;margin-bottom:.5rem"><span style="color:var(--muted-fg)">Доставка</span><span style="color:#16a34a">Безкоштовно</span></div>
      <div style="display:flex;justify-content:space-between;font-size:1.25rem;font-weight:600;margin-top:1rem"><span>Разом</span><span>${formatPrice(Cart.totalPrice())}</span></div>
    </div>`;

  summary.querySelectorAll('[data-qty-minus]').forEach(btn => btn.addEventListener('click', () => {
    const item = Cart.getItems().find(i => i.id === btn.dataset.qtyMinus);
    if (item) Cart.updateQty(btn.dataset.qtyMinus, item.qty - 1);
    renderOrderSummary();
  }));
  summary.querySelectorAll('[data-qty-plus]').forEach(btn => btn.addEventListener('click', () => {
    const item = Cart.getItems().find(i => i.id === btn.dataset.qtyPlus);
    if (item) Cart.updateQty(btn.dataset.qtyPlus, item.qty + 1);
    renderOrderSummary();
  }));

  if (submitBtn) submitBtn.disabled = false;
}

function updateDeliveryPointField() {
  const config = DELIVERY_POINT_CONFIG[deliveryMethod];
  const label = document.getElementById('delivery-point-label');
  const input = document.getElementById('novaPoshta');
  if (label) label.textContent = config.label;
  if (input) input.placeholder = config.placeholder;
}

function setDeliveryMethod(method) {
  deliveryMethod = method;
  document.querySelectorAll('[data-delivery-method]').forEach((button) => {
    const active = button.dataset.deliveryMethod === method;
    button.classList.toggle('active', active);
    button.setAttribute('aria-checked', String(active));
  });
  updateDeliveryPointField();
}

function setPaymentMethod(method) {
  payment = method;
  document.querySelectorAll('.payment-option').forEach((button) => {
    button.classList.toggle('active', button.dataset.payment === method);
  });
  const note = document.getElementById('payment-method-note');
  if (note) note.textContent = PAYMENT_NOTES[method];
}

document.addEventListener('DOMContentLoaded', () => {
  renderOrderSummary();
  window.addEventListener('cart-updated', renderOrderSummary);

  document.querySelectorAll('[data-delivery-method]').forEach((button) => {
    button.addEventListener('click', () => setDeliveryMethod(button.dataset.deliveryMethod));
  });

  document.querySelectorAll('.payment-option').forEach((button) => {
    button.addEventListener('click', () => setPaymentMethod(button.dataset.payment));
  });

  updateDeliveryPointField();

  const cityInput = document.getElementById('city');
  const cityList = document.getElementById('city-list');
  cityInput?.addEventListener('input', () => {
    const q = cityInput.value.toLowerCase();
    const found = CITIES.filter(c => c.toLowerCase().includes(q));
    cityList.innerHTML = found.map(c => `<button type="button">${c}</button>`).join('');
    cityList.classList.toggle('hidden', found.length === 0);
    cityList.querySelectorAll('button').forEach(btn => btn.addEventListener('click', () => {
      cityInput.value = btn.textContent;
      cityList.classList.add('hidden');
    }));
  });

  document.getElementById('checkout-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = document.getElementById('submit-order');
    btn.textContent = 'Обробка...';
    btn.disabled = true;
    setTimeout(() => {
      Cart.clear();
      document.getElementById('checkout-content').innerHTML = `
        <div class="success-box">
          <div class="success-icon">✓</div>
          <h2 style="font-family:var(--font-serif);font-weight:300;font-size:1.75rem;margin-bottom:1rem">Дякуємо за <strong>замовлення!</strong></h2>
          <p style="color:var(--muted-fg);margin-bottom:2rem">Ваше замовлення успішно оформлено. Наш менеджер зв'яжеться з вами найближчим часом.</p>
          <div class="order-number"><p style="font-size:.875rem;color:var(--muted-fg);margin-bottom:.5rem">Номер замовлення</p><code>CH-${Date.now().toString().slice(-8)}</code></div>
          <a href="catalog.html" class="btn btn-outline">← Повернутися до каталогу</a>
        </div>`;
    }, 1500);
  });

  const params = new URLSearchParams(location.search);
  const productId = params.get('product');
  if (productId && Cart.getItems().length === 0 && getWatchById(productId)) {
    Cart.add(productId);
    renderOrderSummary();
  }
});
