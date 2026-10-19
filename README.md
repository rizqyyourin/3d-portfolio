# Ahmad Rizqy Yourin — Portfolio

Personal portfolio for Ahmad Rizqy Yourin, a fullstack developer based in Jakarta. The page is framed as a rounded, macOS-inspired window: a two-column introduction with a profile photo, three featured projects, three embedded Threads posts, a grouped tech stack, and freeCodeCamp and GitHub progress panels.

The site is a **Next.js static export** served as Cloudflare Workers static assets at [yourin.my.id](https://yourin.my.id).

## Run

```bash
bun install
bun dev
```

Open http://localhost:3000.

```bash
bun run build            # static export into out/
bun run lint
bun run test             # Playwright; needs `bunx playwright install chromium` once
bun run preview          # serve out/ through wrangler (Workers static assets)
bun run deploy           # build + wrangler deploy
bun run images:optimize  # rebuild public/images/*.webp from assets/source/*.png
bun run sync             # refresh both progress snapshots (freeCodeCamp and GitHub)
bun run freecodecamp:sync # refresh only src/lib/freecodecamp.ts
bun run github:sync      # refresh only src/lib/github.ts
```

## Deploy

`next.config.ts` sets `output: 'export'`, so `next build` writes a fully static site to `out/`. `wrangler.jsonc` publishes that directory as Workers static assets — there is no Worker script, so requests never execute code. Cloudflare bills static asset requests as free and unlimited, which is why this setup does not touch the Workers free-plan request quota.

Production deploys run through **Workers Builds**, connected to this repository:

| Setting | Value |
| --- | --- |
| Production branch | `main` |
| Build command | `bun run build` |
| Deploy command | `npx wrangler deploy` |
| Root directory | *(empty)* |

Worker name in the Cloudflare dashboard must stay `web-portfolio` to match `wrangler.jsonc`. If a build fails on the lockfile, set the build variable `BUN_VERSION=1.4.2` to match `packageManager`.

### Domain

`yourin.my.id` and `www.yourin.my.id` are Worker **custom domains**, declared in the `routes` array of `wrangler.jsonc`. Cloudflare creates and owns the matching DNS records, so those hostnames must not have hand-made A or CNAME records; an existing record makes the deploy fail with `already has externally managed DNS records`.

`routes` is authoritative: a deploy removes custom domains that are not listed, which is how a temporary staging hostname gets cleaned up. Add a hostname to `routes` to keep it.

A zone-level Single Redirect Rule sends `www` to the apex with a 301 while preserving the path and query string. `www` stays attached to the Worker as well, so the site still loads if that rule is ever removed.

Keep the following outside this project:

- `cafe`, `qpay`, and `ticketin` records, which still point at the VPS.
- The `google-site-verification` TXT records.

Rolling back means deleting both custom domains and adding `A` records for `yourin.my.id` and `www.yourin.my.id` pointing back at the origin.

## Sections

- **Introduction** (`#about`) — name, a two-paragraph summary, actions to open the LinkedIn profile or the CV, and the profile photo.
- **Built Projects** (`#projects`) — Kohi Cafe, QPAY, and Ticketin. Each card links to its live site.
- **Threads** — three posts rendered through the Threads embed script.
- **Tech Stack** — frontend, backend, database, and tools & deployment groups, each with a mark per technology.
- **Progress** (`#progress`) — two cards. freeCodeCamp shows total points and a rolling-year activity graph; GitHub shows the year's contribution count and its calendar-year graph. Both link to the matching profile.
- **Footer** — GitHub, email, LinkedIn, Instagram, Threads, and the current year.

## Behaviour

- The theme toggle in the header switches light and dark, stores the choice under `portfolio-theme`, and animates the change with a circular view transition where the browser supports it.
- Mobile navigation opens from the header, closes on Escape, and returns focus to the toggle button.
- Hero elements enter on load; each section reveals once on scroll. Project cards and stack groups add restrained hover feedback.
- Images show a skeleton while loading and a text fallback if they fail to load.
- Threads embeds track their own load state and fall back to a plain "View on Threads" link.
- The progress graphs shade each day by its activity intensity — freeCodeCamp derives the intensity from solved challenges, GitHub ships its own four levels. Each graph scrolls horizontally on narrow screens and shows when its snapshot was taken.
- A skip link jumps straight to the introduction.

## Stack

Next.js App Router, TypeScript, Tailwind CSS, Motion, Phosphor Icons, and simple-icons, with Radix and lucide behind the UI primitives. Deployed with Wrangler to Cloudflare Workers.

At runtime the page loads the Satoshi webfont from Fontshare, the Threads embed script from `threads.com`, and the Cloudflare Web Analytics beacon from `static.cloudflareinsights.com`. No other requests are made.

## Files

- `next.config.ts`: static export (`output: 'export'`) and `images.unoptimized`, because a static export has no image optimizer.
- `wrangler.jsonc`: Worker name and the `out/` assets directory, with `404-page` not-found handling.
- `src/app/page.tsx`: page composition, reveal animations, and the project, Threads, and tech stack sections.
- `src/app/layout.tsx`: metadata, the canonical URL, the Fontshare stylesheet link, and the Web Analytics beacon.
- `src/app/robots.ts`, `src/app/sitemap.ts`: generated `robots.txt` and `sitemap.xml`.
- `src/app/globals.css`: window frame, light and dark variables, responsive sections, skeleton styles.
- `src/components/ui/animated-theme-toggler.tsx`: theme toggle.
- `src/components/ui/button.tsx`, `dialog.tsx`: shadcn/Radix primitives kept for reuse; nothing imports them yet.
- `src/lib/portfolio.ts`: project, skill, and certification data. The page renders the skill groups.
- `src/lib/utils.ts`: class name helper.
- `scripts/optimize-images.mjs`: converts the source PNGs into the WebP files that ship.
- `scripts/lib/snapshot.mjs`: shared write-and-fallback plumbing for the snapshot scripts.
- `scripts/fetch-freecodecamp.mjs`, `scripts/fetch-github.mjs`: snapshot each profile; `bun run build` runs both before `next build`.
- `src/lib/freecodecamp.ts`, `src/lib/github.ts`: generated progress snapshots (summary number and per-day intensity) that the Progress cards render.
- `tests/portfolio.spec.ts`: Playwright coverage for layout, content, and reveals.
- `public/images`: the WebP profile photo and project covers. `public/cv`: the CV PDF linked from the header and hero.
- `assets/source`: the full-resolution PNG originals. They stay out of `out/`, so they are never deployed.

## Content

The name, introduction, profile photo, project covers and links, and the CV PDF come from the owner's material. `src/lib/portfolio.ts` still holds longer project write-ups and the certification list, which the current design does not render.

The footer year is baked into the HTML at build time, so it refreshes on the next deploy rather than in the browser.

The freeCodeCamp and GitHub progress snapshots work the same way: `bun run build` runs `bun run sync` first, which writes `src/lib/freecodecamp.ts` and `src/lib/github.ts`. Neither service can be read from the browser — the freeCodeCamp API is CORS-locked to `freecodecamp.org`, and GitHub's contribution calendar needs a token through GraphQL — so the site deliberately does not run a Worker to proxy them. The numbers refresh on the next deploy.

Visual direction follows the owner-supplied reference recorded in `DESIGN.md`: a quiet, spacious personal portfolio in a rounded macOS-inspired frame.
