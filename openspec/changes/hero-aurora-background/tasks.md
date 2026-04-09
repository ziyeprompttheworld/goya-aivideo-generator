## 1. Background Integration

- [x] 1.1 Import `AuroraBackground` in `src/components/landing/hero-section.tsx`
- [x] 1.2 Replace `<BlackHoleBackground />` with `<AuroraBackground />` in line 316 of `hero-section.tsx`
- [x] 1.3 Remove the unused `BlackHoleBackground` import statement from `hero-section.tsx`
- [x] 1.4 Optimize the `section` container style if necessary to ensure it's truly full-screen (`min-h-screen`)

## 2. Testing and Polish

- [x] 2.1 Verify that the shader correctly fills the viewport on both desktop and mobile
- [x] 2.2 Confirm that the mouse interaction (parallax depth) is working smoothly
- [x] 2.3 Verify that the Video Generator panel and text have sufficient contrast against the aurora streaks
- [x] 2.4 Profile the performance manually to ensure 60fps rendering
