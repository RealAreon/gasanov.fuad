import { useAppStore } from '../../store/useAppStore';
import { getProductBySlug } from '../../data/products';
import { ModalShell } from '../shared/ModalShell';
import { Icon } from '../shared/Icon';
import './ProductModal.scss';

const formatPrice = (value: number, currency: string) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(value);

const STATUS_LABEL: Record<string, string> = {
  active: 'In Atelier Stock',
  limited: 'Limited Edition',
  'coming-soon': 'Reservation Only',
};

export const ProductModal = () => {
  const isOpen = useAppStore((state) => state.overlays.productQuickView);
  const closeOverlay = useAppStore((state) => state.closeOverlay);
  const openOverlay = useAppStore((state) => state.openOverlay);
  const slug = useAppStore((state) => state.activeProductSlug);
  const addToCart = useAppStore((state) => state.addToCart);
  const pushToast = useAppStore((state) => state.pushToast);

  const product = slug ? getProductBySlug(slug) : undefined;

  if (!product) {
    return (
      <ModalShell isOpen={isOpen} onClose={() => closeOverlay('productQuickView')} labelledBy="product-title" className="product-modal">
        <p className="product-modal__empty">Select a watch to see details.</p>
      </ModalShell>
    );
  }

  const handleAddToCart = () => {
    addToCart(product.id, 1);
    pushToast(`${product.name} added to your selection.`, 'success');
  };

  const handleBuyNow = () => {
    addToCart(product.id, 1);
    closeOverlay('productQuickView');
    window.setTimeout(() => openOverlay('cart'), 80);
  };

  return (
    <ModalShell isOpen={isOpen} onClose={() => closeOverlay('productQuickView')} labelledBy="product-title" className="product-modal">
      <button type="button" className="icon-btn product-modal__close" aria-label="Close" onClick={() => closeOverlay('productQuickView')}>
        <Icon name="close" size={18} />
      </button>

      <div className="product-modal__grid">
        <div className="product-modal__media">
          <img src={product.image} alt={product.name} />
        </div>

        <div className="product-modal__body">
          <span className={`product-modal__status product-modal__status--${product.colorway}`}>
            {STATUS_LABEL[product.status]}
          </span>
          <h2 id="product-title">{product.name}</h2>
          <p className="product-modal__tagline">{product.tagline}</p>
          <p className="product-modal__price">{formatPrice(product.price, product.currency)}</p>
          <p className="product-modal__desc">{product.shortDescription}</p>

          <ul className="product-modal__highlights">
            {product.highlights.map((highlight) => (
              <li key={highlight}>
                <Icon name="check" size={14} />
                <span>{highlight}</span>
              </li>
            ))}
          </ul>

          <div className="product-modal__actions">
            <button type="button" className="btn-outline" onClick={handleAddToCart}>
              Add to Cart
              <span className="arrow"><Icon name="bag" size={16} /></span>
            </button>
            <button type="button" className="btn-solid" onClick={handleBuyNow}>
              Buy Now
            </button>
          </div>

          {product.specSheetUrl && (
            <a className="product-modal__spec-link" href={product.specSheetUrl} download>
              <Icon name="download" size={15} />
              Download Spec Sheet
            </a>
          )}

          <table className="product-modal__specs">
            <tbody>
              {product.specs.map((spec) => (
                <tr key={spec.label}>
                  <th scope="row">{spec.label}</th>
                  <td>{spec.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </ModalShell>
  );
};
