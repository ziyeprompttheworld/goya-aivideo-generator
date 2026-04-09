## Why

The current "compact" video generator UI is insufficient for the advanced capabilities of Seedance 2.0. To compete with professional platforms like Kie.ai, we need to support sophisticated inputs including multiple image/video references and precise first/last frame controls. This upgrade solves the "limited control" problem for power users and increases the perceived value of the product through a premium, state-of-the-art UI.

## What Changes

1.  **UI/UX Overhaul**: Transition the existing generator input into an optimized "Asset-First" workspace using the `ui-ux-pro-max` design system. This includes a horizontal asset bar, refined typography (Poppins/Open Sans), and glassmorphism effects.
2.  **Expanded Input Capabilities**: Support for `first_frame_url`, `last_frame_url`, multiple `reference_image_urls`, and `reference_video_urls`.
3.  **Seedance 2.0 Example Library**: Replace existing generic examples with 3 high-quality Seedance 2.0 use cases (Martial Arts, Cyberpunk Transition, Pixar Style).

## Capabilities

### New Capabilities
- `seedance-2-pro-ui`: An enhanced interface within the existing component structure that manages multiple assets and keyframes.
- `seedance-2-asset-mapping`: Logic to transform UI-provided assets into Kie.ai API compatible payloads.

### Modified Capabilities
- `video-generator`: The core generation tool will be expanded to handle multi-modal inputs instead of a single image.

## Impact

- **UI Components**: `src/components/video-generator/video-generator-input.tsx` will receive significant layout updates.
- **Config**: `src/config/tool-pages/image-to-video.config.ts` will have its examples and model list replaced.
- **APIs**: `src/app/api/v1/video/create/route.ts` must be updated to accept the new parameter fields.
