import { Phone } from 'lucide-react';

interface BuyButtonProps {
  shopeeUrl?: string;
  lazadaUrl?: string;
  orderUrl?: string;
  orderPhone?: string;
  productName: string;
}

export default function BuyButton({
  shopeeUrl,
  lazadaUrl,
  orderUrl,
  orderPhone,
  productName,
}: BuyButtonProps) {
  if (!shopeeUrl && !lazadaUrl && !orderUrl && !orderPhone) return null;

  return (
    <div className="flex flex-wrap gap-2 mt-3">
      {shopeeUrl && (
        <a
          href={shopeeUrl}
          target="_blank"
          rel="noopener noreferrer sponsored"
          aria-label={`Mua ${productName} trên Shopee`}
          className="inline-flex items-center px-4 py-2 rounded-lg font-semibold text-white text-sm"
          style={{ backgroundColor: '#EE4D2D' }}
        >
          Mua trên Shopee
        </a>
      )}

      {lazadaUrl && (
        <a
          href={lazadaUrl}
          target="_blank"
          rel="noopener noreferrer sponsored"
          aria-label={`Mua ${productName} trên Lazada`}
          className="inline-flex items-center px-4 py-2 rounded-lg font-semibold text-white text-sm"
          style={{ backgroundColor: '#0F146D' }}
        >
          Mua trên Lazada
        </a>
      )}

      {orderUrl && (
        <a
          href={orderUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Đặt hàng ${productName} online`}
          className="inline-flex items-center px-4 py-2 rounded-lg font-semibold text-white text-sm bg-green-600 hover:bg-green-700 transition-colors"
        >
          Đặt hàng online
        </a>
      )}

      {orderPhone && (
        <a
          href={`tel:${orderPhone}`}
          aria-label={`Gọi đặt hàng ${productName}`}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg font-semibold text-white text-sm bg-green-500 hover:bg-green-600 transition-colors"
        >
          <Phone size={14} />
          Gọi đặt hàng: {orderPhone}
        </a>
      )}
    </div>
  );
}
