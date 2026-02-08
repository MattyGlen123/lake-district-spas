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

              document.addEventListener('click', function(e) {
                var btn = e.target.closest('[data-spa-id]');

                if (btn) {
                  var spaId = btn.dataset.spaId || '';
                  var clickIntent = btn.dataset.clickIntent || '';
                  var productName = btn.dataset.productName || 'none';

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
