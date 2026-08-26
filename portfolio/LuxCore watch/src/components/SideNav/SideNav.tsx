import { useAppStore } from '../../store/useAppStore';
import { scrollToSection } from '../../motion/useSmoothScroll';
import './SideNav.scss';

const STEPS = [
  { n: '01', id: 'hero' },
  { n: '02', id: 'craftsmanship' },
  { n: '03', id: 'clients' },
  { n: '04', id: 'journal' },
];

export const SideNav = () => {
  const activeSection = useAppStore((state) => state.activeSection);
  const theme = useAppStore((state) => state.theme);
  const anyOverlayOpen = useAppStore((state) => state.anyOverlayOpen());

  const activeIndex = STEPS.findIndex((step) => step.id === activeSection);
  const isHidden = anyOverlayOpen || activeSection === 'footer';

  return (
    <aside
      className={`side-nav ${isHidden ? 'side-nav--hidden' : ''}`}
      data-theme={theme}
      aria-label="Section navigation"
    >
      <div className="side-nav__rail">
        <ol className="side-nav__list">
          {STEPS.map((step, index) => {
            const isActive = activeSection === step.id;
            const isPassed = activeIndex > index;

            return (
              <li key={step.id} className="side-nav__step">
                <button
                  type="button"
                  className={[
                    'side-nav__item',
                    isActive ? 'is-active' : '',
                    isPassed ? 'is-passed' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  onClick={() => scrollToSection(step.id)}
                  aria-current={isActive ? 'true' : undefined}
                  aria-label={`Section ${step.n}`}
                >
                  <span className="side-nav__num">{step.n}</span>
                </button>

                {index < STEPS.length - 1 && (
                  <span
                    className={`side-nav__segment ${isActive || isPassed ? 'is-gold' : ''}`}
                    aria-hidden="true"
                  />
                )}
              </li>
            );
          })}
        </ol>
      </div>

      <div className="side-nav__explore">
        <span className="side-nav__explore-text">SCROLL TO EXPLORE</span>
        <span className="side-nav__dot" aria-hidden="true" />
      </div>
    </aside>
  );
};
