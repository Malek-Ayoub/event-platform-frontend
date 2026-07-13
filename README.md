# Event Platform Frontend

Monorepo for Event Platform client applications (Sprint 0.1 infrastructure shell).

## Requirements

- Node.js 22+
- pnpm 9+

## Commands

```bash
pnpm install
pnpm build
pnpm typecheck
pnpm lint
```

### Development (per app)

```bash
pnpm --filter @event-platform/public-web dev   # :3000
pnpm --filter @event-platform/organizer dev    # :3001
pnpm --filter @event-platform/admin dev        # :3002
pnpm --filter @event-platform/scanner dev      # :3003
```

## Apps

| App        | Stack            | Port |
| ---------- | ---------------- | ---- |
| public-web | Next.js 15       | 3000 |
| organizer  | Next.js 15       | 3001 |
| admin      | Next.js 15       | 3002 |
| scanner    | Vite + React PWA | 3003 |
