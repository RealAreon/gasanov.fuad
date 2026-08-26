'use client';

import Image from 'next/image';
import Link from 'next/link';
import { X, Plus, Minus, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/lib/cart-store';
import { formatPrice } from '@/lib/watches';

export function CartSidebar() {
  const { items, isCartOpen, setIsCartOpen, removeItem, updateQuantity, totalPrice } = useCart();

  if (!isCartOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-foreground/50 z-50 transition-opacity duration-300"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Sidebar */}
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-background z-50 shadow-2xl transition-transform duration-300 ease-out flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <ShoppingBag className="h-5 w-5" />
            <h2 className="text-lg font-medium tracking-wide">Кошик</h2>
            <span className="text-sm text-muted-foreground">
              ({items.length} {items.length === 1 ? 'товар' : 'товарів'})
            </span>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 hover:bg-muted transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag className="h-16 w-16 text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground mb-6">Ваш кошик порожній</p>
              <Button variant="outline" onClick={() => setIsCartOpen(false)}>
                Продовжити покупки
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {items.map((item) => (
                <div key={item.watch.id} className="flex gap-4">
                  <div className="relative w-24 h-24 bg-muted flex-shrink-0">
                    <Image
                      src={item.watch.images[0]}
                      alt={item.watch.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground tracking-widest uppercase mb-1">
                      {item.watch.brand}
                    </p>
                    <h3 className="font-medium text-sm mb-1 truncate">{item.watch.name}</h3>
                    <p className="text-sm font-semibold mb-3">{formatPrice(item.watch.price)}</p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center border border-border">
                        <button
                          onClick={() => updateQuantity(item.watch.id, item.quantity - 1)}
                          className="p-2 hover:bg-muted transition-colors"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-10 text-center text-sm">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.watch.id, item.quantity + 1)}
                          className="p-2 hover:bg-muted transition-colors"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.watch.id)}
                        className="text-xs text-muted-foreground hover:text-foreground transition-colors underline"
                      >
                        Видалити
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-6 border-t border-border space-y-4">
            <div className="flex items-center justify-between text-lg">
              <span>Разом:</span>
              <span className="font-semibold">{formatPrice(totalPrice)}</span>
            </div>
            <Link href="/checkout" onClick={() => setIsCartOpen(false)}>
              <Button className="w-full bg-gold hover:bg-gold/90 text-foreground tracking-widest uppercase py-6">
                Оформити замовлення
              </Button>
            </Link>
            <button
              onClick={() => setIsCartOpen(false)}
              className="w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors underline"
            >
              Продовжити покупки
            </button>
          </div>
        )}
      </div>
    </>
  );
}
