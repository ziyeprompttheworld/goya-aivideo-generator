## 1. Type & Config Preparation

- [x] 1.1 Update `types.ts` to include `video` in `UploadedImage` and new fields in `SubmitData`.
- [x] 1.2 Register `seedance-2.0` in `defaults.ts` with all supported modes and features.

## 2. Component UI Refactoring

- [x] 2.1 Refactor `VideoGeneratorInput` to use a scrolling horizontal container for asset slots.
- [x] 2.2 Implement specialized rendering for "Start" and "End" frame slots.
- [x] 2.3 Add "Video" badge support to the asset preview cards.
- [x] 2.4 Apply `ui-ux-pro-max` typography and glassmorphism styling.

## 3. Advanced Settings & Logic

- [x] 3.1 Update the settings dropdown to include `Return Last Frame` and `Audio` toggles.
- [x] 3.2 Implement the parameter mapping utility to transform multi-slot uploads into Seedance 2.0 API fields.

## 4. Visibility & UI Customization

- [x] 4.1 Implementation of `hideModelSelector`, `hideModeSelector`, and `hideGenerationTypeSwitch` props.
- [x] 4.2 Integrated "Single Model Mode" logic: automatically handle T2V/I2V within a single mode.

## 5. Example Refresh

- [ ] 4.1 Update `image-to-video.config.ts` with high-quality Seedance 2.0 examples (Martial Arts, etc.).
- [ ] 4.2 Ensure template loading logic supports multi-image population.

## 5. Verification

- [ ] 5.1 Manual test of model switching and asset uploading.
- [ ] 5.2 Verify final API payload format via console logs.
