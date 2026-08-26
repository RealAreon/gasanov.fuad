import { useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { useAppStore, isValidEmail, saveNewsletterEmail } from '../../store/useAppStore';
import { goHomeAndScroll, navigateTo } from '../../app/routing';
import { useSectionMotion } from '../../motion/initSectionMotion';
import { Icon } from '../../components/shared/Icon';
import type { IconName } from '../../components/shared/Icon';
import { PaymentBadges } from './PaymentBadges';
import './Footer.scss';

type FooterAction =
  | { type: 'section'; id: string }
  | { type: 'overlay'; key: 'story' | 'booking' }
  | { type: 'info'; topic: string }
  | { type: 'product'; slug: string };

interface FooterLink {
  label: string;
  action: FooterAction;
}

interface FooterColumn {
  title: string;
  links: FooterLink[];
}

const SOCIALS: Array<{ name: IconName; label: string; href: string }> = [
  { name: 'instagram', label: 'Instagram', href: 'https://instagram.com/chronoswatches' },
  { name: 'facebook', label: 'Facebook', href: 'https://facebook.com/chronoswatches' },
  { name: 'x', label: 'X', href: 'https://x.com/chronoswatches' },
  { name: 'pinterest', label: 'Pinterest', href: 'https://pinterest.com/chronoswatches' },
  { name: 'youtube', label: 'YouTube', href: 'https://youtube.com/@chronoswatches' },
];

const BENEFITS_STRIP: Array<{ icon: IconName; title: string; text: string }> = [
  { icon: 'compass', title: 'Worldwide Shipping', text: 'Complimentary on all orders' },
  { icon: 'lock', title: 'Secure Payment', text: 'Encrypted & trusted checkout' },
  { icon: 'shield', title: '5-Year Warranty', text: 'Built to last. Guaranteed.' },
  { icon: 'gem', title: 'Authenticity Guaranteed', text: '100% Swiss Made originals' },
  { icon: 'user', title: 'Dedicated Support', text: 'Here for you, always' },
];

const LINK_COLUMNS: FooterColumn[] = [
  {
    title: 'Collections',
    links: [
      { label: 'All Collections', action: { type: 'section', id: 'collection' } },
      { label: 'Aurum', action: { type: 'product', slug: 'aurum' } },
      { label: 'Infinitum', action: { type: 'product', slug: 'infinitum' } },
      { label: 'Legacy', action: { type: 'product', slug: 'legacy' } },
      { label: 'Limited Editions', action: { type: 'info', topic: 'limited-editions' } },
      { label: 'Bespoke Creations', action: { type: 'info', topic: 'bespoke' } },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'Our Story', action: { type: 'overlay', key: 'story' } },
      { label: 'Heritage', action: { type: 'info', topic: 'heritage' } },
      { label: 'Sustainability', action: { type: 'info', topic: 'sustainability' } },
      { label: 'Careers', action: { type: 'info', topic: 'careers' } },
      { label: 'Press & Media', action: { type: 'info', topic: 'press' } },
      { label: 'Partnerships', action: { type: 'info', topic: 'partnerships' } },
    ],
  },
  {
    title: 'Craftmanship',
    links: [
      { label: 'The Art of Precision', action: { type: 'section', id: 'craftsmanship' } },
      { label: 'Materials & Innovation', action: { type: 'info', topic: 'materials' } },
      { label: 'Swiss Made', action: { type: 'info', topic: 'swiss-made' } },
      { label: 'Quality Control', action: { type: 'info', topic: 'quality-control' } },
      { label: 'Behind the Scenes', action: { type: 'section', id: 'craftsmanship' } },
      { label: 'Watchmaking Heritage', action: { type: 'info', topic: 'heritage' } },
    ],
  },
  {
    title: 'Journal',
    links: [
      { label: 'Latest Articles', action: { type: 'section', id: 'journal' } },
      { label: 'Design & Inspiration', action: { type: 'section', id: 'journal' } },
      { label: 'Technology', action: { type: 'section', id: 'journal' } },
      { label: 'Heritage Stories', action: { type: 'section', id: 'journal' } },
      { label: 'Events', action: { type: 'info', topic: 'events' } },
      { label: 'Interviews', action: { type: 'info', topic: 'interviews' } },
    ],
  },
  {
    title: 'Customer Care',
    links: [
      { label: 'FAQ', action: { type: 'info', topic: 'faq' } },
      { label: 'Shipping & Delivery', action: { type: 'info', topic: 'shipping-returns' } },
      { label: 'Returns & Exchanges', action: { type: 'info', topic: 'shipping-returns' } },
      { label: 'Warranty', action: { type: 'info', topic: 'warranty' } },
      { label: 'Watch Care Guide', action: { type: 'info', topic: 'watch-care' } },
      { label: 'Contact Us', action: { type: 'section', id: 'footer' } },
    ],
  },
];

const LEGAL_LINKS: FooterLink[] = [
  { label: 'Privacy Policy', action: { type: 'info', topic: 'privacy-policy' } },
  { label: 'Terms & Conditions', action: { type: 'info', topic: 'terms-of-service' } },
  { label: 'Returns', action: { type: 'info', topic: 'shipping-returns' } },
  { label: 'Sitemap', action: { type: 'info', topic: 'sitemap' } },
];

export const Footer = () => {
  const rootRef = useRef<HTMLElement>(null);
  useSectionMotion(rootRef);

  const openOverlay = useAppStore((state) => state.openOverlay);
  const setInfoTopic = useAppStore((state) => state.setInfoTopic);
  const setActiveProductSlug = useAppStore((state) => state.setActiveProductSlug);
  const pushToast = useAppStore((state) => state.pushToast);

  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);

  const runAction = (action: FooterAction) => {
    switch (action.type) {
      case 'section':
        if (action.id === 'collection') {
          navigateTo('catalog');
          break;
        }
        goHomeAndScroll(action.id);
        break;
      case 'overlay':
        openOverlay(action.key);
        break;
      case 'info':
        setInfoTopic(action.topic);
        openOverlay('info');
        break;
      case 'product':
        setActiveProductSlug(action.slug);
        openOverlay('productQuickView');
        break;
      default:
        break;
    }
  };

  const handleSubscribe = (event: FormEvent) => {
    event.preventDefault();
    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    setError(null);
    if (saveNewsletterEmail(email.trim())) {
      pushToast('Welcome to the CHRONOS Circle.', 'success');
      setEmail('');
    } else {
      pushToast('Could not subscribe right now.', 'error');
    }
  };

  return (
    <footer id="footer" data-section="footer" className="site-footer" ref={rootRef}>
      <img
        className="site-footer__bg"
        src="./assets/images/footer/footer-architecture-bg.webp"
        alt=""
        loading="lazy"
      />
      <div className="site-footer__scrim" aria-hidden="true" />

      <div className="site-footer__content container">
        <div className="site-footer__subscribe" data-reveal="up">
          <div className="site-footer__subscribe-intro">
            <p className="site-footer__subscribe-label">Stay Connected</p>
            <h3>Beyond Time</h3>
          </div>
          <p className="site-footer__subscribe-copy">
            Join the world of Chronos and be the first to discover new collections, timeless stories, and exclusive
            experiences.
          </p>
          <div className="site-footer__subscribe-form">
            <form onSubmit={handleSubscribe} noValidate>
              <label htmlFor="footer-email" className="visually-hidden">
                Email address
              </label>
              <div className="site-footer__email-field">
                <Icon name="mail" size={16} />
                <input
                  id="footer-email"
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  autoComplete="email"
                />
              </div>
              <button type="submit" className="btn-solid">
                Subscribe
                <Icon name="arrow-right" size={14} />
              </button>
            </form>
            {error && <span className="site-footer__subscribe-error">{error}</span>}
            <p className="site-footer__privacy-note">
              <Icon name="lock" size={12} />
              We respect your privacy. Unsubscribe anytime.
            </p>
          </div>
        </div>

        <div className="site-footer__grid" data-reveal="up">
          <div className="site-footer__brand">
            <button type="button" className="site-footer__logo" onClick={() => goHomeAndScroll('hero')}>
              <img src="./assets/icons/logo-hourglass.svg" alt="" width={30} height={30} />
              <span>CHRONOS</span>
            </button>
            <p>
              Precision engineering and enduring heritage. Swiss watchmaking crafted for those who measure life in
              moments that matter.
            </p>
            <button type="button" className="site-footer__ghost-btn" onClick={() => openOverlay('story')}>
              Discover Our Story
              <Icon name="arrow-right" size={14} />
            </button>
          </div>

          {LINK_COLUMNS.map((column) => (
            <nav key={column.title} className="site-footer__col" aria-label={column.title}>
              <p className="site-footer__col-title">{column.title}</p>
              {column.links.map((link) => (
                <button key={link.label} type="button" onClick={() => runAction(link.action)}>
                  {link.label}
                </button>
              ))}
            </nav>
          ))}

          <div className="site-footer__col site-footer__contact">
            <p className="site-footer__col-title">Contact</p>
            <span>
              <Icon name="pin" size={14} />
              Bahnhofstrasse 42
              <br />
              8001 Zurich, Switzerland
            </span>
            <a href="mailto:hello@chronoswatches.com">
              <Icon name="mail" size={14} />
              hello@chronoswatches.com
            </a>
            <a href="tel:+41441234567">
              <Icon name="phone" size={14} />
              +41 44 123 45 67
            </a>
            <span>
              <Icon name="clock" size={14} />
              Mon–Sat 10:00–19:00
            </span>
            <button type="button" className="site-footer__ghost-btn" onClick={() => openOverlay('booking')}>
              Book a Visit
              <Icon name="arrow-right" size={14} />
            </button>
          </div>
        </div>

        <div className="site-footer__social" data-reveal="up">
          <span className="site-footer__social-label">Follow Chronos</span>
          <div className="site-footer__social-links">
            {SOCIALS.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
              >
                <Icon name={social.name} size={14} />
                <span>{social.label}</span>
              </a>
            ))}
          </div>
        </div>

        <div className="site-footer__strip" data-reveal="up">
          {BENEFITS_STRIP.map((item) => (
            <div key={item.title} className="site-footer__strip-item">
              <Icon name={item.icon} size={22} />
              <div>
                <strong>{item.title}</strong>
                <span>{item.text}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="site-footer__bottom">
          <p>&copy; CHRONOS 2026. All Rights Reserved.</p>
          <div className="site-footer__legal">
            {LEGAL_LINKS.map((link, index) => (
              <span key={link.label} className="site-footer__legal-item">
                {index > 0 && <span className="site-footer__legal-sep" aria-hidden="true" />}
                <button type="button" onClick={() => runAction(link.action)}>
                  {link.label}
                </button>
              </span>
            ))}
          </div>
          <PaymentBadges />
        </div>
      </div>
    </footer>
  );
};
