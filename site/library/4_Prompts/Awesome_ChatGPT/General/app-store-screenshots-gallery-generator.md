---
title: "🤖 App Store Screenshots Gallery Generator"
tags: ["awesome-chatgpt", "app", "store", "screenshots", "gallery"]
category: "Awesome_ChatGPT"
subcategory: "General"
upstream:
  match: similar
  repo: f/awesome-chatgpt-prompts
  checked: 2026-10-26
---

# App Store Screenshots Gallery Generator

# App Store Screenshots Gallery Generator

**Create a professional, production-ready screenshots gallery for an iOS/macOS/Android app that looks like it was designed by the top 1% of app developers.**

## Context

You are building a screenshots gallery page for an app. The project has screenshots in a folder (typically `screenshots/`, `fastlane/screenshots/`, or similar). The gallery should be a single HTML file that can be deployed to Netlify, Vercel, or any static host.

## Requirements

### 1. Design System Foundation

Create CSS custom properties (design tokens) for:

- **Colors**: Primary palette (50-900 shades), secondary/accent palette, neutral grays (50-900)
- **Surfaces**: Three surface levels (surface-1, surface-2, surface-3)
- **Typography**: Two-font stack (mono for UI elements, sans for body)
- **Spacing**: Consistent scale (4px base)
- **Borders**: Radius scale (sm, md, lg, xl, 2xl, 3xl)
- **Shadows**: Five elevation levels (sm, md, lg, xl, 2xl)
- **Transitions**: Three speeds (fast: 150ms, normal: 300ms, smooth: 400ms with cubic-bezier)

### 2. Layout Architecture

- **Container**: Max-width 1600px, centered, with responsive padding
- **Grid**: Masonry-style responsive grid using `grid-template-columns: repeat(auto-fill, minmax(340px, 1fr))`
- **Gap**: 2rem on desktop, 1.5rem tablet, 1rem mobile
- **Card aspect ratio**: Maintain consistent screenshot presentation

### 3. Header Section

- **App badge**: Small pill-shaped badge with icon and "IOS APPLICATION" or platform text
- **Title**: Large, bold app name with gradient text treatment
- **Subtitle**: One-line description mentioning key technologies and features
- **Background**: Subtle grid pattern overlay for depth
- **Padding**: Reduced vertical padding (3rem top, 2rem bottom) for compact feel

### 4. Screenshot Cards

Each card should have:

- **Container**: White/off-white background, rounded corners (2xl), subtle shadow
- **Image container**: Gradient background, centered screenshot with white border (8px)
- **Hover effects**:
  - Card lifts (-8px translateY) with enhanced shadow
  - Screenshot scales (1.04) with slight rotation (0.5deg)
  - Top border appears (gradient bar)
  - Radial glow overlay fades in
- **Metadata bar**:
  - Number badge (gradient background, 26px square)
  - Device name (uppercase, small font, mono font)
- **Title**: Bold, mono font, 1rem
- **Description**: One-line caption, smaller font, subtle color

### 5. User Journey Ordering

Order screenshots by how users experience the app:

1. **Login/Onboarding** - First screen users see
2. **Dashboard/Home** - Main landing after login
3. **Primary feature views** - Core app functionality
4. **Settings/Configuration** - Customization screens
5. **Permissions/Integrations** - HealthKit, notifications, etc.
6. **Advanced features** - Sync, sharing, cloud features
7. **Analytics/Reports** - Data visualization screens
8. **Archive/History** - Historical data views

### 6. Animations

- **Entrance**: Staggered fade-in with translateY (0.1s delays between cards)
- **Hover**: Smooth cubic-bezier easing (0.16, 1, 0.3, 1)
- **Scroll**: IntersectionObserver to trigger animations when cards enter viewport
- **Performance**: Use `will-change` for transform and opacity

### 7. Footer

- **Background**: Dark (neutral-900) with subtle gradient overlay
- **Border radius**: Top corners only (2xl)
- **Content**: Minimal metadata (device, date, status) with icons
- **Spacing**: Compact (2rem padding)

### 8. Responsive Breakpoints

- **Desktop** (>1280px): 4-5 columns
- **Tablet** (768-1280px): 2-3 columns
- **Mobile** (<768px): 1 column, reduced padding throughout

### 9. Technical Requirements

- **Single HTML file**: All CSS inline in `<style>` tag
- **External dependencies only**:
  - Pico.css (minimal CSS framework)
  - Font Awesome (icons)
  - Google Fonts (Inter + IBM Plex Mono)
  - Animate.css (optional, for additional animations)
- **No build step**: Must work as static HTML
- **Performance**: Optimized animations, no layout shift
- **Accessibility**: Semantic HTML, alt text on images

### 10. Polish Details

- **Subtle gradients**: Background radials for depth (not overwhelming)
- **Border treatment**: 1px solid with alpha transparency
- **Shadow layering**: Multiple shadow values for depth
- **Typography**: Tight letter-spacing on headings (-0.03em)
- **Color consistency**: Use design tokens everywhere, no hardcoded values
- **Image presentation**: White border around screenshots for device frame illusion

## Output Format

Generate a single `index.html` file with:

1. Complete HTML structure
2. Inline CSS with design tokens
3. JavaScript for scroll animations (IntersectionObserver)
4. All screenshot cards with proper metadata
5. Responsive design for all screen sizes

## Example Screenshot Card Structure


---

Contributed by [@AgileInnov8tor](https://github.com/AgileInnov8tor) to [f/awesome-chatgpt-prompts](https://github.com/f/awesome-chatgpt-prompts).
