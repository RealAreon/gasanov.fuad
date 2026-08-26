import { useMemo, useState } from 'react';
import { products } from '../../data/products';
import type { Product } from '../../data/types';
import { useAppStore } from '../../store/useAppStore';
import { Icon } from '../../components/shared/Icon';
import './Catalog.scss';

const formatPrice = (value: number, currency: string) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(value);

type FilterId = 'all' | Product['colorway'];

const FILTERS: Array<{ id: FilterId; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'onyx', label: 'Infinitum' },
  { id: 'aurum', label: 'Aurum' },
  { id: 'legacy', label: 'Legacy' },
];

const STATUS_LABEL: Record<Product['status'], string> = {
  active: 'In stock',
  limited: 'Limited',
  'coming-soon': 'Soon',
};

export const Catalog = () => {
  const [filter, setFilter] = useState<FilterId>('all');
  const setActiveProductSlug = useAppStore((state) => state.setActiveProductSlug);
  const openOverlay = useAppStore((state) => state.openOverlay);
  const addToCart = useAppStore((state) => state.addToCart);
  const pushToast = useAppStore((state) => state.pushToast);

  const visible = useMemo(
    () => (filter === 'all' ? products : products.filter((product) => product.colorway === filter)),
    [filter],
  );

  const openProduct = (slug: string) => {
    setActiveProductSlug(slug);
    openOverlay('productQuickView');
  };

  return (
    <section className="catalog" data-section="catalog" aria-label="Catalog">
      <div className="catalog__intro container">
        <p className="eyebrow">The Atelier Shop</p>
        <h1>Catalog</h1>
        <p className="catalog__lead">
          Swiss automatic timepieces, ready for selection. Every model is finished in-house and backed by a five-year
          warranty.
        </p>
      </div>

      <div className="catalog__toolbar container">
        <div className="catalog__filters" role="tablist" aria-label="Filter by line">
          {FILTERS.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={filter === item.id}
              className={filter === item.id ? 'is-active' : ''}
              onClick={() => setFilter(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
        <p className="catalog__count">
          {visible.length} timepiece{visible.length === 1 ? '' : 's'}
        </p>
      </div>

      <div className="catalog__grid container">
        {visible.map((product) => (
          <article key={product.id} className="catalog-card">
            <button type="button" className="catalog-card__media" onClick={() => openProduct(product.slug)}>
              <img src={product.image} alt={product.name} loading="lazy" />
              <span className={`catalog-card__badge catalog-card__badge--${product.status}`}>
                {STATUS_LABEL[product.status]}
              </span>
            </button>
            <div className="catalog-card__body">
              <p className="catalog-card__tag">{product.tagline}</p>
              <h2>{product.name}</h2>
              <p className="catalog-card__price">{formatPrice(product.price, product.currency)}</p>
              <div className="catalog-card__actions">
                <button type="button" className="btn-outline" onClick={() => openProduct(product.slug)}>
                  Details
                </button>
                <button
                  type="button"
                  className="btn-solid"
                  disabled={product.status === 'coming-soon'}
                  onClick={() => {
                    addToCart(product.id, 1);
                    pushToast(`${product.name} added to your selection.`, 'success');
                  }}
                >
                  <Icon name="bag" size={14} />
                  Add
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};
