import { type Watch } from '@/lib/watches';

interface ProductFeaturesProps {
  watch: Watch;
}

export function ProductFeatures({ watch }: ProductFeaturesProps) {
  const specs = [
    { label: 'Корпус', value: watch.specifications.case },
    { label: 'Механізм', value: watch.specifications.movement },
    { label: 'Водонепроникність', value: watch.specifications.waterResistance },
    { label: 'Діаметр', value: watch.specifications.diameter },
    { label: 'Товщина', value: watch.specifications.thickness },
    { label: 'Браслет', value: watch.specifications.bracelet },
  ];

  return (
    <section className="py-16 lg:py-24 bg-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-gold text-sm tracking-[0.3em] uppercase mb-4">
            Технічні характеристики
          </p>
          <h2 className="text-2xl lg:text-3xl font-light tracking-wide">
            Деталі та <span className="font-semibold">Специфікації</span>
          </h2>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="bg-background">
            {specs.map((spec, index) => (
              <div
                key={spec.label}
                className={`flex justify-between items-center px-6 py-4 ${
                  index !== specs.length - 1 ? 'border-b border-border' : ''
                }`}
              >
                <span className="text-muted-foreground">{spec.label}</span>
                <span className="font-medium text-right">{spec.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping Info */}
        <div className="max-w-3xl mx-auto mt-12 p-6 bg-background border border-border">
          <h3 className="text-lg font-medium mb-4">Доставка по Україні</h3>
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>
              <span className="font-medium text-foreground">Нова Пошта:</span> Безкоштовна доставка при замовленні від 10 000 ₴. Доставка 1-3 дні.
            </p>
            <p>
              <span className="font-medium text-foreground">Оплата:</span> При отриманні (накладений платіж) або передоплата на картку.
            </p>
            <p>
              <span className="font-medium text-foreground">Повернення:</span> 14 днів на повернення або обмін товару.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
