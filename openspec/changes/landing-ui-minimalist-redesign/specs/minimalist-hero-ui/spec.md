## ADDED Requirements

### Requirement: Minimalist Hero Typography
The Hero section SHALL utilize `IBM Plex Mono` as its primary typeface to establish a technical, authored voice.

#### Scenario: Visual Layout
- **WHEN** the user views the Hero section
- **THEN** the headline SHALL be entirely lowercase ("make moving images.")
- **THEN** the word "moving" SHALL be highlighted in deep blue (`#008fff`)
- **THEN** the text SHALL utilize tight leading (`line-height`) and prominent `letter-spacing` as defined in the concept HTML

### Requirement: Sparse Navigation Header
The main navigation header SHALL be minimized to reduce visual noise, matching the "topbar" concept aesthetic.

#### Scenario: Header Rendering
- **WHEN** the landing page loads
- **THEN** the header SHALL NOT display complex dropdowns or multi-column menus
- **THEN** navigation items SHALL be simple lowercase text links with high tracking
- **THEN** the header background SHALL remain completely transparent until scrolled

### Requirement: Call-To-Action Refocus
The Hero section SHALL NOT embed complex application UI components (like the video generator form), but instead rely on a single, clear call-to-action button.

#### Scenario: CTA Interaction
- **WHEN** the Hero section renders
- **THEN** the user SHALL only see a minimalist bordered button labelled "→ start creating"
- **WHEN** the user clicks the CTA button
- **THEN** the user SHALL be scrolled down to the embedded generator OR routed to the app interface
