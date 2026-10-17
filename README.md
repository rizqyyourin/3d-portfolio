# Ahmad Rizqy Yourin — Portfolio

Personal portfolio for Ahmad Rizqy Yourin, a fullstack developer based in Jakarta. The page is framed as a rounded, macOS-inspired window: a two-column introduction with a profile photo, three featured projects, three embedded Threads posts, and a grouped tech stack.

## Run

```bash
bun install
bun dev
```

Open http://localhost:3000.

```bash
bun run build
bun run lint
bunx playwright install chromium
bun run test
```

## Sections

- **Introduction** (`#about`) — name, a two-paragraph summary, actions to start an email or open the CV, and the profile photo.
- **Built Projects** (`#projects`) — Kohi Cafe, QPAY, and Ticketin. Each card links to its live site.
- **Threads** — three posts rendered through the Threads embed script.
- **Tech Stack** — frontend, backend, database, and tools & deployment groups, each with a mark per technology.
- **Footer** — GitHub, email, LinkedIn, Instagram, Threads, and the current year.

## Behaviour

- The theme toggle in the header switches light and dark, stores the choice under `portfolio-theme`, and animates the change with a circular view transition where the browser supports it.
- Mobile navigation opens from the header, closes on Escape, and returns focus to the toggle button.
- Hero elements enter on load; each section reveals once on scroll. Project cards and stack groups add restrained hover feedback.
- Images show a skeleton while loading and a text fallback if they fail to load.
- Threads embeds track their own load state and fall back to a plain "View on Threads" link.
- A skip link jumps straight to the introduction.

## Stack

Next.js App Router, TypeScript, Tailwind CSS, Motion, Phosphor Icons, and simple-icons, with Radix and lucide behind the UI primitives.

At runtime the page loads the Satoshi webfont from Fontshare and the Threads embed script from `threads.com`. No other requests are made.

## Files

- `src/app/page.tsx`: page composition, reveal animations, and the project, Threads, and tech stack sections.
- `src/app/layout.tsx`: metadata and the Fontshare stylesheet link.
- `src/app/globals.css`: window frame, light and dark variables, responsive sections, skeleton styles.
- `src/components/ui/animated-theme-toggler.tsx`: theme toggle.
- `src/components/ui/button.tsx`, `dialog.tsx`: shadcn/Radix primitives kept for reuse; nothing imports them yet.
- `src/lib/portfolio.ts`: project, skill, and certification data. The page renders the skill groups.
- `src/lib/utils.ts`: class name helper.
- `tests/portfolio.spec.ts`: Playwright coverage for layout, content, and reveals.
- `public/images`: profile photo and project covers. `public/cv`: the CV PDF linked from the header and hero.

## Content

The name, introduction, profile photo, project covers and links, and the CV PDF come from the owner's material. `src/lib/portfolio.ts` still holds longer project write-ups and the certification list, which the current design does not render.

Visual direction follows the owner-supplied reference recorded in `DESIGN.md`: a quiet, spacious personal portfolio in a rounded macOS-inspired frame.
