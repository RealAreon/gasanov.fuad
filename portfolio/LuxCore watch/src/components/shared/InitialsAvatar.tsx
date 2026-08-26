import './InitialsAvatar.scss';

interface InitialsAvatarProps {
  name: string;
  size?: number;
}

const PALETTE = ['#c8a15a', '#8b642e', '#6f6a5f', '#b98650', '#9c8555'];

const getInitials = (name: string): string =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');

const getColorIndex = (name: string): number => {
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) hash = (hash + name.charCodeAt(i)) % PALETTE.length;
  return hash;
};

export const InitialsAvatar = ({ name, size = 56 }: InitialsAvatarProps) => (
  <div
    className="initials-avatar"
    style={{ width: size, height: size, fontSize: size * 0.36, background: PALETTE[getColorIndex(name)] }}
    aria-hidden="true"
  >
    {getInitials(name)}
  </div>
);
