## Context

The Hero section currently uses a complex `BlackHoleBackground` which is visually heavy. We are replacing it with a more ethereal and professional `AuroraBackground` built with React Three Fiber. The component is already prepared and optimized for high-DPI displays and mouse interactivity.

## Goals / Non-Goals

**Goals:**
- Replace the Hero section background with the Aurora shader effect.
- Ensure the background is fully responsive and covers the entire viewport.
- Maintain accessibility and readability of the foreground UI (Video Generator).
- Optimize for high performance using GPU-accelerated rendering.

**Non-Goals:**
- Modifying the core video generation functionality.
- Changing the layout of the hero content or navbar.

## Decisions

### 1. Component Swap vs Wrapper
- **Decision**: Directly replace the `<BlackHoleBackground />` component with `<AuroraBackground />` in `hero-section.tsx`.
- **Rationale**: The `AuroraBackground` is self-contained and manages its own full-screen layout. Swapping is cleaner than creating a wrapper that complicates the component tree.
- **Alternative**: A background portal system. Rationale for rejection: Overkill for a single-page background.

### 2. Z-Index Management
- **Decision**: Set `AuroraBackground` container to `z-index: -10` and UI to `z-index: 0` or higher.
- **Rationale**: Ensures the background stays behind all interactive elements, including sticky headers and modals.

## Risks / Trade-offs

- **Risk**: GPU usage on low-end mobile devices.
  - **Mitigation**: The shader is optimized with `powerPreference: "high-performance"` and uses simplified math for noise (trigonometric approximation).
- **Risk**: Readability of light text on light aurora streaks.
  - **Mitigation**: The aurora streaks have a dark fallback background (`bg-slate-950`) and we use translucent UI cards (glassmorphism) to maintain contrast.
