# Requirements Document

## Introduction

Redesign the personal portfolio/blog site (abelkristanto.github.io) to achieve a minimalist, clean, and highly readable aesthetic. The current site uses jekyll-theme-chirpy v6.2.3 with extensive custom CSS and multiple layout sections. The redesign simplifies visual complexity, improves typography and whitespace, reduces decorative elements, and creates a consistent, modern design language across all pages while preserving existing content and functionality.

## Glossary

- **Site**: The Jekyll-based personal portfolio/blog at abelkristanto.github.io
- **Layout_System**: The collection of Jekyll layouts (default.html, home.html, page.html) that structure page rendering
- **Style_Sheet**: The custom SCSS file (assets/css/jekyll-theme-chirpy.scss) that defines all visual styling
- **Sidebar**: The left-side navigation panel containing avatar, site title, subtitle, and social links
- **Topbar**: The top header component containing page title, navigation links, and contact CTA
- **Home_Page**: The landing page using the home.html layout with hero, services, projects, and CTA sections
- **Content_Page**: Any page using the page.html layout (About, What I Do, Teaching & Community)
- **Card_Component**: A styled container (section-card, project-card, fact-card) used to group related content
- **Color_Palette**: The set of CSS custom properties defining site colors (--site-bg, --site-primary, --site-accent, etc.)
- **Typography_System**: The combination of font families, sizes, line heights, and spacing that control text rendering
- **Scroll_Reveal**: The JavaScript-driven animation that fades in elements as the user scrolls

## Requirements

### Requirement 1: Simplified Color Palette

**User Story:** As a visitor, I want a restrained color palette with fewer competing tones, so that the site feels calm and focused rather than visually busy.

#### Acceptance Criteria

1. THE Style_Sheet SHALL define exactly 5 core color variables: background, surface, text, muted-text, and one accent color, where each variable maps to a single opaque color value
2. THE Style_Sheet SHALL use colors with a saturation value no greater than 10% for the background and surface variables, and SHALL NOT apply colored gradients to background or surface areas
3. THE Style_Sheet SHALL use the single accent color variable for all interactive elements including links, buttons, and active navigation states
4. THE Style_Sheet SHALL replace the multi-color radial gradient on the body element with the flat background color variable
5. THE Style_Sheet SHALL reference the same accent color variable for the default state of every interactive element on every page, and MAY use a darkened or lightened variant (within 15% lightness difference) only for hover and focus states
6. IF the Style_Sheet requires additional derived values for borders, shadows, or opacity variations, THEN THE Style_Sheet SHALL derive them from the 5 core color variables using transparency or lightness adjustments rather than introducing additional hue values

### Requirement 2: Clean Typography

**User Story:** As a visitor, I want clear, well-spaced typography with strong hierarchy, so that content is easy to scan and comfortable to read.

#### Acceptance Criteria

1. THE Typography_System SHALL use a single sans-serif font family for both headings and body text
2. THE Typography_System SHALL set body text size to a minimum of 1rem (16px) and a maximum of 1.25rem (20px) with a line-height between 1.6 and 1.8
3. THE Typography_System SHALL establish heading hierarchy such that each heading level (h1 through h4) is at least 0.25rem larger in font-size and at least 100 units heavier in font-weight than the next lower level, without using decorative treatments such as text-shadow, text-decoration, or color-only differentiation
4. THE Typography_System SHALL limit the maximum content width to between 680px and 720px for optimal reading line length
5. THE Typography_System SHALL apply uniform vertical spacing between content blocks (paragraphs, lists, cards) where the spacing value is between 1.5rem and 2.5rem and the same value is used for all block types within a single page

### Requirement 3: Minimalist Home Page Layout

**User Story:** As a visitor, I want a home page that communicates who Abel is and what he does within a few seconds of landing, so that I can quickly decide where to go next.

#### Acceptance Criteria

1. THE Home_Page SHALL present content in a single-column layout where no section contains side-by-side elements exceeding one column at any viewport width
2. THE Home_Page SHALL contain a maximum of 4 distinct sections rendered as sequential content blocks: introduction, services summary, selected work, and contact call-to-action
3. THE Home_Page SHALL display the introduction section with a headline of maximum 12 words and a description paragraph of maximum 50 words
4. THE Home_Page SHALL remove the quick-facts statistics grid from the hero area
5. THE Home_Page SHALL present the services summary as a vertically stacked list or single-column card layout without icon elements preceding each service item
6. WHEN a visitor views the Home_Page on a viewport width of 767px or less, THE Layout_System SHALL render all sections in a single stacked column with uniform horizontal padding of 16px on each side
7. THE Home_Page SHALL display the contact call-to-action section with at least one actionable link or button that navigates to a contact method

### Requirement 4: Simplified Navigation

**User Story:** As a visitor, I want navigation that is minimal and predictable, so that I can find content without visual distraction.

#### Acceptance Criteria

1. THE Topbar SHALL display navigation links as plain text without pill-shaped backgrounds (border-radius creating pill shapes), background-color fills, or colored borders, and hover/focus states SHALL use only text color change without adding background fills or border colors
2. THE Topbar SHALL remove the kicker text label ("Personal website" / "Explore") above the page title
3. THE Topbar SHALL use a flat, borderless design without box-shadow or backdrop-filter effects
4. THE Sidebar SHALL display only the avatar, site title, and contact icon links without the subtitle paragraph or collaboration note
5. WHEN a navigation link is active, THE Topbar SHALL indicate the active state using an underline (text-decoration or border-bottom) without background-color changes, and the underline SHALL be visible at a minimum thickness of 2px
6. WHEN a visitor hovers over or focuses on a navigation link, THE Topbar SHALL provide visual feedback limited to a text color change to the site's primary color, without adding background fills, borders, or elevation effects

### Requirement 5: Reduced Card Styling

**User Story:** As a visitor, I want content cards that feel lightweight and integrated with the page, so that the layout does not feel heavy or over-designed.

#### Acceptance Criteria

1. THE Card_Component SHALL use flat styling with no box-shadow property applied in any state (default, hover, focus, active)
2. THE Card_Component SHALL use either no border or a single 1px solid border in a color that does not exceed a contrast ratio of 2:1 against the card background, and SHALL NOT use layered borders or borders with transparency
3. THE Card_Component SHALL NOT apply hover transform animations (translateY or scale) and SHALL limit hover effects to at most a background-color or border-color transition
4. THE Card_Component SHALL use a border-radius between 0px and 8px (inclusive) for a cleaner geometric appearance
5. THE Card_Component SHALL maintain consistent internal padding between 1rem and 1.5rem across all card types

### Requirement 6: Removal of Decorative Effects

**User Story:** As a visitor, I want a site free of unnecessary visual effects, so that the content itself is the focus.

#### Acceptance Criteria

1. THE Style_Sheet SHALL set opacity to 1 and transform to none on all elements with the reveal-on-scroll class, regardless of whether the reveal-ready class is present on the document root, so that no scroll-triggered fade-in animation occurs
2. THE Style_Sheet SHALL remove the decorative radial gradient overlay (::after pseudo-element) from the hero-copy section by setting its display to none
3. THE Style_Sheet SHALL remove backdrop-filter blur effects from the Topbar wrapper and Sidebar by setting backdrop-filter to none on both elements
4. THE Style_Sheet SHALL remove the transition property and the hover-state transform and box-shadow changes from section-card and project-card elements, so that cards appear identical on hover and at rest
5. THE Layout_System SHALL remove the scroll-reveal.html include from the default layout so that the scroll-reveal script is not loaded on any page
6. THE Style_Sheet SHALL remove the transition property from hero-panel, cta-banner, btn, nav-link, and topbar-nav-link elements so that no animated property changes occur on interaction

### Requirement 7: Consistent Content Page Styling

**User Story:** As a visitor, I want all content pages (About, What I Do, Teaching & Community) to share the same visual rhythm, so that the site feels cohesive as I navigate between pages.

#### Acceptance Criteria

1. THE Layout_System SHALL apply the same maximum content width (as defined in Requirement 2, criterion 4), the same vertical spacing of at least 1.5rem between content blocks, and the same font family and body text size to all Content_Page instances
2. THE Content_Page SHALL use the same card styling as defined in Requirement 5 for all section-card, service-card, and fact-card elements, including any icon elements contained within service-cards
3. THE Content_Page SHALL use consistent heading styles matching the Typography_System defined in Requirement 2, where all h2 headings share the same font-size and font-weight across pages, and all h3 headings share the same font-size and font-weight across pages
4. THE Content_Page SHALL not use the eyebrow text pattern (uppercase, letter-spaced label above headings)
5. WHEN a Content_Page contains a quick-facts grid, THE Layout_System SHALL render the facts in a two-column grid with no background color or box-shadow on individual fact items, collapsing to a single column below 768px viewport width
6. THE Content_Page SHALL style the lead-paragraph element with the same font-size, line-height, and color across all Content_Page instances

### Requirement 8: Minimalist Footer

**User Story:** As a visitor, I want a footer that provides essential links without visual clutter, so that I can find contact information without distraction.

#### Acceptance Criteria

1. THE Site footer SHALL display only the copyright notice (© symbol, current four-digit year, and site owner name) and exactly three social links (Email, LinkedIn, GitHub) arranged horizontally on a single line at viewport widths of 768px and above, and allowed to wrap into no more than two lines at viewport widths below 768px
2. THE Site footer SHALL not contain the tagline text ("Data, AI, automation, and education with practical impact")
3. THE Site footer SHALL render all footer text at a font size of 0.88rem and a color matching the site muted-text variable (--site-muted), with no background color, borders, box-shadows, or decorative elements applied to the footer container
4. THE Site footer SHALL maintain a minimum top margin of 2rem between the footer and the last content section above it
5. THE Site footer social links SHALL open LinkedIn and GitHub URLs in a new browser tab with rel="noopener noreferrer", and the Email link SHALL use a mailto: URI targeting the configured site email address

### Requirement 9: Mobile Responsiveness

**User Story:** As a mobile visitor, I want the minimalist design to work equally well on small screens, so that the reading experience is comfortable on any device.

#### Acceptance Criteria

1. WHEN the viewport width is below 768px, THE Layout_System SHALL collapse all grid layouts (including services grids, project grids, and quick-facts grids) to a single column with each item stacked vertically
2. WHEN the viewport width is below 768px, THE Topbar navigation SHALL remain horizontally scrollable with no wrapping, and all navigation links SHALL have a minimum touch target size of 44×44 CSS pixels
3. WHEN the viewport width is below 768px, THE Layout_System SHALL apply horizontal padding between 1rem and 1.25rem to all content sections
4. WHEN the viewport width is below 768px, THE Typography_System SHALL maintain body text size at a minimum of 1rem without reduction
5. WHEN the viewport width is below 768px, THE Card_Component SHALL use full-width layout with no horizontal margin
6. WHEN the viewport width is below 768px, THE Sidebar SHALL be hidden from view and accessible only through a toggle control, rather than occupying permanent screen space
7. WHEN the viewport width is below 768px, THE Layout_System SHALL constrain all images and embedded media to a maximum width of 100% of their containing element to prevent horizontal overflow
8. WHEN the viewport width is below 768px, THE Layout_System SHALL prevent horizontal scrolling on the page body by ensuring no element exceeds the viewport width

### Requirement 10: Performance and Accessibility Preservation

**User Story:** As a visitor, I want the redesigned site to load quickly and remain accessible, so that the minimalist approach improves rather than degrades the user experience.

#### Acceptance Criteria

1. THE Layout_System SHALL preserve the skip-link element such that it is visually hidden by default, becomes visible when it receives keyboard focus, and navigates focus to the main content landmark when activated
2. THE Style_Sheet SHALL maintain a minimum color contrast ratio of 4.5:1 between text and background colors for all normal-sized text, and a minimum of 3:1 for text larger than 18pt or bold text larger than 14pt
3. THE Style_Sheet SHALL preserve focus-visible outline styles for all interactive elements (links, buttons, and form controls) with a minimum outline width of 2px and a minimum outline-offset of 2px
4. THE Layout_System SHALL preserve all existing semantic HTML landmarks (header, nav, main, aside, footer) with their associated aria-label attributes
5. THE Style_Sheet SHALL produce a total custom CSS file that contains fewer lines than the current implementation, measured by comparing the line count of the compiled custom stylesheet before and after the redesign
6. WHEN the redesigned site is loaded on a standard broadband connection, THE Layout_System SHALL achieve a Largest Contentful Paint (LCP) of 2500 milliseconds or less and a total CSS transfer size no greater than 50KB compressed
