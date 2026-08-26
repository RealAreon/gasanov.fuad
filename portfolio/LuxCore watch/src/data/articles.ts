import type { Article } from './types';

export const featuredArticle: Article = {
  id: 'a0',
  slug: 'the-return-of-timeless-design',
  title: 'The Return of Timeless Design',
  excerpt:
    'In an age of fleeting trends, classic design endures. Discover how Chronos redefines heritage through precision engineering and enduring craftsmanship that transcends generations.',
  body: [
    'Trends arrive loudly and leave quietly. What remains — on the wrist, in the archive, and in the culture of watchmaking — is proportion, material honesty, and the patience to finish a bridge by hand.',
    'At Chronos, heritage is not a mood board. It is a working method: calibers designed to be serviced for decades, cases shaped for balance rather than novelty, and dials that still read clearly under changing light.',
    'The Return of Timeless Design is our invitation to look past the season. When a watch is built to outlast its owner\u2019s first decade of wear, \u201cclassic\u201d stops being nostalgia and becomes engineering.',
    'This is the Chronos promise — precision that feels inevitable, and beauty that does not need to shout.',
  ],
  image: './assets/images/journal/journal-featured.webp',
  category: 'Heritage',
  readMinutes: 8,
  date: '2024-05-24',
  featured: true,
};

export const articles: Article[] = [
  {
    id: 'a1',
    slug: 'the-art-of-mechanical-precision',
    title: 'The Art of Mechanical Precision',
    excerpt: 'Inside the atelier where every gear, jewel and bevel is finished to tolerances measured in microns.',
    body: [
      'Mechanical precision is not a slogan on a hangtag. It is the daily discipline of machining, adjusting and listening to a caliber until its beat is even under the loupe.',
      'Our watchmakers spend years learning to feel resistance in a train wheel, to read the grain of a bevel, and to know when a jewel is seated correctly by sound as much as sight.',
      'The Art of Mechanical Precision documents that quiet craft — the hours no client sees, and the standards we refuse to automate away.',
    ],
    image: './assets/images/journal/journal-mechanics.webp',
    category: 'Craftsmanship',
    readMinutes: 6,
    date: '2024-05-18',
  },
  {
    id: 'a2',
    slug: 'time-nature-perfection',
    title: 'Time, Nature, Perfection',
    excerpt: 'How alpine light, stone and silence shape the way we test — and design — a Chronos case.',
    body: [
      'Nature keeps better time than any marketing calendar. Temperature swings, altitude and dust reveal weaknesses in a seal long before a showroom ever would.',
      'We take prototypes into the mountains for a reason: if a case can hold its integrity where the air thins and the rock is cold, it will hold on a city street.',
      'Time, Nature, Perfection is a meditation on why outdoor testing still belongs in a Swiss manufacture that otherwise lives by the loupe.',
    ],
    image: './assets/images/journal/journal-mountains-watch.webp',
    category: 'Inspiration',
    readMinutes: 5,
    date: '2024-05-12',
  },
  {
    id: 'a3',
    slug: 'designing-for-generations',
    title: 'Designing for Generations',
    excerpt: 'From first graphite sketch to sapphire crystal — building watches meant to be worn by more than one lifetime.',
    body: [
      'Every Chronos reference begins as a sketch that must survive argument. If a line cannot justify itself under scrutiny, it does not leave the page.',
      'Designing for generations means choosing dials that age with dignity, bracelets that can be resized without drama, and movements that a future watchmaker can still service.',
      'We keep the discarded sketches. They are a reminder that restraint is a design decision — and often the hardest one.',
    ],
    image: './assets/images/journal/journal-sketch.webp',
    category: 'Design',
    readMinutes: 7,
    date: '2024-05-05',
  },
  {
    id: 'a4',
    slug: 'innovation-behind-tradition',
    title: 'Innovation Behind Tradition',
    excerpt: 'New alloys, smarter regulation, familiar silhouettes — how Chronos advances without abandoning its DNA.',
    body: [
      'Tradition without progress becomes costume. Progress without tradition becomes fashion. Chronos lives in the tension between the two.',
      'Behind every familiar case profile sits metallurgy research, accelerated wear testing and regulation protocols that did not exist when our first atelier opened.',
      'Innovation Behind Tradition is the story of those invisible upgrades — the ones a wearer feels as reliability, not as a press release.',
    ],
    image: './assets/images/journal/journal-movement.webp',
    category: 'Technology',
    readMinutes: 6,
    date: '2024-04-28',
  },
  {
    id: 'a5',
    slug: 'the-jewels-that-carry-time',
    title: 'The Jewels That Carry Time',
    excerpt: 'Synthetic rubies, friction and the quiet engineering that keeps a caliber running for decades.',
    body: [
      'Jewels are not decoration. They are bearing surfaces harder than the steel they support, chosen to reduce wear at the points that move most often.',
      'Understanding where jewels sit — and why — is one of the fastest ways to read a movement like a watchmaker.',
      'We walk through the role of each stone in our flagship caliber, and why we still insist on finishing the seats by hand.',
    ],
    image: './assets/images/journal/journal-mechanics.webp',
    category: 'Craftsmanship',
    readMinutes: 5,
    date: '2024-04-20',
  },
  {
    id: 'a6',
    slug: 'light-on-the-dial',
    title: 'Light on the Dial',
    excerpt: 'Why dial finishing, lume and contrast matter more than any complication on the brochure.',
    body: [
      'A watch is read in motion — under office fluorescents, evening candlelight, and the harsh noon of travel. Dial design must survive all three.',
      'We discuss lume placement, hand lengths and the quiet hierarchy of indices that make a Chronos dial legible without shouting.',
      'Light on the Dial is a short masterclass in the graphic decisions owners notice every day without naming them.',
    ],
    image: './assets/images/journal/journal-sketch.webp',
    category: 'Design',
    readMinutes: 4,
    date: '2024-04-12',
  },
  {
    id: 'a7',
    slug: 'altitude-and-the-seal',
    title: 'Altitude and the Seal',
    excerpt: 'What mountain testing taught us about gaskets, crowns and long-term water resistance.',
    body: [
      'Water resistance ratings are promises. Altitude testing is evidence. The pressure and temperature swing of a single alpine day can expose a weak gasket faster than months of desk wear.',
      'Our case team logs every prototype that fails — and every one that does not — so geometry improves with data, not folklore.',
      'Altitude and the Seal shares the discipline behind the numbers printed on our casebacks.',
    ],
    image: './assets/images/journal/journal-mountains-watch.webp',
    category: 'Technology',
    readMinutes: 5,
    date: '2024-04-04',
  },
  {
    id: 'a8',
    slug: 'archives-of-a-manufacture',
    title: 'Archives of a Manufacture',
    excerpt: 'Notebooks, rejected bridges and the heritage stories that still shape new references.',
    body: [
      'Our archive is not a museum display. It is a working library of failures, breakthroughs and unfinished ideas.',
      'When a new Legacy bridge needed a forgotten geometry, the answer was waiting in water-stained notebooks from the early atelier years.',
      'Archives of a Manufacture is an invitation into that room — and into why remembering is a form of innovation.',
    ],
    image: './assets/images/journal/journal-movement.webp',
    category: 'Heritage',
    readMinutes: 7,
    date: '2024-03-22',
  },
];

export const allArticles: Article[] = [featuredArticle, ...articles];

export const getArticleBySlug = (slug: string): Article | undefined =>
  allArticles.find((article) => article.slug === slug);
