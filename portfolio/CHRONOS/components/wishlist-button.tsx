'use client';

import { Heart } from 'lucide-react';
import { useWishlist } from '@/lib/wishlist-store';

export function WishlistButton({
  watchId,
  className = '',
  size = 'md',
}: {
  watchId: string;
  className?: string;
  size?: 'md' | 'lg';
}) {
  const { has, toggle } = useWishlist();
  const active = has(watchId);

  return (
    <button
      type="button"
      data-wishlist={watchId}
      aria-pressed={active}
      aria-label={active ? 'Прибрати з обраного' : 'Додати в обране'}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(watchId);
      }}
      className={`inline-flex items-center justify-center rounded-full border border-border bg-white/95 transition-transform duration-200 hover:scale-105 hover:border-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold ${
        size === 'lg' ? 'h-12 w-12 min-h-12 min-w-12' : 'h-11 w-11 min-h-11 min-w-11'
      } ${className}`}
    >
      <Heart
        className={`h-4 w-4 transition-colors ${active ? 'fill-[#e74c3c] stroke-[#e74c3c]' : 'stroke-muted-foreground'}`}
        aria-hidden="true"
      />
    </button>
  );
}
