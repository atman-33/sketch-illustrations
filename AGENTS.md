# AGENTS.md Contract

## Steering Documents
- Treat `.codex/steering/product.md` ("Product Guidance") as the product authority; cite sections instead of copying details.
- Treat `.codex/steering/tech.md` ("Tech Guidance") as the technical authority; reference relevant sections when summarizing decisions.
- Treat `.codex/steering/structure.md` ("Structure Guidance") as the structural authority; align directory and naming decisions with it.
- Use repository helpers to resolve Steering paths; avoid hardcoded absolute paths.
- Keep Steering files read-only; follow the sanctioned change-management flow for updates.

## Decision Precedence
1) Steering documents under `.codex/steering/*.md`.
2) This AGENTS.md contract (general repository conventions).
3) Generic assumptions only when explicitly allowed.

## Agent Behavior Contract
- Prefer project-provided CLI abstractions over ad-hoc process spawning.
- Respect feature flags and configuration gating documented in Steering or linked code.
- Use shared logging utilities; log key lifecycle and error paths without excess noise.
- Route failures through centralized services/utilities rather than standalone handlers.
- Honor performance and UX guidance from Steering so the environment stays responsive.

## Paths & I/O
- Prefer sanctioned filesystem helpers for workspace reads/writes/creates.
- Resolve Steering paths via approved utilities; avoid absolute path literals.
- Modify files only within approved workspace areas defined by project rules.
- Leave `.codex/steering` untouched; use the approved update flow for any changes.

## CLI Integration
- Build CLI commands through official builders or wrappers before direct execution.
- Reference approval modes and model flags from their definitions/tests instead of restating values.
- Verify required tooling before invocation and surface setup guidance when missing.

## Submission Checklist (For Agents)
- Verify decisions against `.codex/steering/*.md`; cite files/sections without duplication.
- Resolve Steering paths with approved utilities; avoid absolute paths.
- Respect feature flags and constraints documented by the project.
- Use sanctioned wrappers for CLI interactions when available.
- Avoid restating Steering content or code constants; keep deliverables concise and index-like.

## Non-Goals / Anti-Patterns
- Do not bypass official wrappers/utilities for CLI calls when they exist.
- Do not store state in globals beyond established singletons.
- Do not write outside approved directories or overwrite Steering directly.
- Do not re-enable disabled features unless explicitly requested.

## Instructions to Apply
- Write or update `AGENTS.md` at the repository root per this contract.
- Update existing AGENTS.md files in place to conform without duplicating Steering content.
