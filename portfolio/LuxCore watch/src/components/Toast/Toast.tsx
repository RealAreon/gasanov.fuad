import { useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Icon } from '../shared/Icon';
import './Toast.scss';

const AUTO_DISMISS_MS = 3800;

export const ToastStack = () => {
  const toasts = useAppStore((state) => state.toasts);
  const dismissToast = useAppStore((state) => state.dismissToast);

  useEffect(() => {
    if (toasts.length === 0) return;
    const timers = toasts.map((toast) =>
      window.setTimeout(() => dismissToast(toast.id), AUTO_DISMISS_MS),
    );
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [toasts, dismissToast]);

  if (toasts.length === 0) return null;

  return (
    <div className="toast-stack" role="status" aria-live="polite">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast toast--${toast.tone}`}>
          <Icon name={toast.tone === 'error' ? 'close' : 'check'} size={16} />
          <span>{toast.text}</span>
          <button type="button" aria-label="Dismiss notification" onClick={() => dismissToast(toast.id)}>
            <Icon name="close" size={13} />
          </button>
        </div>
      ))}
    </div>
  );
};
