import { useEffect, useState } from 'react';
import './Preloader.scss';

interface PreloaderProps {
  onDone: () => void;
}

export const Preloader = ({ onDone }: PreloaderProps) => {
  const [progress, setProgress] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let frame = 0;
    let finished = false;

    const finish = () => {
      if (finished) return;
      finished = true;
      setProgress(100);
      window.setTimeout(() => setLeaving(true), 220);
    };

    const tick = () => {
      setProgress((prev) => {
        if (prev >= 92) return prev;
        const next = prev + (92 - prev) * 0.045 + 0.3;
        return Math.min(next, 92);
      });
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);

    const minTimer = window.setTimeout(finish, 1500);
    const failSafe = window.setTimeout(finish, 4000);

    if (document.readyState === 'complete') {
      window.setTimeout(finish, 900);
    } else {
      window.addEventListener('load', finish);
    }

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(minTimer);
      window.clearTimeout(failSafe);
      window.removeEventListener('load', finish);
    };
  }, []);

  useEffect(() => {
    if (!leaving) return;
    const timer = window.setTimeout(() => {
      setHidden(true);
      onDone();
    }, 620);
    return () => window.clearTimeout(timer);
  }, [leaving, onDone]);

  if (hidden) return null;

  return (
    <div className={`preloader ${leaving ? 'preloader--leaving' : ''}`} aria-hidden={leaving}>
      <div className="preloader__inner">
        <img
          className="preloader__logo"
          src="./assets/icons/logo-hourglass.svg"
          alt=""
          width={40}
          height={40}
        />
        <p className="preloader__word">CHRONOS</p>
        <div className="preloader__bar">
          <div className="preloader__bar-fill" style={{ width: `${progress}%` }} />
        </div>
        <span className="preloader__count">{Math.round(progress)}%</span>
      </div>
    </div>
  );
};
