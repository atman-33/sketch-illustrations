# Product Guidance

- Describe the app as a sketch-illustration catalog where users search, filter, preview, copy, and download CC0 SVG artwork (see README.md lines 1-40).
- Emphasize instant value: highlight that users can copy SVG or trigger PNG conversions client-side without backend services (see app/lib/api.ts and README.md PNG conversion section).
- Mention hero, featured illustrations, quick categories, and search workspace as the core user flows to preserve (see app/routes/* modules).
- Note that all illustration/category data currently comes from static JSON fetched via `fetchStaticJson` and cached in `app/lib/server/illustration-data.server.ts`; any changes must keep cache integrity and schema validation with Zod.
- Preserve clipboard and download fallbacks provided by `actionUtils` (see app/lib/api.ts and app/components/illustration-card.tsx) so users never lose copy/download capability.
- Call out CC0 licensing expectation for assets inside `public/illustrations`; advise verifying any new assets keep that promise.
- When extending features, keep the “instant, offline-ready” story: avoid introducing dependencies that require server connectivity unless product requirements change.
