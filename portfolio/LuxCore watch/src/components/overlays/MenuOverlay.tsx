import { useAppStore } from '../../store/useAppStore';
import { goHomeAndScroll, navigateTo } from '../../app/routing';
import { ModalShell } from '../shared/ModalShell';
import { Icon } from '../shared/Icon';
import './MenuOverlay.scss';

const LINKS: Array<{ id: string; label: string; kind: 'home' | 'catalog' | 'section' }> = [
  { id: 'hero', label: 'Home', kind: 'home' },
  { id: 'catalog', label: 'Catalog', kind: 'catalog' },
  { id: 'clients', label: 'About Us', kind: 'section' },
  { id: 'journal', label: 'Journal', kind: 'section' },
];

const SOCIALS: Array<{ name: 'instagram' | 'facebook' | 'x' | 'youtube'; label: string }> = [
  { name: 'instagram', label: 'Instagram' },
  { name: 'facebook', label: 'Facebook' },
  { name: 'x', label: 'X' },
  { name: 'youtube', label: 'YouTube' },
];

export const MenuOverlay = () => {
  const isOpen = useAppStore((state) => state.overlays.menu);
  const closeOverlay = useAppStore((state) => state.closeOverlay);
  const openOverlay = useAppStore((state) => state.openOverlay);
  const pushToast = useAppStore((state) => state.pushToast);

  const handleNav = (link: (typeof LINKS)[number]) => {
    closeOverlay('menu');
    window.setTimeout(() => {
      if (link.kind === 'catalog') navigateTo('catalog');
      else if (link.kind === 'home') navigateTo('home');
      else goHomeAndScroll(link.id);
    }, 80);
  };

  return (
    <ModalShell isOpen={isOpen} onClose={() => closeOverlay('menu')} labelledBy="menu-title" variant="full">
      <div className="menu-overlay">
        <div className="menu-overlay__top container">
          <span className="menu-overlay__brand">CHRONOS</span>
          <button
            type="button"
            className="icon-btn"
            aria-label="Close menu"
            onClick={() => closeOverlay('menu')}
          >
            <Icon name="close" size={18} />
          </button>
        </div>

        <nav className="menu-overlay__nav container" id="menu-title" aria-label="Full site navigation">
          {LINKS.map((link, index) => (
            <button key={link.id} type="button" onClick={() => handleNav(link)}>
              <span className="menu-overlay__index">{String(index + 1).padStart(2, '0')}</span>
              {link.label}
            </button>
          ))}
        </nav>

        <div className="menu-overlay__bottom container">
          <div className="menu-overlay__col">
            <p className="eyebrow">Concierge</p>
            <button
              type="button"
              className="menu-overlay__link"
              onClick={() => {
                closeOverlay('menu');
                window.setTimeout(() => openOverlay('booking'), 80);
              }}
            >
              Book a private viewing
            </button>
            <button
              type="button"
              className="menu-overlay__link"
              onClick={() => {
                closeOverlay('menu');
                window.setTimeout(() => openOverlay('account'), 80);
              }}
            >
              Account
            </button>
            <a className="menu-overlay__link" href="mailto:atelier@chronos-watches.example">
              atelier@chronos-watches.example
            </a>
            <button
              type="button"
              className="menu-overlay__link"
              onClick={() => pushToast('Concierge line: +41 22 000 00 00', 'info')}
            >
              +41 22 000 00 00
            </button>
          </div>
          <div className="menu-overlay__col">
            <p className="eyebrow">Follow</p>
            <div className="menu-overlay__socials">
              {SOCIALS.map((social) => (
                <button
                  key={social.name}
                  type="button"
                  className="icon-btn"
                  aria-label={social.label}
                  onClick={() => pushToast(`Opening ${social.label}…`, 'info')}
                >
                  <Icon name={social.name} size={16} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ModalShell>
  );
};
