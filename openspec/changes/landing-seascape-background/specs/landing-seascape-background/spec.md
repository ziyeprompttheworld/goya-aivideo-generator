## ADDED Requirements

### Requirement: Interactive Seascape Background
The landing page SHALL feature a full-screen ocean shader background rendered using React Three Fiber.

#### Scenario: Visual Rendering
- **WHEN** the landing page loads
- **THEN** the Seascape shader SHALL render smoothly in the background layer
- **THEN** the shader SHALL maintain high performance (target 60fps) on desktop and mobile

#### Scenario: Mouse Interaction
- **WHEN** the user moves their mouse across the screen
- **THEN** the shader uniform `iMouse` SHALL update, causing subtle shifts in the wave perspective or lighting

### Requirement: Scroll-Linked Ocean Parallax
The Seascape background SHALL dynamically respond to the page scroll position to create vertical depth.

#### Scenario: Vertical Perspective Shift
- **WHEN** the user scrolls down the landing page
- **THEN** the shader camera origin `ori.y` SHALL increase proportionally to `iScroll`
- **THEN** the ocean surface SHALL appear to sink relative to the viewport, creating a 3D volume effect
