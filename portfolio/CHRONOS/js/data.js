const STYLE_LABELS = {"classic":"Класичні","sport":"Спортивні","dress":"Елегантні"};
const WATCHES = [
  {
    "id": "datejust-silver",
    "name": "Datejust 41 Silver",
    "brand": "Royal Crown",
    "price": 38999,
    "description": "Класичний годинник з срібним циферблатом",
    "longDescription": "Datejust 41 - це втілення класичного стилю. Сріблястий циферблат з римськими цифрами, функція швидкої зміни дати та браслет Jubilee роблять цей годинник ідеальним для будь-якої нагоди.",
    "images": [
      "public/media/products/photo-1587836374828-4dbafa94cf0e.webp",
      "public/media/products/photo-1548171915-e79a380a2a4b.webp"
    ],
    "style": "classic",
    "features": [
      "Функція дати",
      "Сапфірове скло",
      "Браслет Jubilee",
      "Хронометр COSC"
    ],
    "specifications": {
      "case": "Oystersteel та біле золото",
      "movement": "Автоматичний калібр 3235",
      "waterResistance": "100 метрів",
      "diameter": "41 мм",
      "thickness": "11.8 мм",
      "bracelet": "Jubilee, Oystersteel"
    },
    "inStock": true
  },
  {
    "id": "datejust-blue",
    "name": "Datejust 41 Blue",
    "brand": "Royal Crown",
    "price": 42999,
    "description": "Елегантний годинник з синім циферблатом",
    "longDescription": "Datejust 41 з глибоким синім циферблатом - це символ вишуканості. Римські цифри з білого золота та браслет Oyster підкреслюють статус власника.",
    "images": [
      "public/media/products/photo-1548171915-e79a380a2a4b.webp",
      "public/media/products/photo-1587836374828-4dbafa94cf0e.webp"
    ],
    "style": "classic",
    "features": [
      "Функція дати",
      "Сапфірове скло",
      "Браслет Oyster",
      "Хронометр COSC"
    ],
    "specifications": {
      "case": "Oystersteel та біле золото",
      "movement": "Автоматичний калібр 3235",
      "waterResistance": "100 метрів",
      "diameter": "41 мм",
      "thickness": "11.8 мм",
      "bracelet": "Oyster, Oystersteel"
    },
    "inStock": true,
    "isNew": true
  },
  {
    "id": "datejust-champagne",
    "name": "Datejust 36 Champagne",
    "brand": "Royal Crown",
    "price": 35999,
    "originalPrice": 39999,
    "description": "Унікальний шампанський циферблат",
    "longDescription": "Datejust 36 з шампанським циферблатом - це класика, яка ніколи не виходить з моди. Ідеальний розмір для будь-якого зап'ястя.",
    "images": [
      "public/media/products/photo-1523170335258-f5ed11844a49.webp",
      "public/media/products/photo-1587836374828-4dbafa94cf0e.webp"
    ],
    "style": "classic",
    "features": [
      "Функція дати",
      "Сапфірове скло",
      "Браслет Jubilee",
      "Автопідзавод"
    ],
    "specifications": {
      "case": "Oystersteel та жовте золото",
      "movement": "Автоматичний калібр 3235",
      "waterResistance": "100 метрів",
      "diameter": "36 мм",
      "thickness": "11.6 мм",
      "bracelet": "Jubilee, Oystersteel та золото"
    },
    "inStock": true
  },
  {
    "id": "oyster-perpetual-black",
    "name": "Oyster Perpetual Black",
    "brand": "Royal Crown",
    "price": 28999,
    "description": "Мінімалістичний дизайн з чорним циферблатом",
    "longDescription": "Oyster Perpetual з чорним циферблатом - це втілення мінімалізму та елегантності. Чисті лінії та відсутність зайвих деталей.",
    "images": [
      "public/media/products/photo-1614164185128-e4ec99c436d7.webp",
      "public/media/products/photo-1622434641406-a158123450f9.webp"
    ],
    "style": "classic",
    "features": [
      "Автоматичний механізм",
      "Сапфірове скло",
      "Водонепроникність",
      "Хронометр COSC"
    ],
    "specifications": {
      "case": "Oystersteel",
      "movement": "Автоматичний калібр 3230",
      "waterResistance": "100 метрів",
      "diameter": "41 мм",
      "thickness": "11.5 мм",
      "bracelet": "Oyster, Oystersteel"
    },
    "inStock": true
  },
  {
    "id": "oyster-perpetual-green",
    "name": "Oyster Perpetual Green",
    "brand": "Royal Crown",
    "price": 31999,
    "description": "Яскравий зелений циферблат",
    "longDescription": "Oyster Perpetual з яскравим зеленим циферблатом - це сміливий вибір для тих, хто цінує індивідуальність.",
    "images": [
      "public/media/products/photo-1627037558426-c2d07beda3af.webp",
      "public/media/products/photo-1614164185128-e4ec99c436d7.webp"
    ],
    "style": "classic",
    "features": [
      "Автоматичний механізм",
      "Сапфірове скло",
      "Водонепроникність",
      "Унікальний колір"
    ],
    "specifications": {
      "case": "Oystersteel",
      "movement": "Автоматичний калібр 3230",
      "waterResistance": "100 метрів",
      "diameter": "41 мм",
      "thickness": "11.5 мм",
      "bracelet": "Oyster, Oystersteel"
    },
    "inStock": true,
    "isNew": true
  },
  {
    "id": "air-king",
    "name": "Air-King 40",
    "brand": "Royal Crown",
    "price": 26999,
    "description": "Авіаційна спадщина",
    "longDescription": "Air-King - це данина поваги першопрохідцям авіації. Чіткий циферблат з великими цифрами забезпечує ідеальну читабельність.",
    "images": [
      "public/media/products/photo-1526045431048-f857369baa09.webp",
      "public/media/products/photo-1533139502658-0198f920d8e8.webp"
    ],
    "style": "classic",
    "features": [
      "Авіаційний стиль",
      "Великі цифри",
      "Антимагнітний",
      "Chromalight"
    ],
    "specifications": {
      "case": "Oystersteel",
      "movement": "Автоматичний калібр 3230",
      "waterResistance": "100 метрів",
      "diameter": "40 мм",
      "thickness": "11.5 мм",
      "bracelet": "Oyster, Oystersteel"
    },
    "inStock": true
  },
  {
    "id": "daytona-black",
    "name": "Cosmograph Daytona Black",
    "brand": "Royal Crown",
    "price": 89999,
    "originalPrice": 99999,
    "description": "Легендарний хронограф для справжніх цінителів",
    "longDescription": "Cosmograph Daytona - це годинник для тих, хто цінує швидкість та точність. Тахиметрична шкала, три лічильники хронографа та водонепроникний корпус створені для перемог.",
    "images": [
      "public/media/products/photo-1606744824163-985d376605aa.webp",
      "public/media/products/photo-1612817159949-195b6eb9e31a.webp"
    ],
    "style": "sport",
    "features": [
      "Хронограф",
      "Тахиметрична шкала",
      "Керамічний безель",
      "72-годинний запас ходу"
    ],
    "specifications": {
      "case": "18К біле золото",
      "movement": "Автоматичний калібр 4130",
      "waterResistance": "100 метрів",
      "diameter": "40 мм",
      "thickness": "12.2 мм",
      "bracelet": "Oysterflex"
    },
    "inStock": true
  },
  {
    "id": "daytona-white",
    "name": "Cosmograph Daytona White",
    "brand": "Royal Crown",
    "price": 85999,
    "description": "Хронограф з білим циферблатом",
    "longDescription": "Cosmograph Daytona з білим циферблатом - це контраст та читабельність. Класичний вигляд для перегонів та повсякденного життя.",
    "images": [
      "public/media/products/photo-1612817159949-195b6eb9e31a.webp",
      "public/media/products/photo-1606744824163-985d376605aa.webp"
    ],
    "style": "sport",
    "features": [
      "Хронограф",
      "Тахиметрична шкала",
      "Керамічний безель",
      "72-годинний запас ходу"
    ],
    "specifications": {
      "case": "Oystersteel",
      "movement": "Автоматичний калібр 4130",
      "waterResistance": "100 метрів",
      "diameter": "40 мм",
      "thickness": "12.2 мм",
      "bracelet": "Oyster, Oystersteel"
    },
    "inStock": true,
    "isNew": true
  },
  {
    "id": "gmt-master-pepsi",
    "name": "GMT-Master II Pepsi",
    "brand": "Royal Crown",
    "price": 67999,
    "description": "Культовий годинник мандрівників з двокольоровим безелем",
    "longDescription": "GMT-Master II з легендарним червоно-синім безелем \"Pepsi\" - ідеальний супутник для подорожей. Відстежуйте час у двох часових поясах одночасно.",
    "images": [
      "public/media/products/photo-1594534475808-b18fc33b045e.webp",
      "public/media/products/photo-1639006410127-2d8a4de35c2a.webp"
    ],
    "style": "sport",
    "features": [
      "Два часові пояси",
      "Керамічний безель",
      "24-годинна стрілка",
      "Швидка зміна дати"
    ],
    "specifications": {
      "case": "Oystersteel",
      "movement": "Автоматичний калібр 3285",
      "waterResistance": "100 метрів",
      "diameter": "40 мм",
      "thickness": "12 мм",
      "bracelet": "Jubilee, Oystersteel"
    },
    "inStock": true
  },
  {
    "id": "gmt-master-batman",
    "name": "GMT-Master II Batman",
    "brand": "Royal Crown",
    "price": 72999,
    "description": "Чорно-синій безель для нічних мандрівників",
    "longDescription": "GMT-Master II Batman з чорно-синім безелем - це стриманість та елегантність для тих, хто подорожує вночі.",
    "images": [
      "public/media/products/photo-1639006410127-2d8a4de35c2a.webp",
      "public/media/products/photo-1594534475808-b18fc33b045e.webp"
    ],
    "style": "sport",
    "features": [
      "Два часові пояси",
      "Керамічний безель",
      "24-годинна стрілка",
      "Нічний стиль"
    ],
    "specifications": {
      "case": "Oystersteel",
      "movement": "Автоматичний калібр 3285",
      "waterResistance": "100 метрів",
      "diameter": "40 мм",
      "thickness": "12 мм",
      "bracelet": "Oyster, Oystersteel"
    },
    "inStock": true
  },
  {
    "id": "yacht-master-rose",
    "name": "Yacht-Master 40 Rose Gold",
    "brand": "Royal Crown",
    "price": 54999,
    "description": "Елегантний яхтовий годинник з рожевого золота",
    "longDescription": "Yacht-Master 40 в корпусі з рожевого золота Everose поєднує спортивний характер з неперевершеною елегантністю. Двонаправлений безель та матовий чорний циферблат.",
    "images": [
      "public/media/products/photo-1542496658-e33a6d0d50f6.webp",
      "public/media/products/photo-1509048191080-d2984bad6ae5.webp"
    ],
    "style": "sport",
    "features": [
      "Рожеве золото Everose",
      "Двонаправлений безель",
      "Oysterflex браслет",
      "Chromalight підсвітка"
    ],
    "specifications": {
      "case": "18К рожеве золото Everose",
      "movement": "Автоматичний калібр 3235",
      "waterResistance": "100 метрів",
      "diameter": "40 мм",
      "thickness": "11.8 мм",
      "bracelet": "Oysterflex"
    },
    "inStock": true
  },
  {
    "id": "explorer-white",
    "name": "Explorer II White Dial",
    "brand": "Royal Crown",
    "price": 32999,
    "description": "Надійний інструментальний годинник для експедицій",
    "longDescription": "Explorer II створений для дослідників та спелеологів. 24-годинна стрілка дозволяє відрізняти день від ночі, а яскрава підсвітка Chromalight забезпечує читабельність в темряві.",
    "images": [
      "public/media/products/photo-1526045431048-f857369baa09.webp",
      "public/media/products/photo-1533139502658-0198f920d8e8.webp"
    ],
    "style": "sport",
    "features": [
      "24-годинна стрілка",
      "Фіксований безель",
      "Chromalight",
      "Хронометр COSC"
    ],
    "specifications": {
      "case": "Oystersteel",
      "movement": "Автоматичний калібр 3285",
      "waterResistance": "100 метрів",
      "diameter": "42 мм",
      "thickness": "12.5 мм",
      "bracelet": "Oyster, Oystersteel"
    },
    "inStock": true
  },
  {
    "id": "explorer-black",
    "name": "Explorer II Black Dial",
    "brand": "Royal Crown",
    "price": 33999,
    "description": "Чорний циферблат для справжніх дослідників",
    "longDescription": "Explorer II з чорним циферблатом - це стриманість та функціональність для тих, хто обирає практичність.",
    "images": [
      "public/media/products/photo-1533139502658-0198f920d8e8.webp",
      "public/media/products/photo-1526045431048-f857369baa09.webp"
    ],
    "style": "sport",
    "features": [
      "24-годинна стрілка",
      "Фіксований безель",
      "Chromalight",
      "Хронометр COSC"
    ],
    "specifications": {
      "case": "Oystersteel",
      "movement": "Автоматичний калібр 3285",
      "waterResistance": "100 метрів",
      "diameter": "42 мм",
      "thickness": "12.5 мм",
      "bracelet": "Oyster, Oystersteel"
    },
    "inStock": true
  },
  {
    "id": "submariner-black",
    "name": "Submariner Date Black",
    "brand": "Royal Crown",
    "price": 48999,
    "description": "Легендарний спортивний годинник",
    "longDescription": "Submariner Date з чорним циферблатом та керамічним безелем - це легенда серед спортивних годинників. Водонепроникність до 300 метрів.",
    "images": [
      "public/media/products/photo-1523170335258-f5ed11844a49.webp",
      "public/media/products/photo-1614164185128-e4ec99c436d7.webp"
    ],
    "style": "sport",
    "features": [
      "Водонепроникність 300м",
      "Керамічний безель",
      "Сапфірове скло",
      "Автоматичний механізм"
    ],
    "specifications": {
      "case": "Oystersteel",
      "movement": "Автоматичний калібр 3235",
      "waterResistance": "300 метрів",
      "diameter": "41 мм",
      "thickness": "12.5 мм",
      "bracelet": "Oyster, Oystersteel"
    },
    "inStock": true
  },
  {
    "id": "submariner-green",
    "name": "Submariner Date Green",
    "brand": "Royal Crown",
    "price": 52999,
    "originalPrice": 58999,
    "description": "Культовий зелений безель \"Hulk\"",
    "longDescription": "Submariner з зеленим безелем та циферблатом - це колекційна модель, яка відразу впізнається.",
    "images": [
      "public/media/products/photo-1614164185128-e4ec99c436d7.webp",
      "public/media/products/photo-1523170335258-f5ed11844a49.webp"
    ],
    "style": "sport",
    "features": [
      "Водонепроникність 300м",
      "Зелений керамічний безель",
      "Сапфірове скло",
      "Колекційна модель"
    ],
    "specifications": {
      "case": "Oystersteel",
      "movement": "Автоматичний калібр 3235",
      "waterResistance": "300 метрів",
      "diameter": "41 мм",
      "thickness": "12.5 мм",
      "bracelet": "Oyster, Oystersteel"
    },
    "inStock": true
  },
  {
    "id": "milgauss",
    "name": "Milgauss Z-Blue",
    "brand": "Royal Crown",
    "price": 45999,
    "description": "Антимагнітний годинник для науковців",
    "longDescription": "Milgauss з унікальним Z-Blue циферблатом та помаранчевою блискавкою - це годинник для тих, хто працює з магнітними полями.",
    "images": [
      "public/media/products/photo-1622434641406-a158123450f9.webp",
      "public/media/products/photo-1614164185128-e4ec99c436d7.webp"
    ],
    "style": "sport",
    "features": [
      "Антимагнітний",
      "Зелене сапфірове скло",
      "Помаранчева стрілка",
      "Хронометр COSC"
    ],
    "specifications": {
      "case": "Oystersteel",
      "movement": "Автоматичний калібр 3131",
      "waterResistance": "100 метрів",
      "diameter": "40 мм",
      "thickness": "13.2 мм",
      "bracelet": "Oyster, Oystersteel"
    },
    "inStock": true,
    "isNew": true
  },
  {
    "id": "day-date-green",
    "name": "Day-Date 40 Green Dial",
    "brand": "Royal Crown",
    "price": 95999,
    "description": "Годинник президентів з унікальним зеленим циферблатом",
    "longDescription": "Day-Date 40 з ексклюзивним зеленим циферблатом - це символ влади та успіху. Функція відображення дня тижня повністю, браслет President та корпус з платини.",
    "images": [
      "public/media/products/photo-1627037558426-c2d07beda3af.webp",
      "public/media/products/photo-1618220179428-22790b461013.webp"
    ],
    "style": "dress",
    "features": [
      "День тижня повністю",
      "Золотий корпус",
      "Ексклюзивний циферблат",
      "Браслет President"
    ],
    "specifications": {
      "case": "18К жовте золото",
      "movement": "Автоматичний калібр 3255",
      "waterResistance": "100 метрів",
      "diameter": "40 мм",
      "thickness": "12 мм",
      "bracelet": "President, 18К золото"
    },
    "inStock": true
  },
  {
    "id": "day-date-silver",
    "name": "Day-Date 40 Silver Dial",
    "brand": "Royal Crown",
    "price": 89999,
    "description": "Класичний срібний циферблат",
    "longDescription": "Day-Date 40 з сріблястим циферблатом - це втілення класичної елегантності для найважливіших подій.",
    "images": [
      "public/media/products/photo-1618220179428-22790b461013.webp",
      "public/media/products/photo-1627037558426-c2d07beda3af.webp"
    ],
    "style": "dress",
    "features": [
      "День тижня повністю",
      "Біле золото",
      "Римські цифри",
      "Браслет President"
    ],
    "specifications": {
      "case": "18К біле золото",
      "movement": "Автоматичний калібр 3255",
      "waterResistance": "100 метрів",
      "diameter": "40 мм",
      "thickness": "12 мм",
      "bracelet": "President, 18К біле золото"
    },
    "inStock": true
  },
  {
    "id": "cellini-moonphase",
    "name": "Cellini Moonphase",
    "brand": "Royal Crown",
    "price": 78999,
    "description": "Витончений годинник з фазами місяця",
    "longDescription": "Cellini Moonphase - це вершина годинникового мистецтва. Емальований циферблат з фазами місяця, корпус з білого золота та класичний шкіряний ремінець для справжніх естетів.",
    "images": [
      "public/media/products/photo-1620625515032-6ed0c1790c75.webp",
      "public/media/products/photo-1585123334904-845d60e97b29.webp"
    ],
    "style": "dress",
    "features": [
      "Фази місяця",
      "Емальований циферблат",
      "Біле золото",
      "Шкіряний ремінець"
    ],
    "specifications": {
      "case": "18К біле золото",
      "movement": "Автоматичний калібр 3195",
      "waterResistance": "50 метрів",
      "diameter": "39 мм",
      "thickness": "9.9 мм",
      "bracelet": "Шкіра алігатора"
    },
    "inStock": true
  },
  {
    "id": "cellini-time",
    "name": "Cellini Time Rose Gold",
    "brand": "Royal Crown",
    "price": 68999,
    "description": "Чиста елегантність рожевого золота",
    "longDescription": "Cellini Time з рожевого золота - це чистота ліній та елегантність для найвитонченіших смаків.",
    "images": [
      "public/media/products/photo-1585123334904-845d60e97b29.webp",
      "public/media/products/photo-1620625515032-6ed0c1790c75.webp"
    ],
    "style": "dress",
    "features": [
      "Класичний дизайн",
      "Рожеве золото",
      "Білий лакований циферблат",
      "Шкіряний ремінець"
    ],
    "specifications": {
      "case": "18К рожеве золото",
      "movement": "Автоматичний калібр 3132",
      "waterResistance": "50 метрів",
      "diameter": "39 мм",
      "thickness": "9.1 мм",
      "bracelet": "Шкіра алігатора"
    },
    "inStock": true
  },
  {
    "id": "sky-dweller-blue",
    "name": "Sky-Dweller Blue Dial",
    "brand": "Royal Crown",
    "price": 98999,
    "description": "Найскладніший годинник з двома часовими поясами",
    "longDescription": "Sky-Dweller - це найскладніший годинник у колекції. Річний календар, два часові пояси та інноваційний механізм.",
    "images": [
      "public/media/products/photo-1542496658-e33a6d0d50f6.webp",
      "public/media/products/photo-1509048191080-d2984bad6ae5.webp"
    ],
    "style": "dress",
    "features": [
      "Річний календар",
      "Два часові пояси",
      "Кільце Command",
      "Інноваційний механізм"
    ],
    "specifications": {
      "case": "18К біле золото",
      "movement": "Автоматичний калібр 9001",
      "waterResistance": "100 метрів",
      "diameter": "42 мм",
      "thickness": "14 мм",
      "bracelet": "Oysterflex"
    },
    "inStock": true,
    "isNew": true
  },
  {
    "id": "sky-dweller-champagne",
    "name": "Sky-Dweller Champagne",
    "brand": "Royal Crown",
    "price": 92999,
    "originalPrice": 99999,
    "description": "Елегантний шампанський циферблат",
    "longDescription": "Sky-Dweller з шампанським циферблатом - це поєднання складності та елегантності.",
    "images": [
      "public/media/products/photo-1509048191080-d2984bad6ae5.webp",
      "public/media/products/photo-1542496658-e33a6d0d50f6.webp"
    ],
    "style": "dress",
    "features": [
      "Річний календар",
      "Два часові пояси",
      "Жовте золото",
      "Браслет Oyster"
    ],
    "specifications": {
      "case": "18К жовте золото",
      "movement": "Автоматичний калібр 9001",
      "waterResistance": "100 метрів",
      "diameter": "42 мм",
      "thickness": "14 мм",
      "bracelet": "Oyster, 18К жовте золото"
    },
    "inStock": true
  },
  {
    "id": "pearlmaster-diamond",
    "name": "Pearlmaster Diamond",
    "brand": "Royal Crown",
    "price": 125999,
    "description": "Розкіш з діамантовим безелем",
    "longDescription": "Pearlmaster з діамантовим безелем - це вершина розкоші. Кожен діамант ретельно відібраний та закріплений майстрами.",
    "images": [
      "public/media/products/photo-1618220179428-22790b461013.webp",
      "public/media/products/photo-1627037558426-c2d07beda3af.webp"
    ],
    "style": "dress",
    "features": [
      "Діамантовий безель",
      "Перламутровий циферблат",
      "Біле золото",
      "Браслет Pearlmaster"
    ],
    "specifications": {
      "case": "18К біле золото з діамантами",
      "movement": "Автоматичний калібр 2236",
      "waterResistance": "100 метрів",
      "diameter": "34 мм",
      "thickness": "11.1 мм",
      "bracelet": "Pearlmaster, 18К біле золото"
    },
    "inStock": true
  },
  {
    "id": "lady-datejust",
    "name": "Lady-Datejust 28",
    "brand": "Royal Crown",
    "price": 42999,
    "description": "Жіноча елегантність",
    "longDescription": "Lady-Datejust 28 - це ідеальний годинник для жінок, які цінують елегантність та якість.",
    "images": [
      "public/media/products/photo-1585123334904-845d60e97b29.webp",
      "public/media/products/photo-1620625515032-6ed0c1790c75.webp"
    ],
    "style": "dress",
    "features": [
      "Компактний розмір",
      "Жіночий дизайн",
      "Браслет Jubilee",
      "Діамантові індекси"
    ],
    "specifications": {
      "case": "Oystersteel та рожеве золото",
      "movement": "Автоматичний калібр 2236",
      "waterResistance": "100 метрів",
      "diameter": "28 мм",
      "thickness": "10 мм",
      "bracelet": "Jubilee, Oystersteel та золото"
    },
    "inStock": true
  }
];

function formatPrice(price) {
  return new Intl.NumberFormat('uk-UA', {
    style: 'currency',
    currency: 'UAH',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

function getWatchById(id) {
  return WATCHES.find(w => w.id === id);
}
