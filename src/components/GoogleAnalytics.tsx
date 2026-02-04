'use client';

import Script from 'next/script';

export default function GoogleAnalytics({
  GA_MEASUREMENT_ID,
}: {
  GA_MEASUREMENT_ID: string;
}) {
  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname
            });
          `,
        }}
      />
      <Script
        id="spa-outbound-click-tracker"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              // Ensure dataLayer exists
              window.dataLayer = window.dataLayer || [];
              
              // Event delegation: listen for clicks on document
              document.addEventListener('click', function(e) {
                // Find the closest element with data-spa-id attribute
                const btn = e.target.closest('[data-spa-id]');
                
                if (btn) {
                  // Extract data attributes
                  const spaId = btn.dataset.spaId || '';
                  const clickIntent = btn.dataset.clickIntent || '';
                  const productName = btn.dataset.productName || 'none';
                  
                  // Push custom event to dataLayer with parameters at top level
                  // Parameters are at top level so GA4 can see them immediately
                  window.dataLayer.push({
                    event: 'spa_outbound_click',
                    spa_id: spaId,
                    click_intent: clickIntent,
                    product_name: productName
                  });
                }
              });
            })();
          `,
        }}
      />
    </>
  );
}
