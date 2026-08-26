import { useRef, useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { featuredArticle, articles } from '../../data/articles';
import { scrollToSection } from '../../motion/useSmoothScroll';
import { useSectionMotion } from '../../motion/initSectionMotion';
import { Icon } from '../../components/shared/Icon';
import './Journal.scss';

const PER_PAGE = 4;
const PAGE_COUNT = 5;

const formatCardMeta = (iso: string, category: string) => {
  const date = new Date(iso);
  const month = date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
  const day = date.toLocaleDateString('en-US', { day: '2-digit' });
  const year = date.getFullYear();
  return `${month} ${day}, ${year} \u2022 ${category.toUpperCase()}`;
};

const formatFeaturedDate = (iso: string) => {
  const date = new Date(iso);
  const month = date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
  const day = date.toLocaleDateString('en-US', { day: '2-digit' });
  const year = date.getFullYear();
  return `${month} ${day}, ${year}`;
};

const padPage = (value: number) => String(value).padStart(2, '0');

const getPageArticles = (page: number) => {
  const start = (page * PER_PAGE) % articles.length;
  return Array.from({ length: PER_PAGE }, (_, index) => articles[(start + index) % articles.length]);
};

export const Journal = () => {
  const rootRef = useRef<HTMLElement>(null);
  useSectionMotion(rootRef);

  const setActiveArticleSlug = useAppStore((state) => state.setActiveArticleSlug);
  const openOverlay = useAppStore((state) => state.openOverlay);

  const [page, setPage] = useState(0);
  const visibleArticles = getPageArticles(page);

  const openArticle = (slug: string) => {
    setActiveArticleSlug(slug);
    openOverlay('article');
  };

  const focusFooterEmail = () => {
    scrollToSection('footer');
    window.setTimeout(() => {
      const input = document.querySelector<HTMLInputElement>('footer input[type="email"], #footer-email');
      input?.focus();
    }, 700);
  };

  const goPrev = () => setPage((prev) => (prev - 1 + PAGE_COUNT) % PAGE_COUNT);
  const goNext = () => setPage((prev) => (prev + 1) % PAGE_COUNT);

  return (
    <section id="journal" data-section="journal" data-theme="light" className="journal section" ref={rootRef}>
      <div className="journal__featured container" data-reveal="up">
        <div className="journal__featured-body">
          <p className="eyebrow">Journal</p>
          <h2 className="journal__title">
            <span>The Return of</span>
            <span>Timeless Design</span>
          </h2>
          <p className="journal__kicker">Heritage Never Fades</p>
          <p className="journal__lead">
            In an age of fleeting trends, classic design endures. Discover how Chronos redefines heritage through
            precision engineering and enduring craftsmanship that transcends generations.
          </p>
          <button type="button" className="btn-outline" onClick={() => openArticle(featuredArticle.slug)}>
            Read Full Article
            <span className="arrow">
              <Icon name="arrow-right" size={16} />
            </span>
          </button>
        </div>

        <button
          type="button"
          className="journal__featured-media"
          onClick={() => openArticle(featuredArticle.slug)}
          aria-label={`Read ${featuredArticle.title}`}
        >
          <img src={featuredArticle.image} alt={featuredArticle.title} loading="lazy" />
          <span className="journal__date-card">
            <span className="journal__date-row">
              <Icon name="calendar" size={14} />
              <span>{formatFeaturedDate(featuredArticle.date)}</span>
            </span>
            <span className="journal__date-divider" aria-hidden="true" />
            <span className="journal__date-by">By Chronos Editorial</span>
          </span>
        </button>
      </div>

      <div className="journal__more container" data-reveal="up">
        <div className="journal__more-head">
          <h3>More from the Journal</h3>
          <button type="button" className="journal__view-all" onClick={() => setPage(0)}>
            View All Articles
            <Icon name="arrow-right" size={14} />
          </button>
        </div>

        <div className="journal__grid">
          {visibleArticles.map((article) => (
            <article key={`${article.id}-${page}`} className="journal__card">
              <button
                type="button"
                className="journal__card-media"
                onClick={() => openArticle(article.slug)}
                aria-label={`Read ${article.title}`}
              >
                <img src={article.image} alt={article.title} loading="lazy" />
              </button>
              <p className="journal__card-meta">{formatCardMeta(article.date, article.category)}</p>
              <h4>
                <button type="button" onClick={() => openArticle(article.slug)}>
                  {article.title}
                </button>
              </h4>
              <p className="journal__card-excerpt">{article.excerpt}</p>
              <button
                type="button"
                className="journal__card-arrow"
                aria-label={`Open ${article.title}`}
                onClick={() => openArticle(article.slug)}
              >
                <Icon name="arrow-right" size={16} />
              </button>
            </article>
          ))}
        </div>
      </div>

      <div className="journal__bottom container" data-reveal="up">
        <button type="button" className="journal__subscribe-cta" onClick={focusFooterEmail}>
          <span className="journal__subscribe-play" aria-hidden="true">
            <Icon name="play" size={14} />
          </span>
          <span>Subscribe to Our Journal</span>
        </button>

        <div className="journal__pagination" role="navigation" aria-label="Journal pagination">
          <button type="button" className="journal__page-btn" aria-label="Previous page" onClick={goPrev}>
            <Icon name="chevron-left" size={16} />
          </button>
          <span className="journal__page-label" aria-live="polite">
            {padPage(page + 1)} <span>/</span> {padPage(PAGE_COUNT)}
          </span>
          <button type="button" className="journal__page-btn" aria-label="Next page" onClick={goNext}>
            <Icon name="chevron-right" size={16} />
          </button>
        </div>

        <div className="journal__stats">
          <div>
            <span data-count-to={125} data-count-suffix="+">
              0+
            </span>
            <p>Timepieces</p>
          </div>
          <div>
            <span data-count-to={50} data-count-suffix="K+">
              0K+
            </span>
            <p>Satisfied Clients</p>
          </div>
          <div>
            <span data-count-to={20}>0</span>
            <p>Years of Excellence</p>
          </div>
        </div>
      </div>
    </section>
  );
};
