'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { type Watch, formatPrice, styleLabels } from '@/lib/watches';
import { useCart } from '@/lib/cart-store';
import { WishlistButton } from '@/components/wishlist-button';
import { ShoppingBag, Truck, Shield, Clock, Check, Plus, Minus } from 'lucide-react';

interface ProductInfoProps {
  watch: Watch;
}

export function ProductInfo({ watch }: ProductInfoProps) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = () => {
    setIsAdding(true);
    for (let i = 0; i < quantity; i++) {
      addItem(watch);
    }
    setTimeout(() => setIsAdding(false), 500);
  };

  return (
    <div className="flex flex-col lg:sticky lg:top-28">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-6">
        <Link href="/" className="hover:text-foreground transition-colors">
          Головна
        </Link>
        <span>/</span>
        <Link href="/catalog" className="hover:text-foreground transition-colors">
          Каталог
        </Link>
        <span>/</span>
        <Link
          href={`/catalog?style=${watch.style}`}
          className="hover:text-foreground transition-colors"
        >
          {styleLabels[watch.style]}
        </Link>
      </nav>

      {/* Brand */}
      <p className="text-gold text-sm tracking-[0.3em] uppercase mb-2">
        {watch.brand}
      </p>

      {/* Name */}
      <h1 className="text-2xl lg:text-3xl font-light tracking-wide mb-4">
        {watch.name}
      </h1>

      {/* Price */}
      <div className="flex items-center gap-4 mb-6">
        <span className="text-2xl lg:text-3xl font-semibold">
          {formatPrice(watch.price)}
        </span>
        {watch.originalPrice && (
          <>
            <span className="text-lg text-muted-foreground line-through">
              {formatPrice(watch.originalPrice)}
            </span>
            <span className="bg-gold text-foreground text-xs px-2 py-1 tracking-wider uppercase">
              -{Math.round((1 - watch.price / watch.originalPrice) * 100)}%
            </span>
          </>
        )}
      </div>

      {/* Description */}
      <p className="text-muted-foreground leading-relaxed mb-8">
        {watch.longDescription}
      </p>

      {/* Stock Status */}
      <div className="flex items-center gap-2 mb-6">
        {watch.inStock ? (
          <>
            <Check className="h-4 w-4 text-green-600" />
            <span className="text-sm text-green-600">В наявності</span>
          </>
        ) : (
          <span className="text-sm text-muted-foreground">Немає в наявності</span>
        )}
      </div>

      {/* Quantity Selector */}
      <div className="flex items-center gap-4 mb-6">
        <span className="text-sm">Кількість:</span>
        <div className="flex items-center border border-border">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="p-3 hover:bg-muted transition-colors"
            disabled={quantity <= 1}
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-12 text-center">{quantity}</span>
          <button
            onClick={() => setQuantity((q) => q + 1)}
            className="p-3 hover:bg-muted transition-colors"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <Button
          size="lg"
          onClick={handleAddToCart}
          className={`flex-1 tracking-widest uppercase py-6 transition-all duration-300 ${
            isAdding
              ? 'bg-gold hover:bg-gold/90 text-foreground'
              : 'bg-foreground hover:bg-foreground/90 text-background'
          }`}
          disabled={!watch.inStock}
        >
          <ShoppingBag className={`mr-2 h-5 w-5 transition-transform ${isAdding ? 'scale-110' : ''}`} />
          {isAdding ? 'Додано в кошик' : 'Додати в кошик'}
        </Button>
        <WishlistButton watchId={watch.id} size="lg" className="shrink-0 self-stretch sm:self-auto rounded-none" />
        <Link href={`/checkout?product=${watch.id}`} className="flex-1">
          <Button
            size="lg"
            variant="outline"
            className="w-full border-foreground text-foreground hover:bg-foreground hover:text-background tracking-widest uppercase py-6 transition-all duration-300"
            disabled={!watch.inStock}
          >
            Купити зараз
          </Button>
        </Link>
      </div>

      {/* Trust Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-6 border-t border-b border-border">
        <div className="flex items-center gap-3">
          <Truck className="h-5 w-5 text-gold" />
          <div>
            <p className="text-sm font-medium">Безкоштовна доставка</p>
            <p className="text-xs text-muted-foreground">По всій Україні</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Shield className="h-5 w-5 text-gold" />
          <div>
            <p className="text-sm font-medium">Гарантія 12 місяців</p>
            <p className="text-xs text-muted-foreground">Офіційна гарантія</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Clock className="h-5 w-5 text-gold" />
          <div>
            <p className="text-sm font-medium">Відправка 24 год</p>
            <p className="text-xs text-muted-foreground">Швидка обробка</p>
          </div>
        </div>
      </div>

      {/* Features List */}
      <div className="mt-6">
        <h3 className="text-sm tracking-wider uppercase mb-4">Особливості</h3>
        <ul className="space-y-2">
          {watch.features.map((feature) => (
            <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="w-1 h-1 bg-gold" />
              {feature}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
