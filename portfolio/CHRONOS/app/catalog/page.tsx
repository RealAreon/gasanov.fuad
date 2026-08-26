import { Suspense } from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { CatalogContent } from '@/components/catalog/catalog-content';

export const metadata = {
  title: 'Каталог | CHRONOS',
  description: 'Перегляньте нашу ексклюзивну колекцію преміум годинників. Фільтруйте за брендом, стилем та ціною.',
};

export default function CatalogPage() {
  return (
    <main className="min-h-screen">
      <Header />

      {/* Hero Banner */}
      <section className="pt-24 lg:pt-28 pb-12 lg:pb-16 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gold text-sm tracking-[0.3em] uppercase mb-4">
            Колекція
          </p>
          <h1 className="text-3xl lg:text-4xl font-light tracking-wide">
            Усі <span className="font-semibold">Моделі</span>
          </h1>
        </div>
      </section>

      {/* Catalog */}
      <Suspense fallback={<CatalogSkeleton />}>
        <CatalogContent />
      </Suspense>

      <Footer />
    </main>
  );
}

function CatalogSkeleton() {
  return (
    <section className="py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-square bg-muted mb-4" />
              <div className="h-4 bg-muted w-1/3 mb-2" />
              <div className="h-5 bg-muted w-2/3 mb-2" />
              <div className="h-4 bg-muted w-1/4" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
