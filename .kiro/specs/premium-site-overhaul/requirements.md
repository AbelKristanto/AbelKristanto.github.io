# Requirements Document

## Introduction

This document defines the requirements for a premium visual overhaul of Abel Kristanto Widodo's personal portfolio/blog website. The current site uses jekyll-theme-chirpy v6.2.3 with a minimalist design that the owner finds too plain and visually unappealing. The overhaul transforms the site into a premium, modern, visually engaging portfolio inspired by top-tier portfolio websites (Awwwards, Dribbble-level quality). Additionally, the site will support three languages (English, Indonesian, Chinese) and embed all external application links directly into pages using responsive iframes.

## Glossary

- **Site**: The Jekyll-based portfolio/blog website hosted at abelkristanto.github.io
- **Language_Switcher**: A UI component that allows visitors to switch between English, Indonesian, and Chinese versions of the site
- **Polyglot**: The jekyll-polyglot plugin (v1.12.0) used for multi-language internationalization
- **Embed_Container**: A responsive wrapper element that displays external applications (Streamlit, Tableau, YouTube, GitBook) as inline iframes within pages
- **Design_System**: The collection of CSS custom properties, typography scales, color palettes, animations, and component styles that define the site's visual identity
- **Hero_Section**: The prominent introductory section on the homepage featuring the owner's headline, description, and call-to-action
- **Card_Component**: A reusable UI element with depth (shadows, borders, hover effects) used to display projects, services, and content blocks
- **Micro_Animation**: Subtle CSS/JS animations triggered by user interaction (hover, scroll, focus) that enhance perceived quality
- **Theme_Toggle**: A UI control that switches between light and dark color modes
- **Locale_File**: A YAML data file (`_data/{lang}/strings.yml`) containing translated UI strings for a specific language

## Requirements

### Requirement 1: Premium Color Palette and Gradient System

**User Story:** As a site visitor, I want to see a polished, modern color scheme with subtle gradients, so that the site feels premium and visually engaging rather than flat and plain.

#### Acceptance Criteria

1. THE Design_System SHALL define a primary color palette with at least 5 colors (primary, secondary, accent, background, surface) using CSS custom properties, where each color is distinct in hue or lightness by a minimum of 10% from every other color in the palette
2. THE Design_System SHALL include gradient definitions for hero backgrounds, section backgrounds, and card hover states, where each gradient uses at least 3 color stops in a linear or radial gradient
3. WHEN the Theme_Toggle is set to dark mode, THE Design_System SHALL apply a dark color palette that maintains a minimum contrast ratio of 4.5:1 for body text and 3:1 for large text (18pt or bold 14pt) against their respective background colors, conforming to WCAG AA
4. WHEN the Theme_Toggle is set to light mode, THE Design_System SHALL apply a light color palette where background and surface areas each use a gradient or layered color treatment containing at least 2 color values rather than a single flat color
5. THE Design_System SHALL apply glassmorphism effects on at least the navigation bar and card overlays, defined as a background with opacity between 0.6 and 0.85 combined with a backdrop-filter blur radius between 8px and 20px
6. IF a browser does not support the backdrop-filter property, THEN THE Design_System SHALL fall back to a solid background color with opacity no less than 0.92 on glassmorphism elements to maintain text readability

### Requirement 2: Modern Typography System

**User Story:** As a site visitor, I want to see professional, well-structured typography, so that content is easy to read and the site feels polished.

#### Acceptance Criteria

1. THE Design_System SHALL use a font pairing consisting of a serif or display-weight font (weight 600 or above) for headings (h1 through h4) and a sans-serif font (weight 400 for body) for paragraph text, loaded via Google Fonts or self-hosted WOFF2 files with font-display set to swap
2. THE Design_System SHALL implement a modular type scale with at least 6 distinct sizes (xs, sm, base, lg, xl, 2xl) using CSS clamp() where the minimum value is no less than 0.75rem and the maximum value is no greater than 4rem
3. THE Design_System SHALL define letter-spacing (between -0.02em and 0.05em), line-height (between 1.1 and 1.6 for headings), and font-weight (between 500 and 900) for each heading level h1 through h4, with each successive level decreasing in font-size by at least 0.25rem
4. THE Site SHALL render Chinese characters using a CJK font stack (Noto Sans SC or equivalent) that is loaded only when the Chinese locale is active, with a maximum font file size of 2MB per weight variant to limit page load impact

### Requirement 3: Smooth Micro-Animations and Transitions

**User Story:** As a site visitor, I want to experience smooth, subtle animations when interacting with the site, so that it feels dynamic and high-quality.

#### Acceptance Criteria

1. WHEN a Card_Component receives mouse hover, THE Card_Component SHALL animate with a translateY between -2px and -6px or a scale between 1.01 and 1.05, combined with a box-shadow increase of at least 4px in blur radius, completing the transition within 200ms using an ease or ease-out timing function
2. WHEN a page section scrolls into the viewport (at least 20% visible as detected by Intersection Observer), THE Site SHALL reveal the section content with a fade-in from opacity 0 to 1 and an upward translate of 10px to 30px, completing within 400ms to 800ms
3. WHEN a visitor navigates between pages, THE Site SHALL apply a fade transition on the main content area with a duration between 150ms and 300ms, transitioning opacity from 0 to 1
4. WHEN a button or link receives focus or hover, THE Site SHALL apply a color transition and optional transform (scale between 1.0 and 1.05) within 150ms using an ease timing function
5. WHILE the user has enabled reduced-motion preferences in their operating system, THE Site SHALL disable all non-essential animations and transitions by respecting `prefers-reduced-motion: reduce`, setting all transition-duration and animation-duration values to 0ms except for opacity changes required for content visibility

### Requirement 4: Premium Hero Section

**User Story:** As a site visitor, I want to see an impressive, personality-driven hero section on the homepage, so that I immediately understand who Abel is and feel engaged.

#### Acceptance Criteria

1. THE Hero_Section SHALL display a gradient background with an animated movement (gradient position shift or floating shape translation) that cycles over a duration between 5 seconds and 20 seconds using CSS animation with infinite iteration
2. THE Hero_Section SHALL include Abel's name, professional tagline (maximum 10 words), a brief description (maximum 50 words), and at least two call-to-action buttons with distinct visual hierarchy (one primary filled, one secondary outlined)
3. THE Hero_Section SHALL display key statistics (3000+ professionals reached, 1000+ learners mentored, 10+ automation initiatives, 13 publications) in visually distinct metric cards arranged in a horizontal row at viewport widths of 768px and above
4. WHEN the viewport width is below 768px, THE Hero_Section SHALL stack all content vertically in a single column with a minimum horizontal padding of 16px on each side
5. THE Hero_Section SHALL load above-the-fold content without layout shift (Cumulative Layout Shift below 0.1) by specifying explicit width and height or aspect-ratio on all media elements and reserving space for dynamically loaded content

### Requirement 5: Modern Card and Component Design

**User Story:** As a site visitor, I want project cards, service cards, and content blocks to look polished with depth and visual hierarchy, so that the site feels professionally designed.

#### Acceptance Criteria

1. THE Card_Component SHALL use layered box-shadows (at least 2 shadow layers with distinct offsets) to create visible depth separation from the page background
2. THE Card_Component SHALL include a border of 1px width using semi-transparent colors (opacity between 0.05 and 0.2) that adapts to the active theme (light or dark)
3. WHEN a Card_Component receives hover, THE Card_Component SHALL elevate visually by increasing shadow spread by at least 2px and applying an upward transform of 2px to 6px, with a transition duration between 150ms and 300ms
4. THE Site SHALL define border-radius values as CSS custom properties and apply the same border-radius value across all card types, buttons, and input elements within a page
5. THE Card_Component SHALL support an optional accent color bar or gradient strip with a thickness between 3px and 6px at the top or left side to differentiate card categories

### Requirement 6: Dark and Light Theme Toggle

**User Story:** As a site visitor, I want to switch between dark and light modes with a visually appealing toggle, so that I can browse comfortably in any lighting condition.

#### Acceptance Criteria

1. THE Theme_Toggle SHALL be visible in the navigation area on all pages and at all viewport widths without requiring scrolling or menu expansion on desktop viewports (768px and above)
2. WHEN the Theme_Toggle is activated, THE Site SHALL transition all themed colors using CSS transitions of 300ms duration, and SHALL apply the selected theme's class to the document root before the first paint on page load to prevent flash of unstyled content
3. WHEN the Theme_Toggle is activated, THE Site SHALL store the selected theme value (light or dark) in localStorage under a defined key and SHALL read this key on page load before rendering
4. IF no user preference is stored in localStorage, THEN THE Site SHALL default to the system color scheme preference detected via the `prefers-color-scheme` media query
5. THE Theme_Toggle SHALL use an animated icon (sun/moon or equivalent) that transitions between states with a duration between 200ms and 400ms using CSS transform or opacity transitions

### Requirement 7: Multi-Language Support with Jekyll-Polyglot

**User Story:** As a site visitor, I want to browse the site in English, Indonesian, or Chinese, so that I can read content in my preferred language.

#### Acceptance Criteria

1. THE Site SHALL support three languages: English (en), Indonesian (id), and Chinese (zh), configured via the jekyll-polyglot plugin v1.12.0
2. THE Site SHALL store all translatable UI strings in Locale_Files at `_data/en/strings.yml`, `_data/id/strings.yml`, and `_data/zh/strings.yml`
3. THE Site SHALL set English as the default language, serving English content at the root URL path without a language prefix
4. THE Site SHALL serve Indonesian content at the `/id/` URL prefix and Chinese content at the `/zh/` URL prefix, with each prefixed URL returning the corresponding localized content
5. THE Site SHALL exclude static assets (images, CSS, JavaScript, fonts) from localization processing to avoid duplicate asset generation, ensuring only one copy of each asset exists in the built output
6. IF a Locale_File is missing a translation key, THEN THE Site SHALL fall back to the English value for that key rather than displaying an empty string or a raw key name

### Requirement 8: Language Switcher UI Component

**User Story:** As a site visitor, I want a clear, accessible language switcher in the navigation, so that I can easily change the site language at any time.

#### Acceptance Criteria

1. THE Language_Switcher SHALL be visible in the top navigation area on all pages and at all viewport widths, with a minimum touch target size of 44px by 44px on mobile viewports (below 768px)
2. THE Language_Switcher SHALL display the current active language label and provide selectable options to switch to the other two supported languages
3. WHEN a visitor selects a different language, THE Language_Switcher SHALL navigate to the equivalent page in the selected language while preserving the current page path structure
4. IF the equivalent page does not exist in the selected language, THEN THE Language_Switcher SHALL navigate to the homepage of the selected language
5. THE Language_Switcher SHALL display language names in their native script: "English", "Bahasa Indonesia", "中文"
6. THE Language_Switcher SHALL be operable via keyboard (Tab to focus, Enter or Space to activate) and SHALL include an `aria-label` attribute describing its purpose for screen readers

### Requirement 9: Localized Page Content

**User Story:** As a site visitor, I want all page content (headings, descriptions, navigation labels) to appear in my selected language, so that the experience feels native.

#### Acceptance Criteria

1. THE Site SHALL provide translated versions of all navigation labels, button text, footer text, and UI element labels in Locale_Files for English (en), Indonesian (id), and Chinese (zh), where each translatable string present in `_data/en/strings.yml` has a corresponding entry in `_data/id/strings.yml` and `_data/zh/strings.yml`
2. THE Site SHALL provide translated versions of the homepage hero section content (tagline, description, CTA labels) in all three languages (en, id, zh)
3. THE Site SHALL provide translated versions of the About, What I Do, and Teaching & Community page content in all three languages (en, id, zh)
4. WHEN a blog post does not have a translated version available in the visitor's selected language, THE Site SHALL display the original language version with a visible notice above the post content, written in the visitor's selected language, indicating the content is not yet translated
5. THE Site SHALL provide translated meta tags (title and description) in each language version so that search engines index language-specific metadata for each locale URL

### Requirement 10: Embedded Streamlit Applications

**User Story:** As a site visitor, I want to interact with Streamlit data apps directly on the page without leaving the site, so that I can explore Abel's work seamlessly.

#### Acceptance Criteria

1. THE Embed_Container SHALL display the Interactive Data Portfolio app (dashboardabelkrw.streamlit.app) as a responsive iframe with the `?embed=true` parameter on the Interactive Data Portfolio post page
2. THE Embed_Container SHALL display the AI Chatbot Prototype app (llama2.streamlit.app) as a responsive iframe with the `?embed=true` parameter on the AI Chatbot Prototype post page
3. THE Embed_Container SHALL maintain a minimum height of 600px on viewports of 768px width and above, and a minimum height of 400px on viewports below 768px width, scaling to 100% width of the parent container
4. IF a Streamlit app fails to load within the iframe within 10 seconds, THEN THE Site SHALL display a fallback message indicating the app is unavailable, along with a direct link that opens the app URL in a new browser tab
5. THE Embed_Container SHALL use lazy loading (loading="lazy" attribute) to avoid blocking initial page render

### Requirement 11: Embedded Tableau Dashboards

**User Story:** As a site visitor, I want to view Tableau dashboards directly on the page, so that I can explore data visualizations without navigating away.

#### Acceptance Criteria

1. THE Embed_Container SHALL display Tableau Public dashboards (Car Insurance Analysis, Spotify Analysis, Hotel Reservations Analysis, Mobile Sales Insight) as responsive iframes using Tableau's embed URL format on the Tableau Dashboard Collection post page
2. THE Embed_Container SHALL use the Tableau Public embed URL pattern: `https://public.tableau.com/views/{workbook}/{view}?:embed=y&:display_count=no`
3. THE Embed_Container SHALL maintain a 16:9 aspect ratio for Tableau embeds using the responsive padding-bottom technique, scaling to 100% width of the parent container
4. IF a Tableau dashboard fails to load within 10 seconds, THEN THE Site SHALL display a fallback message indicating the dashboard is unavailable, along with a direct link to the dashboard on Tableau Public that opens in a new tab
5. THE Embed_Container SHALL provide a fullscreen toggle button above each Tableau iframe that is keyboard-accessible, includes an aria-label describing its function, and expands the iframe to fill the viewport when activated

### Requirement 12: Embedded YouTube Videos

**User Story:** As a site visitor, I want to watch Esploor program YouTube videos directly on the page, so that I can access learning content without leaving the site.

#### Acceptance Criteria

1. THE Embed_Container SHALL display YouTube videos from the Esploor Research Program post as responsive iframes using the youtube-nocookie.com embed domain for privacy
2. THE Embed_Container SHALL maintain a 16:9 aspect ratio for all YouTube embeds using the responsive padding-bottom technique, scaling to 100% width of the parent container
3. THE Embed_Container SHALL use lazy loading (loading="lazy" attribute) for YouTube iframes to avoid blocking initial page render
4. THE Embed_Container SHALL include a title attribute on each YouTube iframe containing the video title text for accessibility
5. IF a YouTube video iframe fails to load, THEN THE Site SHALL display a fallback message with a direct link to the video on YouTube that opens in a new tab

### Requirement 13: Embedded GitBook Learning Material

**User Story:** As a site visitor, I want to browse the Data Science Learning GitBook directly on the site, so that I can access Abel's learning materials without navigating to an external page.

#### Acceptance Criteria

1. THE Embed_Container SHALL display the GitBook page (https://data-science-learning.gitbook.io/repository-datalab) as a responsive iframe that scales to 100% width of its parent container on a dedicated learning materials page or section
2. THE Embed_Container SHALL maintain a minimum height of 700px on viewports of 768px width and above to provide adequate reading space
3. THE Embed_Container SHALL include a header bar above the iframe containing a link labeled with the GitBook title that opens the GitBook URL in a new browser tab with rel="noopener noreferrer"
4. IF the GitBook content fails to load in the iframe within 10 seconds or the iframe fires an error event, THEN THE Site SHALL hide the iframe and display a fallback card containing a text explanation that the content cannot be embedded and a prominently styled link to the external GitBook URL (https://data-science-learning.gitbook.io/repository-datalab) that opens in a new tab
5. WHEN the viewport width is below 768px, THE Embed_Container SHALL adjust its minimum height to 500px and scale to 100% width of the viewport minus horizontal page padding

### Requirement 14: Responsive Embed Container System

**User Story:** As a developer, I want a reusable responsive embed system, so that all iframe embeds behave consistently across the site.

#### Acceptance Criteria

1. THE Embed_Container SHALL use a CSS class-based system with variants for three aspect ratios: 16:9 (video), 4:3 (dashboards), and fixed-height (apps, documents), where aspect-ratio variants use padding-bottom percentage technique or CSS aspect-ratio property to maintain proportions
2. THE Embed_Container SHALL ensure all iframes scale to 100% width of their parent container
3. THE Embed_Container SHALL include `frameborder="0"`, `allowfullscreen`, and a `sandbox` attribute with the value `allow-scripts allow-same-origin allow-popups` on all iframes
4. WHEN the viewport width is below 768px, THE Embed_Container SHALL adjust fixed-height embeds to use a minimum height of 400px
5. THE Embed_Container SHALL display a loading placeholder (spinner or skeleton element) that is visible while the iframe content loads, and SHALL hide the placeholder within 1 second after the iframe fires its load event

### Requirement 15: Premium Navigation and Layout

**User Story:** As a site visitor, I want a modern, visually refined navigation and page layout, so that browsing feels smooth and the site structure is clear.

#### Acceptance Criteria

1. THE Site SHALL display a sticky top navigation bar with a semi-transparent background (opacity between 0.7 and 0.9) and a backdrop-filter blur of at least 8px that remains fixed at the top of the viewport during scroll
2. THE Site SHALL apply CSS `scroll-behavior: smooth` to the html element for anchor link navigation and SHALL include a back-to-top button that becomes visible after scrolling down 300px from the top
3. THE Site SHALL use a minimum of 2rem vertical spacing between page sections and a maximum content width of 1200px centered horizontally
4. WHEN the viewport is below 768px, THE Site SHALL collapse the navigation into a hamburger menu icon (minimum touch target 44×44px) that reveals navigation links via a slide-in panel with a CSS transition duration between 200ms and 400ms
5. THE Site SHALL display the Language_Switcher and Theme_Toggle in the navigation bar as icon-only controls (maximum 40px width each) positioned at the end of the navigation bar

### Requirement 16: Performance and Deployment Compatibility

**User Story:** As the site owner, I want the premium redesign to build and deploy successfully on GitHub Pages, so that the site remains accessible and performant.

#### Acceptance Criteria

1. THE Site SHALL build successfully with Jekyll using the existing GitHub Actions workflow (pages-deploy.yml) and pass the html-proofer test step without errors
2. THE Site SHALL achieve a Lighthouse Performance score of at least 80 on mobile by using `loading="lazy"` on all below-the-fold iframes and images, and by ensuring no more than 2 render-blocking CSS or JS resources in the document head
3. THE Site SHALL load custom fonts using `font-display: swap` to prevent invisible text during font loading
4. THE Site SHALL keep total page weight below 2MB for the initial load, measured as the sum of all resources loaded before the DOMContentLoaded event excluding lazy-loaded iframe content
5. IF the Jekyll build fails due to a plugin incompatibility, THEN THE Site build workflow SHALL exit with a non-zero status code and the build log SHALL contain the plugin name and the specific error that caused the failure
