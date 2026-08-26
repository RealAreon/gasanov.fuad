import { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import type { NavigationOptions } from 'swiper/types';
import type { Swiper as SwiperInstance } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import { useAppStore } from '../../store/useAppStore';
import { reviews } from '../../data/reviews';
import { useSectionMotion } from '../../motion/initSectionMotion';
import { Icon } from '../../components/shared/Icon';
import type { IconName } from '../../components/shared/Icon';
import { InitialsAvatar } from '../../components/shared/InitialsAvatar';
import './Clients.scss';

interface ClientStat {
  icon: IconName;
  value: number;
  suffix: string;
  label: string;
}

const STATS: ClientStat[] = [
  { icon: 'user', value: 10, suffix: ',000+', label: '\u0434\u043e\u0432\u043e\u043b\u044c\u043d\u044b\u0445 \u043a\u043b\u0438\u0435\u043d\u0442\u043e\u0432' },
  { icon: 'star', value: 98, suffix: '%', label: '\u0443\u0440\u043e\u0432\u0435\u043d\u044c \u0443\u0434\u043e\u0432\u043b\u0435\u0442\u0432\u043e\u0440\u0451\u043d\u043d\u043e\u0441\u0442\u0438' },
  { icon: 'infinity', value: 65, suffix: '%', label: '\u043f\u043e\u0432\u0442\u043e\u0440\u043d\u044b\u0445 \u043f\u043e\u043a\u0443\u043f\u043e\u043a' },
  { icon: 'compass', value: 120, suffix: '+', label: '\u0441\u0442\u0440\u0430\u043d \u0434\u043e\u0441\u0442\u0430\u0432\u043a\u0438' },
];

export const Clients = () => {
  const rootRef = useRef<HTMLElement>(null);
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  useSectionMotion(rootRef);
  const openOverlay = useAppStore((state) => state.openOverlay);

  const openReviews = () => openOverlay('reviewsAll');

  const bindNavigation = (swiper: SwiperInstance) => {
    const navigation = swiper.params.navigation as NavigationOptions;
    navigation.prevEl = prevRef.current;
    navigation.nextEl = nextRef.current;
    swiper.navigation.destroy();
    swiper.navigation.init();
    swiper.navigation.update();
  };

  return (
    <section
      id="clients"
      data-section="clients"
      data-theme="light"
      className="clients section"
      ref={rootRef}
      aria-label="Clients"
    >
      <img
        className="clients__bg"
        src="./assets/images/clients/clients-interior-bg.webp"
        alt=""
        loading="lazy"
      />
      <div className="clients__scrim" aria-hidden="true" />

      <div className="clients__top container" data-reveal="up">
        <div className="clients__header">
          <p className="eyebrow">{'\u041d\u0430\u0448\u0435 \u0433\u043b\u0430\u0432\u043d\u043e\u0435 \u0434\u043e\u0441\u0442\u0438\u0436\u0435\u043d\u0438\u0435'}</p>
          <h2>{'\u041d\u0430\u0448\u0438 \u043a\u043b\u0438\u0435\u043d\u0442\u044b'}</h2>
          <p className="clients__subtitle">
            <span className="clients__subtitle-line" aria-hidden="true" />
            <span>{'\u0414\u043e\u0432\u0435\u0440\u0438\u0435. \u041e\u043f\u044b\u0442. \u0423\u0434\u043e\u0432\u043b\u0435\u0442\u0432\u043e\u0440\u0435\u043d\u0438\u0435.'}</span>
            <span className="clients__subtitle-line" aria-hidden="true" />
          </p>
          <p className="clients__copy">
            {
              '\u0414\u043b\u044f \u043d\u0430\u0441 \u0438\u0441\u0442\u0438\u043d\u043d\u0430\u044f \u0440\u043e\u0441\u043a\u043e\u0448\u044c \u2014 \u044d\u0442\u043e \u043d\u0435 \u0442\u043e\u043b\u044c\u043a\u043e \u0447\u0430\u0441\u044b, \u043d\u043e \u0438 \u0434\u043e\u0432\u0435\u0440\u0438\u0435 \u043d\u0430\u0448\u0438\u0445 \u043a\u043b\u0438\u0435\u043d\u0442\u043e\u0432. \u041a\u0430\u0436\u0434\u044b\u0439 \u043e\u0442\u0437\u044b\u0432 \u2014 \u044d\u0442\u043e \u0438\u0441\u0442\u043e\u0440\u0438\u044f, \u043a\u043e\u0442\u043e\u0440\u0430\u044f \u0432\u0434\u043e\u0445\u043d\u043e\u0432\u043b\u044f\u0435\u0442 \u043d\u0430\u0441 \u0441\u0442\u0430\u043d\u043e\u0432\u0438\u0442\u044c\u0441\u044f \u043b\u0443\u0447\u0448\u0435 \u043a\u0430\u0436\u0434\u044b\u0439 \u0434\u0435\u043d\u044c.'
            }
          </p>
        </div>

        <article className="clients__quote-card">
          <Icon name="quote" size={32} className="clients__quote-mark" />
          <p className="clients__quote-text">
            {
              '\u0411\u043b\u0430\u0433\u043e\u0434\u0430\u0440\u0438\u043c \u0437\u0430 \u0442\u043e, \u0447\u0442\u043e \u0432\u044b\u0431\u0438\u0440\u0430\u0435\u0442\u0435 CHRONOS \u0438 \u0441\u0442\u0430\u043d\u043e\u0432\u0438\u0442\u0435\u0441\u044c \u0447\u0430\u0441\u0442\u044c\u044e \u043d\u0430\u0448\u0435\u0433\u043e \u043f\u0443\u0442\u0438.'
            }
          </p>
          <img
            className="clients__signature"
            src="./assets/images/clients/signature.svg"
            alt=""
            loading="lazy"
          />
          <p className="clients__signature-label">{'\u041a\u043e\u043c\u0430\u043d\u0434\u0430 CHRONOS'}</p>
        </article>
      </div>

      <div className="clients__carousel container" data-reveal="up">
        <button
          type="button"
          className="clients__nav clients__nav--prev"
          aria-label="Previous reviews"
          ref={prevRef}
        >
          <Icon name="chevron-left" size={18} />
        </button>

        <Swiper
          className="clients__swiper"
          modules={[Autoplay, Navigation]}
          slidesPerView={1.15}
          spaceBetween={18}
          loop
          autoplay={{ delay: 7000, disableOnInteraction: false, pauseOnMouseEnter: true }}
          navigation={{
            prevEl: prevRef.current,
            nextEl: nextRef.current,
          }}
          onBeforeInit={(swiper) => {
            const navigation = swiper.params.navigation as NavigationOptions;
            navigation.prevEl = prevRef.current;
            navigation.nextEl = nextRef.current;
          }}
          onSwiper={bindNavigation}
          breakpoints={{
            680: { slidesPerView: 2.1 },
            980: { slidesPerView: 3.1 },
            1180: { slidesPerView: 4 },
          }}
        >
          {reviews.map((review) => (
            <SwiperSlide key={review.id}>
              <button type="button" className="clients__card" onClick={openReviews}>
                <div className="clients__card-top">
                  {review.avatar ? (
                    <img src={review.avatar} alt="" loading="lazy" />
                  ) : (
                    <InitialsAvatar name={review.name} size={48} />
                  )}
                  <div className="clients__card-meta">
                    <p className="clients__card-name">{review.name}</p>
                    <p className="clients__card-role">{review.role}</p>
                  </div>
                  <Icon name="quote" size={18} className="clients__card-quote" />
                </div>

                <div className="clients__card-stars" aria-label={`${review.rating} out of 5`}>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Icon
                      key={index}
                      name="star"
                      size={12}
                      className={index < review.rating ? 'is-filled' : 'is-empty'}
                    />
                  ))}
                </div>

                <p className="clients__card-text">{review.quote}</p>
              </button>
            </SwiperSlide>
          ))}
        </Swiper>

        <button
          type="button"
          className="clients__nav clients__nav--next"
          aria-label="Next reviews"
          ref={nextRef}
        >
          <Icon name="chevron-right" size={18} />
        </button>
      </div>

      <div className="clients__stats container" data-reveal="up">
        {STATS.map((stat) => (
          <div className="clients__stat" key={stat.label}>
            <span className="clients__stat-icon">
              <Icon name={stat.icon} size={18} />
            </span>
            <span className="clients__stat-value">
              <span data-count-to={stat.value} data-count-suffix={stat.suffix}>
                0{stat.suffix}
              </span>
            </span>
            <span className="clients__stat-label">{stat.label}</span>
          </div>
        ))}
      </div>

      <div className="clients__cta container" data-reveal="up">
        <button type="button" className="btn-outline" onClick={openReviews}>
          {'\u0427\u0438\u0442\u0430\u0442\u044c \u0432\u0441\u0435 \u043e\u0442\u0437\u044b\u0432\u044b'}
          <span className="arrow">
            <Icon name="arrow-right" size={16} />
          </span>
        </button>
      </div>

      <p className="clients__tagline container" data-reveal="up">
        <Icon name="shield" size={14} />
        <span>{'\u0414\u043e\u0432\u0435\u0440\u0438\u0435. \u041a\u0430\u0447\u0435\u0441\u0442\u0432\u043e. \u041d\u0430\u0432\u0441\u0435\u0433\u0434\u0430.'}</span>
      </p>
    </section>
  );
};
