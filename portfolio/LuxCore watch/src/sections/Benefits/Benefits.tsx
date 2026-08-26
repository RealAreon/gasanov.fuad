import { useRef } from 'react';
import { useSectionMotion } from '../../motion/initSectionMotion';
import { navigateTo } from '../../app/routing';
import { Icon } from '../../components/shared/Icon';
import type { IconName } from '../../components/shared/Icon';
import './Benefits.scss';

interface BenefitCard {
  icon: IconName;
  title: string;
  text: string;
}

interface TrustItem {
  icon: IconName;
  label: string;
}

const CARDS: BenefitCard[] = [
  { icon: 'shield', title: 'Swiss Precision', text: 'Expertly calibrated timekeeping.' },
  {
    icon: 'gem',
    title: 'Premium Materials',
    text: 'Sapphire crystal, stainless steel, premium finishes.',
  },
  { icon: 'medal', title: '5-Year Warranty', text: 'Confidence and long-term reliability.' },
  {
    icon: 'check',
    title: 'Authenticity Guaranteed',
    text: 'Every watch certified and original.',
  },
  {
    icon: 'compass',
    title: 'Worldwide Shipping',
    text: 'Secure packaging, global delivery you can trust.',
  },
  {
    icon: 'user',
    title: 'Dedicated Support',
    text: 'Concierge-level customer care, always here for you.',
  },
];

const TRUST: TrustItem[] = [
  { icon: 'user', label: '10,000+ Clients' },
  { icon: 'star', label: '98% Satisfaction' },
  { icon: 'lock', label: 'Secure Payment' },
  { icon: 'clock', label: 'Fast Delivery' },
];

export const Benefits = () => {
  const rootRef = useRef<HTMLElement>(null);
  useSectionMotion(rootRef);

  return (
    <section
      id="craftsmanship"
      data-section="craftsmanship"
      className="benefits section"
      ref={rootRef}
      aria-label="Craftsmanship"
    >
      <img
        className="benefits__bg"
        src="./assets/images/benefits/benefits-bg.webp"
        alt=""
        loading="lazy"
      />
      <div className="benefits__scrim" aria-hidden="true" />

      <div className="benefits__watch" aria-hidden="true">
        <img src="./assets/images/benefits/benefits-watch-right.webp" alt="" loading="lazy" />
      </div>

      <div className="benefits__intro container" data-reveal="up">
        <p className="eyebrow">Why Choose</p>
        <h2 className="benefits__wordmark">CHRONOS</h2>
        <p className="benefits__slogan">
          Built on precision. Driven by passion.
          <br />
          Trusted for generations.
        </p>
        <span className="benefits__rule" aria-hidden="true" />
        <p className="benefits__copy">
          Every detail has a purpose. Every component is chosen with care. Chronos is more than a
          watch—it&apos;s a promise of excellence, crafted to stand the test of time.
        </p>
      </div>

      <div className="benefits__cards container" data-reveal="up">
        <div className="benefits__track">
          {CARDS.map((card, index) => (
            <article
              className="benefits__card"
              key={card.title}
              data-reveal="up"
              data-reveal-delay={index * 60}
            >
              <span className="benefits__icon">
                <Icon name={card.icon} size={22} />
              </span>
              <h3>{card.title}</h3>
              <p>{card.text}</p>
            </article>
          ))}
        </div>
      </div>

      <div className="benefits__trust container" data-reveal="up">
        {TRUST.map((item) => (
          <div className="benefits__trust-item" key={item.label}>
            <Icon name={item.icon} size={18} />
            <span>{item.label}</span>
          </div>
        ))}
      </div>

      <div className="benefits__cta container" data-reveal="up">
        <button type="button" className="btn-outline" onClick={() => navigateTo('catalog')}>
          Discover the Difference
          <span className="arrow">
            <Icon name="arrow-right" size={16} />
          </span>
        </button>
      </div>

      <p className="benefits__tagline container" data-reveal="up">
        <Icon name="shield" size={14} />
        <span>Excellence. Precision. Legacy.</span>
      </p>
    </section>
  );
};
