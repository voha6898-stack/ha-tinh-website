"use client";

import { useEffect } from "react";

interface AdBannerProps {
  slot: string;
  format?: "auto" | "rectangle" | "horizontal";
  className?: string;
}

const sizeClasses: Record<NonNullable<AdBannerProps["format"]>, string> = {
  horizontal: "w-full h-24",
  rectangle: "w-[300px] h-[250px]",
  auto: "w-full",
};

export function AdBanner({ slot, format = "auto", className = "" }: AdBannerProps) {
  const adSenseId = process.env.NEXT_PUBLIC_ADSENSE_ID;
  const sizeClass = sizeClasses[format];

  useEffect(() => {
    if (!adSenseId) return;
    try {
      (
        (window as unknown as { adsbygoogle: unknown[] }).adsbygoogle =
          (window as unknown as { adsbygoogle: unknown[] }).adsbygoogle || []
      ).push({});
    } catch (_) {
      // adsbygoogle not yet available
    }
  }, [adSenseId]);

  if (!adSenseId) {
    return (
      <div
        className={`flex items-center justify-center border-2 border-dashed border-gray-300 bg-gray-100 text-gray-400 text-sm ${sizeClass} ${className}`}
      >
        Quảng cáo
      </div>
    );
  }

  return (
    <ins
      className={`adsbygoogle ${sizeClass} ${className}`}
      style={{ display: "block" }}
      data-ad-client={adSenseId}
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive={format === "auto" ? "true" : undefined}
    />
  );
}

export default AdBanner;
