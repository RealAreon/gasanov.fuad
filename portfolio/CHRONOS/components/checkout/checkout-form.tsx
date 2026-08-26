'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getWatchById, formatPrice } from '@/lib/watches';
import { useCart } from '@/lib/cart-store';
import {
  Shield,
  Truck,
  CreditCard,
  Banknote,
  Check,
  X,
  ArrowLeft,
  Plus,
  Minus,
  ShoppingBag,
} from 'lucide-react';

const ukrainianCities = [
  'Київ',
  'Харків',
  'Одеса',
  'Дніпро',
  'Львів',
  'Запоріжжя',
  'Кривий Ріг',
  'Миколаїв',
  'Вінниця',
  'Херсон',
  'Полтава',
  'Чернігів',
  'Черкаси',
  'Житомир',
  'Суми',
  'Хмельницький',
  'Рівне',
  'Івано-Франківськ',
  'Тернопіль',
  'Луцьк',
  'Ужгород',
];

type PaymentMethod = 'cod' | 'card';
type DeliveryMethod = 'branch' | 'locker' | 'courier';

const deliveryPointConfig: Record<
  DeliveryMethod,
  { label: string; placeholder: string; title: string; description: string }
> = {
  branch: {
    title: 'У відділення',
    description: 'Оберіть місто та відділення',
    label: 'Відділення Нової Пошти',
    placeholder: 'Відділення №1, вул. Хрещатик, 1',
  },
  locker: {
    title: 'У поштомат',
    description: 'Оберіть місто та поштомат',
    label: 'Поштомат Нової Пошти',
    placeholder: 'Поштомат №12345, вул. Шевченка, 10',
  },
  courier: {
    title: 'Кур’єром',
    description: 'Вкажіть адресу доставки',
    label: 'Адреса доставки',
    placeholder: 'вул. Хрещатик, 1, кв. 5',
  },
};

export function CheckoutForm() {
  const searchParams = useSearchParams();
  const productId = searchParams.get('product');
  const { items, updateQuantity, removeItem, totalPrice, clearCart } = useCart();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    city: '',
    novaPoshta: '',
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('branch');
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [citySearch, setCitySearch] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Add product from URL if cart is empty
  useEffect(() => {
    if (productId && items.length === 0) {
      const watch = getWatchById(productId);
      if (watch) {
        // This will be handled by the cart context
      }
    }
  }, [productId, items.length]);

  const filteredCities = ukrainianCities.filter((city) =>
    city.toLowerCase().includes(citySearch.toLowerCase())
  );

  const deliveryPoint = deliveryPointConfig[deliveryMethod];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCitySelect = (city: string) => {
    setFormData((prev) => ({ ...prev, city }));
    setCitySearch(city);
    setIsCityDropdownOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSuccess(true);
    clearCart();
  };

  const isFormValid =
    items.length > 0 &&
    formData.firstName &&
    formData.lastName &&
    formData.phone &&
    formData.city &&
    formData.novaPoshta;

  if (isSuccess) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center bg-green-100">
          <Check className="h-10 w-10 text-green-600" />
        </div>
        <h2 className="text-2xl font-light mb-4">
          Дякуємо за <span className="font-semibold">замовлення!</span>
        </h2>
        <p className="text-muted-foreground mb-8">
          Ваше замовлення успішно оформлено. Наш менеджер зв&apos;яжеться з вами
          найближчим часом для підтвердження.
        </p>
        <div className="bg-muted p-6 mb-8">
          <p className="text-sm text-muted-foreground mb-2">Номер замовлення</p>
          <p className="text-xl font-mono font-semibold">
            CH-{Date.now().toString().slice(-8)}
          </p>
        </div>
        <Link href="/catalog">
          <Button variant="outline" className="tracking-widest uppercase">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Повернутися до каталогу
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Form Section */}
        <div className="space-y-8">
          {/* Contact Info */}
          <div className="space-y-4">
            <h2 className="text-lg font-medium tracking-wide">
              Контактна інформація
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Ім&apos;я</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="Олександр"
                  required
                  className="h-12"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Прізвище</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Коваленко"
                  required
                  className="h-12"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Номер телефону</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+380 50 123 45 67"
                required
                className="h-12"
              />
            </div>
          </div>

          {/* Delivery */}
          <div className="space-y-4">
            <h2 className="text-lg font-medium tracking-wide">Доставка</h2>

            <div className="p-4 border border-gold/30 bg-gold/5 flex items-center gap-3">
              <Truck className="h-5 w-5 text-gold" />
              <div>
                <p className="font-medium">Нова Пошта</p>
                <p className="text-xs text-muted-foreground">
                  Безкоштовна доставка по Україні
                </p>
              </div>
            </div>

            <div
              className="grid grid-cols-1 sm:grid-cols-3 gap-2"
              role="radiogroup"
              aria-label="Спосіб доставки Новою Поштою"
              data-testid="delivery-methods"
            >
              {(Object.entries(deliveryPointConfig) as [DeliveryMethod, typeof deliveryPointConfig.branch][]).map(
                ([value, { title, description }]) => (
                  <button
                    key={value}
                    type="button"
                    role="radio"
                    data-delivery-method={value}
                    aria-checked={deliveryMethod === value}
                    onClick={() => setDeliveryMethod(value)}
                    className={`p-3 text-left border transition-colors ${deliveryMethod === value ? 'border-gold bg-gold/5' : 'border-border hover:border-gold/50'}`}
                  >
                    <span className="block text-sm font-medium">{title}</span>
                    <span className="block mt-1 text-xs text-muted-foreground">{description}</span>
                  </button>
                )
              )}
            </div>

            <p className="text-xs text-muted-foreground" id="nova-poshta-note">
              Доставка лише Новою Поштою: відділення, поштомат або кур’єром. Точна вартість і доступність
              способу відображатимуться в Shopify checkout після підключення інтеграції.
            </p>

            <div className="space-y-2 relative">
              <Label htmlFor="city">Місто</Label>
              <div className="relative">
                <Input
                  id="city"
                  value={citySearch}
                  onChange={(e) => {
                    setCitySearch(e.target.value);
                    setIsCityDropdownOpen(true);
                    if (!e.target.value) {
                      setFormData((prev) => ({ ...prev, city: '' }));
                    }
                  }}
                  onFocus={() => setIsCityDropdownOpen(true)}
                  placeholder="Почніть вводити назву міста"
                  className="h-12"
                  autoComplete="off"
                />
                {citySearch && (
                  <button
                    type="button"
                    onClick={() => {
                      setCitySearch('');
                      setFormData((prev) => ({ ...prev, city: '' }));
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {isCityDropdownOpen && filteredCities.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-border shadow-lg max-h-48 overflow-y-auto z-10">
                  {filteredCities.map((city) => (
                    <button
                      key={city}
                      type="button"
                      onClick={() => handleCitySelect(city)}
                      className={`w-full px-4 py-2 text-left hover:bg-muted transition-colors ${
                        formData.city === city ? 'bg-muted text-gold' : ''
                      }`}
                    >
                      {city}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="novaPoshta" id="delivery-point-label">
                {deliveryPoint.label}
              </Label>
              <Input
                id="novaPoshta"
                name="novaPoshta"
                value={formData.novaPoshta}
                onChange={handleInputChange}
                placeholder={deliveryPoint.placeholder}
                required
                className="h-12"
              />
            </div>
          </div>

          {/* Payment */}
          <div className="space-y-4">
            <h2 className="text-lg font-medium tracking-wide">Оплата</h2>

            <div className="space-y-3" data-testid="payment-methods">
              <button
                type="button"
                data-payment="cod"
                onClick={() => setPaymentMethod('cod')}
                className={`w-full p-4 border flex items-center gap-4 transition-colors ${
                  paymentMethod === 'cod'
                    ? 'border-gold bg-gold/5'
                    : 'border-border hover:border-gold/50'
                }`}
              >
                <Banknote
                  className={`h-5 w-5 ${paymentMethod === 'cod' ? 'text-gold' : 'text-muted-foreground'}`}
                />
                <div className="text-left flex-1">
                  <p className="font-medium">Накладений платіж</p>
                  <p className="text-xs text-muted-foreground">
                    Оплата при отриманні в Новій Пошті
                  </p>
                </div>
                {paymentMethod === 'cod' && (
                  <Check className="h-5 w-5 text-gold" />
                )}
              </button>

              <button
                type="button"
                data-payment="card"
                onClick={() => setPaymentMethod('card')}
                className={`w-full p-4 border flex items-center gap-4 transition-colors ${
                  paymentMethod === 'card'
                    ? 'border-gold bg-gold/5'
                    : 'border-border hover:border-gold/50'
                }`}
              >
                <CreditCard
                  className={`h-5 w-5 ${paymentMethod === 'card' ? 'text-gold' : 'text-muted-foreground'}`}
                />
                <div className="text-left flex-1">
                  <p className="font-medium">Онлайн-карткою</p>
                  <p className="text-xs text-muted-foreground">
                    Безпечна оплата на сайті
                  </p>
                </div>
                {paymentMethod === 'card' && (
                  <Check className="h-5 w-5 text-gold" />
                )}
              </button>
            </div>

            <div
              id="payment-method-note"
              className="rounded-sm border border-border bg-muted/40 p-3 text-xs text-muted-foreground"
            >
              {paymentMethod === 'cod'
                ? 'Накладений платіж: сплата під час отримання у Новій Пошті. Комісію перевізника сплачує покупець.'
                : 'Оплата карткою: безпечна онлайн-оплата буде доступна після підключення платіжного провайдера Shopify.'}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:sticky lg:top-28 h-fit">
          <div className="bg-muted p-6 lg:p-8">
            <h2 className="text-lg font-medium tracking-wide mb-6">
              Ваше замовлення
            </h2>

            {items.length > 0 ? (
              <>
                <div className="space-y-4 pb-6 border-b border-border max-h-80 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.watch.id} className="flex gap-4">
                      <div className="relative w-20 h-20 bg-background flex-shrink-0">
                        <Image
                          src={item.watch.images[0]}
                          alt={item.watch.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-muted-foreground tracking-widest uppercase">
                          {item.watch.brand}
                        </p>
                        <p className="font-medium text-sm truncate">{item.watch.name}</p>
                        <p className="text-gold font-semibold text-sm mt-1">
                          {formatPrice(item.watch.price)}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex items-center border border-border bg-background">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.watch.id, item.quantity - 1)}
                              className="p-1 hover:bg-muted transition-colors"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="w-8 text-center text-xs">{item.quantity}</span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.watch.id, item.quantity + 1)}
                              className="p-1 hover:bg-muted transition-colors"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeItem(item.watch.id)}
                            className="text-xs text-muted-foreground hover:text-foreground underline"
                          >
                            Видалити
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="py-6 space-y-3 border-b border-border">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Товарів: {items.reduce((sum, item) => sum + item.quantity, 0)}
                    </span>
                    <span>{formatPrice(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Доставка</span>
                    <span className="text-green-600">Безкоштовно</span>
                  </div>
                </div>

                <div className="py-6 flex justify-between items-center">
                  <span className="text-lg font-medium">Разом</span>
                  <span className="text-2xl font-semibold">
                    {formatPrice(totalPrice)}
                  </span>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
                <p className="text-muted-foreground mb-4">
                  Ваш кошик порожній
                </p>
                <Link href="/catalog">
                  <Button variant="outline" size="sm">
                    Перейти до каталогу
                  </Button>
                </Link>
              </div>
            )}

            <Button
              type="submit"
              size="lg"
              className="w-full bg-foreground hover:bg-foreground/90 text-background tracking-widest uppercase py-6 transition-all duration-300"
              disabled={!isFormValid || isSubmitting}
            >
              {isSubmitting ? 'Обробка...' : 'Підтвердити замовлення'}
            </Button>

            {/* Trust Badges */}
            <div className="mt-6 pt-6 border-t border-border space-y-3">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Shield className="h-4 w-4 text-gold" />
                <span>Гарантія якості 12 місяців</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Truck className="h-4 w-4 text-gold" />
                <span>Безкоштовна доставка по Україні</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
