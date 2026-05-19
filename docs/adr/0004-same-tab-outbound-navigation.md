# Same-tab outbound navigation with analytics delay

All external links navigate in the same tab (no `target="_blank"`). For HTTP/HTTPS booking links with `data-spa-id`, the GA tracker script intercepts the click, fires the analytics event, waits 200ms, then navigates via `window.location.href`. `mailto:` and `tel:` links are excluded from the delay — they don't cause page unload so the event is never at risk.

`rel` attributes are removed entirely. The previous `noopener noreferrer` was suppressing the HTTP Referer header, hiding lakedistrictspas.co.uk as the traffic source in partner spa analytics. Same-tab navigation sends the Referer header automatically — no `rel` needed.

Trade-off accepted: users navigating away from the site cannot return via the browser back button from the partner's site. This is preferred over the mobile UX cost of new-tab navigation, where users are left with orphaned tabs and no clear path back.

The `ExternalLink` icon (Lucide) is removed from all booking CTAs — it conventionally signals new-tab behaviour, which no longer applies.
