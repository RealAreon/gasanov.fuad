'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

const STORAGE_KEY = 'chronos_wishlist';

function readIds(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(raw) ? raw.filter((id): id is string => typeof id === 'string' && Boolean(id)) : [];
  } catch {
    return [];
  }
}

function writeIds(ids: string[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...new Set(ids)]));
  window.dispatchEvent(new Event('wishlist-updated'));
}

interface WishlistContextType {
  ids: string[];
  has: (watchId: string) => boolean;
  toggle: (watchId: string) => void;
  add: (watchId: string) => void;
  remove: (watchId: string) => void;
  count: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setIds(readIds());
    setHydrated(true);

    const sync = () => setIds(readIds());
    window.addEventListener('wishlist-updated', sync);
    window.addEventListener('storage', (e) => {
      if (e.key === STORAGE_KEY) sync();
    });
    return () => window.removeEventListener('wishlist-updated', sync);
  }, []);

  const persist = useCallback((next: string[]) => {
    const unique = [...new Set(next)];
    setIds(unique);
    writeIds(unique);
  }, []);

  const has = useCallback((watchId: string) => ids.includes(watchId), [ids]);

  const add = useCallback(
    (watchId: string) => {
      if (!watchId || ids.includes(watchId)) return;
      persist([...ids, watchId]);
    },
    [ids, persist]
  );

  const remove = useCallback(
    (watchId: string) => {
      persist(ids.filter((id) => id !== watchId));
    },
    [ids, persist]
  );

  const toggle = useCallback(
    (watchId: string) => {
      if (!watchId) return;
      if (ids.includes(watchId)) persist(ids.filter((id) => id !== watchId));
      else persist([...ids, watchId]);
    },
    [ids, persist]
  );

  const value = useMemo(
    () => ({
      ids: hydrated ? ids : [],
      has,
      toggle,
      add,
      remove,
      count: hydrated ? ids.length : 0,
    }),
    [hydrated, ids, has, toggle, add, remove]
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
