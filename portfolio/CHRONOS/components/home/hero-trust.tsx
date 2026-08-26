'use client';

import { Truck, CreditCard, Shield, PackageCheck } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';

const trustItems = [
  {
    icon: Truck,
    title: 'Доставка по Україні 1–3 дні',
    description: 'Швидка доставка Новою Поштою',
  },
  {
    icon: CreditCard,
    title: 'Оплата при отриманні',
    description: 'Оплачуйте після перевірки',
  },
  {
    icon: Shield,
    title: 'Гарантія 12 місяців',
    description: 'Офіційна гарантія',
  },
  {
    icon: PackageCheck,
    title: 'Перевірка перед оплатою',
    description: 'Огляньте товар перед оплатою',
  },
];

export function HeroTrust() {
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
    <section ref={sectionRef} className="py-16 lg:py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {trustItems.map((item, index) => (
            <div
              key={item.title}
              className={`flex flex-col items-center text-center group transition-all duration-700 ease-out ${
                isVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className="w-16 h-16 flex items-center justify-center border border-gold/30 mb-5 transition-all duration-300 group-hover:border-gold group-hover:bg-gold/5">
                <item.icon className="h-7 w-7 text-gold transition-transform duration-300 group-hover:scale-110" />
              </div>
              <h3 className="text-base font-medium mb-2 tracking-wide text-foreground">
                {item.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
