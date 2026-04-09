## Why

The current hero section background (Black Hole) is being updated to an Aurora-themed shader to align with the "Seedance 2.0" professional and immersive branding. This change provides a superior "wow" factor with better visual depth and performance optimizations specifically for the landing page.

## What Changes

- Replaced existing `BlackHoleBackground` with the newly created `AuroraBackground` component in the Hero section.
- Ensured the background is properly layered behind the video generator UI with a `-z-10` index.
- Cleaned up imports and unused background components in `HeroSection.tsx`.

## Capabilities

### New Capabilities
- `hero-aurora-background`: Provides a full-screen, responsive, and performance-optimized Aurora shader background for the landing page.

### Modified Capabilities
- None

## Impact

- **Affected Components**: `src/components/landing/hero-section.tsx`.
- **New Files**: `src/components/AuroraBackground.tsx` (already created).
- **Styling**: Minor z-index adjustments to ensure UI overlays correctly.
