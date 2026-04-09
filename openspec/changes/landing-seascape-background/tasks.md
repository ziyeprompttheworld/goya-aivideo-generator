## 1. Background Component Implementation

- [x] 1.1 Create `src/components/SeascapeBackground.tsx` based on the Seascape GLSL in `sea.md`.
- [x] 1.2 Implement the R3F `ShaderPlane` and `Canvas` with high-performance configurations.
- [x] 1.3 Sync `iTime`, `iResolution`, `iMouse`, and `iScroll` uniforms in the `useFrame` loop.
- [x] 1.4 Implement the vertical parallax logic in the shader's camera origin (`ori`).

## 2. Landing Page Integration

- [x] 2.1 Replace `AuroraBackground` with `SeascapeBackground` in `src/components/landing/hero-section.tsx`.
- [ ] 2.2 Verify that the Hero section content (Video Generator) remains legible against the new shader.
- [ ] 2.3 Optimize glassmorphism (backdrop-blur) if necessary for the deep blue ocean palette.

## 3. Verification and QA

- [ ] 3.1 Verify background responsiveness on desktop and mobile viewports.
- [ ] 3.2 Confirm smooth scroll-linked parallax behavior.
- [ ] 3.3 Ensure the shader does not significantly impact UI response time (performance profiling).
