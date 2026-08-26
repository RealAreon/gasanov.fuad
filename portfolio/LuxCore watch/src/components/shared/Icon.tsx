export type IconName =
  | 'arrow-right'
  | 'arrow-up-right'
  | 'close'
  | 'menu'
  | 'search'
  | 'bag'
  | 'play'
  | 'star'
  | 'quote'
  | 'chevron-left'
  | 'chevron-right'
  | 'check'
  | 'mail'
  | 'phone'
  | 'pin'
  | 'instagram'
  | 'facebook'
  | 'x'
  | 'pinterest'
  | 'youtube'
  | 'download'
  | 'calendar'
  | 'clock'
  | 'plus'
  | 'minus'
  | 'hourglass'
  | 'shield'
  | 'gem'
  | 'compass'
  | 'infinity'
  | 'medal'
  | 'gear'
  | 'card'
  | 'lock'
  | 'trash'
  | 'user'
  | 'mouse';

interface IconProps {
  name: IconName;
  size?: number;
  className?: string;
  strokeWidth?: number;
}

const PATHS: Record<IconName, string> = {
  'arrow-right': 'M4 12h16M14 6l6 6-6 6',
  'arrow-up-right': 'M7 17 17 7M8 7h9v9',
  close: 'M5 5l14 14M19 5 5 19',
  menu: 'M4 7h16M4 12h16M4 17h16',
  search: 'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm9 2-5.2-5.2',
  bag: 'M6 8h12l-1 12H7L6 8Zm3 0V6a3 3 0 0 1 6 0v2',
  play: 'M8 5v14l12-7L8 5Z',
  star: 'M12 3l2.7 6.2 6.6.6-5 4.5 1.5 6.5L12 17.5 6.2 20.8l1.5-6.5-5-4.5 6.6-.6L12 3Z',
  quote: 'M9 7H5a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h2v2a2 2 0 0 1-2 2v2a4 4 0 0 0 4-4V8a1 1 0 0 0-1-1Zm10 0h-4a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h2v2a2 2 0 0 1-2 2v2a4 4 0 0 0 4-4V8a1 1 0 0 0-1-1Z',
  'chevron-left': 'M15 5 8 12l7 7',
  'chevron-right': 'M9 5l7 7-7 7',
  check: 'M4 12l5 5L20 6',
  mail: 'M4 6h16v12H4V6Zm0 0 8 7 8-7',
  phone: 'M6 3h3l2 5-2.5 1.5a12 12 0 0 0 6 6L16 13l5 2v3a2 2 0 0 1-2 2A17 17 0 0 1 4 5a2 2 0 0 1 2-2Z',
  pin: 'M12 22s7-6.6 7-12a7 7 0 1 0-14 0c0 5.4 7 12 7 12Zm0-9a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z',
  instagram: 'M4 8a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v8a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V8Zm8 1.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Zm4.6-2.4h.01',
  facebook: 'M14 8.5h2.5V5.5H14A3.5 3.5 0 0 0 10.5 9v2H8v3h2.5v7H14v-7h2.2l.4-3H14V9c0-.3.2-.5.5-.5Z',
  x: 'M4.5 4.5 19.5 19.5M19.5 4.5 4.5 19.5',
  pinterest: 'M12 3a9 9 0 0 0-3.2 17.4c-.1-.7-.2-1.8 0-2.6l1.3-5.5s-.3-.7-.3-1.6c0-1.5.9-2.6 2-2.6.9 0 1.4.7 1.4 1.5 0 .9-.6 2.3-.9 3.5-.3 1.1.5 1.9 1.6 1.9 1.9 0 3.2-2.4 3.2-5.3 0-2.2-1.5-3.8-4.2-3.8-3.1 0-5 2.3-5 4.8 0 .9.3 1.5.7 2l.2.2-.1.7c0 .2-.2.8-.3 1-.1.2-.3.2-.5.1-1.4-.6-2.1-2.2-2.1-4 0-3 2.5-6.6 7.5-6.6 4 0 6.6 2.9 6.6 6 0 4.1-2.3 7.1-5.6 7.1-1.1 0-2.2-.6-2.5-1.3l-.7 2.6c-.2.9-.9 2-1.3 2.7A9 9 0 1 0 12 3Z',
  youtube: 'M5 8a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3V8Zm6 1.5v5l4-2.5-4-2.5Z',
  download: 'M12 4v11m0 0-4-4m4 4 4-4M5 19h14',
  calendar: 'M5 6h14v14H5V6Zm0 4h14M8 3v5m8-5v5',
  clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-14v5l3.5 2',
  plus: 'M12 5v14M5 12h14',
  minus: 'M5 12h14',
  hourglass: 'M6 3h12M6 21h12M7 3c0 5 4 7 5 9-1 2-5 4-5 9M17 3c0 5-4 7-5 9 1 2 5 4 5 9',
  shield: 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3Z',
  gem: 'M6 3h12l4 6-10 12L2 9l4-6Zm0 0 6 6 6-6M2 9h20M12 9v12',
  compass: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm3.5-12.5-2 5-5 2 2-5 5-2Z',
  infinity: 'M8.5 9a3.5 3.5 0 1 0 0 6c1.9 0 3-1.7 3.5-3 .5 1.3 1.6 3 3.5 3a3.5 3.5 0 1 0 0-6c-1.9 0-3 1.7-3.5 3-.5-1.3-1.6-3-3.5-3Z',
  medal: 'M12 3l2.6 5.3L20 9l-4 4 1 5.6-5-2.6-5 2.6 1-5.6-4-4 5.4-.7L12 3Z',
  gear: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm7-3a7 7 0 0 0-.2-1.6l2-1.6-2-3.4-2.3.9a7 7 0 0 0-2.7-1.6L13.4 2h-2.8l-.4 2.7a7 7 0 0 0-2.7 1.6l-2.3-.9-2 3.4 2 1.6a7 7 0 0 0 0 3.2l-2 1.6 2 3.4 2.3-.9a7 7 0 0 0 2.7 1.6l.4 2.7h2.8l.4-2.7a7 7 0 0 0 2.7-1.6l2.3.9 2-3.4-2-1.6c.1-.5.2-1 .2-1.6Z',
  card: 'M3 7h18v11H3V7Zm0 4h18M6 15h4',
  lock: 'M6 11V8a6 6 0 1 1 12 0v3m-13 0h14v9H5v-9Z',
  trash: 'M4 7h16M9 7V4h6v3m-8 0 1 13h10l1-13',
  user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 9c0-3.9 3.1-7 7-7s7 3.1 7 7',
  mouse: 'M12 3a5 5 0 0 0-5 5v8a5 5 0 0 0 10 0V8a5 5 0 0 0-5-5Zm0 4v3',
};

const FILLED_ICONS = new Set<IconName>(['play', 'star', 'quote', 'facebook', 'medal']);

export const Icon = ({ name, size = 20, className, strokeWidth = 1.6 }: IconProps) => {
  const filled = FILLED_ICONS.has(name);

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <path
        d={PATHS[name]}
        fill={filled ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth={filled ? 0 : strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
