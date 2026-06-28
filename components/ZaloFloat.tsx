"use client";

import { Phone } from "lucide-react";
import { useState } from "react";

export default function ZaloFloat() {
  const [zaloHovered, setZaloHovered] = useState(false);
  const [phoneHovered, setPhoneHovered] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-3">
      {/* Phone button */}
      <div className="relative">
        {phoneHovered && (
          <div className="absolute right-16 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-lg bg-gray-800 px-3 py-1.5 text-sm text-white shadow-lg">
            Gọi điện ngay
            <span className="absolute right-[-6px] top-1/2 -translate-y-1/2 border-4 border-transparent border-l-gray-800" />
          </div>
        )}
        <a
          href="tel:+84000000000"
          aria-label="Gọi điện"
          onMouseEnter={() => setPhoneHovered(true)}
          onMouseLeave={() => setPhoneHovered(false)}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-600 shadow-lg transition-transform duration-200 hover:scale-110 hover:bg-gray-700"
        >
          <Phone className="h-6 w-6 text-white" strokeWidth={2} />
        </a>
      </div>

      {/* Zalo button */}
      <div className="relative">
        {zaloHovered && (
          <div className="absolute right-16 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-lg bg-gray-800 px-3 py-1.5 text-sm text-white shadow-lg">
            Liên hệ qua Zalo
            <span className="absolute right-[-6px] top-1/2 -translate-y-1/2 border-4 border-transparent border-l-gray-800" />
          </div>
        )}

        {/* Pulse ring */}
        <span className="absolute inset-0 rounded-full bg-[#0068FF] opacity-30 animate-ping" />

        <button
          onClick={() => window.open("https://zalo.me/0000000000", "_blank")}
          aria-label="Liên hệ qua Zalo"
          onMouseEnter={() => setZaloHovered(true)}
          onMouseLeave={() => setZaloHovered(false)}
          className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#0068FF] shadow-lg transition-transform duration-200 hover:scale-110 hover:brightness-110"
        >
          {/* Zalo "Z" logo */}
          <svg
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8"
            aria-hidden="true"
          >
            <text
              x="50%"
              y="50%"
              dominantBaseline="central"
              textAnchor="middle"
              fill="white"
              fontSize="22"
              fontWeight="bold"
              fontFamily="Arial, sans-serif"
              letterSpacing="-1"
            >
              Z
            </text>
          </svg>
        </button>
      </div>
    </div>
  );
}
