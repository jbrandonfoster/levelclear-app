import { SparkleIcon } from './Icons';

interface BadgeProps {
  name: string;
  description: string;
  earned: boolean;
}

const badgeEmojis: { [key: string]: string } = {
  'Day 1': '🌱',
  'One Week': '🏃',
  'Two Weeks': '💪',
  'The Valley': '🌊',
  'The Shift': '⚡',
  '60 Days': '🎯',
  '+1 Forever': '♾️',
  'Level 7': '👑',
};

export function Badge({ name, description, earned }: BadgeProps) {
  const emoji = badgeEmojis[name] || '⭐';

  return (
    <div
      className={`rounded-lg p-4 flex flex-col items-center text-center transition-all ${
        earned
          ? 'bg-dark-card border border-accent-gold'
          : 'bg-dark-card/50 border border-dark-border opacity-60'
      }`}
    >
      <div className="text-3xl mb-2">{emoji}</div>
      <h3 className="text-sm font-semibold text-white">{name}</h3>
      <p className="text-xs text-gray-400 mt-1">{description}</p>
      {earned && (
        <div className="flex items-center gap-1 mt-2 text-xs text-accent-gold">
          <SparkleIcon className="w-3 h-3" />
          Earned
        </div>
      )}
    </div>
  );
}
