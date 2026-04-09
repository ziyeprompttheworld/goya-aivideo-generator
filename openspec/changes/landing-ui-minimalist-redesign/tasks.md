## 1. Typography and Styling Setup

- [x] 1.1 Configure `tailwind.config.ts` to include a custom font family for IBM Plex Mono.
- [x] 1.2 Import `IBM Plex Mono` via `next/font/google` in the main layout wrapper (`src/app/[locale]/layout.tsx`).

## 2. Header Simplification

- [x] 2.1 Update `LandingHeader` in `src/components/landing/header.tsx` to remove bulky dropdown menus and replace them with simple, highly-tracked text links.
- [x] 2.2 Adjust the `LandingHeader` styling to match the clean, uppercase (or lowercase spaced) conceptual design (e.g., smaller font size, high letter spacing).

## 3. Hero Section Refocus

- [x] 3.1 Strip out the existing Video Generator form card and badges from the Hero section in `hero-section.tsx`.
- [x] 3.2 Implement the minimal left-aligned text stack (Wordmark, Headline with blue accent spanning "moving", Subheadline).
- [x] 3.3 Add the minimalist `→ start creating` outlined button that scrolls down to the app/generator section.
- [x] 3.4 Ensure the typography classes exactly match the concept HTML (IBM Plex Mono, specific 300/400 weights, white/gray opacities).

## 4. QA and Verification

- [x] 4.1 Verify that the new font loads correctly and flashes of unstyled text are minimized.
- [x] 4.2 Ensure the layout looks perfectly balanced over the Seascape background on desktop and mobile viewports.

## 5. Showcase Visuals Update

- [ ] 5.1 Replace placeholder videos in `showcase-section.tsx` with downloaded Seedance 2.0 assets from `public/assets/seedance_showcase/`.
- [ ] 5.2 Implement horizontal marquee/scroller and refine the cinematic text badges.

## 6. Feature Matrix Realignment

- [ ] 6.1 Convert the Features section into a 6-column minimalist matrix with thin icons, matching the Raphael design.

## 7. Refined Pricing & CTA

- [ ] 7.1 Apply "Director/Studio" monochrome pricing layout.
- [ ] 7.2 Implement the Ghost Navigation (0 opacity to 1 on hover) in `header.tsx`.

