'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useEffect, useState, useRef } from 'react';

export function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [canPlayVideo, setCanPlayVideo] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 60);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const stop = () => {
      video.pause();
      setCanPlayVideo(false);
    };
    const play = async () => {
      video.muted = true;
      video.defaultMuted = true;
      try {
        await video.play();
        setCanPlayVideo(true);
      } catch {
        setCanPlayVideo(false);
      }
    };

    if (reduceMotion.matches) stop();
    else void play();

    const onChange = (e: MediaQueryListEvent) => {
      if (e.matches) stop();
      else void play();
    };
    reduceMotion.addEventListener('change', onChange);

    const onVisibility = () => {
      if (document.hidden) video.pause();
      else if (!reduceMotion.matches) void play();
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      reduceMotion.removeEventListener('change', onChange);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return (
    <section className="relative flex min-h-[100svh] items-end overflow-hidden bg-[#0a0b0d]">
      {/* Full-bleed media — watch as the dominant plane */}
      <div className="absolute inset-0 z-0" aria-hidden="true">
        <div className={`absolute inset-0 ${canPlayVideo ? '' : 'hero-kenburns'}`}>
          <Image
            src="/media/hero-watch-poster.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className={`object-cover object-[center_18%] transition-opacity duration-700 sm:object-[center_22%] ${
              canPlayVideo ? 'opacity-0' : 'opacity-100'
            }`}
          />
        </div>
        <video
          ref={videoRef}
          className={`absolute inset-0 h-full w-full object-cover object-[center_18%] transition-opacity duration-700 sm:object-[center_22%] ${
            canPlayVideo ? 'opacity-100 hero-video-drift' : 'opacity-0'
          }`}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/media/hero-watch-poster.jpg"
          disablePictureInPicture
          aria-hidden="true"
        >
          <source src="/media/hero-watch-mobile.mp4" type="video/mp4" media="(max-width: 767px)" />
          <source src="/media/hero-watch.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Film grade — keep the dial readable, push type into a clear bottom stage */}
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        aria-hidden="true"
        style={{
          background: [
            'radial-gradient(90% 70% at 50% 28%, transparent 0%, rgba(10,11,13,0.18) 48%, rgba(10,11,13,0.72) 100%)',
            'linear-gradient(180deg, rgba(10,11,13,0.5) 0%, transparent 22%, transparent 42%, rgba(10,11,13,0.55) 68%, rgba(10,11,13,0.94) 100%)',
            'linear-gradient(90deg, rgba(10,11,13,0.45) 0%, transparent 38%, transparent 62%, rgba(10,11,13,0.28) 100%)',
          ].join(', '),
        }}
      />

      {/* Cool steel haze — atmosphere without cards or badges */}
      <div
        className="pointer-events-none absolute left-1/2 top-[18%] z-[1] h-[50vh] w-[70vw] -translate-x-1/2 rounded-full opacity-40 blur-3xl"
        aria-hidden="true"
        style={{
          background: 'radial-gradient(circle, rgba(180,190,205,0.14) 0%, transparent 68%)',
        }}
      />

      {/* Bottom composition — Tailwind: px-6/px-8, stacked CTAs on mobile */}
      <div className="relative z-[2] w-full min-w-0 px-6 pb-16 pt-[calc(3.5rem+1.75rem)] sm:px-8 sm:pb-20 lg:pb-24">
        <div
          className={`mx-auto w-full min-w-0 max-w-7xl text-white ${
            isVisible ? 'hero-reveal' : 'opacity-0'
          }`}
        >
          <p className="hero-reveal-item hero-brand font-serif text-[clamp(2.1rem,11vw,5.5rem)] font-semibold uppercase leading-[0.92] tracking-[0.18em] text-white sm:tracking-[0.24em]">
            CHRONOS
          </p>

          <div
            className="hero-reveal-item hero-rule mt-4 h-px w-16 origin-left bg-gradient-to-r from-[#d4af6a] to-[#d4af6a]/30 sm:mt-5 sm:w-24"
            style={{ animationDelay: '140ms' }}
            aria-hidden="true"
          />

          <div
            className="hero-reveal-item mt-6 flex w-full min-w-0 flex-col gap-7 sm:mt-8 sm:gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-12"
            style={{ animationDelay: '260ms' }}
          >
            <div className="min-w-0 max-w-xl">
              <h1 className="font-serif text-[clamp(1.35rem,5.2vw,2.65rem)] font-normal normal-case leading-[1.25] tracking-[0.04em] text-white/95">
                Точність, яку відчувають.
              </h1>
              <p className="mt-3 max-w-md font-sans text-[0.92rem] leading-relaxed text-white/90 sm:mt-4 sm:text-base">
                Преміум-годинники для чоловіків, які обирають статус без зайвого шуму.
              </p>
            </div>

            <div
              className="hero-reveal-item flex w-full min-w-0 shrink-0 flex-col items-stretch gap-3 sm:max-w-sm sm:flex-row sm:items-center sm:gap-4 lg:max-w-none"
              style={{ animationDelay: '400ms' }}
            >
              <Link href="/catalog" className="min-w-0 w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full max-w-full bg-gold px-8 py-6 text-[0.68rem] font-medium uppercase tracking-[0.2em] text-foreground transition-colors duration-300 hover:bg-[#e0c07a] sm:w-auto sm:px-10 sm:py-7 sm:text-xs sm:tracking-[0.22em]"
                >
                  До колекції
                </Button>
              </Link>
              <Link href="/catalog?sort=new" className="min-w-0 w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full max-w-full border-white/45 bg-white/10 px-8 py-6 text-[0.68rem] font-medium uppercase tracking-[0.2em] text-white backdrop-blur-[2px] transition-colors duration-300 hover:border-[#d4af6a] hover:bg-white/15 hover:text-[#f0d78c] sm:w-auto sm:px-10 sm:py-7 sm:text-xs sm:tracking-[0.22em]"
                >
                  Новинки
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll cue — edge pulse, clear of the CTA */}
      <a
        href="#featured"
        className={`absolute bottom-8 right-4 z-[3] flex flex-col items-center gap-2 sm:bottom-10 sm:right-8 ${
          isVisible ? 'hero-scroll-cue' : 'opacity-0'
        }`}
        aria-label="Прокрутити до колекції"
      >
        <span className="hero-scroll-line origin-top block h-10 w-px bg-gradient-to-b from-[#d4af6a]/85 to-transparent" />
      </a>
    </section>
  );
}
