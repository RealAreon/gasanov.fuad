const LANGUAGES = {
  uk: { code: 'UK', name: 'Українська' },
  en: { code: 'EN', name: 'English' },
  de: { code: 'DE', name: 'Deutsch' },
  fr: { code: 'FR', name: 'Français' },
  es: { code: 'ES', name: 'Español' },
  it: { code: 'IT', name: 'Italiano' },
  pl: { code: 'PL', name: 'Polski' },
  nl: { code: 'NL', name: 'Nederlands' },
  pt: { code: 'PT', name: 'Português' },
  ro: { code: 'RO', name: 'Română' },
  cs: { code: 'CS', name: 'Čeština' },
  hu: { code: 'HU', name: 'Magyar' },
  el: { code: 'EL', name: 'Ελληνικά' },
};

const STRINGS = {
  uk: {
    'logo.sub': 'Преміум Годинники',
    'nav.catalog': 'Каталог',
    'nav.classic': 'Класичні', 'nav.classic.desc': 'Вічна елегантність',
    'nav.sport': 'Спортивні', 'nav.sport.desc': 'Для активного життя',
    'nav.dress': 'Елегантні', 'nav.dress.desc': 'Витончений стиль',
    'nav.new': 'Нова колекція', 'nav.new.desc': 'Останні надходження',
    'nav.viewAll': 'Переглянути все →', 'nav.viewAllCatalog': 'Переглянути весь каталог',
    'search.title': 'Пошук годинників', 'search.placeholder': 'Введіть назву, бренд, стиль...', 'search.empty': 'Нічого не знайдено',
    'cart.title': 'Кошик', 'cart.empty': 'Ваш кошик порожній', 'cart.total': 'Разом:',
    'cart.checkout': 'Оформити замовлення', 'cart.continue': 'Продовжити покупки', 'cart.remove': 'Видалити',
    'product.addToCart': 'Додати в кошик', 'badge.new': 'Новинка', 'badge.sale': 'Акція',
    'footer.desc': 'Ексклюзивна колекція преміум годинників для цінителів справжньої якості та стилю.',
    'footer.nav': 'Навігація', 'footer.contacts': 'Контакти', 'footer.schedule': 'Графік роботи',
    'footer.hours': '24/7', 'footer.support24': 'Підтримка 24 години',
    'footer.freeDelivery': 'Безкоштовна доставка по Україні', 'footer.copyright': '© 2024 CHRONOS. Усі права захищені.',
    'footer.privacy': 'Політика конфіденційності', 'footer.cookies': 'Cookie',
    'footer.terms': 'Користувацька угода', 'footer.offer': 'Публічна оферта',
    'cookie.text': 'Ми використовуємо cookie для роботи сайту та покращення сервісу.',
    'cookie.more': 'Детальніше', 'cookie.accept': 'Прийняти',
    'hero.badge': 'Swiss Timepieces',
    'hero.title': 'Точність, яку відчувають.',
    'hero.text': 'Преміум-годинники для чоловіків, які обирають статус без зайвого шуму.',
    'hero.btn.collection': 'До колекції', 'hero.btn.new': 'Новинки',
    'stat.clients': 'клієнтів', 'stat.warranty': 'гарантії', 'stat.delivery': 'доставка',
    'stat.payment': 'Оплата', 'stat.paymentSub': 'при отриманні', 'stat.warrantyVal': '2 дні', 'stat.deliveryVal': '1-3 дні',
    'section.collection': 'Наша колекція', 'section.featured': 'Обрані <strong>Моделі</strong>',
    'section.viewAll': 'Переглянути всі моделі →', 'section.styles': 'Стилі', 'section.findStyle': 'Знайдіть Свій <strong>Стиль</strong>',
    'cat.classic': 'Класичні', 'cat.classic.desc': 'Вічний стиль та елегантність',
    'cat.sport': 'Спортивні', 'cat.sport.desc': 'Для активного способу життя',
    'cat.dress': 'Елегантні', 'cat.dress.desc': 'Для особливих подій',
    'section.reviews': 'Відгуки', 'section.clients': 'Наші <strong>Клієнти</strong>',
    'section.why': 'Чому обирають нас', 'section.trust': 'Довіра та <strong>Надійність</strong>',
    'trust.banner': 'Понад 5000+ задоволених клієнтів по всій Україні',
    'trust.quality': 'Гарантія 2 дні', 'trust.quality.desc': 'Гарантія та повернення протягом 2 днів після отримання',
    'trust.delivery': 'Безкоштовна доставка', 'trust.delivery.desc': 'По всій Україні через Нову Пошту',
    'trust.movement': 'Оригінальні механізми', 'trust.movement.desc': 'Швейцарські та японські механізми',
    'trust.fast': 'Швидка обробка', 'trust.fast.desc': 'Відправка протягом 24 годин',
    'trust.cod': 'Оплата при отриманні', 'trust.cod.desc': 'Перевірте товар перед оплатою',
    'trust.support': 'Підтримка 24 години', 'trust.support.desc': 'Консультації та допомога цілодобово',
    'catalog.title': 'Каталог', 'catalog.style': 'Стиль:', 'catalog.all': 'Усі',
    'catalog.sort': 'Сортування', 'catalog.models': 'моделей', 'catalog.clear': 'Скинути все', 'catalog.notFound': 'Нічого не знайдено',
    'catalog.price': 'Ціна', 'catalog.min': 'Мін', 'catalog.max': 'Макс', 'catalog.resetPrice': 'Скинути ціну',
    'catalog.activeFilters': 'Активні фільтри', 'catalog.removeFilter': 'Прибрати фільтр',
    'catalog.filters': 'Фільтри', 'catalog.quick': 'Швидко:', 'catalog.showResults': 'Показати',
    'catalog.collection': 'Колекція', 'catalog.material': 'Матеріал', 'catalog.movement': 'Механізм',
    'catalog.availability': 'Статус', 'catalog.loading': 'Оновлення…',
    'catalog.prev': 'Попередня', 'catalog.next': 'Наступна',
    'sort.economy': 'Спочатку економ клас', 'sort.luxury': 'Спочатку люкс клас', 'sort.new': 'Спочатку нова колекція', 'sort.old': 'Спочатку минула колекція',
    'lang.label': 'Мова',
    'wishlist.title': 'Обране', 'wishlist.empty': 'Список обраного порожній', 'wishlist.remove': 'Прибрати',
    'account.title': 'Акаунт',
    'marquee.1': 'Швейцарські механізми', 'marquee.2': 'Преміум якість', 'marquee.3': 'Безкоштовна доставка',
    'brand.label': 'Наша історія', 'brand.title': 'Мистецтво <strong>Часу</strong>',
    'brand.p1': 'CHRONOS — це більше, ніж магазин годинників. Це простір, де кожна модель обрана з увагою до деталей, якості механізму та характеру власника.',
    'brand.p2': 'Ми працюємо лише з перевіреними постачальниками. Гарантія та повернення — протягом 2 днів після отримання.',
    'brand.link': 'Дізнатися більше →',
    'faq.label': 'FAQ', 'faq.title': 'Часті <strong>Питання</strong>',
    'faq.q1': 'Яка гарантія на годинники?', 'faq.a1': 'Гарантія діє 2 дні з моменту отримання. Повернення за гарантією також можливе протягом 2 днів.',
    'faq.q2': 'Як здійснюється доставка?', 'faq.a2': 'Безкоштовна доставка Новою Поштою по всій Україні. Відправка протягом 24 годин після замовлення.',
    'faq.q3': 'Чи можна оплатити при отриманні?', 'faq.a3': 'Так, оплата при отриманні (накладений платіж). Ви можете перевірити товар перед оплатою.',
    'faq.q4': 'Чи оригінальні механізми?', 'faq.a4': 'Усі годинники оснащені швейцарськими або японськими механізмами найвищої якості.',
    'faq.q5': 'Який графік підтримки?', 'faq.a5': 'Підтримка працює 24 години на добу, 7 днів на тиждень.',
    'cta.label': 'Готові обрати?', 'cta.title': 'Ваш ідеальний <strong>годинник</strong> чекає',
    'cta.text': 'Перегляньте колекцію з 24+ моделями преміум-класу', 'cta.account': 'Створити акаунт',
    'page.homeTitle': 'CHRONOS | Преміум Годинники в Україні',
    'page.catalogTitle': 'Каталог | CHRONOS',
    'legal.label': 'Юридична інформація',
    'page.privacyTitle': 'Політика конфіденційності | CHRONOS',
    'legal.privacy.title': 'Політика конфіденційності',
    'legal.privacy.intro': 'Ця Політика конфіденційності пояснює, як CHRONOS збирає, використовує та захищає персональні дані користувачів сайту.',
    'legal.privacy.h1': '1. Які дані ми збираємо',
    'legal.privacy.p1': 'Ми можемо отримувати ім’я, номер телефону, адресу електронної пошти, адресу доставки та дані про замовлення, які ви надаєте добровільно.',
    'legal.privacy.h2': '2. Мета обробки',
    'legal.privacy.li1': 'оформлення та виконання замовлень;',
    'legal.privacy.li2': 'зв’язок щодо доставки та сервісу;',
    'legal.privacy.li3': 'покращення роботи сайту та підтримки клієнтів.',
    'legal.privacy.h3': '3. Зберігання та захист',
    'legal.privacy.p3': 'Ми вживаємо розумних заходів для захисту даних від несанкціонованого доступу. Дані не передаються третім особам, окрім випадків, необхідних для доставки та оплати.',
    'legal.privacy.h4': '4. Ваші права',
    'legal.privacy.p4Html': 'Ви можете звернутися щодо доступу, виправлення або видалення своїх даних за адресою <a href="mailto:areon.softer@gmail.com">areon.softer@gmail.com</a> або телефоном <a href="tel:+380930259157">+380 93 025 91 57</a>.',
    'legal.privacy.h5': '5. Контакти',
    'legal.privacy.p5Html': 'З питань конфіденційності пишіть на <a href="mailto:areon.softer@gmail.com">areon.softer@gmail.com</a>. Підтримка працює 24/7.',
    'page.cookiesTitle': 'Використання cookie | CHRONOS',
    'legal.cookies.title': 'Використання cookie',
    'legal.cookies.intro': 'Сайт CHRONOS використовує файли cookie та схожі технології для коректної роботи сервісу.',
    'legal.cookies.h1': '1. Що таке cookie',
    'legal.cookies.p1': 'Cookie — невеликі файли, які зберігаються у вашому браузері та допомагають сайту запам’ятовувати налаштування й стан кошика.',
    'legal.cookies.h2': '2. Які cookie ми використовуємо',
    'legal.cookies.li1': 'необхідні — для роботи кошика, обраного та базових функцій;',
    'legal.cookies.li2': 'функціональні — для збереження мови та згоди на cookie;',
    'legal.cookies.li3': 'аналітичні (за наявності) — для розуміння, як користувачі взаємодіють із сайтом.',
    'legal.cookies.h3': '3. Керування cookie',
    'legal.cookies.p3': 'Ви можете прийняти cookie через банер на сайті або змінити налаштування у своєму браузері. Відключення частини cookie може вплинути на роботу магазину.',
    'legal.cookies.h4': '4. Додаткова інформація',
    'legal.cookies.p4Html': 'Деталі щодо персональних даних — у <a href="privacy.html">Політиці конфіденційності</a>. Питання: <a href="mailto:areon.softer@gmail.com">areon.softer@gmail.com</a>.',
    'page.termsTitle': 'Користувацька угода | CHRONOS',
    'legal.terms.title': 'Користувацька угода',
    'legal.terms.intro': 'Користуючись сайтом CHRONOS, ви погоджуєтесь із цією Угодою.',
    'legal.terms.h1': '1. Загальні положення',
    'legal.terms.p1': 'Сайт надає інформацію про товари та можливість оформити замовлення преміум-годинників з доставкою по Україні.',
    'legal.terms.h2': '2. Обліковий запис',
    'legal.terms.p2': 'Користувач відповідає за достовірність даних, які вказує під час реєстрації чи оформлення замовлення.',
    'legal.terms.h3': '3. Замовлення та оплата',
    'legal.terms.p3': 'Ціни та наявність товарів можуть змінюватися. Підтвердження замовлення відбувається після зв’язку менеджера або автоматичного підтвердження на сайті. Доступна оплата при отриманні.',
    'legal.terms.h4': '4. Гарантія та повернення',
    'legal.terms.p4': 'Гарантія діє 2 дні з моменту отримання товару. Повернення за гарантією також можливе протягом 2 днів після отримання.',
    'legal.terms.h5': '5. Підтримка',
    'legal.terms.p5Html': 'Служба підтримки працює 24/7: <a href="tel:+380930259157">+380 93 025 91 57</a>, <a href="mailto:areon.softer@gmail.com">areon.softer@gmail.com</a>.',
    'legal.terms.h6': '6. Інші документи',
    'legal.terms.p6Html': 'Див. також <a href="offer.html">Публічну оферту</a>, <a href="privacy.html">Політику конфіденційності</a> та <a href="cookies.html">Використання cookie</a>.',
    'page.offerTitle': 'Публічна оферта | CHRONOS',
    'legal.offer.title': 'Публічна оферта',
    'legal.offer.intro': 'Цей документ є офіційною пропозицією (публічною офертою) інтернет-магазину CHRONOS укласти договір купівлі-продажу товарів дистанційним способом.',
    'legal.offer.h1': '1. Предмет оферти',
    'legal.offer.p1': 'Продавець пропонує Покупцю товари, розміщені в каталозі сайту, на умовах цієї оферти.',
    'legal.offer.h2': '2. Оформлення замовлення',
    'legal.offer.p2': 'Замовлення вважається прийнятим після його оформлення на сайті та/або підтвердження менеджером. Покупець зобов’язаний надати коректні контактні дані.',
    'legal.offer.h3': '3. Ціна та оплата',
    'legal.offer.p3': 'Ціна товару вказується на сайті. Оплата можлива при отриманні або іншим способом, погодженим із Продавцем.',
    'legal.offer.h4': '4. Доставка',
    'legal.offer.p4': 'Доставка здійснюється по Україні. Терміни та умови залежать від служби доставки та регіону отримувача.',
    'legal.offer.h5': '5. Гарантія та повернення',
    'legal.offer.p5': 'Гарантійний термін становить 2 дні з дати отримання товару. Повернення за гарантією здійснюється протягом 2 днів за умови збереження товарного вигляду та комплектації, якщо інше не передбачено законодавством України.',
    'legal.offer.h6': '6. Контакти продавця',
    'legal.offer.p6Html': 'Телефон: <a href="tel:+380930259157">+380 93 025 91 57</a><br>Email: <a href="mailto:areon.softer@gmail.com">areon.softer@gmail.com</a><br>Графік підтримки: 24/7',
  },
  en: {
    'logo.sub': 'Premium Watches', 'nav.catalog': 'Catalog',
    'nav.classic': 'Classic', 'nav.classic.desc': 'Timeless elegance', 'nav.sport': 'Sport', 'nav.sport.desc': 'Active lifestyle',
    'nav.dress': 'Dress', 'nav.dress.desc': 'Refined style', 'nav.new': 'New Collection', 'nav.new.desc': 'Latest arrivals',
    'nav.viewAll': 'View all →', 'nav.viewAllCatalog': 'View full catalog',
    'search.title': 'Search watches', 'search.placeholder': 'Enter name or brand...', 'search.empty': 'Nothing found',
    'cart.title': 'Cart', 'cart.empty': 'Your cart is empty', 'cart.total': 'Total:',
    'cart.checkout': 'Checkout', 'cart.continue': 'Continue shopping', 'cart.remove': 'Remove',
    'product.addToCart': 'Add to cart', 'badge.new': 'New', 'badge.sale': 'Sale',
    'footer.desc': 'Exclusive collection of premium watches for connoisseurs of true quality and style.',
    'footer.nav': 'Navigation', 'footer.contacts': 'Contacts', 'footer.schedule': 'Working hours',
    'footer.hours': '24/7', 'footer.support24': '24-hour support',
    'footer.freeDelivery': 'Free delivery across Ukraine', 'footer.copyright': '© 2024 CHRONOS. All rights reserved.',
    'footer.privacy': 'Privacy Policy', 'footer.cookies': 'Cookies',
    'footer.terms': 'User Agreement', 'footer.offer': 'Public Offer',
    'cookie.text': 'We use cookies to run the site and improve our service.',
    'cookie.more': 'Learn more', 'cookie.accept': 'Accept',
    'hero.badge': 'Swiss Timepieces',
    'hero.title': 'Precision you can feel.',
    'hero.text': 'Premium watches for men who choose status without the noise.',
    'hero.btn.collection': 'View collection', 'hero.btn.new': 'New arrivals',
    'stat.clients': 'clients', 'stat.warranty': 'warranty', 'stat.delivery': 'delivery',
    'stat.payment': 'Payment', 'stat.paymentSub': 'on delivery', 'stat.warrantyVal': '2 days', 'stat.deliveryVal': '1-3 days',
    'section.collection': 'Our collection', 'section.featured': 'Featured <strong>Models</strong>',
    'section.viewAll': 'View all models →', 'section.styles': 'Styles', 'section.findStyle': 'Find Your <strong>Style</strong>',
    'cat.classic': 'Classic', 'cat.classic.desc': 'Timeless style and elegance',
    'cat.sport': 'Sport', 'cat.sport.desc': 'For an active lifestyle', 'cat.dress': 'Dress', 'cat.dress.desc': 'For special occasions',
    'section.reviews': 'Reviews', 'section.clients': 'Our <strong>Clients</strong>',
    'section.why': 'Why choose us', 'section.trust': 'Trust & <strong>Reliability</strong>',
    'trust.banner': 'Over 5000+ satisfied clients across Ukraine',
    'trust.quality': '2-day warranty', 'trust.quality.desc': 'Warranty and returns within 2 days of delivery',
    'trust.delivery': 'Free delivery', 'trust.delivery.desc': 'Across Ukraine via Nova Poshta',
    'trust.movement': 'Original movements', 'trust.movement.desc': 'Swiss and Japanese movements',
    'trust.fast': 'Fast processing', 'trust.fast.desc': 'Shipped within 24 hours',
    'trust.cod': 'Pay on delivery', 'trust.cod.desc': 'Inspect before payment',
    'trust.support': '24-hour support', 'trust.support.desc': 'Help and consultation around the clock',
    'catalog.title': 'Catalog', 'catalog.style': 'Style:', 'catalog.all': 'All', 'catalog.sort': 'Sort by',
    'catalog.models': 'models', 'catalog.clear': 'Reset all', 'catalog.notFound': 'Nothing found',
    'catalog.price': 'Price', 'catalog.min': 'Min', 'catalog.max': 'Max', 'catalog.resetPrice': 'Reset price',
    'catalog.activeFilters': 'Active filters', 'catalog.removeFilter': 'Remove filter',
    'catalog.filters': 'Filters', 'catalog.quick': 'Quick:', 'catalog.showResults': 'Show results',
    'catalog.collection': 'Collection', 'catalog.material': 'Material', 'catalog.movement': 'Movement',
    'catalog.availability': 'Status', 'catalog.loading': 'Updating…',
    'catalog.prev': 'Previous', 'catalog.next': 'Next',
    'sort.economy': 'Economy first', 'sort.luxury': 'Luxury first', 'sort.new': 'New collection first', 'sort.old': 'Older collection first',
    'lang.label': 'Language',
    'wishlist.title': 'Wishlist', 'wishlist.empty': 'Your wishlist is empty', 'wishlist.remove': 'Remove',
    'account.title': 'Account',
    'marquee.1': 'Swiss Movements', 'marquee.2': 'Premium Quality', 'marquee.3': 'Free Delivery',
    'brand.label': 'Our story', 'brand.title': 'The Art of <strong>Time</strong>',
    'brand.p1': 'CHRONOS is more than a watch store. Every model is selected with attention to movement quality and the character of its owner.',
    'brand.p2': 'We work only with verified suppliers. Warranty and returns are available within 2 days of delivery.',
    'brand.link': 'Learn more →',
    'faq.label': 'FAQ', 'faq.title': 'Frequently <strong>Asked</strong>',
    'faq.q1': 'What warranty do watches have?', 'faq.a1': 'Warranty is valid for 2 days from delivery. Warranty returns are also available within 2 days.',
    'faq.q2': 'How is delivery handled?', 'faq.a2': 'Free Nova Poshta delivery across Ukraine. Shipped within 24 hours.',
    'faq.q3': 'Can I pay on delivery?', 'faq.a3': 'Yes, cash on delivery. Inspect the item before payment.',
    'faq.q4': 'Are movements original?', 'faq.a4': 'All watches feature Swiss or Japanese movements of the highest quality.',
    'faq.q5': 'What are support hours?', 'faq.a5': 'Support is available 24 hours a day, 7 days a week.',
    'cta.label': 'Ready to choose?', 'cta.title': 'Your perfect <strong>watch</strong> awaits',
    'cta.text': 'Browse 24+ premium models', 'cta.account': 'Create account',
    'page.homeTitle': 'CHRONOS | Premium Watches in Ukraine',
    'page.catalogTitle': 'Catalog | CHRONOS',
    'legal.label': 'Legal information',
    'page.privacyTitle': 'Privacy Policy | CHRONOS',
    'legal.privacy.title': 'Privacy Policy',
    'legal.privacy.intro': 'This Privacy Policy explains how CHRONOS collects, uses, and protects personal data of website users.',
    'legal.privacy.h1': '1. What data we collect',
    'legal.privacy.p1': 'We may receive your name, phone number, email address, delivery address, and order details that you provide voluntarily.',
    'legal.privacy.h2': '2. Purpose of processing',
    'legal.privacy.li1': 'placing and fulfilling orders;',
    'legal.privacy.li2': 'communication about delivery and service;',
    'legal.privacy.li3': 'improving the website and customer support.',
    'legal.privacy.h3': '3. Storage and protection',
    'legal.privacy.p3': 'We take reasonable measures to protect data from unauthorized access. Data is not shared with third parties except when required for delivery and payment.',
    'legal.privacy.h4': '4. Your rights',
    'legal.privacy.p4Html': 'You may request access to, correction, or deletion of your data at <a href="mailto:areon.softer@gmail.com">areon.softer@gmail.com</a> or by phone at <a href="tel:+380930259157">+380 93 025 91 57</a>.',
    'legal.privacy.h5': '5. Contacts',
    'legal.privacy.p5Html': 'For privacy questions, email <a href="mailto:areon.softer@gmail.com">areon.softer@gmail.com</a>. Support is available 24/7.',
    'page.cookiesTitle': 'Cookie Policy | CHRONOS',
    'legal.cookies.title': 'Cookie Policy',
    'legal.cookies.intro': 'The CHRONOS website uses cookies and similar technologies for proper service operation.',
    'legal.cookies.h1': '1. What cookies are',
    'legal.cookies.p1': 'Cookies are small files stored in your browser that help the site remember settings and cart state.',
    'legal.cookies.h2': '2. Which cookies we use',
    'legal.cookies.li1': 'essential — for cart, wishlist, and basic functions;',
    'legal.cookies.li2': 'functional — to save language and cookie consent;',
    'legal.cookies.li3': 'analytics (if enabled) — to understand how users interact with the site.',
    'legal.cookies.h3': '3. Managing cookies',
    'legal.cookies.p3': 'You can accept cookies via the site banner or change settings in your browser. Disabling some cookies may affect the store.',
    'legal.cookies.h4': '4. Additional information',
    'legal.cookies.p4Html': 'Details about personal data are in the <a href="privacy.html">Privacy Policy</a>. Questions: <a href="mailto:areon.softer@gmail.com">areon.softer@gmail.com</a>.',
    'page.termsTitle': 'User Agreement | CHRONOS',
    'legal.terms.title': 'User Agreement',
    'legal.terms.intro': 'By using the CHRONOS website, you agree to this Agreement.',
    'legal.terms.h1': '1. General provisions',
    'legal.terms.p1': 'The site provides product information and the ability to order premium watches with delivery across Ukraine.',
    'legal.terms.h2': '2. Account',
    'legal.terms.p2': 'The user is responsible for the accuracy of data provided during registration or checkout.',
    'legal.terms.h3': '3. Orders and payment',
    'legal.terms.p3': 'Prices and availability may change. Order confirmation happens after manager contact or automatic confirmation on the site. Payment on delivery is available.',
    'legal.terms.h4': '4. Warranty and returns',
    'legal.terms.p4': 'Warranty is valid for 2 days from receipt. Warranty returns are also available within 2 days of receipt.',
    'legal.terms.h5': '5. Support',
    'legal.terms.p5Html': 'Support is available 24/7: <a href="tel:+380930259157">+380 93 025 91 57</a>, <a href="mailto:areon.softer@gmail.com">areon.softer@gmail.com</a>.',
    'legal.terms.h6': '6. Other documents',
    'legal.terms.p6Html': 'See also the <a href="offer.html">Public Offer</a>, <a href="privacy.html">Privacy Policy</a>, and <a href="cookies.html">Cookie Policy</a>.',
    'page.offerTitle': 'Public Offer | CHRONOS',
    'legal.offer.title': 'Public Offer',
    'legal.offer.intro': 'This document is the official proposal (public offer) of the CHRONOS online store to conclude a distance sale contract.',
    'legal.offer.h1': '1. Subject of the offer',
    'legal.offer.p1': 'The Seller offers the Buyer goods listed in the site catalog under the terms of this offer.',
    'legal.offer.h2': '2. Placing an order',
    'legal.offer.p2': 'An order is accepted after it is placed on the site and/or confirmed by a manager. The Buyer must provide correct contact details.',
    'legal.offer.h3': '3. Price and payment',
    'legal.offer.p3': 'The product price is shown on the site. Payment is possible on delivery or by another method agreed with the Seller.',
    'legal.offer.h4': '4. Delivery',
    'legal.offer.p4': 'Delivery is provided across Ukraine. Timing and terms depend on the courier service and the recipient’s region.',
    'legal.offer.h5': '5. Warranty and returns',
    'legal.offer.p5': 'The warranty period is 2 days from the date of receipt. Warranty returns are available within 2 days if the product appearance and completeness are preserved, unless otherwise required by Ukrainian law.',
    'legal.offer.h6': '6. Seller contacts',
    'legal.offer.p6Html': 'Phone: <a href="tel:+380930259157">+380 93 025 91 57</a><br>Email: <a href="mailto:areon.softer@gmail.com">areon.softer@gmail.com</a><br>Support hours: 24/7',
  },
  de: {
    'logo.sub': 'Premium Uhren', 'nav.catalog': 'Katalog', 'nav.classic': 'Klassisch', 'nav.classic.desc': 'Zeitlose Eleganz',
    'nav.sport': 'Sport', 'nav.sport.desc': 'Aktiver Lebensstil', 'nav.dress': 'Elegant', 'nav.dress.desc': 'Feiner Stil',
    'nav.new': 'Neue Kollektion', 'nav.new.desc': 'Neueste Artikel', 'nav.viewAll': 'Alle ansehen →', 'nav.viewAllCatalog': 'Gesamten Katalog ansehen',
    'search.title': 'Uhren suchen', 'search.placeholder': 'Name oder Marke eingeben...', 'search.empty': 'Nichts gefunden',
    'cart.title': 'Warenkorb', 'cart.empty': 'Ihr Warenkorb ist leer', 'cart.total': 'Gesamt:',
    'cart.checkout': 'Zur Kasse', 'cart.continue': 'Weiter einkaufen', 'cart.remove': 'Entfernen',
    'product.addToCart': 'In den Warenkorb', 'badge.new': 'Neu', 'badge.sale': 'Aktion',
    'footer.desc': 'Exklusive Kollektion Premium-Uhren für Kenner echter Qualität und Stil.',
    'footer.nav': 'Navigation', 'footer.contacts': 'Kontakt', 'footer.schedule': 'Öffnungszeiten',
    'footer.freeDelivery': 'Kostenlose Lieferung in der Ukraine', 'footer.copyright': '© 2024 CHRONOS. Alle Rechte vorbehalten.',
    'footer.privacy': 'Datenschutz', 'footer.cookies': 'Cookies',
    'footer.terms': 'Nutzungsbedingungen', 'footer.offer': 'Öffentliches Angebot',
    'footer.hours': '24/7', 'footer.support24': 'Support rund um die Uhr',
    'cookie.text': 'Wir verwenden Cookies für den Betrieb der Website und zur Verbesserung des Services.',
    'cookie.more': 'Mehr erfahren', 'cookie.accept': 'Akzeptieren',
    'hero.badge': 'Swiss Timepieces', 'hero.title': 'Präzision, die man spürt.',
    'hero.text': 'Premium-Uhren für Männer, die Status ohne Lärm wählen.',
    'hero.btn.collection': 'Zur Kollektion', 'hero.btn.new': 'Neuheiten',
    'stat.clients': 'Kunden', 'stat.warranty': 'Garantie', 'stat.delivery': 'Lieferung', 'stat.payment': 'Zahlung', 'stat.paymentSub': 'bei Erhalt',
    'stat.warrantyVal': '1 Jahr', 'stat.deliveryVal': '1-3 Tage',
    'section.collection': 'Unsere Kollektion', 'section.featured': 'Ausgewählte <strong>Modelle</strong>',
    'section.viewAll': 'Alle Modelle ansehen →', 'section.styles': 'Stile', 'section.findStyle': 'Finden Sie Ihren <strong>Stil</strong>',
    'cat.classic': 'Klassisch', 'cat.classic.desc': 'Zeitloser Stil', 'cat.sport': 'Sport', 'cat.sport.desc': 'Aktiver Lebensstil',
    'cat.dress': 'Elegant', 'cat.dress.desc': 'Für besondere Anlässe',
    'section.reviews': 'Bewertungen', 'section.clients': 'Unsere <strong>Kunden</strong>',
    'section.why': 'Warum wir', 'section.trust': 'Vertrauen & <strong>Zuverlässigkeit</strong>',
    'trust.banner': 'Über 5000+ zufriedene Kunden in der Ukraine',
    'trust.quality': 'Qualitätsgarantie', 'trust.quality.desc': '12 Monate offizielle Garantie',
    'trust.delivery': 'Kostenlose Lieferung', 'trust.delivery.desc': 'In der gesamten Ukraine',
    'trust.movement': 'Originalwerke', 'trust.movement.desc': 'Schweizer und japanische Werke',
    'trust.fast': 'Schnelle Bearbeitung', 'trust.fast.desc': 'Versand innerhalb von 24 Stunden',
    'trust.cod': 'Zahlung bei Erhalt', 'trust.cod.desc': 'Prüfen Sie vor der Zahlung',
    'trust.support': '24/7 Support', 'trust.support.desc': 'Immer für Beratung erreichbar',
    'catalog.title': 'Katalog', 'catalog.style': 'Stil:', 'catalog.all': 'Alle', 'catalog.sort': 'Sortierung',
    'catalog.models': 'Modelle', 'catalog.clear': 'Filter löschen', 'catalog.notFound': 'Nichts gefunden',
    'sort.economy': 'Günstig zuerst', 'sort.luxury': 'Luxus zuerst', 'sort.new': 'Neue Kollektion', 'sort.old': 'Ältere Kollektion',
    'lang.label': 'Sprache',
    'wishlist.title': 'Wunschliste', 'wishlist.empty': 'Ihre Wunschliste ist leer', 'wishlist.remove': 'Entfernen',
    'account.title': 'Konto',
    'marquee.1': 'Schweizer Werke', 'marquee.2': 'Premium Qualität', 'marquee.3': 'Kostenlose Lieferung',
    'brand.label': 'Unsere Geschichte', 'brand.title': 'Die Kunst der <strong>Zeit</strong>',
    'brand.p1': 'CHRONOS ist mehr als ein Uhrenshop. Jedes Modell wird mit Blick auf Qualität und Charakter ausgewählt.',
    'brand.p2': 'Wir arbeiten nur mit geprüften Lieferanten und bieten offizielle Garantie.',
    'brand.link': 'Mehr erfahren →',
    'faq.label': 'FAQ', 'faq.title': 'Häufige <strong>Fragen</strong>',
    'faq.q1': 'Welche Garantie?', 'faq.a1': '12 Monate offizielle Garantie auf alle Modelle.',
    'faq.q2': 'Wie erfolgt die Lieferung?', 'faq.a2': 'Kostenlose Lieferung in der gesamten Ukraine innerhalb von 24 Stunden.',
    'faq.q3': 'Zahlung bei Erhalt?', 'faq.a3': 'Ja, Nachnahme. Prüfen Sie vor der Zahlung.',
    'faq.q4': 'Originalwerke?', 'faq.a4': 'Schweizer und japanische Werke höchster Qualität.',
    'cta.label': 'Bereit zu wählen?', 'cta.title': 'Ihre perfekte <strong>Uhr</strong> wartet',
    'cta.text': '24+ Premium-Modelle entdecken', 'cta.account': 'Konto erstellen',
  },
  fr: {
    'logo.sub': 'Montres Premium', 'nav.catalog': 'Catalogue', 'nav.classic': 'Classiques', 'nav.classic.desc': 'Élégance intemporelle',
    'nav.sport': 'Sportives', 'nav.sport.desc': 'Vie active', 'nav.dress': 'Élégantes', 'nav.dress.desc': 'Style raffiné',
    'nav.new': 'Nouvelle collection', 'nav.new.desc': 'Dernières arrivées', 'nav.viewAll': 'Tout voir →', 'nav.viewAllCatalog': 'Voir tout le catalogue',
    'cart.title': 'Panier', 'cart.empty': 'Votre panier est vide', 'cart.total': 'Total:', 'cart.checkout': 'Commander', 'cart.continue': 'Continuer les achats', 'cart.remove': 'Supprimer',
    'product.addToCart': 'Ajouter au panier', 'badge.new': 'Nouveau', 'badge.sale': 'Promo',
    'hero.badge': 'Swiss Timepieces', 'hero.title': 'La précision que l’on ressent.',
    'hero.text': 'Montres premium pour ceux qui choisissent le statut sans bruit.',
    'hero.btn.collection': 'Voir la collection', 'hero.btn.new': 'Nouveautés',
    'catalog.title': 'Catalogue', 'catalog.all': 'Tous', 'catalog.sort': 'Tri', 'catalog.models': 'modèles',
    'sort.economy': 'Économique d\'abord', 'sort.luxury': 'Luxe d\'abord', 'sort.new': 'Nouvelle collection', 'sort.old': 'Ancienne collection',
    'lang.label': 'Langue', 'search.title': 'Rechercher des montres', 'search.placeholder': 'Nom ou marque...', 'search.empty': 'Rien trouvé',
    'footer.nav': 'Navigation', 'footer.contacts': 'Contacts', 'footer.schedule': 'Horaires',
    'section.collection': 'Notre collection', 'section.featured': 'Modèles <strong>sélectionnés</strong>',
    'product.addToCart': 'Ajouter au panier',
  },
  es: {
    'logo.sub': 'Relojes Premium', 'nav.catalog': 'Catálogo', 'nav.classic': 'Clásicos', 'nav.sport': 'Deportivos', 'nav.dress': 'Elegantes',
    'nav.viewAll': 'Ver todo →', 'cart.title': 'Carrito', 'cart.checkout': 'Finalizar pedido', 'cart.continue': 'Seguir comprando',
    'product.addToCart': 'Añadir al carrito', 'badge.new': 'Nuevo', 'badge.sale': 'Oferta',
    'hero.badge': 'Swiss Timepieces', 'hero.title': 'Precisión que se siente.',
    'hero.text': 'Relojes premium para quienes eligen estatus sin ruido.',
    'hero.btn.collection': 'Ver colección', 'hero.btn.new': 'Novedades',
    'catalog.title': 'Catálogo', 'catalog.all': 'Todos', 'catalog.sort': 'Ordenar', 'catalog.models': 'modelos',
    'sort.economy': 'Económico primero', 'sort.luxury': 'Lujo primero', 'sort.new': 'Nueva colección', 'sort.old': 'Colección anterior',
    'lang.label': 'Idioma', 'search.title': 'Buscar relojes',
  },
  it: {
    'logo.sub': 'Orologi Premium', 'nav.catalog': 'Catalogo', 'nav.classic': 'Classici', 'nav.sport': 'Sportivi', 'nav.dress': 'Eleganti',
    'cart.title': 'Carrello', 'cart.checkout': 'Ordina', 'cart.continue': 'Continua acquisti',
    'product.addToCart': 'Aggiungi al carrello', 'badge.new': 'Novità', 'badge.sale': 'Saldi',
    'hero.badge': 'Swiss Timepieces', 'hero.title': 'Precisione che si sente.',
    'hero.text': 'Orologi premium per chi sceglie lo status senza rumore.',
    'hero.btn.collection': 'Vedi collezione', 'hero.btn.new': 'Novità',
    'catalog.title': 'Catalogo', 'catalog.all': 'Tutti', 'catalog.sort': 'Ordina', 'catalog.models': 'modelli',
    'lang.label': 'Lingua',
  },
  pl: {
    'logo.sub': 'Zegarki Premium', 'nav.catalog': 'Katalog', 'nav.classic': 'Klasyczne', 'nav.sport': 'Sportowe', 'nav.dress': 'Eleganckie',
    'cart.title': 'Koszyk', 'cart.checkout': 'Zamów', 'cart.continue': 'Kontynuuj zakupy',
    'product.addToCart': 'Dodaj do koszyka', 'badge.new': 'Nowość', 'badge.sale': 'Promocja',
    'hero.badge': 'Swiss Timepieces', 'hero.title': 'Precyzja, którą czuć.',
    'hero.text': 'Zegarki premium dla tych, którzy wybierają status bez zbędnego hałasu.',
    'hero.btn.collection': 'Do kolekcji', 'hero.btn.new': 'Nowości',
    'catalog.title': 'Katalog', 'catalog.all': 'Wszystkie', 'catalog.sort': 'Sortuj', 'catalog.models': 'modeli',
    'lang.label': 'Język',
  },
  nl: {
    'logo.sub': 'Premium Horloges', 'nav.catalog': 'Catalogus', 'nav.classic': 'Klassiek', 'nav.sport': 'Sport', 'nav.dress': 'Elegant',
    'cart.title': 'Winkelwagen', 'cart.checkout': 'Afrekenen', 'cart.continue': 'Verder winkelen',
    'product.addToCart': 'In winkelwagen', 'badge.new': 'Nieuw', 'badge.sale': 'Actie',
    'catalog.title': 'Catalogus', 'catalog.all': 'Alle', 'catalog.sort': 'Sorteren', 'catalog.models': 'modellen',
    'lang.label': 'Taal',
  },
  pt: {
    'logo.sub': 'Relógios Premium', 'nav.catalog': 'Catálogo', 'nav.classic': 'Clássicos', 'nav.sport': 'Desportivos', 'nav.dress': 'Elegantes',
    'cart.title': 'Carrinho', 'cart.checkout': 'Finalizar', 'cart.continue': 'Continuar compras',
    'product.addToCart': 'Adicionar ao carrinho', 'badge.new': 'Novo', 'badge.sale': 'Promoção',
    'catalog.title': 'Catálogo', 'catalog.all': 'Todos', 'catalog.sort': 'Ordenar', 'catalog.models': 'modelos',
    'lang.label': 'Idioma',
  },
  ro: {
    'logo.sub': 'Ceasuri Premium', 'nav.catalog': 'Catalog', 'nav.classic': 'Clasice', 'nav.sport': 'Sport', 'nav.dress': 'Elegante',
    'cart.title': 'Coș', 'cart.checkout': 'Finalizează', 'cart.continue': 'Continuă cumpărăturile',
    'product.addToCart': 'Adaugă în coș', 'badge.new': 'Nou', 'badge.sale': 'Reducere',
    'catalog.title': 'Catalog', 'catalog.all': 'Toate', 'catalog.sort': 'Sortare', 'catalog.models': 'modele',
    'lang.label': 'Limbă',
  },
  cs: {
    'logo.sub': 'Prémiové Hodinky', 'nav.catalog': 'Katalog', 'nav.classic': 'Klasické', 'nav.sport': 'Sportovní', 'nav.dress': 'Elegantní',
    'cart.title': 'Košík', 'cart.checkout': 'Objednat', 'cart.continue': 'Pokračovat v nákupu',
    'product.addToCart': 'Přidat do košíku', 'badge.new': 'Novinka', 'badge.sale': 'Akce',
    'catalog.title': 'Katalog', 'catalog.all': 'Vše', 'catalog.sort': 'Řazení', 'catalog.models': 'modelů',
    'lang.label': 'Jazyk',
  },
  hu: {
    'logo.sub': 'Prémium Órák', 'nav.catalog': 'Katalógus', 'nav.classic': 'Klasszikus', 'nav.sport': 'Sport', 'nav.dress': 'Elegáns',
    'cart.title': 'Kosár', 'cart.checkout': 'Rendelés', 'cart.continue': 'Vásárlás folytatása',
    'product.addToCart': 'Kosárba', 'badge.new': 'Új', 'badge.sale': 'Akció',
    'catalog.title': 'Katalógus', 'catalog.all': 'Összes', 'catalog.sort': 'Rendezés', 'catalog.models': 'modell',
    'lang.label': 'Nyelv',
  },
  el: {
    'logo.sub': 'Premium Ρολόγια', 'nav.catalog': 'Κατάλογος', 'nav.classic': 'Κλασικά', 'nav.sport': 'Αθλητικά', 'nav.dress': 'Κομψά',
    'cart.title': 'Καλάθι', 'cart.checkout': 'Ολοκλήρωση', 'cart.continue': 'Συνέχεια αγορών',
    'product.addToCart': 'Προσθήκη στο καλάθι', 'badge.new': 'Νέο', 'badge.sale': 'Προσφορά',
    'catalog.title': 'Κατάλογος', 'catalog.all': 'Όλα', 'catalog.sort': 'Ταξινόμηση', 'catalog.models': 'μοντέλα',
    'lang.label': 'Γλώσσα',
  },
};

function getLang() {
  return localStorage.getItem('chronos-lang') || 'uk';
}

function t(key) {
  const lang = getLang();
  return STRINGS[lang]?.[key] || STRINGS.en?.[key] || STRINGS.uk[key] || key;
}

function setLang(lang) {
  if (!LANGUAGES[lang]) return;
  localStorage.setItem('chronos-lang', lang);
  document.documentElement.lang = lang;
  applyTranslations();
  window.dispatchEvent(new CustomEvent('lang-changed', { detail: { lang } }));
}

function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.dataset.i18n;
    if (key) el.textContent = t(key);
  });
  document.querySelectorAll('[data-i18n-html]').forEach((el) => {
    const key = el.dataset.i18nHtml;
    if (key) el.innerHTML = t(key);
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
    const key = el.dataset.i18nPlaceholder;
    if (key) el.placeholder = t(key);
  });
  document.querySelectorAll('[data-i18n-alt]').forEach((el) => {
    const key = el.dataset.i18nAlt;
    if (key) el.setAttribute('alt', t(key));
  });
  document.querySelectorAll('select option[data-i18n]').forEach((el) => {
    el.textContent = t(el.dataset.i18n);
  });
  const titleKey = document.body.dataset.i18nTitle;
  if (titleKey) document.title = t(titleKey);
  if (typeof updateSortDropdownUI === 'function') updateSortDropdownUI();
}

function langSwitcherHtml(variant = 'desktop') {
  const current = getLang();
  const btnId = variant === 'mobile' ? 'lang-btn-mobile' : 'lang-btn';
  const dropdownId = variant === 'mobile' ? 'lang-dropdown-mobile' : 'lang-dropdown';
  const options = Object.entries(LANGUAGES)
    .map(([code, meta]) => `<button type="button" class="lang-option${code === current ? ' active' : ''}" data-lang="${code}">${meta.name}</button>`)
    .join('');
  return `
    <div class="lang-switcher">
      <button type="button" class="lang-btn" id="${btnId}" aria-label="${t('lang.label')}" aria-expanded="false">
        <span class="lang-code">${LANGUAGES[current].code}</span>
      </button>
      <div class="lang-dropdown" id="${dropdownId}">${options}</div>
    </div>`;
}

let langSwitcherReady = false;

function setupLangSwitcher() {
  if (langSwitcherReady) return;
  langSwitcherReady = true;

  document.addEventListener('click', (e) => {
    const langBtn = e.target.closest('.lang-btn');
    const langOpt = e.target.closest('.lang-option[data-lang]');
    const switcher = e.target.closest('.lang-switcher');
    const dropdown = switcher?.querySelector('.lang-dropdown');

    if (langBtn) {
      e.stopPropagation();
      document.querySelectorAll('.lang-dropdown.open').forEach((dd) => {
        if (dd !== dropdown) {
          dd.classList.remove('open');
          dd.closest('.lang-switcher')?.querySelector('.lang-btn')?.setAttribute('aria-expanded', 'false');
        }
      });
      const isOpen = dropdown?.classList.toggle('open');
      langBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      return;
    }

    if (langOpt && langOpt.closest('.lang-dropdown')) {
      e.stopPropagation();
      const lang = langOpt.dataset.lang;
      if (lang && lang !== getLang()) setLang(lang);
      document.querySelectorAll('.lang-dropdown').forEach((dd) => dd.classList.remove('open'));
      document.querySelectorAll('.lang-btn').forEach((btn) => btn.setAttribute('aria-expanded', 'false'));
      return;
    }

    if (!e.target.closest('.lang-switcher')) {
      document.querySelectorAll('.lang-dropdown').forEach((dd) => dd.classList.remove('open'));
      document.querySelectorAll('.lang-btn').forEach((btn) => btn.setAttribute('aria-expanded', 'false'));
    }
  });
}

function updateLangSwitcherUI() {
  const current = getLang();
  document.querySelectorAll('.lang-code').forEach((codeEl) => {
    codeEl.textContent = LANGUAGES[current].code;
  });
  document.querySelectorAll('.lang-option[data-lang]').forEach((opt) => {
    opt.classList.toggle('active', opt.dataset.lang === current);
  });
  document.querySelectorAll('.lang-btn').forEach((btn) => {
    btn.setAttribute('aria-label', t('lang.label'));
  });
}

window.t = t;
window.getLang = getLang;
window.setLang = setLang;
window.applyTranslations = applyTranslations;
window.langSwitcherHtml = langSwitcherHtml;
window.setupLangSwitcher = setupLangSwitcher;
window.updateLangSwitcherUI = updateLangSwitcherUI;

document.addEventListener('DOMContentLoaded', () => {
  document.documentElement.lang = getLang();
  setupLangSwitcher();
  applyTranslations();
});
