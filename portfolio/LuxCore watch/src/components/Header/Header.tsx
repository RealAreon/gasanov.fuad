import { useAppStore } from '../../store/useAppStore';
import { navigateTo, type AppRoute } from '../../app/routing';
import { Icon } from '../shared/Icon';
import './Header.scss';

interface HeaderProps {
  route: AppRoute;
}

export const Header = ({ route }: HeaderProps) => {
  const theme = useAppStore((state) => state.theme);
  const cartCount = useAppStore((state) => state.cartCount());
  const account = useAppStore((state) => state.account);
  const openOverlay = useAppStore((state) => state.openOverlay);

  return (
    <header className="site-header site-header--solid" data-theme={theme}>
      <div className="site-header__inner container">
        <div className="site-header__left">
          <button
            type="button"
            className={`site-header__catalog ${route === 'catalog' ? 'is-active' : ''}`}
            onClick={() => navigateTo('catalog')}
          >
            Catalog
            <Icon name="chevron-right" size={12} className="site-header__caret" />
          </button>
        </div>

        <button
          type="button"
          className="site-header__brand"
          onClick={() => navigateTo('home')}
          aria-label="CHRONOS — home"
        >
          <img src="./assets/icons/logo-hourglass.svg" alt="" width={28} height={28} />
          <span className="site-header__wordmark">CHRONOS</span>
          <span className="site-header__tag">Swiss Timepieces</span>
        </button>

        <div className="site-header__actions">
          <button
            type="button"
            className="site-header__icon"
            aria-label={`Cart, ${cartCount} items`}
            onClick={() => openOverlay('cart')}
          >
            <Icon name="bag" size={18} />
            <span className="site-header__badge site-header__badge--gold">{cartCount}</span>
          </button>

          <button
            type="button"
            className="site-header__icon"
            aria-label={account ? `Account, ${account.name}` : 'Create account'}
            onClick={() => openOverlay('account')}
          >
            <Icon name="user" size={18} />
            {account ? <span className="site-header__badge site-header__badge--gold">•</span> : null}
          </button>

          <button
            type="button"
            className="site-header__menu"
            aria-label="Open menu"
            onClick={() => openOverlay('menu')}
          >
            <Icon name="menu" size={16} />
          </button>
        </div>
      </div>
    </header>
  );
};
