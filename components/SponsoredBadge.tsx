interface SponsoredBadgeProps {
  type: 'sponsored' | 'affiliate' | 'featured';
}

const BADGE_CONFIG = {
  sponsored: {
    label: 'Tài trợ',
    className: 'bg-orange-100 text-orange-700 border border-orange-200',
  },
  affiliate: {
    label: 'Liên kết thương mại',
    className: 'bg-gray-100 text-gray-600 border border-gray-200',
  },
  featured: {
    label: 'Nổi Bật ⭐',
    className: 'bg-yellow-50 text-yellow-700 border border-yellow-300',
  },
} as const;

export default function SponsoredBadge({ type }: SponsoredBadgeProps) {
  const { label, className } = BADGE_CONFIG[type];

  return (
    <span
      className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${className}`}
    >
      {label}
    </span>
  );
}
