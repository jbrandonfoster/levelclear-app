interface SectionCardProps {
  title: string;
  content: string;
  highlighted?: boolean;
}

export function SectionCard({ title, content, highlighted = false }: SectionCardProps) {
  return (
    <div
      className={`rounded-lg p-6 mb-4 ${
        highlighted
          ? 'border-l-4 border-accent-gold bg-dark-card'
          : 'bg-dark-card border border-dark-border'
      }`}
    >
      <h3 className="text-lg font-semibold text-accent-gold mb-3">{title}</h3>
      <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{content}</p>
    </div>
  );
}
