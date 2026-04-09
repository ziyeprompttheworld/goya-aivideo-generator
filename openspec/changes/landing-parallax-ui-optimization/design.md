## Context

We have successfully integrated the Aurora shader. Now we need to sync the UI elements with the scroll behavior to create a professional depth effect. We will leverage `framer-motion` which is already a core dependency.

## Goals / Non-Goals

**Goals:**
- Create a multi-layered parallax effect (Foreground UI / Content / Aurora Background).
- Improve readability using refined glassmorphism and contrast boosters.
- Ensure smooth 60fps animations even on mobile.

**Non-Goals:**
- Redesigning the core layout structure.
- Adding complex 3D models (pure UI/Shader parallax only).

## Decisions

### 1. Parallax Implementation Strategy
- **Decision**: Use `framer-motion`'s `useScroll` hook combined with `useTransform`.
- **Rationale**: It provides high performance by utilizing CSS transforms and is easily composable within React components.
- **Layers**:
  - **Distant**: `AuroraBackground` (Y-offset: 10% scroll speed)
  - **Middle**: Section content (Floating cards, text)
  - **Foreground**: Hero text and primary CTA highlights (Y-offset: -15% scroll speed)

### 2. Glassmorphism Refinement
- **Decision**: Standardize on `backdrop-blur-xl` and `bg-slate-900/40` for dark mode sections.
- **Rationale**: XL blur provides enough distortion to make text readable over high-contrast aurora highlights without losing the "glass" feel.
- **Action**: Update `HeroSection`, `FeaturesSection`, and `PricingSection` cards.

### 3. Aurora Background Integration
- **Decision**: Add a `scrollY` uniform to the `AuroraBackground` component.
- **Rationale**: Allows the shader logic to shift vertically as the user scrolls, making it feel like it occupies a 3D volume behind the page.

## Risks / Trade-offs

- **Risk**: "Jittery" scrolling on mobile due to heavy R3F + Framer Motion.
  - **Mitigation**: Use `whileInView` sparingly and ensure `layoutShift` is minimized. Use `will-change-transform` for parallax layers.
- **Risk**: Background appearing too bright in some sections.
  - **Mitigation**: Add a subtle dynamic overlay (gradient) that darkens the background as you move into content-heavy sections like FAQ or Footer.
