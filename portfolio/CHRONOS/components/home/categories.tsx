'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState, useRef } from 'react';

const categories = [
  {
    id: 'classic',
    name: 'Класичні',
    description: 'Вічний стиль та елегантність',
    image: 'https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=800&q=80',
  },
  {
    id: 'sport',
    name: 'Спортивні',
    description: 'Для активного способу життя',
    image: 'https://images.unsplash.com/photo-1606744824163-985d376605aa?w=800&q=80',
  },
  {
    id: 'dress',
    name: 'Елегантні',
    description: 'Для особливих подій',
    image: 'https://images.unsplash.com/photo-1627037558426-c2d07beda3af?w=800&q=80',
  },
];

export function Categories() {
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
    <section ref={sectionRef} className="py-24 lg:py-32 bg-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div
          className={`text-center mb-16 transition-all duration-700 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <p className="text-gold text-sm tracking-[0.3em] uppercase mb-4">
            Стилі
          </p>
          <h2 className="text-3xl lg:text-4xl font-light tracking-wide text-balance">
            Знайдіть Свій <span className="font-semibold">Стиль</span>
          </h2>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <Link
              key={category.id}
              href={`/catalog?style=${category.id}`}
              className={`group relative aspect-[3/4] overflow-hidden transition-all duration-700 ease-out ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <Image
                src={category.image}
                alt={category.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-foreground/50 group-hover:bg-foreground/40 transition-colors duration-300" />

              <div className="absolute inset-0 flex flex-col justify-end p-6">
                <h3 className="text-xl font-semibold text-background mb-1 tracking-wide">
                  {category.name}
                </h3>
                <p className="text-sm text-background/70">
                  {category.description}
                </p>
                <div className="mt-4 h-px w-0 bg-gold transition-all duration-500 group-hover:w-full" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
