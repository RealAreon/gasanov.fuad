import { useEffect, useRef, useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { allArticles, getArticleBySlug } from '../../data/articles';
import { ModalShell } from '../shared/ModalShell';
import { Icon } from '../shared/Icon';
import './ArticleModal.scss';

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

export const ArticleModal = () => {
  const isOpen = useAppStore((state) => state.overlays.article);
  const closeOverlay = useAppStore((state) => state.closeOverlay);
  const slug = useAppStore((state) => state.activeArticleSlug);
  const setActiveArticleSlug = useAppStore((state) => state.setActiveArticleSlug);
  const [progress, setProgress] = useState(0);
  const bodyRef = useRef<HTMLDivElement>(null);

  const article = slug ? getArticleBySlug(slug) : undefined;

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = 0;
    setProgress(0);
  }, [slug]);

  const handleScroll = () => {
    const node = bodyRef.current;
    if (!node) return;
    const max = node.scrollHeight - node.clientHeight;
    setProgress(max > 0 ? Math.min(1, node.scrollTop / max) : 0);
  };

  const related = article
    ? allArticles.filter((entry) => entry.id !== article.id && entry.category === article.category).slice(0, 3)
    : [];
  const fallbackRelated = article && related.length < 3
    ? allArticles.filter((entry) => entry.id !== article.id && !related.includes(entry)).slice(0, 3 - related.length)
    : [];
  const relatedArticles = [...related, ...fallbackRelated];

  if (!article) {
    return (
      <ModalShell isOpen={isOpen} onClose={() => closeOverlay('article')} labelledBy="article-title" variant="full">
        <p className="article-modal__empty">Select an article to read.</p>
      </ModalShell>
    );
  }

  return (
    <ModalShell isOpen={isOpen} onClose={() => closeOverlay('article')} labelledBy="article-title" variant="full">
      <div className="article-modal">
        <div className="article-modal__progress">
          <div className="article-modal__progress-fill" style={{ transform: `scaleX(${progress})` }} />
        </div>

        <div className="article-modal__topbar container">
          <span className="eyebrow">{article.category}</span>
          <button type="button" className="icon-btn" aria-label="Close article" onClick={() => closeOverlay('article')}>
            <Icon name="close" size={18} />
          </button>
        </div>

        <div className="article-modal__body" ref={bodyRef} onScroll={handleScroll}>
          <div className="article-modal__hero container">
            <h2 id="article-title">{article.title}</h2>
            <p className="article-modal__meta">
              {formatDate(article.date)} · {article.readMinutes} min read
            </p>
          </div>

          <div className="article-modal__figure">
            <img src={article.image} alt={article.title} loading="lazy" />
          </div>

          <div className="article-modal__content container">
            {article.body.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          <div className="article-modal__related container">
            <p className="eyebrow">More from the Journal</p>
            <div className="article-modal__related-grid">
              {relatedArticles.map((entry) => (
                <button key={entry.id} type="button" onClick={() => setActiveArticleSlug(entry.slug)}>
                  <img src={entry.image} alt={entry.title} loading="lazy" />
                  <span>{entry.title}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ModalShell>
  );
};
