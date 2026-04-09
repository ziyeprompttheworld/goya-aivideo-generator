## Context

We previously implemented an Aurora background with parallax effects. The user now wants to switch to a "Seascape" shader. The current infrastructure using React Three Fiber (R3F) and Framer Motion is highly reusable for this transition.

## Goals / Non-Goals

**Goals:**
- Implement the "Seascape" GLSL shader within a performant R3F component.
- Maintain existing scroll-linked parallax and mouse-interaction capabilities.
- Ensure full-screen coverage and responsiveness across all devices.

**Non-Goals:**
- Modifying the core UI layout of the landing page.
- Changing the billing or auth logic in the Hero section.

## Decisions

### 1. Component Structure
- **Decision**: Create `SeascapeBackground.tsx` based on the `AuroraBackground.tsx` template (Canvas + ShaderPlane).
- **Rationale**: The R3F boilerplate (uniform handling, DPR-aware resolution, clock syncing) is already optimized for high performance and stability.

### 2. Shader Implementation
- **Decision**: Port the "Seascape" shader code from `sea.md` into the `fragmentShader` string.
- **Rationale**: This is a direct request from the user for a specific aesthetic.
- **Uniforms**: Standard Shadertoy uniforms (`iTime`, `iResolution`, `iMouse`) plus our custom `iScroll` for parallax.

### 3. Parallax Logic
- **Decision**: Map `iScroll` to the camera Y position in the shader's `ori` (origin) vector.
- **Rationale**: Shifting the camera's height relative to the wave surface creates a natural vertical perspective shift that matches the page scroll.

### 4. Component Replacement
- **Decision**: Swap the component in `HeroSection.tsx`.
- **Rationale**: Keeps the code clean by removing the old background reference.

## Risks / Trade-offs

- **Risk**: The "Seascape" shader is computationally intensive due to ray marching steps.
  - **Mitigation**: Use `NUM_STEPS = 32` (as provided) and ensure `high-performance` power preference is set in the R3F `Canvas`. We will also disable `Antialiasing` (AA) by default if performance drops on mobile.
- **Risk**: Visual contrast issues between the blue waves and the white text.
  - **Mitigation**: Adjust the glassmorphism blur in `HeroSection` or add a subtle dark gradient overlay on the bottom of the section.
