## Why

To provide a new visual aesthetic for the Goya.ai landing page, we are replacing the current Aurora background with a "Seascape" shader. This change aims to create a more dynamic and immersive "Seedance 2.0" experience, leveraging high-performance GLSL rendering to enhance user engagement.

## What Changes

- **New Component**: Implement `SeascapeBackground.tsx`, a React Three Fiber component rendering the classic "Seascape" shader by Alexander Alekseev.
- **Background Swap**: Replace the `AuroraBackground` component with `SeascapeBackground` in `src/components/landing/hero-section.tsx`.
- **Motion Integration**: Ensure the new background supports the previously implemented scroll-based parallax logic (shifting camera Y or uniforms based on `iScroll`).
- **UI Refresh**: Adjust glassmorphism parameters (blur, opacity) if necessary to ensure optimal legibility against the new blue/green color palette of the Seascape shader.

## Capabilities

### New Capabilities
- `landing-seascape-background`: A full-screen interactive ocean shader background for the landing page.

### Modified Capabilities
- `landing-parallax-motion`: Integrating the seascape shader into the existing scroll-linked parallax system.

## Impact

- `src/components/SeascapeBackground.tsx`: New R3F background component.
- `src/components/landing/hero-section.tsx`: Component swap and style adjustments.
- `src/components/AuroraBackground.tsx`: Likely to be retired or archived in favor of the new background.
