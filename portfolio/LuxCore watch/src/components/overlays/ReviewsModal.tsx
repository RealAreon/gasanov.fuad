import { useMemo, useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { filterReviewsByRegion } from '../../data/reviews';
import type { ReviewRegion } from '../../data/types';
import { ModalShell } from '../shared/ModalShell';
import { Icon } from '../shared/Icon';
import { InitialsAvatar } from '../shared/InitialsAvatar';
import './ReviewsModal.scss';

const FILTERS: Array<{ id: ReviewRegion | 'all'; label: string }> = [
  { id: 'all', label: '\u0412\u0441\u0435' },
  { id: 'europe', label: '\u0415\u0432\u0440\u043e\u043f\u0430' },
  { id: 'cis', label: '\u0421\u041d\u0413' },
  { id: 'middle-east', label: '\u0411\u043b\u0438\u0436\u043d\u0438\u0439 \u0412\u043e\u0441\u0442\u043e\u043a' },
];

export const ReviewsModal = () => {
  const isOpen = useAppStore((state) => state.overlays.reviewsAll);
  const closeOverlay = useAppStore((state) => state.closeOverlay);
  const [filter, setFilter] = useState<ReviewRegion | 'all'>('all');

  const filtered = useMemo(() => filterReviewsByRegion(filter), [filter]);

  return (
    <ModalShell isOpen={isOpen} onClose={() => closeOverlay('reviewsAll')} labelledBy="reviews-title" variant="full">
      <div className="reviews-modal">
        <div className="reviews-modal__top container">
          <h2 id="reviews-title">\u041e\u0442\u0437\u044b\u0432\u044b \u043a\u043b\u0438\u0435\u043d\u0442\u043e\u0432</h2>
          <button type="button" className="icon-btn" aria-label="\u0417\u0430\u043a\u0440\u044b\u0442\u044c" onClick={() => closeOverlay('reviewsAll')}>
            <Icon name="close" size={18} />
          </button>
        </div>

        <div className="reviews-modal__filters container">
          {FILTERS.map((item) => (
            <button
              key={item.id}
              type="button"
              className={filter === item.id ? 'is-active' : ''}
              onClick={() => setFilter(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="reviews-modal__grid container">
          {filtered.map((review) => (
            <article key={review.id} className="reviews-modal__card">
              <Icon name="quote" size={22} />
              <p className="reviews-modal__quote">{review.quote}</p>
              <div className="reviews-modal__stars" aria-label={`${review.rating} out of 5`}>
                {Array.from({ length: 5 }).map((_, index) => (
                  <Icon key={index} name="star" size={13} className={index < review.rating ? 'is-filled' : 'is-empty'} />
                ))}
              </div>
              <div className="reviews-modal__author">
                {review.avatar ? (
                  <img src={review.avatar} alt={review.name} loading="lazy" />
                ) : (
                  <InitialsAvatar name={review.name} size={48} />
                )}
                <div>
                  <p className="reviews-modal__name">{review.name}</p>
                  <p className="reviews-modal__role">{review.role}</p>
                </div>
              </div>
            </article>
          ))}
          {filtered.length === 0 && <p className="reviews-modal__empty">\u041d\u0435\u0442 \u043e\u0442\u0437\u044b\u0432\u043e\u0432 \u0432 \u044d\u0442\u043e\u0439 \u043a\u0430\u0442\u0435\u0433\u043e\u0440\u0438\u0438.</p>}
        </div>
      </div>
    </ModalShell>
  );
};
