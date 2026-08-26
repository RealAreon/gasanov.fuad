export type AppRoute = 'home' | 'catalog';

const PENDING_SCROLL_KEY = 'chronos-pending-scroll';

export const getRoute = (): AppRoute => {
  const hash = window.location.hash.replace(/^#/, '').replace(/^\//, '');
  return hash.startsWith('catalog') ? 'catalog' : 'home';
};

export const navigateTo = (route: AppRoute): void => {
  const next = route === 'catalog' ? '#/catalog' : '#/';
  if (window.location.hash === next || (route === 'home' && !window.location.hash)) {
    return;
  }
  window.location.hash = next;
};

export const setPendingHomeScroll = (sectionId: string): void => {
  try {
    sessionStorage.setItem(PENDING_SCROLL_KEY, sectionId);
  } catch {
    /* ignore */
  }
};

export const consumePendingHomeScroll = (): string | null => {
  try {
    const value = sessionStorage.getItem(PENDING_SCROLL_KEY);
    if (value) sessionStorage.removeItem(PENDING_SCROLL_KEY);
    return value;
  } catch {
    return null;
  }
};

export const goHomeAndScroll = (sectionId: string): void => {
  if (getRoute() === 'home') {
    const target = document.getElementById(sectionId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
  }
  setPendingHomeScroll(sectionId);
  navigateTo('home');
};
