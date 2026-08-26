import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { products } from '../data/products';
import type { CartItem } from '../data/types';

export type Theme = 'dark' | 'light';

export type OverlayKey =
  | 'cart'
  | 'menu'
  | 'account'
  | 'productQuickView'
  | 'article'
  | 'reviewsAll'
  | 'booking'
  | 'story'
  | 'info';

export interface AccountProfile {
  name: string;
  email: string;
}

export interface ToastMessage {
  id: number;
  text: string;
  tone: 'success' | 'error' | 'info';
}

interface OpenOverlays {
  cart: boolean;
  menu: boolean;
  account: boolean;
  productQuickView: boolean;
  article: boolean;
  reviewsAll: boolean;
  booking: boolean;
  story: boolean;
  info: boolean;
}

const closedOverlays: OpenOverlays = {
  cart: false,
  menu: false,
  account: false,
  productQuickView: false,
  article: false,
  reviewsAll: false,
  booking: false,
  story: false,
  info: false,
};

interface AppState {
  cart: CartItem[];
  addToCart: (productId: string, qty?: number) => void;
  removeFromCart: (productId: string) => void;
  setQty: (productId: string, qty: number) => void;
  clearCart: () => void;
  cartCount: () => number;
  cartSubtotal: () => number;

  overlays: OpenOverlays;
  openOverlay: (key: OverlayKey) => void;
  closeOverlay: (key: OverlayKey) => void;
  closeAllOverlays: () => void;
  anyOverlayOpen: () => boolean;

  activeProductSlug: string | null;
  setActiveProductSlug: (slug: string | null) => void;

  activeArticleSlug: string | null;
  setActiveArticleSlug: (slug: string | null) => void;

  infoTopic: string | null;
  setInfoTopic: (topic: string | null) => void;

  activeSection: string;
  setActiveSection: (id: string) => void;

  theme: Theme;
  setTheme: (theme: Theme) => void;

  selectedCollectionId: string;
  setSelectedCollectionId: (id: string) => void;

  account: AccountProfile | null;
  signIn: (profile: AccountProfile) => void;
  signOut: () => void;

  toasts: ToastMessage[];
  pushToast: (text: string, tone?: ToastMessage['tone']) => void;
  dismissToast: (id: number) => void;
}

let toastId = 0;

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      cart: [],
      addToCart: (productId, qty = 1) =>
        set((state) => {
          const existing = state.cart.find((item) => item.productId === productId);
          if (existing) {
            return {
              cart: state.cart.map((item) =>
                item.productId === productId ? { ...item, qty: item.qty + qty } : item,
              ),
            };
          }
          return { cart: [...state.cart, { productId, qty }] };
        }),
      removeFromCart: (productId) =>
        set((state) => ({ cart: state.cart.filter((item) => item.productId !== productId) })),
      setQty: (productId, qty) =>
        set((state) => ({
          cart:
            qty <= 0
              ? state.cart.filter((item) => item.productId !== productId)
              : state.cart.map((item) => (item.productId === productId ? { ...item, qty } : item)),
        })),
      clearCart: () => set({ cart: [] }),
      cartCount: () => get().cart.reduce((sum, item) => sum + item.qty, 0),
      cartSubtotal: () =>
        get().cart.reduce((sum, item) => {
          const product = products.find((entry) => entry.id === item.productId);
          return product ? sum + product.price * item.qty : sum;
        }, 0),

      overlays: closedOverlays,
      openOverlay: (key) => set((state) => ({ overlays: { ...state.overlays, [key]: true } })),
      closeOverlay: (key) => set((state) => ({ overlays: { ...state.overlays, [key]: false } })),
      closeAllOverlays: () => set({ overlays: closedOverlays }),
      anyOverlayOpen: () => Object.values(get().overlays).some(Boolean),

      activeProductSlug: null,
      setActiveProductSlug: (slug) => set({ activeProductSlug: slug }),

      activeArticleSlug: null,
      setActiveArticleSlug: (slug) => set({ activeArticleSlug: slug }),

      infoTopic: null,
      setInfoTopic: (topic) => set({ infoTopic: topic }),

      activeSection: 'hero',
      setActiveSection: (id) => set({ activeSection: id }),

      theme: 'dark',
      setTheme: (theme) => set({ theme }),

      selectedCollectionId: 'infinitum',
      setSelectedCollectionId: (id) => set({ selectedCollectionId: id }),

      account: null,
      signIn: (profile) => set({ account: profile }),
      signOut: () => set({ account: null }),

      toasts: [],
      pushToast: (text, tone = 'info') =>
        set((state) => ({ toasts: [...state.toasts, { id: ++toastId, text, tone }] })),
      dismissToast: (id) => set((state) => ({ toasts: state.toasts.filter((toast) => toast.id !== id) })),
    }),
    {
      name: 'chronos-storage',
      partialize: (state) => ({ cart: state.cart, account: state.account }),
      storage: {
        getItem: (name) => {
          try {
            const value = localStorage.getItem(name);
            return value ? JSON.parse(value) : null;
          } catch {
            return null;
          }
        },
        setItem: (name, value) => {
          try {
            localStorage.setItem(name, JSON.stringify(value));
          } catch {
            /* storage unavailable — fail silently */
          }
        },
        removeItem: (name) => {
          try {
            localStorage.removeItem(name);
          } catch {
            /* storage unavailable — fail silently */
          }
        },
      },
    },
  ),
);

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const isValidEmail = (value: string): boolean => EMAIL_PATTERN.test(value.trim());

export const saveBookingRecord = (record: {
  name: string;
  email: string;
  date: string;
  time: string;
  message: string;
}): boolean => {
  try {
    const key = 'chronos-bookings';
    const raw = localStorage.getItem(key);
    const existing = raw ? JSON.parse(raw) : [];
    const entry = { ...record, id: `bk-${Date.now()}`, createdAt: new Date().toISOString() };
    localStorage.setItem(key, JSON.stringify([...existing, entry]));
    return true;
  } catch {
    return false;
  }
};

export const saveNewsletterEmail = (email: string): boolean => {
  try {
    const key = 'chronos-newsletter';
    const raw = localStorage.getItem(key);
    const existing: string[] = raw ? JSON.parse(raw) : [];
    if (!existing.includes(email)) {
      localStorage.setItem(key, JSON.stringify([...existing, email]));
    }
    return true;
  } catch {
    return false;
  }
};
