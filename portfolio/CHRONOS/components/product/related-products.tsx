'use client';

import Link from 'next/link';
import Image from 'next/image';
import { watches, formatPrice, type Watch } from '@/lib/watches';
import { useCart } from '@/lib/cart-store';
import { WishlistButton } from '@/components/wishlist-button';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import { useState } from 'react';

interface RelatedProductsProps {
  currentId: string;
  style: Watch['style'];
}

export function RelatedProducts({ currentId, style }: RelatedProductsProps) {
  const relatedWatches = watches
    .filter((watch) => watch.id !== currentId && watch.style === style)
    .slice(0, 4);

  if (relatedWatches.length === 0) {
    const otherWatches = watches.filter((watch) => watch.id !== currentId).slice(0, 4);
    if (otherWatches.length === 0) return null;
    
    return <RelatedProductsGrid watches={otherWatches} />;
  }

  return <RelatedProductsGrid watches={relatedWatches} />;
}

function RelatedProductsGrid({ watches: relatedWatches }: { watches: Watch[] }) {
  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <div>
            <p className="text-gold text-sm tracking-[0.3em] uppercase mb-2">
              Вам також сподобається
            </p>
            <h2 className="text-2xl lg:text-3xl font-light tracking-wide">
              Схожі <span className="font-semibold">Моделі</span>
            </h2>
          </div>
          <Link
            href="/catalog"
            className="hidden sm:flex items-center gap-2 text-sm tracking-widest uppercase text-foreground hover:text-gold transition-colors group"
          >
            Усі моделі
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {relatedWatches.map((watch) => (
            <RelatedProductCard key={watch.id} watch={watch} />
          ))}
        </div>

        <div className="sm:hidden text-center mt-8">
          <Link
            href="/catalog"
            className="inline-flex items-center gap-2 text-sm tracking-widest uppercase text-foreground hover:text-gold transition-colors"
          >
            Усі моделі
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function RelatedProductCard({ watch }: { watch: Watch }) {
  const { addItem } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdding(true);
    addItem(watch);
    setTimeout(() => setIsAdding(false), 500);
  };

  return (
    <div className="group relative">
      <div className="relative mb-4 aspect-square overflow-hidden bg-muted">
        <Link href={`/product/${watch.id}`} aria-label={watch.name} className="absolute inset-0 block">
          <Image
            src={watch.images[0]}
            alt={watch.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </Link>
        <WishlistButton watchId={watch.id} className="absolute right-3 top-3 z-[8]" />
      </div>
      <Link href={`/product/${watch.id}`} className="block space-y-1">
        <p className="text-xs text-muted-foreground tracking-widest uppercase">
          {watch.brand}
        </p>
        <h3 className="font-medium group-hover:text-gold transition-colors">
          {watch.name}
        </h3>
        <p className="text-sm font-semibold">{formatPrice(watch.price)}</p>
      </Link>
      <button
        type="button"
        onClick={handleAddToCart}
        className={`mt-3 w-full py-2 flex items-center justify-center gap-2 text-xs tracking-wider uppercase transition-all duration-300 ${
          isAdding
            ? 'bg-gold text-foreground'
            : 'bg-foreground text-background hover:bg-foreground/90'
        }`}
      >
        <ShoppingBag className={`h-3 w-3 transition-transform ${isAdding ? 'scale-110' : ''}`} />
        {isAdding ? 'Додано' : 'Додати в кошик'}
      </button>
    </div>
  );
}
