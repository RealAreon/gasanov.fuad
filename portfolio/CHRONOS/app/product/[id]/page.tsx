import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { ProductGallery } from '@/components/product/product-gallery';
import { ProductInfo } from '@/components/product/product-info';
import { ProductFeatures } from '@/components/product/product-features';
import { RelatedProducts } from '@/components/product/related-products';
import { getWatchById, watches } from '@/lib/watches';

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return watches.map((watch) => ({
    id: watch.id,
  }));
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { id } = await params;
  const watch = getWatchById(id);

  if (!watch) {
    return {
      title: 'Товар не знайдено | CHRONOS',
    };
  }

  return {
    title: `${watch.name} | CHRONOS`,
    description: watch.longDescription,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const watch = getWatchById(id);

  if (!watch) {
    notFound();
  }

  return (
    <main className="min-h-screen">
      <Header />

      {/* Product Section */}
      <section className="pt-24 lg:pt-28 pb-16 lg:pb-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/catalog"
            className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            aria-label="Повернутися до каталогу"
          >
            <span aria-hidden="true">←</span>
            Повернутися до каталогу
          </Link>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            <ProductGallery images={watch.images} name={watch.name} />
            <ProductInfo watch={watch} />
          </div>
        </div>
      </section>

      {/* Features & Specs */}
      <ProductFeatures watch={watch} />

      {/* Related Products */}
      <RelatedProducts currentId={watch.id} style={watch.style} />

      <Footer />
    </main>
  );
}
