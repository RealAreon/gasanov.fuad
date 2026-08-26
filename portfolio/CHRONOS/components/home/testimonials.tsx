'use client';

import { Star, Quote } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';

const testimonials = [
  {
    id: 1,
    name: 'Олександр К.',
    location: 'Київ',
    rating: 5,
    text: 'Неймовірна якість та сервіс! Годинник виглядає розкішно і працює бездоганно. Доставка була швидкою, а упаковка вразила своєю преміальністю.',
    watch: 'Datejust 41 Silver',
  },
  {
    id: 2,
    name: 'Марина В.',
    location: 'Одеса',
    rating: 5,
    text: 'Купувала годинник у подарунок чоловіку. Він у захваті! Якість на найвищому рівні. Обов\'язково повернусь за наступною покупкою.',
    watch: 'GMT-Master II Pepsi',
  },
  {
    id: 3,
    name: 'Дмитро П.',
    location: 'Львів',
    rating: 5,
    text: 'Вже третій годинник замовляю в CHRONOS. Завжди відмінна якість, швидка доставка Новою Поштою та професійна консультація.',
    watch: 'Cosmograph Daytona Black',
  },
];

export function Testimonials() {
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
    <section ref={sectionRef} className="py-24 lg:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div
          className={`text-center mb-16 transition-all duration-700 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <p className="text-gold text-sm tracking-[0.3em] uppercase mb-4">
            Відгуки
          </p>
          <h2 className="text-3xl lg:text-4xl font-light tracking-wide text-balance">
            Наші <span className="font-semibold">Клієнти</span>
          </h2>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className={`relative bg-muted p-8 lg:p-10 transition-all duration-700 ease-out hover:shadow-lg ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              {/* Quote Icon */}
              <Quote className="absolute top-6 right-6 h-8 w-8 text-gold/20" />

              {/* Rating */}
              <div className="flex gap-1 mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-gold text-gold" />
                ))}
              </div>

              {/* Text */}
              <p className="text-foreground/80 leading-relaxed mb-6">
                &quot;{testimonial.text}&quot;
              </p>

              {/* Watch */}
              <p className="text-xs text-gold tracking-wider uppercase mb-4">
                {testimonial.watch}
              </p>

              {/* Author */}
              <div className="pt-6 border-t border-border">
                <p className="font-medium">{testimonial.name}</p>
                <p className="text-sm text-muted-foreground">{testimonial.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
