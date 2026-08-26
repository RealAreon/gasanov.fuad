'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, X, ShoppingBag, Search, ChevronDown, Heart, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/lib/cart-store';
import { useWishlist } from '@/lib/wishlist-store';
import { SearchModal } from '@/components/search-modal';
import { ChronosLogo } from '@/components/chronos-logo';

const catalogItems = [
  { label: 'Класичні', href: '/catalog?style=classic', description: 'Вічна елегантність' },
  { label: 'Спортивні', href: '/catalog?style=sport', description: 'Для активного життя' },
  { label: 'Елегантні', href: '/catalog?style=dress', description: 'Витончений стиль' },
  { label: 'Нова колекція', href: '/catalog?sort=new', description: 'Останні надходження' },
  { label: 'Хіти продажів', href: '/catalog?sort=popular', description: 'Найпопулярніші моделі' },
];

export function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { totalItems, setIsCartOpen } = useCart();
  const { count: wishlistCount } = useWishlist();
  const isHomeHero = pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  const onHero = isHomeHero && !isScrolled;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-[300] isolation-isolate transition-all duration-500 ${
          onHero
            ? 'border-b border-white/5 bg-gradient-to-b from-black/55 via-black/25 to-transparent text-white backdrop-blur-[2px] [&_a]:text-white [&_button]:text-white'
            : isScrolled
              ? 'bg-background/98 shadow-sm backdrop-blur-md'
              : 'bg-background/95 backdrop-blur-sm'
        }`}
      >
        <div className="mx-auto max-w-7xl px-3 min-[360px]:px-4 sm:px-6 lg:px-8">
          <div className="relative grid h-[3.75rem] grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-1 lg:flex lg:h-20 lg:justify-between lg:gap-0">
            <div className="hidden lg:flex items-center">
              <div
                className="relative z-[310]"
                onMouseEnter={() => setIsCatalogOpen(true)}
                onMouseLeave={() => setIsCatalogOpen(false)}
              >
                <button
                  type="button"
                  aria-expanded={isCatalogOpen}
                  aria-haspopup="true"
                  className="flex items-center gap-2 text-sm tracking-widest uppercase text-foreground/80 hover:text-foreground transition-colors duration-300 py-6 group"
                  onClick={() => setIsCatalogOpen((v) => !v)}
                >
                  <span className="relative">
                    Каталог
                    <span className={`absolute -bottom-1 left-0 h-px bg-gold transition-all duration-300 ${isCatalogOpen ? 'w-full' : 'w-0 group-hover:w-full'}`} />
                  </span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isCatalogOpen ? 'rotate-180' : ''}`} />
                </button>

                <div
                  className={`absolute top-full left-0 z-[320] pt-2 transition-all duration-300 ${
                    isCatalogOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2 pointer-events-none'
                  }`}
                >
                  <div className="bg-background border border-border shadow-xl min-w-[280px]">
                    <div className="p-2">
                      {catalogItems.map((item) => (
                        <Link
                          key={item.label}
                          href={item.href}
                          className="flex flex-col px-5 py-4 hover:bg-muted transition-colors duration-200 group/item"
                          onClick={() => setIsCatalogOpen(false)}
                        >
                          <span className="text-sm font-medium text-foreground group-hover/item:text-gold transition-colors duration-200">
                            {item.label}
                          </span>
                          <span className="text-xs text-muted-foreground mt-1">
                            {item.description}
                          </span>
                        </Link>
                      ))}
                    </div>
                    <div className="border-t border-border p-4">
                      <Link
                        href="/catalog"
                        className="flex items-center justify-center gap-2 text-xs tracking-widest uppercase text-gold hover:text-gold/80 transition-colors"
                        onClick={() => setIsCatalogOpen(false)}
                      >
                        Переглянути все
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="justify-self-start lg:hidden min-h-11 min-w-11 h-11 w-11"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-nav"
              aria-label={isMenuOpen ? 'Закрити меню' : 'Відкрити меню'}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>

            <Link
              href="/"
              className="min-w-0 max-w-full justify-self-center overflow-hidden lg:absolute lg:left-1/2 lg:max-w-[18rem] lg:-translate-x-1/2"
              aria-label="CHRONOS"
            >
              <ChronosLogo />
            </Link>

            <div className="flex shrink-0 items-center justify-self-end gap-0">
              <Button
                variant="ghost"
                size="icon"
                className="relative group hidden min-h-11 min-w-11 h-11 w-11 lg:inline-flex"
                onClick={() => setIsSearchOpen(true)}
                aria-label="Пошук"
              >
                <Search className="h-5 w-5 transition-colors group-hover:text-gold" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="relative group min-h-11 min-w-11 h-11 w-11"
                aria-label="Обране"
                asChild
              >
                <Link href="/catalog">
                  <Heart className="h-5 w-5 transition-colors group-hover:text-gold" />
                  {wishlistCount > 0 && (
                    <span className="pointer-events-none absolute top-1 right-1 min-w-[0.95rem] h-[0.95rem] px-0.5 bg-[#e74c3c] text-white text-[8px] flex items-center justify-center font-medium leading-none">
                      {wishlistCount}
                    </span>
                  )}
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="relative group hidden min-h-11 min-w-11 h-11 w-11 lg:inline-flex"
                aria-label="Акаунт"
                asChild
              >
                <Link href="/account">
                  <User className="h-5 w-5 transition-colors group-hover:text-gold" />
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="relative group min-h-11 min-w-11 h-11 w-11"
                onClick={() => setIsCartOpen(true)}
                aria-label="Кошик"
              >
                <ShoppingBag className="h-5 w-5 transition-colors group-hover:text-gold" />
                {totalItems > 0 && (
                  <span className="pointer-events-none absolute top-1 right-1 min-w-[0.95rem] h-[0.95rem] px-0.5 bg-gold text-foreground text-[8px] flex items-center justify-center font-medium leading-none">
                    {totalItems}
                  </span>
                )}
              </Button>
            </div>
          </div>
        </div>

        {isMenuOpen && (
          <div id="mobile-nav" className="lg:hidden border-t border-border bg-background relative z-[310] shadow-md">
            <nav className="flex flex-col px-4 py-4 gap-1 max-h-[min(70vh,32rem)] overflow-y-auto">
              {catalogItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="px-3 py-3 text-sm tracking-wide hover:bg-muted min-h-11"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/catalog"
                className="px-3 py-3 text-sm text-gold min-h-11"
                onClick={() => setIsMenuOpen(false)}
              >
                Весь каталог
              </Link>
              <div className="mt-3 grid gap-1 border-t border-border pt-3">
                <button
                  type="button"
                  className="flex min-h-11 items-center gap-3 px-3 py-3 text-left text-sm hover:bg-muted"
                  onClick={() => {
                    setIsMenuOpen(false);
                    setIsSearchOpen(true);
                  }}
                >
                  <Search className="h-4 w-4" />
                  Пошук
                </button>
                <Link
                  href="/account"
                  className="flex min-h-11 items-center gap-3 px-3 py-3 text-sm hover:bg-muted"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User className="h-4 w-4" />
                  Акаунт
                </Link>
              </div>
            </nav>
          </div>
        )}
      </header>

      {isMenuOpen && (
        <button
          type="button"
          className="fixed inset-0 z-[290] bg-black/35 lg:hidden"
          aria-label="Закрити меню"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
