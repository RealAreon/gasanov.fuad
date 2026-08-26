import { useAppStore } from '../../store/useAppStore';
import { ModalShell } from '../shared/ModalShell';
import { Icon } from '../shared/Icon';
import './InfoModal.scss';

interface InfoContent {
  title: string;
  paragraphs: string[];
}

const INFO_CONTENT: Record<string, InfoContent> = {
  'privacy-policy': {
    title: 'Privacy Policy',
    paragraphs: [
      'CHRONOS collects only the information required to process reservations, respond to enquiries and improve the atelier experience — including your name, contact details and, where relevant, delivery preferences.',
      'We never sell client data. Information shared through the booking or newsletter forms is stored securely and used solely for concierge communication.',
      'You may request access to, or deletion of, your data at any time by contacting hello@chronoswatches.com.',
    ],
  },
  'terms-of-service': {
    title: 'Terms & Conditions',
    paragraphs: [
      'All prices listed are indicative and confirmed by a concierge representative prior to any reservation being finalized.',
      'Limited editions are allocated on a first-confirmed basis. CHRONOS reserves the right to decline any reservation request.',
      'Continued use of this site constitutes acceptance of these terms as they are updated from time to time.',
    ],
  },
  'shipping-returns': {
    title: 'Shipping & Returns',
    paragraphs: [
      'Every timepiece is hand-delivered or shipped fully insured via appointment, in coordination with your concierge.',
      'Bespoke and limited-edition pieces are final sale once production has begun. In-stock references may be returned within 14 days in unworn condition.',
      'Worldwide shipping is complimentary on all confirmed orders.',
    ],
  },
  warranty: {
    title: 'Warranty',
    paragraphs: [
      'Every CHRONOS movement carries a five-year international warranty covering manufacturing defects in materials and workmanship.',
      'Warranty does not cover water damage from unauthorized case openings or accidental impact. Register your timepiece within 30 days of delivery to activate full coverage.',
    ],
  },
  careers: {
    title: 'Careers',
    paragraphs: [
      'We hire watchmakers, case finishers and client relations specialists directly into our Zurich and Geneva ateliers — typically through referral and an eighteen-month apprenticeship track.',
      'Open roles are listed with our federation partners. Reach out to careers@chronoswatches.com with a portfolio or CV.',
    ],
  },
  press: {
    title: 'Press & Media',
    paragraphs: [
      'For imagery, interview requests or embargoed announcements, contact our press office at press@chronoswatches.com.',
      'A curated press kit including product photography and brand history is available on request.',
    ],
  },
  heritage: {
    title: 'Heritage',
    paragraphs: [
      'CHRONOS was founded on a simple conviction: timepieces should outlast trends. Our archive of sketches, calibers and case geometries still informs every new reference.',
      'Heritage for us is a working method — finishing standards, material honesty and the patience to build watches meant for more than one generation.',
    ],
  },
  sustainability: {
    title: 'Sustainability',
    paragraphs: [
      'We source responsibly, design for repairability and keep movements serviceable for decades — the most durable form of luxury.',
      'Packaging is recyclable, and our Zurich atelier runs on renewable energy where municipal supply allows.',
    ],
  },
  partnerships: {
    title: 'Partnerships',
    paragraphs: [
      'Select collaborations with galleries, private clubs and cultural institutions are considered by invitation.',
      'For partnership enquiries, write to partnerships@chronoswatches.com with a brief and proposed timeline.',
    ],
  },
  'limited-editions': {
    title: 'Limited Editions',
    paragraphs: [
      'Limited editions are produced in tightly controlled series and allocated through our concierge team.',
      'Availability is confirmed individually. Join the newsletter or book a visit to be considered for upcoming releases.',
    ],
  },
  bespoke: {
    title: 'Bespoke Creations',
    paragraphs: [
      'Bespoke Chronos pieces begin with a private consultation covering dial, case metal, engraving and delivery timeline.',
      'Production typically spans several months. Book a visit to begin the conversation with our atelier advisors.',
    ],
  },
  materials: {
    title: 'Materials & Innovation',
    paragraphs: [
      'From proprietary alloys to sapphire crystals and hand-finished bridges, every material is chosen for longevity under wear.',
      'Innovation at Chronos is quiet — upgrades you feel as reliability rather than novelty.',
    ],
  },
  'swiss-made': {
    title: 'Swiss Made',
    paragraphs: [
      'Every Chronos timepiece meets Swiss Made criteria: design, assembly and final inspection are completed in Switzerland.',
      'Our movements are regulated and tested in-house before leaving the atelier.',
    ],
  },
  'quality-control': {
    title: 'Quality Control',
    paragraphs: [
      'Each finished watch passes timed rate tests, water-resistance checks and a multi-day wear trial by our regulation team.',
      'Only pieces that meet our internal tolerances are released to clients.',
    ],
  },
  events: {
    title: 'Events',
    paragraphs: [
      'Private viewings, atelier evenings and seasonal presentations are shared first with newsletter subscribers.',
      'Follow Chronos on social channels or subscribe below for invitations.',
    ],
  },
  interviews: {
    title: 'Interviews',
    paragraphs: [
      'Conversations with our watchmakers, designers and long-standing clients appear regularly in The Journal.',
      'Visit the Journal section for the latest interviews and atelier notes.',
    ],
  },
  faq: {
    title: 'FAQ',
    paragraphs: [
      'Most questions about sizing, servicing, shipping and warranty are handled by your dedicated concierge.',
      'For general enquiries before booking, email hello@chronoswatches.com or call +41 44 123 45 67 during showroom hours.',
    ],
  },
  'watch-care': {
    title: 'Watch Care Guide',
    paragraphs: [
      'Rinse after saltwater exposure, avoid chemical cleaners on leather straps, and have water resistance checked after any impact.',
      'We recommend a full service every four to five years — earlier if the watch is worn daily in demanding conditions.',
    ],
  },
  sitemap: {
    title: 'Sitemap',
    paragraphs: [
      'Primary sections: Home, Catalog, Craftsmanship, Clients, Journal and Footer.',
      'Overlays available from the site: product quick view, article reader, booking, our story, cart and information pages.',
    ],
  },
};

export const InfoModal = () => {
  const isOpen = useAppStore((state) => state.overlays.info);
  const closeOverlay = useAppStore((state) => state.closeOverlay);
  const topic = useAppStore((state) => state.infoTopic);

  const content = topic ? INFO_CONTENT[topic] : undefined;

  return (
    <ModalShell isOpen={isOpen} onClose={() => closeOverlay('info')} labelledBy="info-title" className="info-modal">
      <button type="button" className="icon-btn info-modal__close" aria-label="Close" onClick={() => closeOverlay('info')}>
        <Icon name="close" size={18} />
      </button>
      <div className="info-modal__body">
        <h2 id="info-title">{content?.title ?? 'Information'}</h2>
        {(content?.paragraphs ?? ['Details coming soon.']).map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
    </ModalShell>
  );
};
