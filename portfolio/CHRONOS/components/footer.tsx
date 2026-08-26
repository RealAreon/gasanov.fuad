import Link from 'next/link';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { ChronosLogo } from '@/components/chronos-logo';

export function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-6">
            <ChronosLogo className="text-background [&_.chronos-logo-mark]:text-gold" />
            <p className="text-sm text-background/70 leading-relaxed">
              Ексклюзивна колекція преміум годинників для цінителів справжньої якості та стилю.
            </p>
          </div>

          {/* Navigation */}
          <div className="space-y-6">
            <h4 className="text-sm tracking-widest uppercase">Навігація</h4>
            <nav className="flex flex-col gap-3">
              <Link href="/catalog" className="text-sm text-background/70 hover:text-gold transition-colors">
                Каталог
              </Link>
              <Link href="/catalog?style=classic" className="text-sm text-background/70 hover:text-gold transition-colors">
                Класичні годинники
              </Link>
              <Link href="/catalog?style=sport" className="text-sm text-background/70 hover:text-gold transition-colors">
                Спортивні годинники
              </Link>
              <Link href="/catalog?style=dress" className="text-sm text-background/70 hover:text-gold transition-colors">
                Елегантні годинники
              </Link>
            </nav>
          </div>

          {/* Contact */}
          <div className="space-y-6">
            <h4 className="text-sm tracking-widest uppercase">Контакти</h4>
            <div className="flex flex-col gap-4">
              <a href="tel:+380501234567" className="flex items-center gap-3 text-sm text-background/70 hover:text-gold transition-colors">
                <Phone className="h-4 w-4 text-gold" />
                +380 50 123 45 67
              </a>
              <a href="mailto:info@chronos.ua" className="flex items-center gap-3 text-sm text-background/70 hover:text-gold transition-colors">
                <Mail className="h-4 w-4 text-gold" />
                info@chronos.ua
              </a>
              <div className="flex items-center gap-3 text-sm text-background/70">
                <MapPin className="h-4 w-4 text-gold" />
                Київ, Україна
              </div>
            </div>
          </div>

          {/* Hours */}
          <div className="space-y-6">
            <h4 className="text-sm tracking-widest uppercase">Графік роботи</h4>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 text-sm text-background/70">
                <Clock className="h-4 w-4 text-gold" />
                Пн-Пт: 10:00 - 20:00
              </div>
              <p className="text-sm text-background/70 ml-7">Сб-Нд: 11:00 - 18:00</p>
              <p className="text-xs text-gold mt-4">
                Безкоштовна доставка по Україні
              </p>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-background/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-background/50">
              © 2024 CHRONOS. Усі права захищені.
            </p>
            <div className="flex gap-6">
              <Link href="#" className="text-xs text-background/50 hover:text-gold transition-colors">
                Політика конфіденційності
              </Link>
              <Link href="#" className="text-xs text-background/50 hover:text-gold transition-colors">
                Умови використання
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
