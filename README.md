# sketch-illustrations

A React Router 7 application that showcases a curated catalog of hand-drawn, CC0-licensed SVG illustrations. Users can search, filter, preview, copy, or download artwork that is optimized for presentations, whiteboards, and product mockups. All interaction currently relies on typed mock data so the experience works out of the box without external services.

## Features

- **Home experience** – Hero messaging, featured illustrations, and highlighted categories sourced from `app/lib/server/mock-data.server.ts`.
- **Category explorer** – `/categories` lists all mock categories with grid/list toggle, keyword filtering, and quick navigation into detail pages.
- **Category detail pages** – `/category/:slug` shows all illustrations for a category, with client-side tag filters and search.
- **Search workspace** – `/search` supports combined keyword + category filtering, showing live results and applied filter chips.
- **Copy & download utilities** – SVGs can be copied as raw markup or rendered to PNG inside the browser via an offscreen canvas (no backend dependency). PNG downloads fall back automatically when the Clipboard API is unavailable.
- **Responsive UI kit** – Built with Tailwind CSS 4, Radix primitives, `lucide-react` icons, and custom components in `app/components`.

## Tech stack

- **Runtime**: React 19, React Router v7 (file-system routes)
- **Build tooling**: Vite 6, @react-router/dev, Cloudflare Vite plugin
- **Styling**: Tailwind CSS 4 + Tailwind Merge, Radix UI components
- **Data / Utilities**: Zod for typing, Drizzle ORM schemas (future integration), Sonner toast notifications
- **Quality & DX**: TypeScript 5.8, Biome for lint + format, Vitest, Husky githooks, Wrangler CLI integration

## Getting started

1. **Install dependencies**
   ```bash
   npm install
   ```
2. **Environment variables** (optional for local mock setup)
   ```bash
   cp .env.example .env
   cp .env.example .dev.vars
   ```
   > The current UI uses in-repo mock data. The `.env` files prepare the app for future Drizzle/D1 + better-auth usage.
3. **Start the dev server**
   ```bash
   npm run dev
   ```
   This launches `react-router dev` with an Edge-compatible SSR runtime at http://localhost:5173.

### Production build & preview

```bash
npm run build
npm run preview
```

### Deployment (Cloudflare Workers / Pages)

```bash
npm run deploy
```

Ensure you are authenticated with `wrangler` and have configured the project in `wrangler.jsonc` before deploying.

## Available scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the Edge-compatible development server. |
| `npm run build` | Build the production bundle (React Router asset server). |
| `npm run preview` | Preview the production build locally. |
| `npm run deploy` | Build and deploy via Wrangler. |
| `npm run typecheck` | Generate type definitions (wrangler + react-router) and run TypeScript project references. |
| `npm run check` | Typecheck followed by Biome lint/format. |
| `npm run biome:check` | Run Biome lint with auto-fixes and formatting. |
| `npm run test` | Execute Vitest test suites. |
| `npm run db:*` | Scaffold and run Drizzle migrations (local + production). |
| `npm run auth:db:generate` | Generate better-auth schema against a local D1 instance. |

## Project structure highlights

```
app/
  components/            # Reusable UI building blocks and hooks
  lib/                   # Mock data, API helpers, type definitions, utilities
  routes/                # React Router route modules (layouts, pages, metadata)
  root.tsx               # Global document, theme, and router wiring
  entry.server.tsx       # Edge/SSR entry point
public/illustrations/    # CC0 SVG assets served statically
workers/                 # Cloudflare Worker entry (request handler)
database/                # Drizzle ORM schemas (not wired to mock app yet)
```

## PNG conversion details

- Conversion is handled entirely in the browser within `conversionApi.convertToPng` (`app/lib/api.ts`).
- The helper fetches an illustration's SVG, draws it to an offscreen `<canvas>`, and returns a PNG `Blob`.
- `use-copy-download` and components like `IllustrationCard` use this blob to drive clipboard copy or file download actions.
- Because the workflow is client-only, there is no need to manage WASM modules or backend endpoints, which simplifies Cloudflare deployment.

## Assets & licensing

All sample illustrations live under `public/illustrations` and are treated as CC0 assets. Replace these files with your own artwork as needed; update the mock data or wire the pages to a real data source for production usage.

## Future integration notes

- Drizzle + Cloudflare D1 schemas exist but are not currently queried. When you connect to a live database, replace `app/lib/server/mock-data.server.ts` with loaders/actions that read from Drizzle.
- Authentication scaffolding (`better-auth`) is provisioned by scripts but unused by the mock UI. Remove or implement it depending on product requirements.
- If you reintroduce server-side SVG rendering (e.g., via Resvg), keep in mind the deployment environment (Cloudflare Edge vs Node) and avoid Node-only APIs in Workers.

## Contributing

1. Create a feature branch (`git checkout -b feature/...`).
2. Run `npm run check` before opening a PR to ensure linting, formatting, and type checks pass.
3. Add or update tests with `npm run test` when you change logic or components.

---

Built with ❤️ to help designers and developers reuse sketch-style illustrations quickly.
