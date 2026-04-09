## Why

To elevate the brand identity and improve the focus of the Goya.ai landing page, we need to transition to a highly curated, minimalist design aesthetic inspired by Adrian Zumbrunnen's portfolio. The current layout is visually busy. By applying this new styleguide (IBM Plex Mono, sparse typography, high contrast) on top of the newly implemented Seascape dynamic background, we will create a more intimate, premium, and focused user experience.

## What Changes

- **Typography overhaul**: Implement `IBM Plex Mono` as the primary interface font for the Hero section.
- **Hero layout redesign**: Remove heavy marketing copy and complex panels in favor of a clean, text-heavy greeting block.
- **Copy update**: 
  - Eyebrow: `ai video generation`
  - Headline: `make moving images.` (with "moving" highlighted in brand color `#008fff`).
  - Subheadline: `type a prompt. receive a film.`
- **CTA and Navigation**: Switch to a minimalist bordered CTA button (`→ start creating`) and a quiet, spaced-out top navigation bar.
- **Header integration**: Make the `HeroSection` and `Header` blend seamlessly with the aesthetic, relying on the Seascape shader's depth for visual interest rather than complex UI cards.

## Capabilities

### New Capabilities
- `minimalist-hero-ui`: A redesigned, typography-focused Hero section interface.

### Modified Capabilities
- `<empty>`

## Impact

- `src/components/landing/hero-section.tsx`: Complete overhaul of the foreground UI elements.
- `src/components/landing/header.tsx`: Simplify top navigation to match the concept's "topbar" style.
- `src/app/globals.css` / `tailwind.config.ts`: Bring in `IBM Plex Mono` and define the necessary typography tokens.
