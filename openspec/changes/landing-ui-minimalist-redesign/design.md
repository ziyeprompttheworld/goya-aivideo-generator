## Context

The current `HeroSection` and `Header` utilize components from Magic UI, Framer Motion, and Aceternity, resulting in a somewhat noisy "Dashboard"-style marketing intro. The new goal is to strip down the visual interface so that it acts as a very restrained foreground overlaying the `SeascapeBackground`, reflecting a premium, confident "Apple/Azumbrunnen" aesthetic.

## Goals / Non-Goals

**Goals:**
- Add `IBM Plex Mono` to the Next.js font configuration and Tailwind.
- Apply the typographic rules defined in the Azumbrunnen concept (lowercase, high letter-spacing, specific opacities).
- Adapt the existing landing page header to a transparent, minimal style with wide spacing.
- Rebuild the core content of `hero-section.tsx` to match the exact rhythmic flow: Wordmark → Headline (with blue accent) → Subhead → Outline CTA.

**Non-Goals:**
- Completely rewriting the underlying `Header` routing logic and i18n logic (keep the hooks and functionality, just change the styles).
- Removing the `Video Generator` logic (if there is an input box, we may need to decide whether to hide it or redesign it to match the minimalist style; for now, we will lean into the concept HTML which only has a CTA button leading to the app, rather than embedding the input form in the hero).

## Decisions

### 1. Typography and Tailwind
- **Decision**: Import `IBM Plex Mono` from `next/font/google` in `layout.tsx` or define it globally in CSS. Add a custom font family `font-mono-plex` to `tailwind.config.ts`.
- **Rationale**: The concept relies heavily on the technical, typewriter feel of this specific monospace font.

### 2. Header / Top Navigation
- **Decision**: Update `LandingHeader` to look like the `.topbar` in the concept. Make it transparent, remove bulky navigation menus (or simplify them down to text links `work`, `about`, `pricing`, etc.), with `font-size: 10px`, high tracking `tracking-widest`.
- **Rationale**: Reduces the cognitive load at the top of the page.

### 3. Hero Content Override
- **Decision**: Replace the current `<motion.div>` hero text and badge with the simple CSS structure provided in the concept (using Tailwind utility classes).
  - Use `text-[11px] tracking-[0.22em] text-white/30` for the eyebrow.
  - Use `text-4xl text-white font-light leading-tight` for the headline.
  - Use `text-[#008fff]` for the accent color on "moving".
- **Rationale**: Exactly matches the user's requested styleguide.

### 4. CTA and Form Interaction
- **Decision**: Hide the inline `VideoGenerator` input box in the Hero section and replace it with the simple `→ start creating` outlined button that scrolls to or links to the generator/app.
- **Rationale**: To maintain the "restraint and negative space" philosophy of the Azumbrunnen styleguide, the dense UI of the generator must be deferred until the user explicitly clicks the call-to-action.

## Risks / Trade-offs

- **Risk**: Moving from an exposed input box to a CTA requires an extra click from the user to generate a video.
  - **Mitigation**: Ensure the CTA leads immediately to an immersive generator modal or the dedicated app interface with zero loading friction.
- **Risk**: The ultra-minimalist style might reduce the visibility of SEO and feature keywords.
  - **Mitigation**: Keep the semantic HTML tags (`<h1>`, `<h2>`) intact for SEO, ensuring the visual styling doesn't harm accessibility.
