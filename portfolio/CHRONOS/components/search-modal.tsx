'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, Search } from 'lucide-react';
import { watches, formatPrice, styleLabels } from '@/lib/watches';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    
    const searchTerm = query.toLowerCase();
    return watches.filter((watch) => {
      const term = searchTerm;
      return (
        watch.name.toLowerCase().includes(term) ||
        watch.brand.toLowerCase().includes(term) ||
        watch.description.toLowerCase().includes(term) ||
        watch.style.toLowerCase().includes(term) ||
        styleLabels[watch.style].toLowerCase().includes(term) ||
        watch.specifications.movement.toLowerCase().includes(term) ||
        watch.specifications.diameter.toLowerCase().includes(term) ||
        String(watch.price).includes(term)
      );
    }).slice(0, 6);
  }, [query]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-foreground/50 z-50 transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-x-0 top-0 z-50 bg-background shadow-2xl max-h-[80vh] overflow-hidden flex flex-col transition-transform duration-300 ease-out">
        {/* Search Input */}
        <div className="flex items-center gap-4 p-4 lg:p-6 border-b border-border">
          <Search className="h-5 w-5 text-muted-foreground flex-shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Пошук за моделлю, категорією, брендом..."
            className="flex-1 text-lg bg-transparent outline-none placeholder:text-muted-foreground"
            autoFocus
          />
          <button
            onClick={onClose}
            className="p-2 min-h-11 min-w-11 hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            aria-label="Закрити пошук"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-6">
          {query.trim() === '' ? (
            <div className="text-center py-12 text-muted-foreground">
              Введіть назву моделі, категорію або бренд
            </div>
          ) : searchResults.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              На жаль, нічого не знайдено за запитом &quot;{query}&quot;
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              {searchResults.map((watch) => (
                <Link
                  key={watch.id}
                  href={`/product/${watch.id}`}
                  onClick={onClose}
                  className="flex gap-4 p-3 hover:bg-muted transition-colors group"
                >
                  <div className="relative w-20 h-20 bg-muted flex-shrink-0">
                    <Image
                      src={watch.images[0]}
                      alt={watch.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground tracking-widest uppercase mb-1">
                      {watch.brand} • {styleLabels[watch.style]}
                    </p>
                    <h3 className="font-medium text-sm mb-1 truncate group-hover:text-gold transition-colors">
                      {watch.name}
                    </h3>
                    <p className="text-sm font-semibold">{formatPrice(watch.price)}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Quick Links */}
        {query.trim() === '' && (
          <div className="p-4 lg:p-6 border-t border-border">
            <p className="text-xs text-muted-foreground tracking-widest uppercase mb-4">
              Популярні категорії
            </p>
            <div className="flex flex-wrap gap-2">
              <Link
                href="/catalog?style=classic"
                onClick={onClose}
                className="px-4 py-2 bg-muted hover:bg-muted/80 text-sm transition-colors"
              >
                Класичні
              </Link>
              <Link
                href="/catalog?style=sport"
                onClick={onClose}
                className="px-4 py-2 bg-muted hover:bg-muted/80 text-sm transition-colors"
              >
                Спортивні
              </Link>
              <Link
                href="/catalog?style=dress"
                onClick={onClose}
                className="px-4 py-2 bg-muted hover:bg-muted/80 text-sm transition-colors"
              >
                Елегантні
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
