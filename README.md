# Yourin — Beyond the Screen

An immersive, full-viewport 3D portfolio for Ahmad Rizqy Yourin. Scrolling moves a persistent camera through five chapters; the MacBook turns through multiple revolutions and is surrounded by interactive project surfaces, a toolkit orbit, and career milestones. Detailed CV content opens only on request.

## Run

```bash
npm install
npm run dev
```

Open http://localhost:3000.

```bash
npm run build
npm run lint
npx playwright install chromium
npm test
```

## Interactions

- Scroll or swipe vertically to travel through Enter, Work, Stack, Journey, and Connect.
- Chapter navigation, the Index menu, arrow keys, Page Up/Down, Home, and End provide direct navigation.
- Free Explore enables 360-degree manual orbit. Return to Scroll Mode to restore the camera choreography.
- Click a project surface, floating label, skill node, or career milestone to open details.
- Pause stops ambient motion. Reduced-motion users get immediate navigation and camera placement without float or continuous rotation.
- Keyboard-accessible chapter actions expose the same information as the 3D objects.
- The model load failure state offers retry and direct content access.

## Stack & files

Next.js App Router, TypeScript, Tailwind CSS, shadcn/Radix components, Lucide, Motion, Three.js, React Three Fiber, and Drei. No external font or model requests are needed at runtime for the 3D scene.

- `src/app/page.tsx`: journey navigation, scroll state, accessible content dialogs.
- `src/components/macbook.tsx`: camera choreography, imported model, interactive 3D artifacts.
- `src/lib/journey.ts`: chapter labels.
- `src/lib/portfolio.ts`: project, skill, and certification data.
- `src/lib/screen-texture.ts`: generated display artwork.
- `src/app/globals.css`: full-screen composition and responsive HUD.

## Model attribution

[MacBook](https://sketchfab.com/3d-models/macbook-289c013e6c0541f498d4c6b40045db88) by [M I H](https://sketchfab.com/imamulhasan), [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). The owner-supplied `macbook/source/ASSET.glb` is preserved in the source folder. Its web version at `public/models/macbook.glb` is 7.5 MB, with unchanged geometry and embedded textures resized to 2048px. Regenerate it with `node scripts/prepare-model.mjs`. Scene adaptations: scale, placement, custom screen overlay, lighting, and motion. Attribution is available through Credits and `public/models/LICENSE.md`.

Project artwork is illustrative. No project/certificate URLs or downloadable CV were provided, so none are invented.

Visual direction references: [United Carriers](https://unitedcarriers.com) and [NexStudio](https://nexstudio.tech). The portfolio uses original UI, scene choreography, and artwork; no assets from those sites are copied.
