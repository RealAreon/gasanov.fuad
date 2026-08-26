import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { Icon } from './Icon';
import './ModalShell.scss';

interface ModalShellProps {
  isOpen: boolean;
  onClose: () => void;
  labelledBy: string;
  children: ReactNode;
  variant?: 'center' | 'drawer-right' | 'full';
  className?: string;
}

export const ModalShell = ({ isOpen, onClose, labelledBy, children, variant = 'center', className }: ModalShellProps) => {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const timer = window.setTimeout(() => {
      const focusable = panelRef.current?.querySelector<HTMLElement>(
        'button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])',
      );
      focusable?.focus();
    }, 60);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      window.clearTimeout(timer);
      document.removeEventListener('keydown', handleKeyDown);
      previouslyFocused?.focus?.();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className={`modal-shell modal-shell--${variant}`} role="presentation">
      <button
        type="button"
        className="modal-shell__backdrop"
        aria-label="Close overlay"
        onClick={onClose}
      />
      <div
        className={`modal-shell__panel ${className ?? ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        ref={panelRef}
      >
        <button type="button" className="modal-shell__close" aria-label="Close" onClick={onClose}>
          <span>Close</span>
          <Icon name="close" size={16} />
        </button>
        {children}
      </div>
    </div>
  );
};
