/**
 * One-time generator: creates a static HTML site you can open via index.html
 * Run: node build-static-site.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;

function loadIconHelper() {
  const iconsPath = path.join(ROOT, 'js', 'icons.js');
  if (!fs.existsSync(iconsPath)) return (name) => '';
  const src = fs.readFileSync(iconsPath, 'utf8');
  const fn = new Function(src + '; return icon;');
  return fn();
}
const icon = loadIconHelper();

// Read watches data from lib/watches.ts
const watchesSrc = fs.readFileSync(path.join(ROOT, 'lib', 'watches.ts'), 'utf8');
const watchesMatch = watchesSrc.match(/export const watches: Watch\[\] = (\[[\s\S]*?\n\]);/);
if (!watchesMatch) throw new Error('Could not parse watches data');
const watches = eval(watchesMatch[1]);

const styleLabels = { classic: 'Класичні', sport: 'Спортивні', dress: 'Елегантні' };

function formatPrice(price) {
  return new Intl.NumberFormat('uk-UA', {
    style: 'currency',
    currency: 'UAH',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function productCard(watch, prefix = '') {
  const badge = watch.originalPrice
    ? '<span class="badge badge-sale">Акція</span>'
    : watch.isNew
      ? '<span class="badge badge-new">Новинка</span>'
      : '';
  const orig = watch.originalPrice
    ? `<span class="price-old">${formatPrice(watch.originalPrice)}</span>`
    : '';
  return `
    <article class="product-card">
      <a href="${prefix}product/${watch.id}.html" class="product-link">
        <div class="product-image">
          <img src="${watch.images[0]}" alt="${esc(watch.name)}" loading="lazy">
          ${badge}
        </div>
        <div class="product-info">
          <p class="product-brand">${esc(watch.brand)}</p>
          <h3 class="product-name">${esc(watch.name)}</h3>
          <p class="product-desc">${esc(watch.description)}</p>
          <div class="product-prices">
            <span class="price">${formatPrice(watch.price)}</span>${orig}
          </div>
        </div>
      </a>
      <button class="btn btn-dark btn-full" data-add-cart="${watch.id}">Додати в кошик</button>
    </article>`;
}

function head(title, prefix = '') {
  return `<!DOCTYPE html>
<html lang="uk">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(title)}</title>
  <meta name="description" content="Ексклюзивна колекція преміум годинників CHRONOS. Безкоштовна доставка по Україні.">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="${prefix}css/style.css">
  <link rel="icon" href="${prefix}public/icon.svg" type="image/svg+xml">
</head>`;
}

function scripts(prefix = '', extra = '') {
  const extras = Array.isArray(extra) ? extra : extra ? [extra] : [];
  const extraScripts = extras.map(f => `<script src="${prefix}js/${f}"></script>`).join('\n  ');
  return `
  <script src="${prefix}js/icons.js"></script>
  <script src="${prefix}js/i18n.js"></script>
  <script src="${prefix}js/data.js"></script>
  <script src="${prefix}js/cart.js"></script>
  <script src="${prefix}js/animations.js"></script>
  <script src="${prefix}js/app.js"></script>
  ${extraScripts}
</body>
</html>`;
}

function bodyStart(prefix = '') {
  return `<body data-base="${prefix}">
  <div id="site-header"></div>`;
}

function bodyEnd(prefix = '', extra = '') {
  return `
  <div id="site-footer"></div>
  <div id="cart-overlay"></div>
  <div id="search-overlay"></div>
  ${scripts(prefix, extra)}`;
}

// --- CSS ---
const css = `/* CHRONOS Static Site */
:root {
  --background: #fefefe;
  --foreground: #1a1a1a;
  --muted: #f5f5f5;
  --muted-fg: #737373;
  --gold: #c9a962;
  --border: #e5e5e5;
  --font-serif: 'Playfair Display', Georgia, serif;
  --font-sans: 'Inter', system-ui, sans-serif;
}
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  .reveal { opacity: 1 !important; transform: none !important; }
  .fly-to-cart { display: none !important; }
  .hero-image img { animation: none !important; }
}
body {
  font-family: var(--font-sans);
  background:
    radial-gradient(ellipse at 15% 0%, rgba(201,169,98,.07) 0%, transparent 45%),
    radial-gradient(ellipse at 85% 100%, rgba(201,169,98,.05) 0%, transparent 45%),
    linear-gradient(180deg, #faf9f7 0%, #fefefe 25%, #fefefe 100%);
  background-attachment: fixed;
  color: var(--foreground);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}
img { max-width: 100%; height: auto; display: block; }
a { color: inherit; text-decoration: none; }
button { font-family: inherit; cursor: pointer; border: none; background: none; }
ul { list-style: none; }
.container { max-width: 80rem; margin: 0 auto; padding: 0 1rem; }
@media (min-width: 640px) { .container { padding: 0 1.5rem; } }
@media (min-width: 1024px) { .container { padding: 0 2rem; } }

/* Background decorations */
.bg-decor-layer {
  position: fixed; inset: 0; pointer-events: none; z-index: -1; overflow: hidden;
}
.bg-orb {
  position: absolute; border-radius: 50%; filter: blur(90px); will-change: transform;
}
.bg-orb-1 { width: 520px; height: 520px; background: rgba(201,169,98,.14); top: -8%; right: -6%; }
.bg-orb-2 { width: 420px; height: 420px; background: rgba(201,169,98,.09); bottom: 15%; left: -8%; }
.bg-orb-3 { width: 340px; height: 340px; background: rgba(26,26,26,.04); top: 45%; left: 35%; }

/* Scroll reveal */
.reveal {
  opacity: 0;
  transform: translateY(32px);
  transition: opacity .75s cubic-bezier(.22,1,.36,1), transform .75s cubic-bezier(.22,1,.36,1);
  transition-delay: var(--reveal-delay, 0ms);
}
.reveal.revealed { opacity: 1; transform: translateY(0); }

/* Fly to cart */
.fly-to-cart {
  position: fixed; width: 2.75rem; height: 2.75rem; z-index: 9999; pointer-events: none;
  display: flex; align-items: center; justify-content: center;
  background: var(--gold); border-radius: 50%;
  box-shadow: 0 6px 24px rgba(201,169,98,.55);
}
.fly-to-cart svg { width: 1.35rem; height: 1.35rem; color: #fff; stroke: #fff; }
.cart-pulse { animation: cartPulse .55s ease; }
@keyframes cartPulse {
  0%, 100% { transform: scale(1); }
  40% { transform: scale(1.25); color: var(--gold); }
}

/* Header */
.site-header {
  position: fixed; top: 0; left: 0; right: 0; z-index: 100;
  background: rgba(254,254,254,.95); backdrop-filter: blur(8px);
  border-bottom: 1px solid transparent; transition: .3s;
}
.site-header.scrolled { border-bottom-color: var(--border); box-shadow: 0 1px 3px rgba(0,0,0,.05); }
.header-inner {
  display: flex; align-items: center; justify-content: space-between;
  height: 4rem;
}
@media (min-width: 1024px) { .header-inner { height: 5rem; } }
.logo-wrap { position: absolute; left: 50%; transform: translateX(-50%); text-align: center; }
.logo { font-family: var(--font-serif); font-size: 1.25rem; font-weight: 600; letter-spacing: .35em; }
@media (min-width: 1024px) { .logo { font-size: 1.5rem; } }
.logo-sub { font-size: 9px; letter-spacing: .5em; color: var(--gold); text-transform: uppercase; margin-top: 2px; }
.nav-desktop { display: none; }
@media (min-width: 1024px) {
  .nav-desktop { display: flex; align-items: center; }
  .nav-desktop > a, .nav-dropdown-btn {
    font-size: .75rem; letter-spacing: .15em; text-transform: uppercase;
    color: rgba(26,26,26,.8); padding: 1.5rem .5rem; display: flex; align-items: center; gap: .5rem;
  }
  .nav-desktop > a:hover, .nav-dropdown-btn:hover { color: var(--foreground); }
  .nav-dropdown { position: relative; }
  .nav-dropdown-menu {
    position: absolute; top: 100%; left: 0; min-width: 280px;
    background: var(--background); border: 1px solid var(--border);
    box-shadow: 0 10px 40px rgba(0,0,0,.1); opacity: 0; visibility: hidden;
    transform: translateY(-8px); transition: .3s;
  }
  .nav-dropdown:hover .nav-dropdown-menu { opacity: 1; visibility: visible; transform: translateY(0); }
  .nav-dropdown-menu a { display: block; padding: 1rem 1.25rem; border-bottom: 1px solid var(--border); }
  .nav-dropdown-menu a:last-child { border-bottom: none; }
  .nav-dropdown-menu a:hover { background: var(--muted); }
  .nav-dropdown-menu strong { display: block; font-size: .875rem; }
  .nav-dropdown-menu small { color: var(--muted-fg); font-size: .75rem; }
}
.header-actions { display: flex; gap: .25rem; margin-left: auto; }
@media (min-width: 1024px) { .header-actions { margin-left: 0; } }
.icon-btn {
  width: 2.5rem; height: 2.5rem; display: flex; align-items: center; justify-content: center;
  border-radius: 0; transition: .2s;
}
.icon-btn:hover { color: var(--gold); }
.icon-btn svg { width: 1.25rem; height: 1.25rem; }
.cart-badge {
  position: absolute; top: 2px; right: 2px; width: 1rem; height: 1rem;
  background: var(--gold); font-size: 10px; display: flex; align-items: center; justify-content: center;
}
.menu-toggle { display: flex; }
@media (min-width: 1024px) { .menu-toggle { display: none; } }
.mobile-nav {
  display: none; border-top: 1px solid var(--border); padding: 1rem 1.5rem;
}
.mobile-nav.open { display: block; }
.mobile-nav a { display: block; padding: .75rem 0; font-size: .875rem; border-bottom: 1px solid var(--border); }
.mobile-nav a:hover { color: var(--gold); }

/* Buttons */
.btn {
  display: inline-flex; align-items: center; justify-content: center; gap: .5rem;
  padding: .875rem 2rem; font-size: .7rem; letter-spacing: .15em; text-transform: uppercase;
  font-weight: 500; transition: .3s; border: 1px solid transparent;
}
.btn-dark { background: var(--foreground); color: var(--background); }
.btn-dark:hover { opacity: .9; }
.btn-outline { border-color: rgba(26,26,26,.2); background: transparent; color: var(--foreground); }
.btn-outline:hover { background: var(--foreground); color: var(--background); }
.btn-gold { background: var(--gold); color: var(--foreground); }
.btn-gold:hover { opacity: .9; }
.btn-full { width: 100%; }
.btn-lg { padding: 1.1rem 2.5rem; }

/* Hero */
.hero {
  padding-top: 6rem; min-height: 100vh; position: relative; overflow: hidden;
  background: linear-gradient(160deg, rgba(201,169,98,.03) 0%, transparent 40%, rgba(250,249,247,.8) 100%);
}
.hero::before {
  content: ''; position: absolute; inset: 0; pointer-events: none;
  background-image: radial-gradient(circle at 1px 1px, rgba(201,169,98,.07) 1px, transparent 0);
  background-size: 36px 36px;
  mask-image: linear-gradient(180deg, rgba(0,0,0,.6) 0%, transparent 75%);
}
.hero::after {
  content: ''; position: absolute; top: 20%; right: -5%; width: 40%; height: 60%;
  background: radial-gradient(ellipse, rgba(201,169,98,.08) 0%, transparent 70%);
  filter: blur(60px); pointer-events: none;
}
.hero .container { position: relative; z-index: 1; }
@media (min-width: 1024px) { .hero { padding-top: 8rem; } }
.hero-grid {
  display: grid; gap: 3rem; align-items: center; min-height: calc(100vh - 200px);
}
@media (min-width: 1024px) { .hero-grid { grid-template-columns: 1fr 1fr; } }
.hero-badge { display: flex; align-items: center; gap: .5rem; margin-bottom: 2rem; }
.hero-badge-line { width: 3rem; height: 1px; background: var(--gold); }
.hero-badge span { font-size: .75rem; letter-spacing: .3em; text-transform: uppercase; color: var(--gold); }
.hero h1 {
  font-family: var(--font-serif); font-size: clamp(1.875rem, 5vw, 3.5rem);
  font-weight: 300; line-height: 1.15; margin-bottom: 2rem;
}
.hero h1 em { color: var(--gold); font-style: italic; }
.hero-text { color: var(--muted-fg); font-size: 1.05rem; max-width: 32rem; margin-bottom: 2.5rem; }
.hero-btns { display: flex; flex-wrap: wrap; gap: 1rem; }
.hero-image { display: flex; justify-content: center; }
@media (min-width: 1024px) { .hero-image { justify-content: flex-end; } }
.hero-image img {
  max-height: 500px; object-fit: contain;
  filter: drop-shadow(0 25px 50px rgba(0,0,0,.15));
  animation: float 6s ease-in-out infinite;
  will-change: transform;
}
@keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-20px)} }
.hero-stats {
  display: grid; grid-template-columns: repeat(2,1fr); gap: 1.5rem 2rem;
  padding: 3rem 2rem; margin-top: 3rem;
  border-top: 1px solid var(--border);
  background: linear-gradient(180deg, rgba(201,169,98,.04) 0%, transparent 100%);
}
@media (min-width: 768px) { .hero-stats { grid-template-columns: repeat(4,1fr); gap: 2rem; padding: 3.5rem 0; } }
.stat-item {
  display: flex; gap: 1.25rem; align-items: center;
  padding: 1rem; transition: transform .3s, box-shadow .3s;
}
.stat-item:hover { transform: translateY(-2px); }
.stat-icon {
  width: 3.25rem; height: 3.25rem;
  border: 1px solid rgba(201,169,98,.35);
  background: rgba(201,169,98,.06);
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  transition: border-color .3s, background .3s, box-shadow .3s;
}
.stat-item:hover .stat-icon {
  border-color: var(--gold);
  background: rgba(201,169,98,.12);
  box-shadow: 0 4px 20px rgba(201,169,98,.15);
}
.stat-icon svg { width: 1.25rem; height: 1.25rem; color: var(--gold); stroke: var(--gold); }
.stat-value { font-weight: 500; font-size: 1.05rem; letter-spacing: .02em; }
.stat-label { font-size: .875rem; color: var(--muted-fg); margin-top: .125rem; }

/* Sections */
.section { padding: 6rem 0; position: relative; overflow: hidden; }
.section > .container { position: relative; z-index: 1; }
.section:not(.section-dark):not(.section-muted)::before {
  content: ''; position: absolute; inset: 0; pointer-events: none;
  background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0L30 60M0 30L60 30' stroke='%23c9a962' stroke-width='0.3' opacity='0.15' fill='none'/%3E%3C/svg%3E");
  opacity: .4;
}
.section-muted {
  background: linear-gradient(135deg, #f7f5f2 0%, #f0ede8 50%, #f5f3f0 100%);
}
.section-muted::after {
  content: ''; position: absolute; top: 10%; right: 8%; width: 280px; height: 280px;
  background: radial-gradient(circle, rgba(201,169,98,.12) 0%, transparent 70%);
  filter: blur(50px); pointer-events: none;
}
.section-dark {
  background: linear-gradient(165deg, #1a1a1a 0%, #141414 50%, #1c1a17 100%);
  color: var(--background);
}
.section-dark::before {
  content: ''; position: absolute; inset: 0; pointer-events: none;
  background-image: radial-gradient(circle at 1px 1px, rgba(201,169,98,.06) 1px, transparent 0);
  background-size: 32px 32px; opacity: .5;
}
.section-header { text-align: center; margin-bottom: 4rem; }
.section-label { color: var(--gold); font-size: .875rem; letter-spacing: .3em; text-transform: uppercase; margin-bottom: 1rem; }
.section-title { font-family: var(--font-serif); font-size: clamp(1.75rem, 3vw, 2.25rem); font-weight: 300; }
.section-title strong { font-weight: 600; }

/* Products grid */
.products-grid {
  display: grid; gap: 2rem;
  grid-template-columns: 1fr;
}
@media (min-width: 640px) { .products-grid { grid-template-columns: repeat(2,1fr); } }
@media (min-width: 1024px) { .products-grid.cols-4 { grid-template-columns: repeat(4,1fr); } }
@media (min-width: 1024px) { .products-grid.cols-3 { grid-template-columns: repeat(3,1fr); } }
.product-card { display: flex; flex-direction: column; }
.product-card-media { position: relative; }
.product-link { display: flex; flex-direction: column; flex: 1; }
.product-info { flex: 1; display: flex; flex-direction: column; }
.product-prices { margin-top: auto; }
.product-image { position: relative; aspect-ratio: 1/1; overflow: hidden; background: var(--muted); margin-bottom: 1.5rem; }
.product-image img { width: 100%; height: 100%; object-fit: cover; transition: transform .7s; }
.product-card:hover .product-image img { transform: scale(1.05); }
.badge { position: absolute; top: 1rem; left: 1rem; font-size: .7rem; letter-spacing: .1em; text-transform: uppercase; padding: .25rem .75rem; }
.badge-sale { background: var(--gold); color: var(--foreground); }
.badge-new { background: var(--foreground); color: var(--background); }
.product-brand { font-size: .7rem; letter-spacing: .15em; text-transform: uppercase; color: var(--muted-fg); margin-bottom: .25rem; }
.product-name { font-family: var(--font-serif); font-size: 1.125rem; font-weight: 500; margin-bottom: .5rem; transition: .2s; }
.product-card:hover .product-name { color: var(--gold); }
.product-desc { font-size: .875rem; color: var(--muted-fg); margin-bottom: .5rem; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.product-prices { display: flex; gap: .75rem; align-items: center; }
.price { font-size: 1.125rem; font-weight: 600; }
.price-old { font-size: .875rem; color: var(--muted-fg); text-decoration: line-through; }
.product-card .btn { margin-top: 1rem; }

/* Categories */
.categories-grid { display: grid; gap: 1.5rem; }
@media (min-width: 640px) { .categories-grid { grid-template-columns: repeat(3,1fr); } }
.category-card { position: relative; aspect-ratio: 3/4; overflow: hidden; display: block; }
.category-card img { width: 100%; height: 100%; object-fit: cover; transition: transform .7s; }
.category-card:hover img { transform: scale(1.1); }
.category-overlay {
  position: absolute; inset: 0; background: rgba(26,26,26,.5);
  display: flex; flex-direction: column; justify-content: flex-end; padding: 1.5rem;
  transition: .3s;
}
.category-card:hover .category-overlay { background: rgba(26,26,26,.4); }
.category-overlay h3 { color: #fff; font-size: 1.25rem; font-weight: 600; margin-bottom: .25rem; }
.category-overlay p { color: rgba(255,255,255,.7); font-size: .875rem; }
.category-line { height: 1px; width: 0; background: var(--gold); margin-top: 1rem; transition: .5s; }
.category-card:hover .category-line { width: 100%; }

/* Testimonials */
.testimonials-grid { display: grid; gap: 2rem; }
@media (min-width: 768px) { .testimonials-grid { grid-template-columns: repeat(3,1fr); } }
.testimonial-card { background: var(--muted); padding: 2rem; position: relative; }
.testimonial-stars { display: flex; gap: .25rem; margin-bottom: 1.5rem; color: var(--gold); }
.testimonial-text { color: rgba(26,26,26,.8); margin-bottom: 1.5rem; line-height: 1.7; }
.testimonial-watch { font-size: .7rem; letter-spacing: .1em; text-transform: uppercase; color: var(--gold); margin-bottom: 1rem; }
.testimonial-author { padding-top: 1.5rem; border-top: 1px solid var(--border); }
.testimonial-author strong { display: block; }
.testimonial-author span { font-size: .875rem; color: var(--muted-fg); }

/* Trust */
.trust-grid { display: grid; gap: 2rem; }
@media (min-width: 640px) { .trust-grid { grid-template-columns: repeat(2,1fr); } }
@media (min-width: 1024px) { .trust-grid { grid-template-columns: repeat(3,1fr); } }
.trust-item { text-align: center; padding: 1.5rem 1rem; transition: transform .3s; }
.trust-item:hover { transform: translateY(-4px); }
.trust-icon {
  width: 4.5rem; height: 4.5rem; margin: 0 auto 1.5rem;
  border: 1px solid rgba(201,169,98,.35);
  background: rgba(201,169,98,.06);
  display: flex; align-items: center; justify-content: center;
  transition: border-color .3s, background .3s, box-shadow .3s;
}
.trust-item:hover .trust-icon {
  border-color: var(--gold);
  background: rgba(201,169,98,.15);
  box-shadow: 0 8px 24px rgba(201,169,98,.2);
}
.trust-icon svg { width: 1.75rem; height: 1.75rem; color: var(--gold); stroke: var(--gold); }
.trust-item h3 { font-size: 1.125rem; margin-bottom: .5rem; }
.trust-item p { font-size: .875rem; color: rgba(255,255,255,.6); }
.trust-banner { text-align: center; margin-top: 5rem; padding-top: 3rem; border-top: 1px solid rgba(255,255,255,.1); }
.trust-banner p { color: var(--gold); font-size: clamp(1.125rem, 2vw, 1.5rem); font-weight: 300; }

/* Footer */
.site-footer { background: var(--foreground); color: var(--background); padding: 4rem 0; }
.footer-grid { display: grid; gap: 3rem; }
@media (min-width: 768px) { .footer-grid { grid-template-columns: repeat(2,1fr); } }
@media (min-width: 1024px) { .footer-grid { grid-template-columns: repeat(4,1fr); } }
.footer-brand h3 { font-family: var(--font-serif); font-size: 1.5rem; letter-spacing: .3em; }
.footer-brand .logo-sub { color: var(--gold); }
.footer-brand p { font-size: .875rem; color: rgba(255,255,255,.7); margin-top: 1.5rem; line-height: 1.7; }
.footer-col h4 { font-size: .875rem; letter-spacing: .15em; text-transform: uppercase; margin-bottom: 1.5rem; }
.footer-col a, .footer-col p { display: block; font-size: .875rem; color: rgba(255,255,255,.7); margin-bottom: .75rem; transition: .2s; }
.footer-col a:hover { color: var(--gold); }
.footer-bottom {
  margin-top: 4rem; padding-top: 2rem; border-top: 1px solid rgba(255,255,255,.1);
  display: flex; flex-direction: column; gap: 1rem; align-items: center;
}
@media (min-width: 768px) { .footer-bottom { flex-direction: row; justify-content: space-between; } }
.footer-bottom p, .footer-bottom a { font-size: .75rem; color: rgba(255,255,255,.5); }
.footer-bottom a:hover { color: var(--gold); }
.footer-links { display: flex; gap: 1.5rem; }

/* Cart sidebar */
.overlay {
  position: fixed; inset: 0; background: rgba(26,26,26,.5); z-index: 200;
  opacity: 0; visibility: hidden; transition: .3s;
}
.overlay.open { opacity: 1; visibility: visible; }
.cart-panel {
  position: fixed; top: 0; right: 0; height: 100%; width: 100%; max-width: 28rem;
  background: var(--background); z-index: 201; transform: translateX(100%);
  transition: .3s; display: flex; flex-direction: column; box-shadow: -10px 0 40px rgba(0,0,0,.15);
}
.cart-panel.open { transform: translateX(0); }
.cart-header { display: flex; align-items: center; justify-content: space-between; padding: 1.5rem; border-bottom: 1px solid var(--border); }
.cart-title { font-size: 1.125rem; font-weight: 500; display: flex; align-items: center; gap: .5rem; }
.cart-title svg { width: 1.25rem; height: 1.25rem; color: var(--gold); }
.cart-body { flex: 1; overflow-y: auto; padding: 1.5rem; }
.cart-empty { text-align: center; padding: 3rem 0; color: var(--muted-fg); }
.cart-item { display: flex; gap: 1rem; margin-bottom: 1.5rem; }
.cart-item img { width: 6rem; height: 6rem; object-fit: cover; background: var(--muted); flex-shrink: 0; }
.cart-item-info { flex: 1; min-width: 0; }
.cart-item-name { font-weight: 500; font-size: .875rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.cart-qty { display: inline-flex; border: 1px solid var(--border); margin-top: .5rem; }
.cart-qty button { padding: .5rem .75rem; }
.cart-qty span { padding: .5rem .75rem; min-width: 2.5rem; text-align: center; font-size: .875rem; }
.cart-remove { font-size: .75rem; color: var(--muted-fg); text-decoration: underline; margin-left: .5rem; }
.cart-footer { padding: 1.5rem; border-top: 1px solid var(--border); }
.cart-footer-actions { display: flex; flex-direction: column; gap: .75rem; }
.cart-total { display: flex; justify-content: space-between; font-size: 1.125rem; margin-bottom: 1rem; }
.cart-total strong { font-weight: 600; }

/* Search modal */
.search-panel {
  position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%) scale(.95);
  width: calc(100% - 2rem); max-width: 36rem; background: var(--background);
  z-index: 201; opacity: 0; visibility: hidden; transition: .3s; padding: 2rem;
  box-shadow: 0 25px 50px rgba(0,0,0,.2);
}
.search-panel.open { opacity: 1; visibility: visible; transform: translate(-50%, -50%) scale(1); }
.search-input {
  width: 100%; padding: 1rem; border: 1px solid var(--border); font-size: 1rem; margin-bottom: 1rem;
}
.search-input:focus { outline: none; border-color: var(--gold); }
.search-results a {
  display: flex; gap: 1rem; padding: .75rem 0; border-bottom: 1px solid var(--border); align-items: center;
}
.search-results a:hover { background: var(--muted); }
.search-results img { width: 3rem; height: 3rem; object-fit: cover; }

/* Catalog filters */
.page-header { padding: 7rem 0 2rem; text-align: center; }
.page-header h1 { font-family: var(--font-serif); font-size: 2.5rem; font-weight: 300; }
.filters-bar {
  display: flex; flex-wrap: wrap; gap: 1rem; align-items: center; justify-content: space-between;
  padding-bottom: 2rem; margin-bottom: 2rem; border-bottom: 1px solid var(--border);
}
.filter-group { display: flex; flex-wrap: wrap; gap: .5rem; align-items: center; }
.filter-label { font-size: .7rem; letter-spacing: .1em; text-transform: uppercase; color: var(--muted-fg); }
.filter-btn {
  padding: .375rem .75rem; font-size: .7rem; letter-spacing: .1em; text-transform: uppercase;
  background: var(--muted); transition: .2s;
}
.filter-btn.active, .filter-btn:hover { background: var(--foreground); color: var(--background); }
.pagination { display: flex; justify-content: center; gap: .5rem; margin-top: 3rem; }
.pagination button {
  width: 2.5rem; height: 2.5rem; border: 1px solid var(--border); font-size: .875rem;
}
.pagination button.active { background: var(--foreground); color: var(--background); }
.pagination button:disabled { opacity: .4; cursor: not-allowed; }

/* Product page */
.product-page { padding-top: 6rem; }
.product-layout { display: grid; gap: 3rem; padding: 2rem 0 4rem; }
@media (min-width: 1024px) { .product-layout { grid-template-columns: 1fr 1fr; gap: 4rem; } }
.gallery-main { aspect-ratio: 1; background: var(--muted); overflow: hidden; margin-bottom: 1rem; }
.gallery-main img { width: 100%; height: 100%; object-fit: cover; }
.gallery-thumbs { display: flex; gap: .75rem; }
.gallery-thumbs button { width: 5rem; height: 5rem; overflow: hidden; opacity: .6; border: 2px solid transparent; }
.gallery-thumbs button.active, .gallery-thumbs button:hover { opacity: 1; border-color: var(--gold); }
.gallery-thumbs img { width: 100%; height: 100%; object-fit: cover; }
.breadcrumb { display: flex; gap: .5rem; font-size: .75rem; color: var(--muted-fg); margin-bottom: 1.5rem; flex-wrap: wrap; }
.breadcrumb a:hover { color: var(--foreground); }
.product-detail-brand { color: var(--gold); font-size: .875rem; letter-spacing: .3em; text-transform: uppercase; margin-bottom: .5rem; }
.product-detail-name { font-family: var(--font-serif); font-size: clamp(1.5rem, 3vw, 2rem); font-weight: 300; margin-bottom: 1rem; }
.product-detail-price { display: flex; gap: 1rem; align-items: center; margin-bottom: 1.5rem; }
.product-detail-price .price { font-size: 1.75rem; }
.discount-badge { background: var(--gold); font-size: .7rem; padding: .25rem .5rem; letter-spacing: .1em; text-transform: uppercase; }
.product-detail-desc { color: var(--muted-fg); line-height: 1.8; margin-bottom: 2rem; }
.stock-ok { color: #16a34a; font-size: .875rem; display: flex; align-items: center; gap: .5rem; margin-bottom: 1.5rem; }
.qty-row { display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem; }
.qty-control { display: flex; border: 1px solid var(--border); }
.qty-control button { padding: .75rem 1rem; }
.qty-control span { padding: .75rem 1rem; min-width: 3rem; text-align: center; }
.product-actions { display: flex; flex-direction: column; gap: 1rem; margin-bottom: 2rem; }
@media (min-width: 640px) { .product-actions { flex-direction: row; } }
.product-actions .btn { flex: 1; }
.trust-row { display: grid; gap: 1rem; padding: 1.5rem 0; border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); margin-bottom: 1.5rem; }
@media (min-width: 640px) { .trust-row { grid-template-columns: repeat(3,1fr); } }
.trust-row-item { display: flex; gap: .75rem; align-items: flex-start; }
.trust-row-item svg { width: 1.25rem; height: 1.25rem; color: var(--gold); flex-shrink: 0; margin-top: 2px; }
.trust-row-item strong { display: block; font-size: .875rem; }
.trust-row-item span { font-size: .75rem; color: var(--muted-fg); }
.features-list li { display: flex; gap: .5rem; align-items: center; font-size: .875rem; color: var(--muted-fg); margin-bottom: .5rem; }
.features-list li::before { content: ''; width: 4px; height: 4px; background: var(--gold); flex-shrink: 0; }
.specs-table { background: var(--background); max-width: 48rem; margin: 0 auto; }
.specs-row { display: flex; justify-content: space-between; padding: 1rem 1.5rem; border-bottom: 1px solid var(--border); gap: 1rem; }
.specs-row:last-child { border-bottom: none; }
.specs-row span:first-child { color: var(--muted-fg); }
.specs-row span:last-child { font-weight: 500; text-align: right; }
.shipping-box { max-width: 48rem; margin: 3rem auto 0; padding: 1.5rem; border: 1px solid var(--border); background: var(--background); }
.shipping-box h3 { margin-bottom: 1rem; }
.shipping-box p { font-size: .875rem; color: var(--muted-fg); margin-bottom: .75rem; }

/* Checkout */
.checkout-form { max-width: 64rem; margin: 0 auto; }
.checkout-grid { display: grid; gap: 3rem; }
@media (min-width: 1024px) { .checkout-grid { grid-template-columns: 1fr 1fr; } }
.form-section { margin-bottom: 2rem; }
.form-section h2 { font-size: 1.125rem; margin-bottom: 1rem; }
.form-row { display: grid; gap: 1rem; grid-template-columns: 1fr 1fr; margin-bottom: 1rem; }
.form-group { margin-bottom: 1rem; }
.form-group label { display: block; font-size: .875rem; margin-bottom: .5rem; }
.form-group input, .form-group select {
  width: 100%; padding: .875rem 1rem; border: 1px solid var(--border); font-size: 1rem;
}
.form-group input:focus { outline: none; border-color: var(--gold); }
.np-banner { padding: 1rem; border: 1px solid rgba(201,169,98,.3); background: rgba(201,169,98,.05); display: flex; gap: .75rem; margin-bottom: 1rem; }
.np-banner svg { width: 1.25rem; height: 1.25rem; color: var(--gold); flex-shrink: 0; }
.np-delivery-methods {
  display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: .5rem; margin-bottom: .75rem;
}
@media (max-width: 640px) { .np-delivery-methods { grid-template-columns: 1fr; } }
.np-delivery-method {
  border: 1px solid var(--border); padding: .75rem; background: transparent; font: inherit;
  text-align: left; transition: .2s; cursor: pointer;
}
.np-delivery-method strong { display: block; font-size: .875rem; font-weight: 500; }
.np-delivery-method small { display: block; margin-top: .25rem; font-size: .75rem; color: var(--muted-fg); }
.np-delivery-method.active { border-color: var(--gold); background: rgba(201,169,98,.08); }
.checkout-note { font-size: .75rem; color: var(--muted-fg); margin: 0 0 1rem; line-height: 1.5; }
.checkout-note-box {
  margin-top: .75rem; margin-bottom: 0; padding: .75rem; border: 1px solid var(--border);
  background: rgba(0,0,0,.02);
}
.payment-option {
  width: 100%; padding: 1rem; border: 1px solid var(--border); display: flex; gap: 1rem;
  align-items: center; margin-bottom: .75rem; text-align: left; transition: .2s;
}
.payment-option.active { border-color: var(--gold); background: rgba(201,169,98,.05); }
.payment-option svg { width: 1.25rem; height: 1.25rem; flex-shrink: 0; }
.payment-option.active svg { color: var(--gold); }
.order-summary { background: var(--muted); padding: 2rem; position: sticky; top: 7rem; }
.city-dropdown { position: relative; }
.city-list {
  position: absolute; top: 100%; left: 0; right: 0; background: var(--background);
  border: 1px solid var(--border); max-height: 12rem; overflow-y: auto; z-index: 10;
}
.city-list button { width: 100%; padding: .5rem 1rem; text-align: left; }
.city-list button:hover { background: var(--muted); }
.success-box { text-align: center; padding: 3rem 0; max-width: 32rem; margin: 0 auto; }
.success-icon {
  width: 5rem; height: 5rem; background: #dcfce7; margin: 0 auto 1.5rem;
  display: flex; align-items: center; justify-content: center;
}
.success-icon svg { width: 2.5rem; height: 2.5rem; color: #16a34a; }
.order-number { background: var(--muted); padding: 1.5rem; margin: 2rem 0; }
.order-number code { font-size: 1.25rem; font-weight: 600; }

.text-center { text-align: center; }
.text-link { display: inline-flex; align-items: center; gap: .5rem; font-size: .75rem; letter-spacing: .15em; text-transform: uppercase; margin-top: 3rem; }
.text-link:hover { color: var(--gold); }
.page-spacer { padding-top: 5rem; }
.hidden { display: none !important; }

/* Account page */
.account-card {
  max-width: 28rem; margin: 0 auto; padding: 2.5rem;
  border: 1px solid var(--border);
  background: var(--background);
  box-shadow: 0 20px 60px rgba(0,0,0,.06);
}
.account-tabs {
  display: flex; gap: 0; margin-bottom: 2rem;
  border-bottom: 1px solid var(--border);
}
.account-tab {
  flex: 1; padding: .875rem 1rem; font-size: .75rem;
  letter-spacing: .15em; text-transform: uppercase; font-weight: 500;
  color: var(--muted-fg); border-bottom: 2px solid transparent;
  margin-bottom: -1px; transition: .2s;
}
.account-tab:hover { color: var(--foreground); }
.account-tab.active { color: var(--foreground); border-bottom-color: var(--gold); }
.account-panel { display: none; }
.account-panel.active { display: block; }
.account-form .form-group:last-of-type { margin-bottom: 1.5rem; }
.account-message {
  padding: .875rem 1rem; margin-bottom: 1.5rem; font-size: .875rem;
  background: rgba(201,169,98,.1); border: 1px solid rgba(201,169,98,.3);
  color: var(--foreground);
}
.account-note {
  margin-top: 2rem; padding-top: 1.5rem; border-top: 1px solid var(--border);
  font-size: .75rem; color: var(--muted-fg); text-align: center; line-height: 1.7;
}
.account-note a { text-decoration: underline; }
.account-note a:hover { color: var(--gold); }
.page-header h1 { font-family: var(--font-serif); font-size: 2.5rem; font-weight: 300; }
.page-header h1 strong { font-weight: 600; }
`;

// --- data.js ---
const dataJs = `const STYLE_LABELS = ${JSON.stringify(styleLabels)};
const WATCHES = ${JSON.stringify(watches, null, 2)};

function formatPrice(price) {
  return new Intl.NumberFormat('uk-UA', {
    style: 'currency',
    currency: 'UAH',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

function getWatchById(id) {
  return WATCHES.find(w => w.id === id);
}
`;

// --- cart.js ---
const cartJs = `const Cart = {
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
`;

// --- app.js ---
const appJs = `function getBase() {
  return document.body.dataset.base || '';
}

function pageUrl(page) {
  const base = getBase();
  if (page === 'home') return base + 'index.html';
  if (page === 'catalog') return base + 'catalog.html';
  if (page === 'checkout') return base + 'checkout.html';
  if (page === 'account') return base + 'account.html';
  if (page.startsWith('product/')) return base + page + '.html';
  if (page.startsWith('catalog?')) return base + 'catalog.html?' + page.split('?')[1];
  return base + page;
}

function renderHeader() {
  const base = getBase();
  const el = document.getElementById('site-header');
  if (!el) return;

  el.innerHTML = \`
    <header class="site-header" id="header">
      <div class="container header-inner">
        <nav class="nav-desktop">
          <div class="nav-dropdown">
            <button class="nav-dropdown-btn" type="button">Каталог ▾</button>
            <div class="nav-dropdown-menu">
              <a href="\${pageUrl('catalog?style=classic')}"><strong>Класичні</strong><small>Вічна елегантність</small></a>
              <a href="\${pageUrl('catalog?style=sport')}"><strong>Спортивні</strong><small>Для активного життя</small></a>
              <a href="\${pageUrl('catalog?style=dress')}"><strong>Елегантні</strong><small>Витончений стиль</small></a>
              <a href="\${pageUrl('catalog?sort=new')}"><strong>Нова колекція</strong><small>Останні надходження</small></a>
              <a href="\${pageUrl('catalog')}"><strong style="color:var(--gold);text-align:center;display:block;padding:.5rem">Переглянути все →</strong></a>
            </div>
          </div>
        </nav>
        <button class="icon-btn menu-toggle" id="menu-toggle" aria-label="Меню">\${icon('menu')}</button>
        <a href="\${pageUrl('home')}" class="logo-wrap">
          <div class="logo">CHRONOS</div>
          <div class="logo-sub">Преміум Годинники</div>
        </a>
        <div class="header-actions">
          <button class="icon-btn" id="search-btn" aria-label="Пошук" style="position:relative">\${icon('search')}</button>
          <a href="\${pageUrl('account')}" class="icon-btn" aria-label="Обліковий запис">\${icon('user')}</a>
          <button class="icon-btn" id="cart-btn" aria-label="Кошик" style="position:relative">
            \${icon('shopping-bag')}
            <span class="cart-badge hidden" id="cart-badge">0</span>
          </button>
        </div>
      </div>
      <nav class="mobile-nav" id="mobile-nav">
        <a href="\${pageUrl('catalog?style=classic')}">Класичні</a>
        <a href="\${pageUrl('catalog?style=sport')}">Спортивні</a>
        <a href="\${pageUrl('catalog?style=dress')}">Елегантні</a>
        <a href="\${pageUrl('catalog?sort=new')}">Нова колекція</a>
        <a href="\${pageUrl('catalog')}" style="color:var(--gold);text-align:center;margin-top:.5rem">Переглянути весь каталог</a>
      </nav>
    </header>\`;

  document.getElementById('menu-toggle')?.addEventListener('click', () => {
    document.getElementById('mobile-nav').classList.toggle('open');
  });
  document.getElementById('search-btn')?.addEventListener('click', openSearch);
  document.getElementById('cart-btn')?.addEventListener('click', openCart);

  window.addEventListener('scroll', () => {
    document.getElementById('header')?.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });
}

function renderFooter() {
  const el = document.getElementById('site-footer');
  if (!el) return;
  el.innerHTML = \`
    <footer class="site-footer">
      <div class="container footer-grid">
        <div class="footer-brand">
          <h3>CHRONOS</h3>
          <div class="logo-sub">Преміум Годинники</div>
          <p>Ексклюзивна колекція преміум годинників для цінителів справжньої якості та стилю.</p>
        </div>
        <div class="footer-col">
          <h4>Навігація</h4>
          <a href="\${pageUrl('catalog')}">Каталог</a>
          <a href="\${pageUrl('catalog?style=classic')}">Класичні годинники</a>
          <a href="\${pageUrl('catalog?style=sport')}">Спортивні годинники</a>
          <a href="\${pageUrl('catalog?style=dress')}">Елегантні годинники</a>
        </div>
        <div class="footer-col">
          <h4>Контакти</h4>
          <a href="tel:+380501234567">📞 +380 50 123 45 67</a>
          <a href="mailto:info@chronos.ua">✉ info@chronos.ua</a>
          <p>📍 Київ, Україна</p>
        </div>
        <div class="footer-col">
          <h4>Графік роботи</h4>
          <p>Пн-Пт: 10:00 - 20:00</p>
          <p>Сб-Нд: 11:00 - 18:00</p>
          <p style="color:var(--gold);margin-top:1rem;font-size:.8rem">Безкоштовна доставка по Україні</p>
        </div>
      </div>
      <div class="container footer-bottom">
        <p>© 2024 CHRONOS. Усі права захищені.</p>
        <div class="footer-links">
          <a href="#">Політика конфіденційності</a>
          <a href="#">Умови використання</a>
        </div>
      </div>
    </footer>\`;
}

function renderCartOverlay() {
  const overlay = document.getElementById('cart-overlay');
  if (!overlay) return;
  overlay.innerHTML = \`
    <div class="overlay" id="cart-backdrop"></div>
    <aside class="cart-panel" id="cart-panel">
      <div class="cart-header">
        <h2 class="cart-title">\${icon('shopping-bag')} Кошик (<span id="cart-count-label">0</span>)</h2>
        <button class="icon-btn" id="cart-close" aria-label="Закрити">\${icon('x')}</button>
      </div>
      <div class="cart-body" id="cart-body"></div>
      <div class="cart-footer hidden" id="cart-footer">
        <div class="cart-total"><span>Разом:</span><strong id="cart-total-price">0 ₴</strong></div>
        <div class="cart-footer-actions">
          <button type="button" class="btn btn-outline btn-full" id="cart-continue-btn">Продовжити покупки</button>
          <a href="\${pageUrl('checkout')}" class="btn btn-gold btn-full" id="cart-checkout-btn">Оформити замовлення</a>
        </div>
      </div>
    </aside>\`;

  document.getElementById('cart-close')?.addEventListener('click', closeCart);
  document.getElementById('cart-backdrop')?.addEventListener('click', closeCart);
  document.getElementById('cart-continue-btn')?.addEventListener('click', closeCart);
}

function renderSearchOverlay() {
  const overlay = document.getElementById('search-overlay');
  if (!overlay) return;
  overlay.innerHTML = \`
    <div class="overlay" id="search-backdrop"></div>
    <div class="search-panel" id="search-panel">
      <button class="icon-btn" id="search-close" style="float:right" aria-label="Закрити">\${icon('x')}</button>
      <h2 style="margin-bottom:1rem;font-family:var(--font-serif)">Пошук годинників</h2>
      <input type="search" class="search-input" id="search-input" placeholder="Введіть назву або бренд...">
      <div class="search-results" id="search-results"></div>
    </div>\`;

  document.getElementById('search-close')?.addEventListener('click', closeSearch);
  document.getElementById('search-backdrop')?.addEventListener('click', closeSearch);
  document.getElementById('search-input')?.addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase().trim();
    const results = document.getElementById('search-results');
    if (!q) { results.innerHTML = ''; return; }
    const found = WATCHES.filter(w =>
      w.name.toLowerCase().includes(q) || w.brand.toLowerCase().includes(q) || w.description.toLowerCase().includes(q)
    ).slice(0, 6);
    results.innerHTML = found.map(w => \`
      <a href="\${pageUrl('product/' + w.id)}">
        <img src="\${w.images[0]}" alt="">
        <div><strong>\${w.name}</strong><br><small>\${formatPrice(w.price)}</small></div>
      </a>\`).join('') || '<p style="color:var(--muted-fg);padding:1rem 0">Нічого не знайдено</p>';
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
    body.innerHTML = '<div class="cart-empty"><p>Ваш кошик порожній</p><button class="btn btn-outline" onclick="closeCart()">Продовжити покупки</button></div>';
    footer?.classList.add('hidden');
    return;
  }

  body.innerHTML = items.map(({ watch, qty }) => \`
    <div class="cart-item">
      <img src="\${watch.images[0]}" alt="\${watch.name}">
      <div class="cart-item-info">
        <p class="product-brand">\${watch.brand}</p>
        <p class="cart-item-name">\${watch.name}</p>
        <p class="price">\${formatPrice(watch.price)}</p>
        <div style="display:flex;align-items:center;margin-top:.5rem">
          <div class="cart-qty">
            <button type="button" data-cart-minus="\${watch.id}">−</button>
            <span>\${qty}</span>
            <button type="button" data-cart-plus="\${watch.id}">+</button>
          </div>
          <button class="cart-remove" data-cart-remove="\${watch.id}">Видалити</button>
        </div>
      </div>
    </div>\`).join('');

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
  renderHeader();
  renderFooter();
  renderCartOverlay();
  renderSearchOverlay();
  updateCartUI();
  window.addEventListener('cart-updated', updateCartUI);
});
`;

// --- catalog.js ---
const catalogJs = `const ITEMS_PER_PAGE = 8;
let state = { style: '', sort: 'economy', page: 1, minPrice: 0, maxPrice: 130000 };

function getFiltered() {
  let list = [...WATCHES];
  if (state.style) list = list.filter(w => w.style === state.style);
  list = list.filter(w => w.price >= state.minPrice && w.price <= state.maxPrice);
  switch (state.sort) {
    case 'economy': list.sort((a, b) => a.price - b.price); break;
    case 'luxury': list.sort((a, b) => b.price - a.price); break;
    case 'new': list.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0)); break;
    case 'old': list.sort((a, b) => (a.isNew ? 1 : 0) - (b.isNew ? 1 : 0)); break;
  }
  return list;
}

function renderCatalog() {
  const filtered = getFiltered();
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE) || 1;
  if (state.page > totalPages) state.page = totalPages;
  const pageItems = filtered.slice((state.page - 1) * ITEMS_PER_PAGE, state.page * ITEMS_PER_PAGE);

  document.getElementById('catalog-count').textContent = filtered.length + ' моделей';
  const grid = document.getElementById('catalog-grid');
  if (pageItems.length === 0) {
    grid.innerHTML = '<div class="text-center" style="grid-column:1/-1;padding:4rem 0"><p style="color:var(--muted-fg);margin-bottom:1rem">Нічого не знайдено</p><button class="btn btn-outline" id="clear-filters">Очистити фільтри</button></div>';
    document.getElementById('clear-filters')?.addEventListener('click', clearFilters);
  } else {
    grid.innerHTML = pageItems.map(w => productCardHtml(w)).join('');
  }

  document.querySelectorAll('.filter-btn[data-style]').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.style === state.style);
  });

  const pag = document.getElementById('pagination');
  if (totalPages <= 1) { pag.innerHTML = ''; return; }
  let html = \`<button \${state.page === 1 ? 'disabled' : ''} id="prev-page">‹</button>\`;
  for (let i = 1; i <= totalPages; i++) {
    html += \`<button class="\${state.page === i ? 'active' : ''}" data-page="\${i}">\${i}</button>\`;
  }
  html += \`<button \${state.page === totalPages ? 'disabled' : ''} id="next-page">›</button>\`;
  pag.innerHTML = html;
  pag.querySelectorAll('[data-page]').forEach(btn => btn.addEventListener('click', () => { state.page = +btn.dataset.page; renderCatalog(); window.scrollTo(0, 0); }));
  document.getElementById('prev-page')?.addEventListener('click', () => { state.page--; renderCatalog(); });
  document.getElementById('next-page')?.addEventListener('click', () => { state.page++; renderCatalog(); });
}

function productCardHtml(w) {
  const badge = w.originalPrice ? '<span class="badge badge-sale">Акція</span>' : w.isNew ? '<span class="badge badge-new">Новинка</span>' : '';
  const orig = w.originalPrice ? \`<span class="price-old">\${formatPrice(w.originalPrice)}</span>\` : '';
  return \`<article class="product-card">
    <a href="product/\${w.id}.html" class="product-link">
      <div class="product-image"><img src="\${w.images[0]}" alt="\${w.name}" loading="lazy">\${badge}</div>
      <div class="product-info">
        <p class="product-brand">\${w.brand}</p>
        <h3 class="product-name">\${w.name}</h3>
        <p class="product-desc">\${w.description}</p>
        <div class="product-prices"><span class="price">\${formatPrice(w.price)}</span>\${orig}</div>
      </div>
    </a>
    <button class="btn btn-dark btn-full" data-add-cart="\${w.id}">Додати в кошик</button>
  </article>\`;
}

function clearFilters() {
  state = { style: '', sort: 'economy', page: 1, minPrice: 0, maxPrice: 130000 };
  history.replaceState(null, '', 'catalog.html');
  renderCatalog();
}

document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(location.search);
  state.style = params.get('style') || '';
  if (params.get('sort') === 'new') state.sort = 'new';

  document.querySelectorAll('.filter-btn[data-style]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.style = btn.dataset.style;
      state.page = 1;
      renderCatalog();
    });
  });

  document.getElementById('sort-select')?.addEventListener('change', (e) => {
    state.sort = e.target.value;
    state.page = 1;
    renderCatalog();
  });

  renderCatalog();
});
`;

// --- checkout.js ---
const checkoutJs = fs.readFileSync(path.join(ROOT, 'js', 'checkout.js'), 'utf8');

// --- account.js ---
const accountJs = fs.readFileSync(path.join(ROOT, 'js', 'account.js'), 'utf8');

// Write shared assets
fs.mkdirSync(path.join(ROOT, 'css'), { recursive: true });
fs.mkdirSync(path.join(ROOT, 'js'), { recursive: true });
fs.mkdirSync(path.join(ROOT, 'product'), { recursive: true });

fs.writeFileSync(path.join(ROOT, 'css', 'style.css'), css);
fs.writeFileSync(path.join(ROOT, 'js', 'data.js'), dataJs);
fs.writeFileSync(path.join(ROOT, 'js', 'cart.js'), cartJs);
fs.writeFileSync(path.join(ROOT, 'js', 'app.js'), appJs);
fs.writeFileSync(path.join(ROOT, 'js', 'catalog.js'), catalogJs);
fs.writeFileSync(path.join(ROOT, 'js', 'checkout.js'), checkoutJs);
fs.writeFileSync(path.join(ROOT, 'js', 'account.js'), accountJs);

// --- index.html ---
const featured = watches.slice(0, 4);
const indexHtml = `${head('CHRONOS | Преміум Годинники в Україні')}
${bodyStart()}
<main>
  <section class="hero">
    <div class="container">
      <div class="hero-grid">
        <div>
          <div class="hero-badge"><div class="hero-badge-line"></div><span>Преміум колекція</span></div>
          <h1>Час — це більше,<br>ніж аксесуар.<br><em>Це сигнал хто ти.</em></h1>
          <p class="hero-text">Ексклюзивні преміум-годинники для чоловіків, які цінують статус, стиль та увагу до деталей.</p>
          <div class="hero-btns">
            <a href="catalog.html" class="btn btn-dark btn-lg">Переглянути колекцію</a>
            <a href="catalog.html?sort=new" class="btn btn-outline btn-lg">Новинки</a>
          </div>
        </div>
        <div class="hero-image">
          <img src="https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800&q=90" alt="Luxury premium watch">
        </div>
      </div>
      <div class="hero-stats">
        <div class="stat-item"><div class="stat-icon">${icon('users')}</div><div><div class="stat-value">500+</div><div class="stat-label">клієнтів</div></div></div>
        <div class="stat-item"><div class="stat-icon">${icon('shield')}</div><div><div class="stat-value">1 рік</div><div class="stat-label">гарантії</div></div></div>
        <div class="stat-item"><div class="stat-icon">${icon('truck')}</div><div><div class="stat-value">1-3 дні</div><div class="stat-label">доставка</div></div></div>
        <div class="stat-item"><div class="stat-icon">${icon('credit-card')}</div><div><div class="stat-value">Оплата</div><div class="stat-label">при отриманні</div></div></div>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="section-header">
        <p class="section-label">Наша колекція</p>
        <h2 class="section-title">Обрані <strong>Моделі</strong></h2>
      </div>
      <div class="products-grid cols-4">${featured.map(w => productCard(w)).join('')}</div>
      <div class="text-center"><a href="catalog.html" class="text-link">Переглянути всі моделі →</a></div>
    </div>
  </section>

  <section class="section section-muted">
    <div class="container">
      <div class="section-header">
        <p class="section-label">Стилі</p>
        <h2 class="section-title">Знайдіть Свій <strong>Стиль</strong></h2>
      </div>
      <div class="categories-grid">
        <a href="catalog.html?style=classic" class="category-card">
          <img src="https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=800&q=80" alt="Класичні">
          <div class="category-overlay"><h3>Класичні</h3><p>Вічний стиль та елегантність</p><div class="category-line"></div></div>
        </a>
        <a href="catalog.html?style=sport" class="category-card">
          <img src="https://images.unsplash.com/photo-1606744824163-985d376605aa?w=800&q=80" alt="Спортивні">
          <div class="category-overlay"><h3>Спортивні</h3><p>Для активного способу життя</p><div class="category-line"></div></div>
        </a>
        <a href="catalog.html?style=dress" class="category-card">
          <img src="https://images.unsplash.com/photo-1627037558426-c2d07beda3af?w=800&q=80" alt="Елегантні">
          <div class="category-overlay"><h3>Елегантні</h3><p>Для особливих подій</p><div class="category-line"></div></div>
        </a>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="section-header">
        <p class="section-label">Відгуки</p>
        <h2 class="section-title">Наші <strong>Клієнти</strong></h2>
      </div>
      <div class="testimonials-grid">
        <div class="testimonial-card">
          <div class="testimonial-stars">★★★★★</div>
          <p class="testimonial-text">"Неймовірна якість та сервіс! Годинник виглядає розкішно і працює бездоганно."</p>
          <p class="testimonial-watch">Datejust 41 Silver</p>
          <div class="testimonial-author"><strong>Олександр К.</strong><span>Київ</span></div>
        </div>
        <div class="testimonial-card">
          <div class="testimonial-stars">★★★★★</div>
          <p class="testimonial-text">"Купувала годинник у подарунок чоловіку. Він у захваті! Якість на найвищому рівні."</p>
          <p class="testimonial-watch">GMT-Master II Pepsi</p>
          <div class="testimonial-author"><strong>Марина В.</strong><span>Одеса</span></div>
        </div>
        <div class="testimonial-card">
          <div class="testimonial-stars">★★★★★</div>
          <p class="testimonial-text">"Вже третій годинник замовляю в CHRONOS. Завжди відмінна якість та швидка доставка."</p>
          <p class="testimonial-watch">Cosmograph Daytona Black</p>
          <div class="testimonial-author"><strong>Дмитро П.</strong><span>Львів</span></div>
        </div>
      </div>
    </div>
  </section>

  <section class="section section-dark">
    <div class="container">
      <div class="section-header">
        <p class="section-label">Чому обирають нас</p>
        <h2 class="section-title">Довіра та <strong>Надійність</strong></h2>
      </div>
      <div class="trust-grid">
        <div class="trust-item"><div class="trust-icon">${icon('shield')}</div><h3>Гарантія якості</h3><p>12 місяців офіційної гарантії на всі годинники</p></div>
        <div class="trust-item"><div class="trust-icon">${icon('truck')}</div><h3>Безкоштовна доставка</h3><p>По всій Україні через Нову Пошту</p></div>
        <div class="trust-item"><div class="trust-icon">${icon('trophy')}</div><h3>Оригінальні механізми</h3><p>Швейцарські та японські механізми</p></div>
        <div class="trust-item"><div class="trust-icon">${icon('clock')}</div><h3>Швидка обробка</h3><p>Відправка протягом 24 годин</p></div>
        <div class="trust-item"><div class="trust-icon">${icon('credit-card')}</div><h3>Оплата при отриманні</h3><p>Перевірте товар перед оплатою</p></div>
        <div class="trust-item"><div class="trust-icon">${icon('phone')}</div><h3>Підтримка 24/7</h3><p>Завжди на зв'язку для консультації</p></div>
      </div>
      <div class="trust-banner"><p>Понад 5000+ задоволених клієнтів по всій Україні</p></div>
    </div>
  </section>
</main>
${bodyEnd()}`;

fs.writeFileSync(path.join(ROOT, 'index.html'), indexHtml);

// --- catalog.html ---
const catalogHtml = `${head('Каталог | CHRONOS')}
${bodyStart()}
<main class="page-spacer">
  <div class="page-header container"><h1>Каталог</h1></div>
  <section class="section" style="padding-top:0">
    <div class="container">
      <div class="filters-bar">
        <div class="filter-group">
          <span class="filter-label">Стиль:</span>
          <button class="filter-btn active" data-style="">Усі</button>
          <button class="filter-btn" data-style="classic">Класичні</button>
          <button class="filter-btn" data-style="sport">Спортивні</button>
          <button class="filter-btn" data-style="dress">Елегантні</button>
        </div>
        <div style="display:flex;gap:1rem;align-items:center">
          <span id="catalog-count" style="font-size:.875rem;color:var(--muted-fg)"></span>
          <select id="sort-select" style="padding:.5rem;border:1px solid var(--border)">
            <option value="economy">Спочатку економ клас</option>
            <option value="luxury">Спочатку люкс клас</option>
            <option value="new">Спочатку нова колекція</option>
            <option value="old">Спочатку минула колекція</option>
          </select>
        </div>
      </div>
      <div class="products-grid cols-3" id="catalog-grid"></div>
      <div class="pagination" id="pagination"></div>
    </div>
  </section>
</main>
${bodyEnd('', 'catalog.js')}`;

fs.writeFileSync(path.join(ROOT, 'catalog.html'), catalogHtml);

// --- checkout.html ---
const checkoutHtml = `${head('Оформлення замовлення | CHRONOS')}
${bodyStart()}
<main class="page-spacer">
  <div class="page-header container"><h1>Оформлення замовлення</h1></div>
  <section class="section" style="padding-top:0">
    <div class="container" id="checkout-content">
      <form class="checkout-form" id="checkout-form">
        <div class="checkout-grid">
          <div>
            <div class="form-section">
              <h2>Контактна інформація</h2>
              <div class="form-row">
                <div class="form-group"><label for="firstName">Ім'я</label><input id="firstName" name="firstName" required placeholder="Олександр"></div>
                <div class="form-group"><label for="lastName">Прізвище</label><input id="lastName" name="lastName" required placeholder="Коваленко"></div>
              </div>
              <div class="form-group"><label for="phone">Номер телефону</label><input id="phone" name="phone" type="tel" required placeholder="+380 50 123 45 67"></div>
            </div>
            <div class="form-section">
              <h2>Доставка</h2>
              <div class="np-banner"><span>🚚</span><div><strong>Нова Пошта</strong><br><small>Безкоштовна доставка по Україні</small></div></div>
              <div class="np-delivery-methods" id="nova-poshta-methods" role="radiogroup" aria-label="Спосіб доставки Новою Поштою" data-testid="delivery-methods">
                <button type="button" class="np-delivery-method active" data-delivery-method="branch" aria-checked="true">
                  <strong>У відділення</strong>
                  <small>Оберіть місто та відділення</small>
                </button>
                <button type="button" class="np-delivery-method" data-delivery-method="locker" aria-checked="false">
                  <strong>У поштомат</strong>
                  <small>Оберіть місто та поштомат</small>
                </button>
                <button type="button" class="np-delivery-method" data-delivery-method="courier" aria-checked="false">
                  <strong>Кур’єром</strong>
                  <small>Вкажіть адресу доставки</small>
                </button>
              </div>
              <p class="checkout-note" id="nova-poshta-note">Доставка лише Новою Поштою: відділення, поштомат або кур’єром. Точна вартість і доступність способу відображатимуться в Shopify checkout після підключення інтеграції.</p>
              <div class="form-group city-dropdown">
                <label for="city">Місто</label>
                <input id="city" required placeholder="Почніть вводити назву міста" autocomplete="off">
                <div class="city-list hidden" id="city-list"></div>
              </div>
              <div class="form-group">
                <label for="novaPoshta" id="delivery-point-label">Відділення Нової Пошти</label>
                <input id="novaPoshta" name="novaPoshta" required placeholder="Відділення №1, вул. Хрещатик, 1">
              </div>
            </div>
            <div class="form-section">
              <h2>Оплата</h2>
              <div data-testid="payment-methods">
                <button type="button" class="payment-option active" data-payment="cod"><span>💵</span><div><strong>Накладений платіж</strong><br><small>Оплата при отриманні в Новій Пошті</small></div></button>
                <button type="button" class="payment-option" data-payment="card"><span>💳</span><div><strong>Онлайн-карткою</strong><br><small>Безпечна оплата на сайті</small></div></button>
              </div>
              <p class="checkout-note checkout-note-box" id="payment-method-note">Накладений платіж: сплата під час отримання у Новій Пошті. Комісію перевізника сплачує покупець.</p>
            </div>
          </div>
          <div>
            <div class="order-summary">
              <h2 style="margin-bottom:1.5rem">Ваше замовлення</h2>
              <div id="order-summary"></div>
              <button type="submit" class="btn btn-dark btn-full btn-lg" id="submit-order" style="margin-top:1.5rem">Підтвердити замовлення</button>
              <p style="margin-top:1rem;font-size:.75rem;color:var(--muted-fg);text-align:center">🛡 Гарантія якості 12 місяців · 🚚 Безкоштовна доставка</p>
            </div>
          </div>
        </div>
      </form>
    </div>
  </section>
</main>
${bodyEnd('', 'checkout.js')}`;

fs.writeFileSync(path.join(ROOT, 'checkout.html'), checkoutHtml);

// --- account.html ---
const accountHtml = `${head('Обліковий запис | CHRONOS')}
${bodyStart()}
<main class="page-spacer">
  <div class="page-header container">
    <p class="section-label">Особистий кабінет</p>
    <h1>Обліковий <strong>Запис</strong></h1>
  </div>
  <section class="section" style="padding-top:0">
    <div class="container">
      <div class="account-card">
        <div class="account-tabs">
          <button type="button" class="account-tab active" data-tab="login">Вхід</button>
          <button type="button" class="account-tab" data-tab="register">Реєстрація</button>
        </div>
        <div id="account-message" class="account-message hidden" role="status"></div>
        <div class="account-panel active" id="panel-login">
          <form id="login-form" class="account-form">
            <div class="form-group">
              <label for="login-email">Email</label>
              <input type="email" id="login-email" name="email" required placeholder="name@example.com" autocomplete="email">
            </div>
            <div class="form-group">
              <label for="login-password">Пароль</label>
              <input type="password" id="login-password" name="password" required placeholder="••••••••" autocomplete="current-password">
            </div>
            <button type="submit" class="btn btn-dark btn-full btn-lg">Увійти</button>
          </form>
        </div>
        <div class="account-panel" id="panel-register">
          <form id="register-form" class="account-form">
            <div class="form-row">
              <div class="form-group">
                <label for="register-first">Ім'я</label>
                <input type="text" id="register-first" name="firstName" required placeholder="Олександр">
              </div>
              <div class="form-group">
                <label for="register-last">Прізвище</label>
                <input type="text" id="register-last" name="lastName" required placeholder="Коваленко">
              </div>
            </div>
            <div class="form-group">
              <label for="register-email">Email</label>
              <input type="email" id="register-email" name="email" required placeholder="name@example.com" autocomplete="email">
            </div>
            <div class="form-group">
              <label for="register-password">Пароль</label>
              <input type="password" id="register-password" name="password" required placeholder="Мінімум 8 символів" autocomplete="new-password" minlength="8">
            </div>
            <div class="form-group">
              <label for="register-password-confirm">Підтвердження пароля</label>
              <input type="password" id="register-password-confirm" name="passwordConfirm" required placeholder="Повторіть пароль" autocomplete="new-password">
            </div>
            <button type="submit" class="btn btn-gold btn-full btn-lg">Зареєструватися</button>
          </form>
        </div>
        <p class="account-note">Реєструючись, ви погоджуєтесь з <a href="#">політикою конфіденційності</a> та <a href="#">умовами використання</a>.</p>
      </div>
    </div>
  </section>
</main>
${bodyEnd('', 'account.js')}`;

fs.writeFileSync(path.join(ROOT, 'account.html'), accountHtml);

// --- Product pages ---
watches.forEach((watch) => {
  const discount = watch.originalPrice
    ? `<span class="discount-badge">-${Math.round((1 - watch.price / watch.originalPrice) * 100)}%</span>`
    : '';
  const origPrice = watch.originalPrice
    ? `<span class="price-old">${formatPrice(watch.originalPrice)}</span>`
    : '';
  const thumbs = watch.images.length > 1
    ? `<div class="gallery-thumbs">${watch.images.map((img, i) =>
        `<button type="button" class="${i === 0 ? 'active' : ''}" data-thumb="${i}"><img src="${img}" alt=""></button>`
      ).join('')}</div>`
    : '';

  const specs = [
    ['Корпус', watch.specifications.case],
    ['Механізм', watch.specifications.movement],
    ['Водонепроникність', watch.specifications.waterResistance],
    ['Діаметр', watch.specifications.diameter],
    ['Товщина', watch.specifications.thickness],
    ['Браслет', watch.specifications.bracelet],
  ];

  const related = watches.filter(w => w.style === watch.style && w.id !== watch.id).slice(0, 4);

  const productHtml = `${head(`${watch.name} | CHRONOS`, '../')}
${bodyStart('../')}
<main class="product-page">
  <div class="container product-layout">
    <div>
      <div class="gallery-main"><img id="main-image" src="${watch.images[0]}" alt="${esc(watch.name)}"></div>
      ${thumbs}
    </div>
    <div>
      <nav class="breadcrumb">
        <a href="../index.html">Головна</a><span>/</span>
        <a href="../catalog.html">Каталог</a><span>/</span>
        <a href="../catalog.html?style=${watch.style}">${styleLabels[watch.style]}</a>
      </nav>
      <p class="product-detail-brand">${esc(watch.brand)}</p>
      <h1 class="product-detail-name">${esc(watch.name)}</h1>
      <div class="product-detail-price">
        <span class="price">${formatPrice(watch.price)}</span>${origPrice}${discount}
      </div>
      <p class="product-detail-desc">${esc(watch.longDescription)}</p>
      <p class="stock-ok">✓ В наявності</p>
      <div class="qty-row">
        <span>Кількість:</span>
        <div class="qty-control">
          <button type="button" id="qty-minus">−</button>
          <span id="qty-value">1</span>
          <button type="button" id="qty-plus">+</button>
        </div>
      </div>
      <div class="product-actions">
        <button class="btn btn-dark btn-lg" id="add-to-cart" data-watch-id="${watch.id}">🛍 Додати в кошик</button>
        <a href="../checkout.html?product=${watch.id}" class="btn btn-outline btn-lg">Купити зараз</a>
      </div>
      <div class="trust-row">
        <div class="trust-row-item"><span>🚚</span><div><strong>Безкоштовна доставка</strong><span>По всій Україні</span></div></div>
        <div class="trust-row-item"><span>🛡</span><div><strong>Гарантія 12 місяців</strong><span>Офіційна гарантія</span></div></div>
        <div class="trust-row-item"><span>⏱</span><div><strong>Відправка 24 год</strong><span>Швидка обробка</span></div></div>
      </div>
      <div>
        <h3 style="font-size:.875rem;letter-spacing:.1em;text-transform:uppercase;margin-bottom:1rem">Особливості</h3>
        <ul class="features-list">${watch.features.map(f => `<li>${esc(f)}</li>`).join('')}</ul>
      </div>
    </div>
  </div>

  <section class="section section-muted">
    <div class="container">
      <div class="section-header">
        <p class="section-label">Технічні характеристики</p>
        <h2 class="section-title">Деталі та <strong>Специфікації</strong></h2>
      </div>
      <div class="specs-table">${specs.map(([l, v]) => `<div class="specs-row"><span>${l}</span><span>${esc(v)}</span></div>`).join('')}</div>
      <div class="shipping-box">
        <h3>Доставка по Україні</h3>
        <p><strong>Нова Пошта:</strong> Безкоштовна доставка при замовленні від 10 000 ₴. Доставка 1-3 дні.</p>
        <p><strong>Оплата:</strong> При отриманні (накладений платіж) або передоплата на картку.</p>
        <p><strong>Повернення:</strong> 14 днів на повернення або обмін товару.</p>
      </div>
    </div>
  </section>

  ${related.length ? `<section class="section"><div class="container">
    <div class="section-header"><p class="section-label">Схожі моделі</p><h2 class="section-title">Вам також <strong>Сподобається</strong></h2></div>
    <div class="products-grid cols-4">${related.map(w => productCard(w, '../')).join('')}</div>
  </div></section>` : ''}
</main>
<script>
  let qty = 1;
  document.getElementById('qty-minus')?.addEventListener('click', () => { if (qty > 1) { qty--; document.getElementById('qty-value').textContent = qty; } });
  document.getElementById('qty-plus')?.addEventListener('click', () => { qty++; document.getElementById('qty-value').textContent = qty; });
  document.getElementById('add-to-cart')?.addEventListener('click', () => { Cart.add('${watch.id}', qty); openCart(); });
  document.querySelectorAll('[data-thumb]').forEach(btn => btn.addEventListener('click', () => {
    document.querySelectorAll('[data-thumb]').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('main-image').src = ${JSON.stringify(watch.images)}[btn.dataset.thumb];
  }));
</script>
${bodyEnd('../')}`;

  fs.writeFileSync(path.join(ROOT, 'product', `${watch.id}.html`), productHtml);
});

// --- Open shortcut ---
fs.writeFileSync(path.join(ROOT, 'ВІДКРИТИ-САЙТ.bat'), `@echo off\r\nstart "" "%~dp0index.html"\r\n`);

console.log('✓ Static site generated!');
console.log('  Open: index.html (double-click)');
console.log(`  Pages: index.html, catalog.html, checkout.html, account.html, ${watches.length} product pages`);
console.log('  Folders: css/, js/, product/');
require('./scripts/rebuild-static-products');
