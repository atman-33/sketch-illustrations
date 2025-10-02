# Tech Guidance

- Use React 19 with React Router v7 file-system routes; follow existing pattern where route modules export loader/action plus default component (see app/routes/_app._index/route.tsx).
- Build with Vite 6 and `@react-router/dev`; keep Cloudflare Workers compatibility in mind (check package.json scripts and app/entry.server.tsx) and avoid Node-only APIs.
- Style UI with Tailwind CSS 4 configured via `app/app.css`; leverage `@theme` tokens and utility classes like `sketch-border` instead of ad-hoc CSS.
- Reuse component primitives from `app/components/ui` (Radix-based) and respect arrow-function exports for components (e.g., `Logo` in app/components/logo.tsx).
- Manage data through static JSON loaders in `app/lib/server/illustration-data.server.ts`, validating with Zod schemas from `app/lib/types.ts`.
- Reference helper APIs in `app/lib/api.ts` and `app/utils/static-assets.ts` for clipboard, downloads, and asset fetching rather than reimplementing.
- Run `npm run dev` for local development, `npm run build` + `npm run preview` for production verification, and `npm run deploy` for Cloudflare deployment (see README).
- Enforce quality gates with `npm run check` (typecheck + Biome), `npm run test` (Vitest), and `npm run biome:check` for lint/format fixes before committing.
- Follow Biome lint expectations already encoded (e.g., arrow functions, no enums, no `any`); avoid disabling lint rules unless justified and scoped.
- Use `npm run db:*` and `npm run auth:db:generate` only when wiring Drizzle/better-auth, keeping mock data flow intact otherwise.
