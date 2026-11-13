# Google Analytics 4

## Scope

Add GA4 to the shared BaseLayout with a small consent component, client script,
analytics privacy page, configuration, setup notes and consent regression tests.
No account creation, Google Ads integration, or deployment is performed locally.

## Acceptance criteria

- A missing or invalid Measurement ID leaves analytics and its consent UI inactive.
- Tracking runs only on aristurtle.gr and www.aristurtle.gr.
- No Google script loads before affirmative analytics consent (basic consent mode).
- Accept and reject have equal prominence; the choice lasts 180 days locally.
- Visitors can change their choice from an Analytics settings button on every page.
- Acceptance configures GA4 once per page; advertising consent stays denied.
- Withdrawal disables tracking, deletes the default GA cookies and reloads if the
  Google script was loaded, preventing further tracking on the fresh page.
- Inaccessible browser storage does not break page navigation or consent controls.
- The disclosure explains the analytics provider, purpose, cookies and withdrawal.
- Consent tests and pnpm.cmd run build pass. Browser inspection was previously
  unavailable; the user has requested skipping it if unavailable.

## Pending external setup

The user supplied Measurement ID `G-NSX1MTW4E6`, now configured in the site.
Upload the rebuilt site and verify consented traffic in GA4 Realtime after deployment.
