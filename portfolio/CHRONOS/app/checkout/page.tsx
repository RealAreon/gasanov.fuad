import { Suspense } from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { CheckoutForm } from '@/components/checkout/checkout-form';

export const metadata = {
  title: 'Оформлення замовлення | CHRONOS',
  description: 'Оформіть замовлення преміум годинника з доставкою по Україні.',
};

export default function CheckoutPage() {
  return (
    <main className="min-h-screen">
      <Header />

      <section className="pt-24 lg:pt-28 pb-16 lg:pb-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="text-center mb-12">
            <p className="text-gold text-sm tracking-[0.3em] uppercase mb-4">
              Оформлення
            </p>
            <h1 className="text-3xl lg:text-4xl font-light tracking-wide">
              Ваше <span className="font-semibold">Замовлення</span>
            </h1>
          </div>

          <Suspense fallback={<CheckoutSkeleton />}>
            <CheckoutForm />
          </Suspense>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function CheckoutSkeleton() {
  return (
    <div className="max-w-4xl mx-auto animate-pulse">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-6">
          <div className="h-6 bg-muted w-1/3" />
          <div className="h-12 bg-muted" />
          <div className="h-12 bg-muted" />
          <div className="h-12 bg-muted" />
        </div>
        <div className="h-64 bg-muted" />
      </div>
    </div>
  );
}
