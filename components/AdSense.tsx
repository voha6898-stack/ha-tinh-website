import Script from "next/script";

export default function AdSense() {
  const adSenseId = process.env.NEXT_PUBLIC_ADSENSE_ID;

  if (!adSenseId) {
    return null;
  }

  return (
    <Script
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adSenseId}`}
      strategy="afterInteractive"
      crossOrigin="anonymous"
    />
  );
}
