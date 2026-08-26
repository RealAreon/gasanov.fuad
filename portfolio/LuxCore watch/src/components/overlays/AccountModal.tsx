import { useState, type FormEvent } from 'react';
import { useAppStore, isValidEmail } from '../../store/useAppStore';
import { ModalShell } from '../shared/ModalShell';
import { Icon } from '../shared/Icon';
import './AccountModal.scss';

export const AccountModal = () => {
  const isOpen = useAppStore((state) => state.overlays.account);
  const closeOverlay = useAppStore((state) => state.closeOverlay);
  const account = useAppStore((state) => state.account);
  const signIn = useAppStore((state) => state.signIn);
  const signOut = useAppStore((state) => state.signOut);
  const pushToast = useAppStore((state) => state.pushToast);

  const [mode, setMode] = useState<'signin' | 'create'>('create');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const resetForm = () => {
    setName('');
    setEmail('');
    setPassword('');
    setError(null);
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!isValidEmail(email)) {
      setError('Enter a valid email address.');
      return;
    }
    if (password.trim().length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (mode === 'create' && name.trim().length < 2) {
      setError('Please enter your name.');
      return;
    }

    signIn({
      name: name.trim() || email.split('@')[0],
      email: email.trim(),
    });
    pushToast(mode === 'create' ? 'Account created. Welcome to CHRONOS.' : 'Signed in.', 'success');
    resetForm();
  };

  return (
    <ModalShell isOpen={isOpen} onClose={() => closeOverlay('account')} labelledBy="account-title">
      <div className="account-modal">
        <button
          type="button"
          className="icon-btn account-modal__close"
          aria-label="Close account"
          onClick={() => closeOverlay('account')}
        >
          <Icon name="close" size={18} />
        </button>

        {account ? (
          <>
            <p className="eyebrow">Your Atelier Profile</p>
            <h2 id="account-title">Welcome, {account.name}</h2>
            <p className="account-modal__copy">{account.email}</p>
            <button
              type="button"
              className="btn-outline"
              onClick={() => {
                signOut();
                pushToast('Signed out.', 'info');
              }}
            >
              Sign out
            </button>
          </>
        ) : (
          <>
            <p className="eyebrow">{mode === 'create' ? 'Join Chronos' : 'Client Access'}</p>
            <h2 id="account-title">{mode === 'create' ? 'Create account' : 'Sign in'}</h2>
            <p className="account-modal__copy">
              Save your selection, track reservations, and receive private salon invitations.
            </p>

            <form className="account-modal__form" onSubmit={handleSubmit} noValidate>
              {mode === 'create' && (
                <label>
                  Full name
                  <input value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" />
                </label>
              )}
              <label>
                Email
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  autoComplete="email"
                />
              </label>
              <label>
                Password
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete={mode === 'create' ? 'new-password' : 'current-password'}
                />
              </label>
              {error && <p className="account-modal__error">{error}</p>}
              <button type="submit" className="btn-solid">
                {mode === 'create' ? 'Create account' : 'Sign in'}
                <Icon name="arrow-right" size={14} />
              </button>
            </form>

            <button
              type="button"
              className="account-modal__switch"
              onClick={() => {
                setMode(mode === 'create' ? 'signin' : 'create');
                setError(null);
              }}
            >
              {mode === 'create' ? 'Already have an account? Sign in' : 'New client? Create an account'}
            </button>
          </>
        )}
      </div>
    </ModalShell>
  );
};
