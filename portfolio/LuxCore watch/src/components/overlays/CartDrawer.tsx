import { useAppStore } from '../../store/useAppStore';
import { products } from '../../data/products';
import { ModalShell } from '../shared/ModalShell';
import { Icon } from '../shared/Icon';
import './CartDrawer.scss';

const formatPrice = (value: number, currency: string) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(value);

export const CartDrawer = () => {
  const isOpen = useAppStore((state) => state.overlays.cart);
  const closeOverlay = useAppStore((state) => state.closeOverlay);
  const openOverlay = useAppStore((state) => state.openOverlay);
  const cart = useAppStore((state) => state.cart);
  const setQty = useAppStore((state) => state.setQty);
  const removeFromCart = useAppStore((state) => state.removeFromCart);
  const clearCart = useAppStore((state) => state.clearCart);
  const subtotal = useAppStore((state) => state.cartSubtotal());
  const setActiveProductSlug = useAppStore((state) => state.setActiveProductSlug);
  const pushToast = useAppStore((state) => state.pushToast);

  const lines = cart
    .map((item) => ({ item, product: products.find((product) => product.id === item.productId) }))
    .filter((line) => line.product);

  const handleCheckout = () => {
    if (lines.length === 0) return;
    clearCart();
    closeOverlay('cart');
    pushToast('Reservation received — our concierge will reach out within 24 hours.', 'success');
  };

  return (
    <ModalShell isOpen={isOpen} onClose={() => closeOverlay('cart')} labelledBy="cart-title" variant="drawer-right">
      <div className="cart-drawer">
        <div className="cart-drawer__top">
          <h2 id="cart-title">Your Selection</h2>
          <button type="button" className="icon-btn" aria-label="Close cart" onClick={() => closeOverlay('cart')}>
            <Icon name="close" size={18} />
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="cart-drawer__empty">
            <Icon name="bag" size={32} />
            <p>Your selection is empty.</p>
            <button
              type="button"
              className="btn-outline"
              onClick={() => {
                closeOverlay('cart');
                window.location.hash = '#/catalog';
              }}
            >
              Browse the collection
              <span className="arrow"><Icon name="arrow-right" size={16} /></span>
            </button>
          </div>
        ) : (
          <>
            <ul className="cart-drawer__list">
              {lines.map(({ item, product }) => (
                <li key={item.productId} className="cart-drawer__line">
                  <button
                    type="button"
                    className="cart-drawer__thumb"
                    onClick={() => {
                      setActiveProductSlug(product!.slug);
                      closeOverlay('cart');
                      window.setTimeout(() => openOverlay('productQuickView'), 80);
                    }}
                    aria-label={`View ${product!.name}`}
                  >
                    <img src={product!.image} alt={product!.name} loading="lazy" />
                  </button>
                  <div className="cart-drawer__info">
                    <p className="cart-drawer__name">{product!.name}</p>
                    <p className="cart-drawer__price">{formatPrice(product!.price, product!.currency)}</p>
                    <div className="cart-drawer__qty">
                      <button type="button" aria-label="Decrease quantity" onClick={() => setQty(item.productId, item.qty - 1)}>
                        <Icon name="minus" size={13} />
                      </button>
                      <span>{item.qty}</span>
                      <button type="button" aria-label="Increase quantity" onClick={() => setQty(item.productId, item.qty + 1)}>
                        <Icon name="plus" size={13} />
                      </button>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="cart-drawer__remove"
                    aria-label={`Remove ${product!.name}`}
                    onClick={() => removeFromCart(item.productId)}
                  >
                    <Icon name="trash" size={15} />
                  </button>
                </li>
              ))}
            </ul>

            <div className="cart-drawer__footer">
              <div className="cart-drawer__subtotal">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal, 'USD')}</span>
              </div>
              <p className="cart-drawer__note">Final pricing confirmed by your concierge prior to reservation.</p>
              <button type="button" className="btn-solid" onClick={handleCheckout}>
                Reserve Now
              </button>
            </div>
          </>
        )}
      </div>
    </ModalShell>
  );
};
