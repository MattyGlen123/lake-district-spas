'use client';

import Script from 'next/script';

export default function GoogleAnalytics() {
  return (
    <>
      {/* Google Tag Manager - handles GA4 config + all event tags */}
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

      {/* Spa outbound click tracker */}
      <Script
        id="spa-outbound-click-tracker"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              window.dataLayer = window.dataLayer || [];

              // Helper function to check if URL is external (http/https to different domain)
              function isExternalUrl(url) {
                if (!url) return false;
                // Skip relative URLs (internal links)
                if (!url.startsWith('http://') && !url.startsWith('https://')) {
                  return false;
                }
                try {
                  var urlObj = new URL(url, window.location.origin);
                  var currentHost = window.location.hostname;
                  var linkHost = urlObj.hostname;
                  // Check if it's external (different domain)
                  return linkHost !== currentHost && linkHost !== 'www.' + currentHost && 'www.' + linkHost !== currentHost;
                } catch {
                  return false;
                }
              }

              // Helper function to check if URL is a protocol handler (mailto, tel)
              function isProtocolHandler(url) {
                if (!url) return false;
                return url.startsWith('mailto:') || url.startsWith('tel:');
              }

              document.addEventListener('click', function(e) {
                var link = e.target.closest('a');
                if (!link || !link.href) return;

                // Use the resolved href (absolute URL) for external check
                var href = link.href;
                
                // Track external URLs OR protocol handlers (mailto, tel)
                var isExternal = isExternalUrl(href);
                var isProtocol = isProtocolHandler(href);
                
                if (!isExternal && !isProtocol) return;

                // Get spa ID from data attribute (required)
                var spaId = link.dataset.spaId || '';
                
                // Only fire event if we have a valid spa ID
                if (!spaId) return;

                // Get other data attributes if available
                var clickIntent = link.dataset.clickIntent || 'external-link';
                var productName = link.dataset.productName || 'none';

                // Fire the event for external links or protocol handlers with spa context
                window.dataLayer.push({
                  event: 'spa_outbound_click',
                  spa_id: spaId,
                  click_intent: clickIntent,
                  product_name: productName
                });
              });
            })();
          `,
        }}
      />
    </>
  );
}
