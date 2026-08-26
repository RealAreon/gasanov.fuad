import { useEffect, useState } from 'react';
import { useAppStore } from './store/useAppStore';
import { useSmoothScroll, getLenis, scrollToSection } from './motion/useSmoothScroll';
import { useSectionObserver } from './motion/useSectionObserver';
import { consumePendingHomeScroll, getRoute, type AppRoute } from './app/routing';

import { Preloader } from './components/Preloader/Preloader';
import { Header } from './components/Header/Header';
import { SideNav } from './components/SideNav/SideNav';
import { ToastStack } from './components/Toast/Toast';

import { AccountModal } from './components/overlays/AccountModal';
import { CartDrawer } from './components/overlays/CartDrawer';
import { MenuOverlay } from './components/overlays/MenuOverlay';
import { ProductModal } from './components/overlays/ProductModal';
import { ArticleModal } from './components/overlays/ArticleModal';
import { ReviewsModal } from './components/overlays/ReviewsModal';
import { BookingModal } from './components/overlays/BookingModal';
import { StoryModal } from './components/overlays/StoryModal';
import { InfoModal } from './components/overlays/InfoModal';

import { Hero } from './sections/Hero/Hero';
import { Benefits } from './sections/Benefits/Benefits';
import { Clients } from './sections/Clients/Clients';
import { Journal } from './sections/Journal/Journal';
import { Footer } from './sections/Footer/Footer';
import { Catalog } from './pages/Catalog/Catalog';

function App() {
  const [isReady, setIsReady] = useState(false);
  const [route, setRoute] = useState<AppRoute>(() =>
    typeof window === 'undefined' ? 'home' : getRoute(),
  );
  const anyOverlayOpen = useAppStore((state) => state.anyOverlayOpen());
  const setTheme = useAppStore((state) => state.setTheme);

  useSmoothScroll(isReady);
  useSectionObserver(route);

  useEffect(() => {
    const syncRoute = () => setRoute(getRoute());
    window.addEventListener('hashchange', syncRoute);
    return () => window.removeEventListener('hashchange', syncRoute);
  }, []);

  useEffect(() => {
    if (route === 'catalog') {
      setTheme('dark');
      window.scrollTo({ top: 0, behavior: 'auto' });
      return;
    }

    const pending = consumePendingHomeScroll();
    if (pending) {
      window.setTimeout(() => scrollToSection(pending), 80);
    }
  }, [route, setTheme]);

  useEffect(() => {
    document.body.classList.toggle('is-locked', anyOverlayOpen);

    const lenis = getLenis();
    if (!lenis) return;

    if (anyOverlayOpen) {
      lenis.stop();
    } else {
      lenis.start();
    }
  }, [anyOverlayOpen]);

  return (
    <>
      {!isReady && <Preloader onDone={() => setIsReady(true)} />}

      <Header route={route} />
      {route === 'home' && <SideNav />}

      <main>
        <div key={route} className="page-fade">
          {route === 'catalog' ? (
            <Catalog />
          ) : (
            <>
              <Hero />
              <Benefits />
              <Clients />
              <Journal />
            </>
          )}
        </div>
      </main>

      <Footer />

      <CartDrawer />
      <AccountModal />
      <MenuOverlay />
      <ProductModal />
      <ArticleModal />
      <ReviewsModal />
      <BookingModal />
      <StoryModal />
      <InfoModal />

      <ToastStack />
    </>
  );
}

export default App;
