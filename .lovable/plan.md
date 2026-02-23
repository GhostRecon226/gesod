

# Hero Section Rework - Split Layout with Car Carousel

Redesign the hero section to match the reference layout: a full-width rounded container with text content on the left and a car image carousel on the right.

## Design Approach

Inspired by the Pipely reference image, the hero becomes a two-column layout inside a large rounded container with a dark background. The left side holds the headline, description, CTAs, and a social proof element. The right side features a full-height auto-playing carousel of the uploaded car images, creating a premium automotive showcase feel.

## Layout Structure

```text
+------------------------------------------------------------------+
|  (rounded-2xl container, bg-hero)                                |
|                                                                    |
|   +---------------------------+  +-----------------------------+  |
|   |  Badge: "Vehicle Import"  |  |                             |  |
|   |                           |  |   Car Image Carousel        |  |
|   |  U.S. Auction Vehicles,   |  |   (auto-rotating, 3 cars)  |  |
|   |  Shipped Worldwide        |  |                             |  |
|   |                           |  |   Fade/crossfade transition |  |
|   |  Description text...      |  |                             |  |
|   |                           |  |   Dot indicators at bottom  |  |
|   |  [Request a Quote]        |  |                             |  |
|   |  [Track a Vehicle]        |  |                             |  |
|   |                           |  +-----------------------------+  |
|   |  Stats: 500+ | 30+ | 98% |                                   |
|   +---------------------------+                                   |
+------------------------------------------------------------------+
```

## What Changes

**Copy car images to project assets:**
- `user-uploads://image-7.png` -> `src/assets/hero-car-1.png` (Mercedes AMG)
- `user-uploads://image-8.png` -> `src/assets/hero-car-2.png` (SUV)
- `user-uploads://image-9.png` -> `src/assets/hero-car-3.png` (Lexus RX)

**Rework `src/pages/Home.tsx` hero section (lines 86-123):**
- Replace the centered text hero with a two-column grid layout
- Left column: badge, headline, description, CTA buttons, and a stats row (vehicles imported, countries served, satisfaction rate)
- Right column: Embla carousel with the 3 car images, auto-play every 4 seconds, with dot indicators
- The entire hero sits inside a rounded-2xl container with subtle inner padding
- Text is left-aligned (not centered) matching the reference
- Car images fill the right side with `object-cover` and rounded corners

**Design details:**
- Container has `rounded-2xl` with the existing `bg-hero` dark background
- Left column takes roughly 45% width, right column 55%
- Carousel uses `embla-carousel-react` (already installed) with autoplay via a simple interval
- Dot indicators below the carousel image, styled with primary color for active dot
- Stats row at the bottom of the left column: three inline stats with labels
- On mobile, stacks vertically: text on top, carousel below
- Keeps all existing GESOD RIDES copy (title, description, CTAs)

## Files Modified

| File | Changes |
|---|---|
| `src/assets/hero-car-1.png` | New - Mercedes AMG image |
| `src/assets/hero-car-2.png` | New - SUV image |
| `src/assets/hero-car-3.png` | New - Lexus RX image |
| `src/pages/Home.tsx` | Hero section rewritten: two-column layout with left-aligned text and right-side car carousel using Embla, autoplay interval, dot indicators, stats row |

No new dependencies needed. Embla carousel is already installed.

