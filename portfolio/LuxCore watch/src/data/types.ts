export type ProductStatus = 'active' | 'limited' | 'coming-soon';

export interface ProductSpec {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  status: ProductStatus;
  price: number;
  currency: string;
  shortDescription: string;
  description: string;
  highlights: string[];
  specs: ProductSpec[];
  image: string;
  colorway: 'onyx' | 'aurum' | 'legacy';
  accentHex: string;
  specSheetUrl?: string;
}

export type ReviewRegion = 'europe' | 'cis' | 'middle-east';

export interface Review {
  id: string;
  name: string;
  role: string;
  region: ReviewRegion;
  rating: number;
  quote: string;
  productSlug: string;
  avatar?: string;
  date: string;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string[];
  image: string;
  category: string;
  readMinutes: number;
  date: string;
  featured?: boolean;
}

export interface CartItem {
  productId: string;
  qty: number;
}

export interface BookingRecord {
  id: string;
  name: string;
  email: string;
  date: string;
  time: string;
  message: string;
  createdAt: string;
}
