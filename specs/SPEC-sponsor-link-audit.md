# Sponsor Link Audit

## Scope

Audit active public sponsor entries whose `website` currently points to `aristurtle.gr` as a placeholder. Preserve sponsor names, tiers, ordering, logos, and all existing verified non-placeholder links.

## Acceptance Criteria

- Every active sponsor that currently links to `aristurtle.gr` is checked for a current official company or institution website.
- A sponsor receives a replacement URL only when the destination can be matched confidently to that sponsor.
- If no official destination can be verified, the sponsor has no `website` value and clicking its honeycomb cell performs no navigation.
- Unlinked desktop honeycomb cells retain the same visible hover animation as linked cells but do not use link semantics or a pointer cursor.
- Sponsors without a verified dedicated destination, including Academia entries, render without an `href`; there is no generic fallback URL.
- No active sponsor resolves to `aristurtle.gr` after the audit.
- `pnpm run build` succeeds and the sponsor page has no broken link-related console errors.
