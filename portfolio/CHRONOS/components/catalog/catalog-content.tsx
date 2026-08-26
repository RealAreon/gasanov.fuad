'use client';

import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  watches,
  formatPrice,
  styles,
  styleLabels,
  materials,
  movements,
  type Watch,
} from '@/lib/watches';
import { useCart } from '@/lib/cart-store';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { WishlistButton } from '@/components/wishlist-button';
import {
  SlidersHorizontal,
  X,
  ChevronDown,
  ShoppingBag,
  ChevronLeft,
  ChevronRight,
  Search,
} from 'lucide-react';

const ITEMS_PER_PAGE = 8;
const PRICE_MIN = 0;
const PRICE_MAX = 130000;
const PRICE_STEP = 5000;

const sortOptions = [
  { id: 'economy', label: 'Спочатку економ клас' },
  { id: 'luxury', label: 'Спочатку люкс клас' },
  { id: 'new', label: 'Спочатку нова колекція' },
  { id: 'old', label: 'Спочатку минула колекція' },
] as const;

const facetOptions = [
  { id: 'new', label: 'Новинка' },
  { id: 'sale', label: 'Акція' },
] as const;

type Facet = '' | 'new' | 'sale';
type SortId = (typeof sortOptions)[number]['id'];
type ClearKey = 'style' | 'material' | 'movement' | 'facet' | 'price' | 'query' | 'all';

function clampPrice(value: number, fallback = PRICE_MIN) {
  if (!Number.isFinite(value)) return fallback;
  const stepped = Math.round(value / PRICE_STEP) * PRICE_STEP;
  return Math.min(PRICE_MAX, Math.max(PRICE_MIN, stepped));
}

function parseFacet(value: string | null): Facet {
  return value === 'new' || value === 'sale' ? value : '';
}

function parseSort(value: string | null): SortId {
  return sortOptions.some((o) => o.id === value) ? (value as SortId) : 'economy';
}

function hasPriceFilter(range: [number, number]) {
  return range[0] > PRICE_MIN || range[1] < PRICE_MAX;
}

function FilterPanel({
  selectedStyle,
  selectedMaterial,
  selectedMovement,
  selectedFacet,
  priceRange,
  onStyleChange,
  onMaterialChange,
  onMovementChange,
  onFacetChange,
  onPriceChange,
  onPriceReset,
  className = '',
}: {
  selectedStyle: string;
  selectedMaterial: string;
  selectedMovement: string;
  selectedFacet: Facet;
  priceRange: [number, number];
  onStyleChange: (style: string) => void;
  onMaterialChange: (material: string) => void;
  onMovementChange: (movement: string) => void;
  onFacetChange: (facet: Facet) => void;
  onPriceChange: (value: number[]) => void;
  onPriceReset: () => void;
  className?: string;
}) {
  return (
    <div className={`flex min-w-0 max-w-full flex-col gap-5 overflow-x-hidden ${className}`}>
      <div className="flex flex-col gap-2" role="group" aria-label="Колекція">
        <span className="text-[0.65rem] font-medium uppercase tracking-wider text-muted-foreground">
          Колекція
        </span>
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => onStyleChange('')}
            aria-pressed={!selectedStyle}
            className={`min-h-9 px-2.5 py-1.5 text-[0.65rem] uppercase tracking-wider transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold ${
              !selectedStyle
                ? 'bg-foreground text-background'
                : 'bg-muted text-foreground hover:bg-muted/80'
            }`}
          >
            Усі
          </button>
          {styles.map((style) => (
            <button
              key={style}
              type="button"
              onClick={() => onStyleChange(style)}
              aria-pressed={selectedStyle === style}
              className={`min-h-9 px-2.5 py-1.5 text-[0.65rem] uppercase tracking-wider transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold ${
                selectedStyle === style
                  ? 'bg-foreground text-background'
                  : 'bg-muted text-foreground hover:bg-muted/80'
              }`}
            >
              {styleLabels[style]}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="filter-material" className="text-[0.65rem] font-medium uppercase tracking-wider text-muted-foreground">
          Матеріал
        </label>
        <select
          id="filter-material"
          value={selectedMaterial}
          onChange={(e) => onMaterialChange(e.target.value)}
          className="min-h-10 w-full border border-border bg-background px-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        >
          <option value="">Усі</option>
          {materials.map((material) => (
            <option key={material} value={material}>
              {material}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="filter-movement" className="text-[0.65rem] font-medium uppercase tracking-wider text-muted-foreground">
          Механізм
        </label>
        <select
          id="filter-movement"
          value={selectedMovement}
          onChange={(e) => onMovementChange(e.target.value)}
          className="min-h-10 w-full border border-border bg-background px-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        >
          <option value="">Усі</option>
          {movements.map((movement) => (
            <option key={movement} value={movement}>
              {movement}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-2" role="group" aria-label="Статус">
        <span className="text-[0.65rem] font-medium uppercase tracking-wider text-muted-foreground">
          Статус
        </span>
        <div className="flex flex-wrap gap-1.5">
          {facetOptions.map((facet) => (
            <button
              key={facet.id}
              type="button"
              onClick={() => onFacetChange(selectedFacet === facet.id ? '' : facet.id)}
              aria-pressed={selectedFacet === facet.id}
              className={`min-h-9 px-2.5 py-1.5 text-[0.65rem] uppercase tracking-wider transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold ${
                selectedFacet === facet.id
                  ? 'bg-foreground text-background'
                  : 'bg-muted text-foreground hover:bg-muted/80'
              }`}
            >
              {facet.label}
            </button>
          ))}
        </div>
      </div>

      <div role="group" aria-labelledby="price-filter-label" className="min-w-0 max-w-full">
        <span id="price-filter-label" className="mb-2 block text-[0.65rem] font-medium uppercase tracking-wider text-muted-foreground">
          Ціна
        </span>
        <div className="box-border min-w-0 max-w-full overflow-hidden border border-border bg-background p-2.5">
          <p className="mb-3 max-w-full break-words text-sm tabular-nums">
            {formatPrice(priceRange[0])} – {formatPrice(priceRange[1])}
          </p>
          <Slider
            min={PRICE_MIN}
            max={PRICE_MAX}
            step={PRICE_STEP}
            value={priceRange}
            onValueChange={onPriceChange}
            className="mb-4 w-full max-w-full touch-none px-[10px]"
            aria-label="Діапазон ціни"
          />
          <div className="mb-3 grid min-w-0 max-w-full grid-cols-2 gap-2">
            <label className="min-w-0 max-w-full text-[0.65rem] uppercase tracking-wider text-muted-foreground">
              Мін
              <input
                type="number"
                min={PRICE_MIN}
                max={PRICE_MAX}
                step={PRICE_STEP}
                value={priceRange[0]}
                onChange={(e) => onPriceChange([Number(e.target.value), priceRange[1]])}
                inputMode="numeric"
                className="mt-1 box-border min-h-10 w-full min-w-0 max-w-full border border-border px-1.5 text-[0.85rem] text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
              />
            </label>
            <label className="min-w-0 max-w-full text-[0.65rem] uppercase tracking-wider text-muted-foreground">
              Макс
              <input
                type="number"
                min={PRICE_MIN}
                max={PRICE_MAX}
                step={PRICE_STEP}
                value={priceRange[1]}
                onChange={(e) => onPriceChange([priceRange[0], Number(e.target.value)])}
                inputMode="numeric"
                className="mt-1 box-border min-h-10 w-full min-w-0 max-w-full border border-border px-1.5 text-[0.85rem] text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
              />
            </label>
          </div>
          <button
            type="button"
            onClick={onPriceReset}
            className="box-border min-h-10 w-full min-w-0 max-w-full border border-border px-2 text-[0.65rem] uppercase tracking-wider transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            Скинути ціну
          </button>
        </div>
      </div>
    </div>
  );
}

export function CatalogContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const gridRef = useRef<HTMLDivElement>(null);
  const renderTokenRef = useRef(0);

  const [selectedStyle, setSelectedStyle] = useState(searchParams.get('style') || '');
  const [selectedMaterial, setSelectedMaterial] = useState(() => {
    const m = searchParams.get('material') || '';
    return materials.includes(m) ? m : '';
  });
  const [selectedMovement, setSelectedMovement] = useState(() => {
    const m = searchParams.get('movement') || '';
    return movements.includes(m) ? m : '';
  });
  const [selectedFacet, setSelectedFacet] = useState<Facet>(parseFacet(searchParams.get('facet')));
  const [priceRange, setPriceRange] = useState<[number, number]>(() => {
    const min = clampPrice(Number(searchParams.get('min') || PRICE_MIN));
    const max = clampPrice(Number(searchParams.get('max') || PRICE_MAX), PRICE_MAX);
    return min <= max ? [min, max] : [PRICE_MIN, PRICE_MAX];
  });
  const [sortBy, setSortBy] = useState<SortId>(parseSort(searchParams.get('sort')));
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [searchInput, setSearchInput] = useState(searchParams.get('q') || '');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(Math.max(1, Number(searchParams.get('page') || 1)));
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);
  const [gridMinHeight, setGridMinHeight] = useState<number | undefined>(undefined);

  const syncUrl = useCallback(
    (next: {
      style?: string;
      material?: string;
      movement?: string;
      facet?: Facet;
      sort?: SortId;
      page?: number;
      min?: number;
      max?: number;
      q?: string;
    }) => {
      const params = new URLSearchParams();
      const style = next.style ?? selectedStyle;
      const material = next.material ?? selectedMaterial;
      const movement = next.movement ?? selectedMovement;
      const facet = next.facet ?? selectedFacet;
      const sort = next.sort ?? sortBy;
      const page = next.page ?? currentPage;
      const min = next.min ?? priceRange[0];
      const max = next.max ?? priceRange[1];
      const q = next.q ?? query;

      if (style) params.set('style', style);
      if (material) params.set('material', material);
      if (movement) params.set('movement', movement);
      if (facet) params.set('facet', facet);
      if (sort && sort !== 'economy') params.set('sort', sort);
      if (page > 1) params.set('page', String(page));
      if (min > PRICE_MIN) params.set('min', String(min));
      if (max < PRICE_MAX) params.set('max', String(max));
      if (q) params.set('q', q);

      const qs = params.toString();
      router.push(qs ? `/catalog?${qs}` : '/catalog', { scroll: false });
    },
    [selectedStyle, selectedMaterial, selectedMovement, selectedFacet, sortBy, currentPage, priceRange, query, router]
  );

  useEffect(() => {
    setSelectedStyle(searchParams.get('style') || '');
    const material = searchParams.get('material') || '';
    setSelectedMaterial(materials.includes(material) ? material : '');
    const movement = searchParams.get('movement') || '';
    setSelectedMovement(movements.includes(movement) ? movement : '');
    setSelectedFacet(parseFacet(searchParams.get('facet')));
    setSortBy(parseSort(searchParams.get('sort')));
    const q = searchParams.get('q') || '';
    setQuery(q);
    setSearchInput(q);
    setCurrentPage(Math.max(1, Number(searchParams.get('page') || 1)));
    const min = clampPrice(Number(searchParams.get('min') || PRICE_MIN));
    const max = clampPrice(Number(searchParams.get('max') || PRICE_MAX), PRICE_MAX);
    setPriceRange(min <= max ? [min, max] : [PRICE_MIN, PRICE_MAX]);
  }, [searchParams]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const trimmed = searchInput.trim();
      if (trimmed !== query) {
        setQuery(trimmed);
        setCurrentPage(1);
        syncUrl({ q: trimmed, page: 1 });
      }
    }, 160);
    return () => window.clearTimeout(timer);
  }, [searchInput, query, syncUrl]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsSortOpen(false);
        setIsFilterOpen(false);
      }
    };
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-sort-popover]')) setIsSortOpen(false);
    };
    window.addEventListener('keydown', onKey);
    document.addEventListener('click', onClick);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.removeEventListener('click', onClick);
    };
  }, []);

  useEffect(() => {
    if (!isFilterOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isFilterOpen]);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const onChange = () => {
      if (mq.matches) setIsFilterOpen(false);
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const handleStyleChange = (style: string) => {
    setSelectedStyle(style);
    setCurrentPage(1);
    syncUrl({ style, page: 1 });
  };

  const handleMaterialChange = (material: string) => {
    setSelectedMaterial(material);
    setCurrentPage(1);
    syncUrl({ material, page: 1 });
  };

  const handleMovementChange = (movement: string) => {
    setSelectedMovement(movement);
    setCurrentPage(1);
    syncUrl({ movement, page: 1 });
  };

  const handleFacetChange = (facet: Facet) => {
    setSelectedFacet(facet);
    setCurrentPage(1);
    syncUrl({ facet, page: 1 });
  };

  const handlePriceChange = (value: number[]) => {
    const min = clampPrice(value[0] ?? PRICE_MIN);
    const max = clampPrice(value[1] ?? PRICE_MAX, PRICE_MAX);
    const next: [number, number] = min <= max ? [min, max] : [max, min];
    setPriceRange(next);
    setCurrentPage(1);
    syncUrl({ min: next[0], max: next[1], page: 1 });
  };

  const handlePriceReset = () => {
    setPriceRange([PRICE_MIN, PRICE_MAX]);
    setCurrentPage(1);
    syncUrl({ min: PRICE_MIN, max: PRICE_MAX, page: 1 });
  };

  const filteredWatches = useMemo(() => {
    let filtered = [...watches];
    const q = query.trim().toLowerCase();

    if (selectedStyle) {
      filtered = filtered.filter((watch) => watch.style === selectedStyle);
    }
    if (selectedMaterial) {
      filtered = filtered.filter((watch) => watch.specifications.case === selectedMaterial);
    }
    if (selectedMovement) {
      filtered = filtered.filter((watch) => watch.specifications.movement === selectedMovement);
    }

    filtered = filtered.filter(
      (watch) => watch.price >= priceRange[0] && watch.price <= priceRange[1]
    );

    if (selectedFacet === 'new') filtered = filtered.filter((watch) => Boolean(watch.isNew));
    if (selectedFacet === 'sale') filtered = filtered.filter((watch) => Boolean(watch.originalPrice));

    if (q) {
      filtered = filtered.filter((watch) => {
        const styleLabel = styleLabels[watch.style].toLowerCase();
        const features = watch.features.join(' ').toLowerCase();
        return (
          watch.name.toLowerCase().includes(q) ||
          watch.brand.toLowerCase().includes(q) ||
          watch.description.toLowerCase().includes(q) ||
          watch.longDescription.toLowerCase().includes(q) ||
          watch.style.toLowerCase().includes(q) ||
          styleLabel.includes(q) ||
          features.includes(q) ||
          String(watch.price).includes(q) ||
          watch.specifications.movement.toLowerCase().includes(q) ||
          watch.specifications.diameter.toLowerCase().includes(q) ||
          watch.specifications.case.toLowerCase().includes(q)
        );
      });
    }

    switch (sortBy) {
      case 'economy':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'luxury':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'new':
        filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      case 'old':
        filtered.sort((a, b) => (a.isNew ? 1 : 0) - (b.isNew ? 1 : 0));
        break;
    }

    return filtered;
  }, [selectedStyle, selectedMaterial, selectedMovement, selectedFacet, priceRange, sortBy, query]);

  const totalPages = Math.ceil(filteredWatches.length / ITEMS_PER_PAGE) || 1;
  const safePage = Math.min(currentPage, totalPages);
  const paginatedWatches = filteredWatches.slice(
    (safePage - 1) * ITEMS_PER_PAGE,
    safePage * ITEMS_PER_PAGE
  );

  const priceFiltered = hasPriceFilter(priceRange);
  const activeFilterCount =
    (selectedStyle ? 1 : 0) +
    (selectedMaterial ? 1 : 0) +
    (selectedMovement ? 1 : 0) +
    (selectedFacet ? 1 : 0) +
    (priceFiltered ? 1 : 0) +
    (query ? 1 : 0);
  const hasActiveFilters = activeFilterCount > 0;

  const clearFilters = () => {
    setSelectedStyle('');
    setSelectedMaterial('');
    setSelectedMovement('');
    setSelectedFacet('');
    setPriceRange([PRICE_MIN, PRICE_MAX]);
    setQuery('');
    setSearchInput('');
    setCurrentPage(1);
    syncUrl({
      style: '',
      material: '',
      movement: '',
      facet: '',
      min: PRICE_MIN,
      max: PRICE_MAX,
      q: '',
      page: 1,
    });
  };

  const clearOne = (key: ClearKey) => {
    if (key === 'all') {
      clearFilters();
      return;
    }
    setCurrentPage(1);
    if (key === 'style') {
      setSelectedStyle('');
      syncUrl({ style: '', page: 1 });
    }
    if (key === 'material') {
      setSelectedMaterial('');
      syncUrl({ material: '', page: 1 });
    }
    if (key === 'movement') {
      setSelectedMovement('');
      syncUrl({ movement: '', page: 1 });
    }
    if (key === 'facet') {
      setSelectedFacet('');
      syncUrl({ facet: '', page: 1 });
    }
    if (key === 'price') {
      setPriceRange([PRICE_MIN, PRICE_MAX]);
      syncUrl({ min: PRICE_MIN, max: PRICE_MAX, page: 1 });
    }
    if (key === 'query') {
      setQuery('');
      setSearchInput('');
      syncUrl({ q: '', page: 1 });
    }
  };

  useEffect(() => {
    const token = ++renderTokenRef.current;
    const grid = gridRef.current;
    const prevHeight = grid?.offsetHeight ?? 0;

    if (grid && prevHeight > 0) {
      setGridMinHeight(Math.max(prevHeight, 240));
    }
    setIsFiltering(true);

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const delay = reducedMotion ? 0 : 80;

    const timer = window.setTimeout(() => {
      if (token !== renderTokenRef.current) return;
      setIsFiltering(false);
      requestAnimationFrame(() => {
        if (token === renderTokenRef.current) setGridMinHeight(undefined);
      });
    }, delay);

    return () => window.clearTimeout(timer);
  }, [
    selectedStyle,
    selectedMaterial,
    selectedMovement,
    selectedFacet,
    priceRange,
    sortBy,
    query,
    safePage,
  ]);

  const filterPanelProps = {
    selectedStyle,
    selectedMaterial,
    selectedMovement,
    selectedFacet,
    priceRange,
    onStyleChange: handleStyleChange,
    onMaterialChange: handleMaterialChange,
    onMovementChange: handleMovementChange,
    onFacetChange: handleFacetChange,
    onPriceChange: handlePriceChange,
    onPriceReset: handlePriceReset,
  };

  const chipItems: { key: ClearKey; label: string }[] = [];
  if (selectedStyle) {
    chipItems.push({
      key: 'style',
      label: styleLabels[selectedStyle as keyof typeof styleLabels],
    });
  }
  if (selectedMaterial) chipItems.push({ key: 'material', label: selectedMaterial });
  if (selectedMovement) chipItems.push({ key: 'movement', label: selectedMovement });
  if (selectedFacet === 'new') chipItems.push({ key: 'facet', label: 'Новинка' });
  if (selectedFacet === 'sale') chipItems.push({ key: 'facet', label: 'Акція' });
  if (priceFiltered) {
    chipItems.push({
      key: 'price',
      label: `${formatPrice(priceRange[0])} – ${formatPrice(priceRange[1])}`,
    });
  }
  if (query) chipItems.push({ key: 'query', label: `“${query}”` });

  return (
    <section className="overflow-x-hidden bg-background py-8 sm:py-12 lg:py-16">
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 xl:max-w-[86rem] 2xl:max-w-[92rem]">
        <div className="lg:flex lg:items-start lg:gap-8 xl:gap-10">
          {/* Desktop sidebar */}
          <aside
            className="hidden min-w-0 max-w-full overflow-x-hidden lg:sticky lg:top-24 lg:block lg:w-60 lg:max-w-[15rem] lg:shrink-0 lg:self-start"
            aria-label="Фільтри каталогу"
          >
            <h2 className="mb-4 font-serif text-lg">Фільтри</h2>
            <FilterPanel {...filterPanelProps} />
          </aside>

          {/* Mobile filter sheet */}
          {isFilterOpen && (
            <button
              type="button"
              className="fixed inset-0 z-40 bg-foreground/45 motion-safe:transition-opacity lg:hidden"
              aria-label="Закрити фільтри"
              onClick={() => setIsFilterOpen(false)}
            />
          )}

          <aside
            id="catalog-filters"
            className={`${
              isFilterOpen
                ? 'fixed inset-x-0 bottom-0 z-50 flex h-[min(88vh,42rem)] max-h-[88vh] min-h-0 min-w-0 max-w-full flex-col overflow-hidden rounded-t-2xl border border-border bg-background shadow-2xl motion-safe:animate-in motion-safe:slide-in-from-bottom motion-safe:duration-300'
                : 'hidden'
            } lg:hidden`}
            role="dialog"
            aria-modal={isFilterOpen}
            aria-label="Фільтри"
          >
            <div className="flex shrink-0 items-center justify-between border-b border-border px-4 py-3">
              <h2 className="font-serif text-xl">Фільтри</h2>
              <button
                type="button"
                className="flex h-11 w-11 items-center justify-center text-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                onClick={() => setIsFilterOpen(false)}
                aria-label="Закрити"
              >
                ×
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4 pb-6">
              <FilterPanel {...filterPanelProps} />
            </div>
            <div className="relative z-[2] grid shrink-0 grid-cols-2 gap-3 border-t border-border bg-background p-4 pb-[calc(1rem+env(safe-area-inset-bottom,0px))] shadow-[0_-8px_24px_rgba(0,0,0,0.06)]">
              <button
                type="button"
                onClick={clearFilters}
                className="min-h-11 border border-border text-xs uppercase tracking-wider focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
              >
                Скинути все
              </button>
              <button
                type="button"
                onClick={() => setIsFilterOpen(false)}
                className="min-h-11 bg-foreground text-xs uppercase tracking-wider text-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
              >
                Показати ({filteredWatches.length})
              </button>
            </div>
          </aside>

          {/* Main column */}
          <div className="min-w-0 flex-1">
            <div className="mb-3 grid grid-cols-[1fr_auto] items-center gap-2 border border-border bg-background/70 p-3 backdrop-blur-sm sm:grid-cols-[1fr_auto_auto] sm:p-4 lg:mb-4 lg:grid-cols-[minmax(0,1fr)_auto_minmax(11rem,14rem)] lg:items-end">
              <label className="relative col-span-full min-w-0 lg:col-span-1">
                <span className="sr-only">Пошук</span>
                <Search
                  className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />
                <input
                  type="search"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') {
                      setSearchInput('');
                      setQuery('');
                      setCurrentPage(1);
                      syncUrl({ q: '', page: 1 });
                    }
                  }}
                  placeholder="Назва, бренд, стиль, механізм..."
                  autoComplete="off"
                  className="min-h-11 w-full border border-border bg-background py-2 pl-10 pr-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                />
              </label>

              <Button
                variant="outline"
                className="flex min-h-11 items-center gap-2 lg:hidden"
                onClick={() => setIsFilterOpen(true)}
                aria-expanded={isFilterOpen}
                aria-controls="catalog-filters"
              >
                <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
                Фільтри
                {activeFilterCount > 0 && (
                  <span className="flex h-5 min-w-5 items-center justify-center bg-gold px-1 text-[10px] font-semibold text-foreground">
                    {activeFilterCount}
                  </span>
                )}
              </Button>

              <span className="justify-self-end text-xs text-muted-foreground sm:text-sm" aria-live="polite">
                {filteredWatches.length}{' '}
                {filteredWatches.length === 1 ? 'модель' : 'моделей'}
              </span>

              <div className="relative col-span-full min-w-0 lg:col-span-1" data-sort-popover>
                <span className="mb-1 block text-[0.65rem] uppercase tracking-wider text-muted-foreground">
                  Сортування
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsSortOpen((open) => !open);
                  }}
                  aria-expanded={isSortOpen}
                  aria-haspopup="listbox"
                  className="flex min-h-11 w-full items-center justify-between gap-2 border border-border bg-background px-3 text-left text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                >
                  {sortOptions.find((o) => o.id === sortBy)?.label || 'Сортування'}
                  <ChevronDown
                    className={`h-3 w-3 motion-safe:transition-transform ${isSortOpen ? 'rotate-180' : ''}`}
                    aria-hidden="true"
                  />
                </button>
                {isSortOpen && (
                  <div
                    className="absolute left-0 right-0 top-full z-20 mt-1 max-h-[60vh] overflow-y-auto border border-border bg-background shadow-lg"
                    role="listbox"
                  >
                    {sortOptions.map((option) => (
                      <button
                        key={option.id}
                        type="button"
                        role="option"
                        aria-selected={sortBy === option.id}
                        onClick={() => {
                          setSortBy(option.id);
                          setIsSortOpen(false);
                          setCurrentPage(1);
                          syncUrl({ sort: option.id, page: 1 });
                        }}
                        className={`min-h-11 w-full px-4 py-2 text-left text-sm hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold ${
                          sortBy === option.id ? 'text-gold' : ''
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {hasActiveFilters && (
              <div className="mb-6 flex flex-wrap items-center gap-2" role="list" aria-label="Активні фільтри">
                {chipItems.map((chip) => (
                  <button
                    key={chip.key}
                    type="button"
                    role="listitem"
                    onClick={() => clearOne(chip.key)}
                    className="inline-flex min-h-9 items-center gap-2 border border-border bg-muted px-3 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                    aria-label={`Прибрати фільтр: ${chip.label}`}
                  >
                    {chip.label}
                    <X className="h-3 w-3" aria-hidden="true" />
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => clearOne('all')}
                  className="inline-flex min-h-9 items-center gap-1 px-2 text-xs text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                >
                  Скинути все
                </button>
              </div>
            )}

            <div
              ref={gridRef}
              aria-busy={isFiltering}
              style={gridMinHeight ? { minHeight: gridMinHeight } : undefined}
              className={`transition-opacity duration-150 motion-reduce:transition-none ${
                isFiltering ? 'opacity-60' : 'opacity-100'
              }`}
            >
              {paginatedWatches.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                    {paginatedWatches.map((watch, index) => (
                      <ProductCard key={watch.id} watch={watch} index={index} />
                    ))}
                  </div>

                  {totalPages > 1 && (
                    <nav
                      className="mt-12 flex flex-wrap items-center justify-center gap-2"
                      aria-label="Пагінація"
                    >
                      <button
                        type="button"
                        onClick={() => {
                          const page = Math.max(1, safePage - 1);
                          setCurrentPage(page);
                          syncUrl({ page });
                        }}
                        disabled={safePage === 1}
                        aria-label="Попередня сторінка"
                        className="min-h-11 min-w-11 border border-border p-2 transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                      </button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          type="button"
                          onClick={() => {
                            setCurrentPage(page);
                            syncUrl({ page });
                          }}
                          aria-label={`Сторінка ${page}`}
                          aria-current={safePage === page ? 'page' : undefined}
                          className={`min-h-11 min-w-11 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold ${
                            safePage === page
                              ? 'bg-foreground text-background'
                              : 'border border-border hover:bg-muted'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={() => {
                          const page = Math.min(totalPages, safePage + 1);
                          setCurrentPage(page);
                          syncUrl({ page });
                        }}
                        disabled={safePage === totalPages}
                        aria-label="Наступна сторінка"
                        className="min-h-11 min-w-11 border border-border p-2 transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <ChevronRight className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </nav>
                  )}
                </>
              ) : (
                <div className="py-20 text-center">
                  <p className="mb-4 text-muted-foreground">
                    На жаль, за вашим запитом нічого не знайдено.
                  </p>
                  <Button variant="outline" onClick={clearFilters}>
                    Очистити фільтри
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProductCard({ watch, index }: { watch: Watch; index: number }) {
  const { addItem } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdding(true);
    addItem(watch);
    setTimeout(() => setIsAdding(false), 500);
  };

  return (
    <div
      className="group relative motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 motion-safe:duration-500"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="relative mb-6 aspect-square overflow-hidden bg-muted">
        <Link
          href={`/product/${watch.id}`}
          className="absolute inset-0 block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          aria-label={watch.name}
        >
          <Image
            src={watch.images[0]}
            alt={watch.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover motion-safe:transition-transform motion-safe:duration-700 motion-safe:group-hover:scale-105"
          />
        </Link>
        {watch.originalPrice && (
          <div className="pointer-events-none absolute left-4 top-4 z-[1] bg-gold px-3 py-1 text-xs uppercase tracking-wider text-foreground">
            Акція
          </div>
        )}
        {watch.isNew && !watch.originalPrice && (
          <div className="pointer-events-none absolute left-4 top-4 z-[1] bg-foreground px-3 py-1 text-xs uppercase tracking-wider text-background">
            Новинка
          </div>
        )}
        <WishlistButton watchId={watch.id} className="absolute right-3 top-3 z-[8]" />
      </div>

      <Link
        href={`/product/${watch.id}`}
        className="block space-y-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
      >
        <p className="text-xs uppercase tracking-widest text-muted-foreground">{watch.brand}</p>
        <h3 className="text-lg font-medium transition-colors group-hover:text-gold">
          {watch.name}
        </h3>
        <p className="line-clamp-2 text-sm text-muted-foreground">{watch.description}</p>
        <div className="flex flex-wrap items-center gap-3 pt-1">
          <span className="text-lg font-semibold">{formatPrice(watch.price)}</span>
          {watch.originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              {formatPrice(watch.originalPrice)}
            </span>
          )}
        </div>
      </Link>

      <button
        type="button"
        onClick={handleAddToCart}
        className={`mt-4 flex min-h-11 w-full items-center justify-center gap-2 py-3 text-sm uppercase tracking-wider transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold ${
          isAdding
            ? 'bg-gold text-foreground'
            : 'bg-foreground text-background hover:bg-foreground/90'
        }`}
      >
        <ShoppingBag
          className={`h-4 w-4 motion-safe:transition-transform ${isAdding ? 'scale-110' : ''}`}
          aria-hidden="true"
        />
        {isAdding ? 'Додано' : 'Додати в кошик'}
      </button>
    </div>
  );
}
