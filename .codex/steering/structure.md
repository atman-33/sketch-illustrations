# Structure Guidance

- Treat `app/` as the source root: `app/root.tsx` defines the document shell, and `app/entry.server.tsx` handles Cloudflare Worker rendering.
- Keep reusable UI under `app/components/`; prefer existing subfolders such as `app/components/ui/` for Radix wrappers and `app/components/layout/` for page chrome.
- Organize route code in `app/routes/` using React Router’s filename conventions (`_app._index`, `_app.search._index`, `api.categories.$slug.illustrations`, etc.); nest layouts via directory prefixes starting with `_`.
- Store shared logic in `app/lib/` (`server/` for loaders that fetch JSON metadata, `hooks/` for client hooks, `constants/` for tokens) and keep type definitions centralized in `app/lib/types.ts`.
- Place utility helpers that need to run on both server and client in `app/utils/`; reference `app/utils/static-assets.ts` for asset loading behavior.
- Serve static assets from `public/`, including CC0 SVGs under `public/illustrations/`, metadata JSON in `public/metadata/`, and textures/favicons used by the UI.
- Maintain database and auth scaffolding under `database/`, `drizzle/`, and `app/lib/auth/` even if unused; do not repurpose those directories for unrelated code.
- Follow kebab-case for filenames (e.g., `illustration-card.tsx`) and keep TypeScript modules using arrow-function exports for components and utilities as seen across `app/components`.
