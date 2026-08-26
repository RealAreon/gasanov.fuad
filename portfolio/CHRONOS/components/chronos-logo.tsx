import Image from 'next/image';

function LogoMark({ className = '' }: { className?: string }) {
  return (
    <Image
      src="/logo-mark.png"
      alt=""
      width={64}
      height={64}
      className={`chronos-logo-mark ${className}`}
      unoptimized
      priority
      aria-hidden="true"
    />
  );
}

export function ChronosLogo({
  variant = 'full',
  className = '',
}: {
  variant?: 'full' | 'mark' | 'wordmark';
  className?: string;
}) {
  if (variant === 'mark') {
    return (
      <span className={`chronos-logo chronos-logo--mark ${className}`}>
        <LogoMark />
        <span className="sr-only">CHRONOS</span>
      </span>
    );
  }

  if (variant === 'wordmark') {
    return (
      <span className={`chronos-logo chronos-logo--wordmark ${className}`}>
        <span className="chronos-logo-name">CHRONOS</span>
        <span className="chronos-logo-rule" aria-hidden="true" />
        <span className="chronos-logo-sub">EST. MMXXVI</span>
      </span>
    );
  }

  return (
    <span className={`chronos-logo chronos-logo--full ${className}`}>
      <LogoMark />
      <span className="chronos-logo-text">
        <span className="chronos-logo-name">CHRONOS</span>
        <span className="chronos-logo-sub">Swiss Timepieces</span>
      </span>
    </span>
  );
}
