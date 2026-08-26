import { useAppStore } from '../../store/useAppStore';
import { navigateTo } from '../../app/routing';
import { Icon } from '../../components/shared/Icon';
import './Hero.scss';

const TITLE_LETTERS = 'CHRONOS'.split('');

const STATS = [
  { value: '125+', label: 'Timepieces' },
  { value: '50K+', label: 'Satisfied Clients' },
  { value: '20', label: 'Years of Excellence' },
];

export const Hero = () => {
  const openOverlay = useAppStore((state) => state.openOverlay);

  return (
    <section id="hero" data-section="hero" className="hero hero--static" aria-label="Introduction">
      <div className="hero__media" aria-hidden="true">
        <img
          className="hero__photo"
          src="./assets/images/hero/hero-photo.png"
          alt=""
          fetchPriority="high"
          draggable={false}
        />
      </div>

      <div className="hero__scrim" aria-hidden="true" />

      <div className="hero__interface">
        <div className="hero__layout container">
          <div className="hero__content">
            <h1 className="hero__title">
              {TITLE_LETTERS.map((letter, index) => (
                <span key={index} className="hero__title-letter">
                  {letter}
                </span>
              ))}
            </h1>

            <p className="hero__tagline">Time Beyond Limits</p>

            <p className="hero__copy">
              Chronos is not just a watch.
              <br />
              It&apos;s a statement of timeless
              <br />
              elegance and precision.
            </p>

            <div className="hero__cta">
              <button type="button" className="btn-outline" onClick={() => navigateTo('catalog')}>
                Explore Catalog
                <span className="arrow">
                  <Icon name="arrow-right" size={16} />
                </span>
              </button>
            </div>
          </div>

          <div className="hero__side" aria-hidden="true">
            <span className="hero__side-line" />
            <span className="hero__side-text">Swiss Precision</span>
          </div>
        </div>

        <div className="hero__bottom container">
          <button
            type="button"
            className="hero__story-btn"
            onClick={() => openOverlay('story')}
            aria-label="Discover our story"
          >
            <span className="hero__story-play">
              <Icon name="play" size={14} />
            </span>
            <span className="hero__story-label">Discover Our Story</span>
          </button>

          <ul className="hero__stats">
            {STATS.map((stat) => (
              <li key={stat.label}>
                <span className="hero__stat-value">{stat.value}</span>
                <span className="hero__stat-label">{stat.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};
