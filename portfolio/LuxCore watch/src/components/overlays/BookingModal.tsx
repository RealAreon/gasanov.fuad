import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { useAppStore, isValidEmail, saveBookingRecord } from '../../store/useAppStore';
import { ModalShell } from '../shared/ModalShell';
import { Icon } from '../shared/Icon';
import './BookingModal.scss';

interface FormState {
  name: string;
  email: string;
  date: string;
  time: string;
  message: string;
}

const EMPTY_FORM: FormState = { name: '', email: '', date: '', time: '', message: '' };

export const BookingModal = () => {
  const isOpen = useAppStore((state) => state.overlays.booking);
  const closeOverlay = useAppStore((state) => state.closeOverlay);
  const pushToast = useAppStore((state) => state.pushToast);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [submitted, setSubmitted] = useState(false);

  const update = (field: keyof FormState) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [field]: event.target.value }));

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const nextErrors: Partial<FormState> = {};

    if (form.name.trim().length < 2) nextErrors.name = 'Please enter your full name.';
    if (!isValidEmail(form.email)) nextErrors.email = 'Please enter a valid email address.';
    if (!form.date) nextErrors.date = 'Please choose a date.';
    if (!form.time) nextErrors.time = 'Please choose a time.';

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const saved = saveBookingRecord(form);
    if (saved) {
      setSubmitted(true);
      pushToast('Private viewing request received.', 'success');
    } else {
      pushToast('Could not save your request. Please try again.', 'error');
    }
  };

  const handleClose = () => {
    closeOverlay('booking');
    window.setTimeout(() => {
      setForm(EMPTY_FORM);
      setErrors({});
      setSubmitted(false);
    }, 300);
  };

  return (
    <ModalShell isOpen={isOpen} onClose={handleClose} labelledBy="booking-title" className="booking-modal">
      <button type="button" className="icon-btn booking-modal__close" aria-label="Close" onClick={handleClose}>
        <Icon name="close" size={18} />
      </button>

      {submitted ? (
        <div className="booking-modal__success">
          <Icon name="check" size={36} />
          <h2>Request Received</h2>
          <p>A member of our concierge team will confirm your private viewing within one business day.</p>
          <button type="button" className="btn-outline" onClick={handleClose}>
            Close
            <span className="arrow"><Icon name="arrow-right" size={16} /></span>
          </button>
        </div>
      ) : (
        <form className="booking-modal__form" onSubmit={handleSubmit} noValidate>
          <h2 id="booking-title">Book a Private Viewing</h2>
          <p className="booking-modal__subtitle">Reserve time with our atelier team, in person or by video.</p>

          <div className="booking-modal__field">
            <label htmlFor="booking-name">Full name</label>
            <input id="booking-name" type="text" value={form.name} onChange={update('name')} autoComplete="name" />
            {errors.name && <span className="booking-modal__error">{errors.name}</span>}
          </div>

          <div className="booking-modal__field">
            <label htmlFor="booking-email">Email</label>
            <input id="booking-email" type="email" value={form.email} onChange={update('email')} autoComplete="email" />
            {errors.email && <span className="booking-modal__error">{errors.email}</span>}
          </div>

          <div className="booking-modal__row">
            <div className="booking-modal__field">
              <label htmlFor="booking-date">Date</label>
              <input id="booking-date" type="date" value={form.date} onChange={update('date')} />
              {errors.date && <span className="booking-modal__error">{errors.date}</span>}
            </div>
            <div className="booking-modal__field">
              <label htmlFor="booking-time">Time</label>
              <input id="booking-time" type="time" value={form.time} onChange={update('time')} />
              {errors.time && <span className="booking-modal__error">{errors.time}</span>}
            </div>
          </div>

          <div className="booking-modal__field">
            <label htmlFor="booking-message">Message (optional)</label>
            <textarea
              id="booking-message"
              rows={3}
              value={form.message}
              onChange={update('message')}
              placeholder="Tell us which reference interests you…"
            />
          </div>

          <button type="submit" className="btn-solid">
            Submit Request
          </button>
        </form>
      )}
    </ModalShell>
  );
};
