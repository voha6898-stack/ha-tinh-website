import { ExternalLink } from 'lucide-react';

interface BookingButtonProps {
  bookingUrl?: string;
  agodaUrl?: string;
  klookUrl?: string;
  spotName: string;
}

export default function BookingButton({
  bookingUrl,
  agodaUrl,
  klookUrl,
  spotName,
}: BookingButtonProps) {
  if (!bookingUrl && !agodaUrl && !klookUrl) return null;

  return (
    <div className="mt-3">
      <div className="flex flex-wrap gap-2">
        {bookingUrl && (
          <a
            href={bookingUrl}
            target="_blank"
            rel="noopener noreferrer sponsored"
            aria-label={`Đặt phòng tại ${spotName} qua Booking.com`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white text-sm font-semibold"
            style={{ backgroundColor: '#003580' }}
          >
            Đặt phòng
            <ExternalLink size={13} />
          </a>
        )}

        {agodaUrl && (
          <a
            href={agodaUrl}
            target="_blank"
            rel="noopener noreferrer sponsored"
            aria-label={`Đặt phòng tại ${spotName} qua Agoda`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white text-sm font-semibold"
            style={{ backgroundColor: '#EC1C24' }}
          >
            Agoda
            <ExternalLink size={13} />
          </a>
        )}

        {klookUrl && (
          <a
            href={klookUrl}
            target="_blank"
            rel="noopener noreferrer sponsored"
            aria-label={`Đặt tour tại ${spotName} qua Klook`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white text-sm font-semibold"
            style={{ backgroundColor: '#FF6B2B' }}
          >
            Klook
            <ExternalLink size={13} />
          </a>
        )}
      </div>

      <p className="mt-1.5 text-xs text-gray-400">
        Chúng tôi có thể nhận hoa hồng khi bạn đặt qua liên kết này
      </p>
    </div>
  );
}
