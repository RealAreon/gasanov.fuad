import { useCallback, useEffect, useRef } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { products, getProductBySlug } from '../../data/products';
import { useSectionMotion, initCollectionStack } from '../../motion/initSectionMotion';
import { Icon } from '../../components/shared/Icon';
import type { IconName } from '../../components/shared/Icon';
import './Collection.scss';

const formatPrice = (value: number, currency: string) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(value);

const BENEFITS: { icon: IconName; title: string; text: string }[] = [
  { icon: 'shield', title: 'Swiss Made', text: 'Certified precision and reliability' },
  { icon: 'gem', title: 'Premium Materials', text: 'Sourced for durability and beauty' },
  { icon: 'gear', title: '5 Year Warranty', text: 'Our promise of lasting quality' },
];

export const Collection = () => {
  const rootRef = useRef<HTMLElement>(null);
  const showcaseRef = useRef<HTMLDivElement>(null);
  useSectionMotion(rootRef);

  const selectedId = useAppStore((state) => state.selectedCollectionId);
  const setSelectedCollectionId = useAppStore((state) => state.setSelectedCollectionId);
  const setActiveProductSlug = useAppStore((state) => state.setActiveProductSlug);
  const openOverlay = useAppStore((state) => state.openOverlay);
  const activeSection = useAppStore((state) => state.activeSection);

  const active = getProductBySlug(selectedId) ?? getProductBySlug('infinitum') ?? products[0];
  const activeIndex = Math.max(
    0,
    products.findIndex((product) => product.id === active.id),
  );

  const selectByIndex = useCallback(
    (index: number) => {
      const next = products[(index + products.length) % products.length];
      if (next) setSelectedCollectionId(next.id);
    },
    [setSelectedCollectionId],
  );

  const handleQuickView = (slug: string) => {
    setActiveProductSlug(slug);
    openOverlay('productQuickView');
  };

  const handleViewAll = () => {
    setActiveProductSlug(active.slug);
    openOverlay('productQuickView');
  };

  const scrollToShowcase = () => {
    document.getElementById('collection-showcase')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  useEffect(() => {
    const showcase = showcaseRef.current;
    if (!showcase) return;
    return initCollectionStack(showcase, () => {});
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      const focusInside = root.contains(document.activeElement);
      if (!focusInside && activeSection !== 'collection') return;

      event.preventDefault();
      selectByIndex(event.key === 'ArrowRight' ? activeIndex + 1 : activeIndex - 1);
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeIndex, activeSection, selectByIndex]);

  return (
    <section
      id="collection"
      data-section="collection"
      className="collection section"
      ref={rootRef}
      tabIndex={0}
      aria-label="Collection"
    >
      <img
        className="collection__bg"
        src="./assets/images/collection/collection-bg.webp"
        alt=""
        loading="lazy"
      />
      <div className="collection__scrim" aria-hidden="true" />

      <div className="collection__top container">
        <div className="collection__intro" data-reveal="up">
          <p className="eyebrow">Our Collection</p>
          <h2 className="collection__headline">
            <span>Engineered</span>
            <span>For Eternity</span>
          </h2>
          <span className="collection__rule" aria-hidden="true" />
          <p className="collection__intro-copy">
            Each Chronos timepiece is a masterpiece of precision engineering and timeless design.
            Built to endure. Created to inspire.
          </p>
          <button type="button" className="btn-outline" onClick={scrollToShowcase}>
            Browse Collection
            <span className="arrow">
              <Icon name="arrow-right" size={16} />
            </span>
          </button>
        </div>

        <div className="collection__hero-media" data-reveal="right">
          <div className="collection__eclipse" aria-hidden="true" />
          <img
            className="collection__hero-watch"
            src={active.image}
            alt={`${active.name} — ${active.tagline}`}
            data-parallax="16"
            key={active.id}
          />
        </div>

        <aside className="collection__benefits" data-reveal="left" aria-label="Collection benefits">
          <ul>
            {BENEFITS.map((benefit) => (
              <li key={benefit.title}>
                <span className="collection__benefit-icon">
                  <Icon name={benefit.icon} size={18} />
                </span>
                <div>
                  <p className="collection__benefit-title">{benefit.title}</p>
                  <p className="collection__benefit-text">{benefit.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </aside>
      </div>

      <div
        id="collection-showcase"
        className="collection__showcase container"
        ref={showcaseRef}
        data-reveal="up"
      >
        <div className="collection__zone collection__zone--picker">
          <div className="collection__picker-head">
            <p className="collection__picker-label">Choose Your Collection</p>
            <button type="button" className="collection__view-all" onClick={handleViewAll}>
              View All
              <Icon name="arrow-right" size={14} />
            </button>
          </div>

          <div className="collection__picker" role="listbox" aria-label="Collection models">
            {products.map((product) => (
              <button
                key={product.id}
                type="button"
                role="option"
                className={`collection__picker-card ${product.id === active.id ? 'is-active' : ''}`}
                onClick={() => setSelectedCollectionId(product.id)}
                aria-selected={product.id === active.id}
              >
                <span className="collection__picker-thumb">
                  <img src={product.image} alt="" loading="lazy" />
                </span>
                <span className="collection__picker-meta">
                  <span className="collection__picker-name">{product.name}</span>
                  <span className="collection__picker-tag">{product.tagline}</span>
                </span>
              </button>
            ))}
          </div>

          <div className="collection__picker-nav">
            <button
              type="button"
              className="collection__nav-btn"
              aria-label="Previous model"
              onClick={() => selectByIndex(activeIndex - 1)}
            >
              <Icon name="chevron-left" size={16} />
            </button>
            <button
              type="button"
              className="collection__nav-btn"
              aria-label="Next model"
              onClick={() => selectByIndex(activeIndex + 1)}
            >
              <Icon name="chevron-right" size={16} />
            </button>
          </div>
        </div>

        <div className="collection__zone collection__zone--info">
          <h3>{active.name}</h3>
          <p className="collection__info-tagline">{active.tagline}</p>
          <p className="collection__info-desc">{active.shortDescription}</p>
          <p className="collection__info-price">{formatPrice(active.price, active.currency)}</p>
          <button type="button" className="btn-outline" onClick={() => handleQuickView(active.slug)}>
            Discover This Model
            <span className="arrow">
              <Icon name="arrow-right" size={16} />
            </span>
          </button>
        </div>

        <figure className="collection__zone collection__zone--movement">
          <img
            src="./assets/images/collection/movement-macro.webp"
            alt="Macro detail of the Swiss automatic movement"
            loading="lazy"
          />
        </figure>

        <div className="collection__zone collection__zone--features">
          <p className="eyebrow">Features</p>
          <table>
            <tbody>
              {active.specs.map((spec) => (
                <tr key={spec.label}>
                  <th scope="row">{spec.label}</th>
                  <td>{spec.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {active.specSheetUrl ? (
            <a className="collection__spec-link" href={active.specSheetUrl} download>
              <Icon name="download" size={16} />
              Download Spec Sheet
            </a>
          ) : null}
        </div>
      </div>
    </section>
  );
};
