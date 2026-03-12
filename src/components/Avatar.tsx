interface AvatarProps {
  name?: string;
  image?: string;
  size?: 'sm' | 'md' | 'lg';
  dayNumber?: number;
}

const sizeClasses = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-16 h-16 text-lg',
};

const colors = [
  'bg-purple-600',
  'bg-blue-600',
  'bg-indigo-600',
  'bg-pink-600',
  'bg-rose-600',
  'bg-violet-600',
];

function getColorForName(name: string): string {
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
}

function getInitials(name?: string): string {
  if (!name) return '?';
  return name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

export function Avatar({ name = 'User', image, size = 'md', dayNumber }: AvatarProps) {
  const initials = getInitials(name);
  const bgColor = getColorForName(name);

  return (
    <div className="relative inline-flex">
      {image ? (
        <img
          src={image}
          alt={name}
          className={`${sizeClasses[size]} rounded-full object-cover`}
        />
      ) : (
        <div
          className={`${sizeClasses[size]} ${bgColor} rounded-full flex items-center justify-center font-semibold text-white`}
        >
          {initials}
        </div>
      )}
      {dayNumber && (
        <div className="absolute -bottom-1 -right-1 bg-accent-gold text-dark-bg text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
          {dayNumber}
        </div>
      )}
    </div>
  );
}
