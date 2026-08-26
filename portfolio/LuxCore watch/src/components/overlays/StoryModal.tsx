import { useAppStore } from '../../store/useAppStore';
import { ModalShell } from '../shared/ModalShell';
import { Icon } from '../shared/Icon';
import './StoryModal.scss';

const MILESTONES = [
  { year: '1962', text: 'Founded in a single room above a Geneva bell foundry, with three watchmakers and one bench.' },
  { year: '1988', text: 'First in-house caliber, CH-01, certified after four years of chronometry trials.' },
  { year: '2013', text: 'Began the century-long durability research that would become Caliber CH-04.' },
  { year: 'Today', text: 'A 41-person atelier producing fewer than 900 watches a year, by hand, in Geneva.' },
];

export const StoryModal = () => {
  const isOpen = useAppStore((state) => state.overlays.story);
  const closeOverlay = useAppStore((state) => state.closeOverlay);

  return (
    <ModalShell isOpen={isOpen} onClose={() => closeOverlay('story')} labelledBy="story-title" variant="full">
      <div className="story-modal">
        <div className="story-modal__topbar container">
          <span className="eyebrow">Our Story</span>
          <button type="button" className="icon-btn" aria-label="Close" onClick={() => closeOverlay('story')}>
            <Icon name="close" size={18} />
          </button>
        </div>

        <div className="story-modal__body">
          <div className="story-modal__hero container">
            <h2 id="story-title">Time Beyond Limits</h2>
            <p>
              CHRONOS began with a simple obsession: build a watch that could be handed to a grandchild and keep
              perfect time. Six decades later, that obsession still shapes every decision made inside our Geneva
              atelier — from the alloys we choose to the hours we spend hand-finishing a single bridge.
            </p>
          </div>

          <div className="story-modal__figure">
            <img src="./assets/images/collection/movement-macro.webp" alt="Close-up of a CHRONOS hand-finished movement" loading="lazy" />
          </div>

          <div className="story-modal__timeline container">
            {MILESTONES.map((milestone) => (
              <div key={milestone.year} className="story-modal__milestone">
                <span className="story-modal__year">{milestone.year}</span>
                <p>{milestone.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ModalShell>
  );
};
