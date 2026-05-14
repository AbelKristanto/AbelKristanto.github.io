# Implementation Plan: Minimalist Site Redesign

## Overview

This plan transforms the existing Jekyll portfolio site from a visually rich, multi-effect aesthetic into a minimalist, content-focused design. The implementation rewrites the custom SCSS stylesheet, simplifies layout files and includes, and removes decorative effects — all while preserving existing content, functionality, and accessibility. Changes are scoped to 7 files: the SCSS stylesheet, 3 layouts, and 3 includes (plus deletion of scroll-reveal.html).

## Tasks

- [x] 1. Rewrite the SCSS stylesheet with minimalist color and typography system
  - [x] 1.1 Replace all custom CSS variables and body styling with the 5-core-color palette and single font family
    - Replace the 14+ CSS custom properties in `:root` with the 5 core colors (`--site-bg`, `--site-surface`, `--site-text`, `--site-muted`, `--site-accent`) plus derived values (`--site-border`, `--site-accent-hover`)
    - Remove `--heading-font`, `--body-font`, `--shadow-soft` and all other removed variables
    - Set `--font-family` to `'IBM Plex Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`
    - Replace the multi-color radial gradient on `body` with flat `background: var(--site-bg)`
    - Set body `font-family: var(--font-family)`, `font-size: 1.0625rem`, `line-height: 1.7`, `color: var(--site-text)`
    - _Requirements: 1.1, 1.2, 1.4, 2.1, 2.2_

  - [x] 1.2 Implement the heading hierarchy and content width constraints
    - Set all headings (`h1`–`h4`) to use `var(--font-family)` (single sans-serif, no decorative font)
    - Apply heading sizes: h1=2.25rem/700, h2=1.75rem/600, h3=1.375rem/600, h4=1.125rem/500
    - Remove `letter-spacing: -0.02em`, `text-wrap: balance`, and any decorative heading treatments
    - Set `.content` max-width to `700px` for optimal reading line length
    - Apply uniform vertical spacing of `1.75rem` between content blocks (paragraphs, lists, cards)
    - Remove the `h2::before` decorative gradient line pseudo-element
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

  - [x] 1.3 Flatten card components and remove all decorative effects
    - Style `.section-card`, `.project-card`, `.fact-card` with: `background: var(--site-surface)`, `border: 1px solid var(--site-border)`, `border-radius: 6px`, `padding: 1.25rem`
    - Remove all `box-shadow` from cards in all states (default, hover, focus, active)
    - Remove `transition` and hover `transform: translateY(-4px)` from cards
    - Limit card hover to subtle `border-color: rgba(28, 25, 23, 0.16)` change only
    - Remove `backdrop-filter` from `#sidebar` and `#topbar-wrapper`
    - Remove `box-shadow` from `#topbar-wrapper`
    - Set `.reveal-on-scroll` to `opacity: 1; transform: none` unconditionally (safety fallback)
    - Remove all `.reveal-ready .reveal-on-scroll` animation rules
    - Remove `transition` from `.hero-panel`, `.cta-banner`, `.btn`, `.nav-link`, `.topbar-nav-link`
    - Remove the `.hero-copy::after` radial gradient pseudo-element (set `display: none`)
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 6.1, 6.2, 6.3, 6.4, 6.6_

  - [x] 1.4 Restyle navigation links to plain text with underline active state
    - Remove pill-shaped styling from `.topbar-nav-link`: set `background: none`, `border: none`, `border-radius: 0`, `padding: 0.75rem 0.5rem`
    - Set `.topbar-nav-link` hover/focus to `color: var(--site-accent)` only (no background, no border)
    - Set `.topbar-nav-link.is-active` to `border-bottom: 2px solid var(--site-accent)` (underline indicator, no background change)
    - Remove `box-shadow: inset` from active nav links
    - Style `#topbar-wrapper` as flat: `background: var(--site-surface)`, `border: none`, `box-shadow: none`, `backdrop-filter: none`, `border-radius: 0`
    - Remove `.topbar-kicker` styles (element will be removed from HTML)
    - _Requirements: 4.1, 4.2, 4.3, 4.5, 4.6_

  - [x] 1.5 Implement responsive styles and mobile layout rules
    - At `max-width: 767px`: collapse all grids (`.service-grid`, `.project-grid`, `.section-card-grid`, `.quick-facts`, `.contact-grid`) to `grid-template-columns: 1fr`
    - At `max-width: 767px`: set horizontal padding to `1rem` on content sections
    - At `max-width: 767px`: ensure body text remains at minimum `1rem`
    - At `max-width: 767px`: set cards to full-width with no horizontal margin
    - At `max-width: 767px`: ensure nav links have minimum touch target of `44px × 44px`
    - At `max-width: 767px`: constrain images/media to `max-width: 100%`
    - Prevent horizontal overflow on body: `overflow-x: hidden` on `html`
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.7, 9.8_

  - [x] 1.6 Style the footer and preserve accessibility features
    - Style `.site-footer` with `font-size: 0.88rem`, `color: var(--site-muted)`, `margin-top: 2rem`, no background/border/shadow
    - Preserve `.skip-link` styles (hidden by default, visible on focus)
    - Preserve `a:focus-visible` outline: minimum `2px` width, minimum `2px` offset
    - Ensure all text/background color pairs meet WCAG AA contrast (4.5:1 normal, 3:1 large)
    - Set link colors: default `color: var(--site-accent)`, hover `color: var(--site-accent-hover)`
    - _Requirements: 8.3, 8.4, 10.1, 10.2, 10.3, 10.5_

- [x] 2. Simplify layout includes (topbar, sidebar, footer)
  - [x] 2.1 Simplify the topbar include — remove kicker text and flatten structure
    - Remove the `.topbar-kicker` paragraph element entirely from `_includes/topbar.html`
    - Remove the `.topbar-copy` wrapper div (keep `#topbar-title` directly in `.topbar-main`)
    - Ensure nav links remain as plain `<a>` elements without pill wrappers
    - Preserve `aria-label="Primary navigation"` on the nav element
    - Preserve `aria-label="Top Bar"` on the header element
    - _Requirements: 4.2, 4.3, 10.4_

  - [x] 2.2 Simplify the sidebar include — remove subtitle and collaboration note
    - Remove the `<p class="site-subtitle">` element from `_includes/sidebar.html`
    - Remove the `<div class="sidebar-note">` block (collaboration text)
    - Keep: avatar image, site title link, and contact icon links
    - Preserve `aria-label="Sidebar"` on the aside element
    - _Requirements: 4.4, 10.4_

  - [x] 2.3 Simplify the footer include — remove tagline text
    - Remove the tagline sentence ("Data, AI, automation, and education with practical impact.") from `_includes/footer.html`
    - Keep: copyright notice (© year + name) and the 3 social links (Email, LinkedIn, GitHub)
    - Ensure LinkedIn and GitHub links have `target="_blank" rel="noopener noreferrer"`
    - Ensure Email link uses `mailto:` URI
    - Preserve `aria-label="Site Info"` on the footer element
    - _Requirements: 8.1, 8.2, 8.5, 10.4_

- [x] 3. Remove scroll-reveal from default layout
  - [x] 3.1 Remove the scroll-reveal include from `_layouts/default.html`
    - Delete the line `{% include scroll-reveal.html %}` from `_layouts/default.html`
    - The `_includes/scroll-reveal.html` file can remain on disk (unused) or be deleted
    - Verify that no other layout or include references `scroll-reveal.html`
    - _Requirements: 6.5_

- [x] 4. Checkpoint — Verify base styling and includes
  - Ensure the site builds successfully with `bundle exec jekyll build`
  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. Restructure the home page layout to 4 single-column sections
  - [x] 5.1 Rewrite `_layouts/home.html` with the minimalist 4-section structure
    - Replace the entire home layout content with exactly 4 sections: Introduction, Services Summary, Selected Work, Contact CTA
    - Section 1 (Introduction): headline max 12 words, description max 50 words, one CTA button
    - Section 2 (Services Summary): vertically stacked list, no icons, plain text descriptions
    - Section 3 (Selected Work): 2–3 project cards in single-column stack
    - Section 4 (Contact CTA): short prompt with Email + LinkedIn action links
    - Remove: hero-panel, quick-facts grid, split-section, "Why visitors stay" panel, "Explore the site" directory, teaching & community section
    - Ensure all sections use single-column layout (no side-by-side elements)
    - Ensure the contact CTA has at least one actionable link navigating to a contact method
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7_

- [x] 6. Ensure consistent content page styling
  - [x] 6.1 Verify and adjust content page elements for cross-page consistency
    - Ensure all Content_Page instances (About, What I Do, Teaching & Community) use the same max-width (700px), vertical spacing (1.75rem), font family, and body text size
    - Ensure all `section-card`, `service-card`, and `fact-card` elements use the flat card styling from task 1.3
    - Ensure all h2 headings share the same font-size (1.75rem) and font-weight (600) across pages
    - Ensure all h3 headings share the same font-size (1.375rem) and font-weight (600) across pages
    - Remove the `.eyebrow` text pattern (uppercase, letter-spaced label above headings) from content pages if present
    - Ensure `.quick-facts` grid renders in two columns with no background/shadow on individual fact items, collapsing to single column below 768px
    - Ensure `.lead-paragraph` uses consistent font-size, line-height, and color across all pages
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6_

- [x] 7. Checkpoint — Full build and visual verification
  - Ensure the site builds successfully with `bundle exec jekyll build`
  - Verify the compiled CSS file has fewer lines than the current implementation
  - Ensure all tests pass, ask the user if questions arise.

- [x] 8. Final validation and cleanup
  - [x] 8.1 Verify accessibility and performance requirements
    - Confirm skip-link is present, hidden by default, visible on focus, and targets `#main-content`
    - Confirm all semantic landmarks (header, nav, main, aside, footer) with aria-labels are preserved
    - Confirm focus-visible outlines on all interactive elements (≥2px width, ≥2px offset)
    - Confirm color contrast meets WCAG AA (4.5:1 normal text, 3:1 large text)
    - Confirm mobile nav touch targets are ≥44×44px
    - Confirm no horizontal overflow at mobile viewports
    - Confirm CSS file is smaller than current (line count and transfer size ≤50KB compressed)
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 9.2, 9.8_

- [x] 9. Final checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- No property-based tests are included because this feature consists entirely of declarative CSS, UI rendering, and static HTML structural changes — none of which involve pure functions with varying inputs
- The design uses specific SCSS and HTML code, so no language selection was needed
- All changes preserve existing content and functionality; the redesign is purely presentational
- The `_includes/scroll-reveal.html` file becomes unused after removal from default.html — it can optionally be deleted
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation via `bundle exec jekyll build`

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "2.1", "2.2", "2.3", "3.1"] },
    { "id": 1, "tasks": ["1.2", "1.4", "1.6"] },
    { "id": 2, "tasks": ["1.3", "1.5"] },
    { "id": 3, "tasks": ["5.1"] },
    { "id": 4, "tasks": ["6.1"] },
    { "id": 5, "tasks": ["8.1"] }
  ]
}
```
