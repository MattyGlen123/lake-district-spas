'use client';

import { useEffect } from 'react';
import Script from 'next/script';
import { initOutboundClickTracker } from '@/lib/outboundClickTracker';

export default function GoogleAnalytics() {
  const isProduction = process.env.NODE_ENV === 'production';
  const isLocalhost =
    typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1');

  const enabled = isProduction && !isLocalhost;

  // The click tracker used to be a second inline <Script> that hand-rolled
  // isExternalUrl/isProtocolHandler as a string (dangerouslySetInnerHTML) —
  // that copy could only drift from what the tests exercised. Since this is
  // already a client component, the tracker is a real imported module wired
  // up here via useEffect instead: one implementation, shipped and tested.
  useEffect(() => {
    if (!enabled) return;
    return initOutboundClickTracker();
  }, [enabled]);

  if (!enabled) {
    return null;
  }

  return (
    // Google Tag Manager - handles GA4 config + all event tags
    <Script
      id="google-tag-manager"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-55LJRB7F');
        `,
      }}
    />
  );
}
