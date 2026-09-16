# betway-booking-frontend

Next.js (App Router, TypeScript, Tailwind CSS v4) UI for the Betway Nigeria booking-code
product — Decode, Create, and Convert screens over
[`betway-booking-backend`](../backend). Never calls Betway directly.

Design: [Claude Design canvas](https://claude.ai/artifact/X28GaTC2QPLeU9hVkUTuKD), tokens
extracted verbatim into `../docs/design-tokens.md` — read that file before changing any
color/spacing/typography value here. System architecture and sequence diagrams live in the
`betway-booking-backend` repo's `docs/architecture.md` (the backend is the hub all three
repos share; checked out as a sibling directory that's `../backend/docs/architecture.md`).

## Screens

- `/decode` — paste a code, see every selection with its odds and bettable status
- `/create` — sport → event → market picker with a running slip sidebar, generates a code
- `/convert` — paste a code, drops dead legs, generates a fresh code (kept vs removed)

## Dev setup

Requires [`betway-booking-backend`](../backend) running locally first (see its README —
`docker compose up -d && npx prisma migrate dev && npm run dev`), with `CORS_ORIGIN` set to
match wherever this dev server runs.

```
cp .env.local.example .env.local   # NEXT_PUBLIC_API_URL, defaults to http://localhost:3000
npm install
npm run dev
```

## Build

```
npm run build
npm run lint
```

No automated test suite — the backend already covers the business logic (decode/create/
convert edge cases); this repo is verified by exercising each screen against the live
backend + live Betway data.
