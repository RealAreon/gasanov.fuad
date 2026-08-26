'use client';

import Link from 'next/link';
import Image from 'next/image';
import { watches, formatPrice } from '@/lib/watches';
import { useCart } from '@/lib/cart-store';
import { WishlistButton } from '@/components/wishlist-button';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';

export function FeaturedProducts() {
  const featuredWatches = watches.slice(0, 4);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const { addItem } = useCart();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section id="featured" ref={sectionRef} className="scroll-mt-24 py-24 lg:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div
          className={`text-center mb-16 transition-all duration-700 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <p className="text-gold text-sm tracking-[0.3em] uppercase mb-4">
            Наша колекція
          </p>
          <h2 className="text-3xl lg:text-4xl font-light tracking-wide text-balance">
            Обрані <span className="font-semibold">Моделі</span>
          </h2>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredWatches.map((watch, index) => (
            <div
              key={watch.id}
              className={`group transition-all duration-700 ease-out ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="relative aspect-square mb-6 overflow-hidden bg-muted">
                  <Link href={`/product/${watch.id}`} aria-label={watch.name} className="absolute inset-0 block">
                    <Image
                      src={watch.images[0]}
                      alt={watch.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </Link>
                  {watch.originalPrice && (
                    <div className="pointer-events-none absolute top-4 left-4 z-[1] bg-gold text-foreground text-xs px-3 py-1 tracking-wider uppercase">
                      Акція
                    </div>
                  )}
                  {watch.isNew && !watch.originalPrice && (
                    <div className="pointer-events-none absolute top-4 left-4 z-[1] bg-foreground text-background text-xs px-3 py-1 tracking-wider uppercase">
                      Новинка
                    </div>
                  )}
                  <WishlistButton watchId={watch.id} className="absolute top-3 right-3 z-[8]" />
                </div>

                <Link href={`/product/${watch.id}`} className="block space-y-2">
                  <p className="text-xs text-muted-foreground tracking-widest uppercase">
                    {watch.brand}
                  </p>
                  <h3 className="font-medium text-lg group-hover:text-gold transition-colors">
                    {watch.name}
                  </h3>
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-semibold">
                      {formatPrice(watch.price)}
                    </span>
                    {watch.originalPrice && (
                      <span className="text-sm text-muted-foreground line-through">
                        {formatPrice(watch.originalPrice)}
                      </span>
                    )}
                  </div>
                </Link>

              {/* Add to Cart Button */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  addItem(watch);
                }}
                className="mt-4 w-full py-3 flex items-center justify-center gap-2 text-sm tracking-wider uppercase bg-foreground text-background hover:bg-foreground/90 transition-all duration-300"
              >
                <ShoppingBag className="h-4 w-4" />
                Додати в кошик
              </button>
            </div>
          ))}
        </div>

        {/* View All Link */}
        <div
          className={`text-center mt-16 transition-all duration-700 delay-500 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <Link
            href="/catalog"
            className="inline-flex items-center gap-2 text-sm tracking-widest uppercase text-foreground hover:text-gold transition-colors group"
          >
            Переглянути всі моделі
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
