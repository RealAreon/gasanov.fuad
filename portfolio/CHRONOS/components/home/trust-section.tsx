'use client';

import { Shield, Truck, Award, Clock, CreditCard, Headphones } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';

const trustItems = [
  {
    icon: Shield,
    title: 'Гарантія якості',
    description: '12 місяців офіційної гарантії на всі годинники',
  },
  {
    icon: Truck,
    title: 'Безкоштовна доставка',
    description: 'По всій Україні через Нову Пошту',
  },
  {
    icon: Award,
    title: 'Оригінальні механізми',
    description: 'Швейцарські та японські механізми',
  },
  {
    icon: Clock,
    title: 'Швидка обробка',
    description: 'Відправка протягом 24 годин',
  },
  {
    icon: CreditCard,
    title: 'Оплата при отриманні',
    description: 'Перевірте товар перед оплатою',
  },
  {
    icon: Headphones,
    title: 'Підтримка 24/7',
    description: 'Завжди на зв\'язку для консультації',
  },
];

export function TrustSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 lg:py-32 bg-foreground text-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div
          className={`text-center mb-16 transition-all duration-700 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <p className="text-gold text-sm tracking-[0.3em] uppercase mb-4">
            Чому обирають нас
          </p>
          <h2 className="text-3xl lg:text-4xl font-light tracking-wide text-balance">
            Довіра та <span className="font-semibold">Надійність</span>
          </h2>
        </div>

        {/* Trust Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {trustItems.map((item, index) => (
            <div
              key={item.title}
              className={`flex flex-col items-center text-center group transition-all duration-700 ease-out ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="w-16 h-16 flex items-center justify-center border border-gold/30 mb-6 transition-all duration-300 group-hover:border-gold group-hover:bg-gold/10">
                <item.icon className="h-7 w-7 text-gold transition-transform duration-300 group-hover:scale-110" />
              </div>
              <h3 className="text-lg font-medium mb-2 tracking-wide">
                {item.title}
              </h3>
              <p className="text-background/60 text-sm leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom Banner */}
        <div
          className={`mt-20 pt-12 border-t border-background/10 text-center transition-all duration-700 delay-500 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <p className="text-gold text-xl lg:text-2xl font-light tracking-wide">
            Понад 5000+ задоволених клієнтів по всій Україні
          </p>
        </div>
      </div>
    </section>
  );
}
