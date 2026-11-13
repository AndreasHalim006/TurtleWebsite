# Activate Google Analytics

1. Sign in to https://analytics.google.com using a team-owned Google account.
   Reuse the team's existing GA4 property if there is one. Otherwise create an
   account and property named ARISTURTLE, with Greece as the reporting time zone
   and EUR as the currency.
2. Create a Web data stream for https://aristurtle.gr. Copy its Measurement ID
   (G-...). Find it again in Admin > Data streams > the website stream.
3. Put the ID in `src/config/analytics.ts` as `analyticsMeasurementId`.
   This ID is public, not a password. Never paste account credentials there.
4. Keep enhanced page-view, scroll and outbound-click measurement enabled for
   the initial setup. Disable form interactions and site search if not needed.
   Outbound clicks include recruitment links to Google Forms and sponsor links;
   they do not confirm that someone submitted an application.
5. Keep Google signals and advertising personalization disabled. Do not add a
   second Google tag through Plesk or Google Tag Manager; the site loads it once.
6. Review the Analytics privacy page against the team's actual account settings.
   It describes website analytics, not all university or team data processing.
7. Run `node --test scripts/test-analytics-consent.mjs` and `pnpm.cmd run build`.
8. Upload all generated page HTML and the contents of dist/assets to Plesk's
   document root, including the new analytics-privacy/index.html. Every page
   now has shared analytics controls. Keep existing server configuration files.
9. On the live domain, visit in a private window and accept analytics. Open
   Reports > Realtime in GA4 and confirm a visit. Standard reports take longer.
   Rejected visits deliberately do not appear. Localhost and preview domains
   deliberately do not load analytics. Ad blockers can also suppress tracking.
10. Check rejection in a fresh private session: no googletagmanager.com script
    or google-analytics.com collection request should load. Test Analytics
    settings > Reject analytics after accepting; the page reloads without GA.

Official references:
- https://support.google.com/analytics/answer/14183469
- https://developers.google.com/tag-platform/security/concepts/consent-mode
- https://developers.google.com/tag-platform/security/guides/consent
- https://developers.google.com/tag-platform/security/guides/privacy
- https://support.google.com/analytics/answer/11397207
- https://support.google.com/analytics/answer/11598602

Local verification cannot confirm delivery to a real property before its ID is
provided and the integration is deployed. The consent tests exercise the client
logic with browser stubs; they do not replace live network verification.
