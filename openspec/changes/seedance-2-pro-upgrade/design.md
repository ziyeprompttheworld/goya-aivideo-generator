## Context

The current `VideoGeneratorInput` is designed for simple, single-asset flows (Image-to-Video). Seedance 2.0 introduces multi-asset references, first/last frame controls, and combined image/video inputs which require a more sophisticated UI and parameter mapping logic.

## Goals / Non-Goals

**Goals:**
- Provide a professional, multi-asset playground UI within the existing component framework.
- Enable precise control over first and last frames for transitions.
- Support up to 5 image references and multiple video references as per Seedance 2.0 specs.
- Apply `ui-ux-pro-max` standards for typography, spacing, and micro-interactions.

**Non-Goals:**
- Creating a completely separate page from scratch (we stay within `VideoGeneratorInput`).
- Implementing non-Seedance 2.0 advanced features (like style-consistent training).

## Decisions

### 1. Component Refactoring
We will extend `VideoGeneratorInput` to support an expanded `uploadArea`. Instead of a single static box, we will implement a horizontal flex container that renders all available `uploadSlots` dynamically. 

### 2. Multi-Modal Asset Support
The asset preview cards will be updated to display a "Video" badge if the file type is video. The upload handler will be updated to accept `video/*` while maintaining backward compatibility for image-only models.

### 3. Smart Parameter Transformation
In the `onSubmit` handler, we will introduce a mapping layer:
- Slots marked as `start`/`end` map to `first_frame_url`/`last_frame_url`.
- Sequential slots (Role 1, Role 2, etc.) map to `reference_image_urls`.
- Video slots map to `reference_video_urls`.

### 4. Seedance 2.0 Visual Palette
Following `ui-ux-pro-max` guidelines, we will apply a Poppins/Open Sans font stack and a more refined glassmorphism container style (`bg-card/40 backdrop-blur-xl`).

## Risks / Trade-offs

- **Mobile Responsiveness**: A horizontal bar of 6+ assets might be difficult to manage on mobile. 
    - *Mitigation*: Enable smooth horizontal scrolling with snap-points for asset cards.
- **Performance**: Many image previews might slow down the UI. 
    - *Mitigation*: Use optimized image components and limit preview size.


┌───────────────────────────────────────────────────────────────────────────────────┐
│  Prompt & Assets Workspace (Glassmorphism + Poppins)                              │
│ ┌──────────┐ ┌──────────────────────────────────────────────────────────────────┐ │
│ │  Assets  │ │  Enter tags like @Image1 for consistency...                      │ │
│ │  Pool    │ │                                                                  │ │
│ │          │ │  "A martial arts sequence where @Image1 performs... "            │ │
│ ├──────────┴─┴──────────────────────────────────────────────────────────────────┤ │
│ │  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐                       │ │
│ │  │ Start  │ │  End   │ │  Ref 1 │ │  Ref 2 │ │   +    │ <─── Horizontal Scroll │ │
│ │  │ [Img]  │ │ [Video]│ │ [Img]  │ │ [Empty]│ │        │      (Smooth Asset Bar)│ │
│ │  └────────┘ └────────┘ └────────┘ └────────┘ └────────┘                       │ │
└─┴─────────────────────────────────────────────────────────────────────────────────┴─┘
  ┌────────────────────────────────────────────────────────┬─────────────┬────────┐
  │ ⌘ Reference to Video ▾ │ ⚛︎ Seedance 2.0 ▾ │ 16:9 | 10s ▾ │ ⋯ Settings  │  Send  │
  └────────────────────────────────────────────────────────┴─────────────┴────────┘



