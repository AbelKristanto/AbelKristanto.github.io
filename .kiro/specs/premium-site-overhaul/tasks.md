# Implementation Plan: Premium Site Overhaul

## Overview

This plan transforms the Jekyll portfolio from its current minimalist Chirpy-based design into a premium, visually engaging site with three major capabilities: premium visual design (gradients, glassmorphism, animations, dark/light theme), multi-language support (EN, ID, ZH via jekyll-polyglot), and embedded content (Streamlit, Tableau, YouTube, GitBook). Tasks are ordered so foundational work (SCSS system, polyglot setup, JS utilities) comes first, then component implementation, then content/translation, and finally verification.

## Tasks

- [x] 1. Set up foundational SCSS design system and project structure
  - [x] 1.1 Create SCSS partials directory and CSS custom properties
    - Create `_sass/premium/` directory with `_variables.scss` defining all CSS custom properties (color palette, gradients, glassmorphism values, shadows, radii, typography scale, transitions)
    - Create `_sass/premium/_theme-light.scss` with light theme gradient and layered color treatments
    - Create `_sass/premium/_theme-dark.scss` with `[data-theme="dark"]` overrides maintaining WCAG AA contrast ratios
    - Create barrel file `_sass/premium.scss` importing all partials in correct order
    - Update `assets/css/jekyll-theme-chirpy.scss` to `@import 'premium'`
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6_

  - [x] 1.2 Create typography system SCSS partial
    - Create `_sass/premium/_typography.scss` with font-family custom properties (Playfair Display for headings, Plus Jakarta Sans for body, Noto Sans SC for CJK)
    - Implement modular type scale with 6+ sizes using CSS clamp() (text-xs through text-4xl, min >= 0.75rem, max <= 4rem)
    - Define letter-spacing, line-height, and font-weight for h1–h4 with each level decreasing by at least 0.25rem
    - Add `[lang="zh"]` override to switch font-family to CJK stack
    - _Requirements: 2.1, 2.2, 2.3, 2.4_

  - [x] 1.3 Create glassmorphism SCSS partial
    - Create `_sass/premium/_glassmorphism.scss` with glass background (opacity 0.6–0.85), backdrop-filter blur (8px–20px), and semi-transparent border
    - Add `@supports not (backdrop-filter: blur(1px))` fallback with solid background opacity >= 0.92
    - Apply glassmorphism to `#topbar-wrapper` with sticky positioning and z-index
    - _Requirements: 1.5, 1.6, 15.1_

  - [x] 1.4 Create animations and transitions SCSS partial
    - Create `_sass/premium/_animations.scss` with card hover transitions (translateY -2px to -6px, shadow increase, 200ms ease)
    - Add scroll-reveal base styles (`.reveal-on-scroll` with opacity 0, translateY 20px; `.is-visible` with opacity 1, translateY 0)
    - Add page fade transition on main content area (150ms–300ms)
    - Add button/link hover transitions (color + optional scale 1.0–1.05, 150ms ease)
    - Add `@media (prefers-reduced-motion: reduce)` rule setting all transition-duration and animation-duration to 0ms except opacity
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

  - [x] 1.5 Create cards SCSS partial
    - Create `_sass/premium/_cards.scss` with layered box-shadows (at least 2 layers), semi-transparent border (opacity 0.05–0.2) adapting to theme
    - Add hover state with shadow spread increase (at least 2px) and upward transform (2px–6px), transition 150ms–300ms
    - Define border-radius as CSS custom properties applied consistently across cards, buttons, inputs
    - Add optional accent color bar/gradient strip (3px–6px thickness) at top or left
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

  - [x] 1.6 Create hero section SCSS partial
    - Create `_sass/premium/_hero.scss` with animated gradient background (position shift cycling 5s–20s, infinite)
    - Style hero content: name, tagline, description, dual CTA buttons (primary filled, secondary outlined)
    - Style metric cards in horizontal row at >= 768px, stacked vertically below 768px with 16px padding
    - Ensure no layout shift (CLS < 0.1) by reserving space for dynamic content
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

  - [x] 1.7 Create embeds SCSS partial
    - Create `_sass/premium/_embeds.scss` with CSS class-based system for three aspect ratios: `.embed-container--video` (16:9, padding-bottom 56.25%), `.embed-container--dashboard` (4:3, padding-bottom 75%), `.embed-container--app` / `.embed-container--document` (fixed min-height 600px at >= 768px, 400px below)
    - Style loading spinner/skeleton placeholder
    - Style fallback card with explanation text and external link button
    - Style fullscreen toggle button
    - _Requirements: 14.1, 14.2, 14.4, 14.5, 10.3, 11.3_

  - [x] 1.8 Create navigation SCSS partial
    - Create `_sass/premium/_navigation.scss` with sticky top nav, semi-transparent background (opacity 0.7–0.9), backdrop-filter blur >= 8px
    - Add hamburger menu styles for < 768px (44×44px touch target, slide-in panel with 200ms–400ms transition)
    - Style Language_Switcher and Theme_Toggle as icon-only controls (max 40px width) at end of nav bar
    - Add back-to-top button visibility after 300px scroll
    - _Requirements: 15.1, 15.2, 15.3, 15.4, 15.5_

  - [x] 1.9 Create responsive SCSS partial
    - Create `_sass/premium/_responsive.scss` with breakpoint overrides consolidating all responsive rules
    - Ensure minimum 2rem vertical spacing between sections, max content width 1200px centered
    - Add `scroll-behavior: smooth` on html element
    - _Requirements: 15.2, 15.3_

- [x] 2. Set up Jekyll-Polyglot multi-language infrastructure
  - [x] 2.1 Configure Polyglot in Gemfile and _config.yml
    - Add `gem "jekyll-polyglot", "~> 1.8"` to Gemfile
    - Add polyglot configuration to `_config.yml`: `languages: ["en", "id", "zh"]`, `default_lang: "en"`, `exclude_from_localization: ["assets", "images", "favicon", "feed.xml", "sitemap.xml"]`, `parallel_localization: false`
    - Add `lang_vars` section with per-language title and description for SEO
    - Add `jekyll-polyglot` to the `plugins` array in `_config.yml`
    - _Requirements: 7.1, 7.3, 7.4, 7.5, 16.1_

  - [x] 2.2 Create locale data files for all three languages
    - Create `_data/en/strings.yml` with all UI strings (navigation labels, theme toggle label, language switcher label, hero content, stats, embed messages, footer, untranslated notice)
    - Create `_data/id/strings.yml` with Indonesian translations for all keys
    - Create `_data/zh/strings.yml` with Chinese translations for all keys
    - Ensure every key in en/strings.yml has a corresponding non-empty entry in id and zh files
    - _Requirements: 7.2, 7.6, 9.1, 9.2_

  - [ ]* 2.3 Write property test for locale key completeness
    - **Property 10: Locale Key Completeness**
    - Parse all three YAML files, verify every key in en exists in id and zh with non-empty values
    - **Validates: Requirements 7.2, 9.1, 9.2**

- [x] 3. Implement JavaScript utilities
  - [x] 3.1 Create theme-toggle.js
    - Implement FOUC-prevention inline script (reads localStorage/prefers-color-scheme, sets `data-theme` on `<html>` before first paint)
    - Implement DOMContentLoaded toggle handler: click toggles `data-theme` between light/dark, stores in localStorage under key `site-theme`
    - Listen for system `prefers-color-scheme` changes when no stored preference exists
    - Handle localStorage unavailability (private browsing) gracefully
    - _Requirements: 6.2, 6.3, 6.4_

  - [ ]* 3.2 Write property test for theme persistence round-trip
    - **Property 9: Theme Persistence Round-Trip**
    - For random theme values in {"light", "dark"}, set localStorage, simulate load, verify `data-theme` attribute matches
    - **Validates: Requirements 6.3**

  - [x] 3.3 Create embed-loader.js
    - Implement DOMContentLoaded handler that finds all `.embed-container` elements
    - Set iframe `src` from `data-src` attribute to begin loading
    - Implement 10-second timeout: hide iframe, hide spinner, show fallback with direct link
    - Handle iframe `load` event: clear timeout, hide spinner, fade in iframe (opacity 0→1)
    - Handle iframe `error` event: show fallback immediately
    - _Requirements: 10.4, 11.4, 12.5, 13.4, 14.5_

  - [x] 3.4 Create scroll-reveal.js
    - Implement Intersection Observer with 20% threshold for section reveal
    - Add fade-in (opacity 0→1) and upward translate (10px–30px) completing in 400ms–800ms
    - Respect `prefers-reduced-motion: reduce` by skipping animations and immediately showing elements
    - Apply staggered reveal delays (capped at 240ms)
    - _Requirements: 3.2, 3.5_

  - [ ]* 3.5 Write property test for reduced motion compliance
    - **Property 5: Reduced Motion Compliance**
    - Parse CSS rules under `prefers-reduced-motion: reduce`, verify all transition-duration and animation-duration values are 0ms except opacity
    - **Validates: Requirements 3.5**

- [x] 4. Checkpoint - Ensure foundational systems compile correctly
  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. Implement HTML includes and layout modifications
  - [x] 5.1 Create theme-toggle.html include
    - Create `_includes/theme-toggle.html` with button element, sun/moon icons, `aria-label` from locale strings
    - Add animated icon transition (200ms–400ms CSS transform/opacity)
    - _Requirements: 6.1, 6.5_

  - [x] 5.2 Create language-switcher.html include
    - Create `_includes/language-switcher.html` with dropdown trigger showing current language, menu listing all three languages in native script ("English", "Bahasa Indonesia", "中文")
    - Use `{% static_href %}` block tag for language links to prevent Polyglot URL relativization
    - Implement keyboard accessibility (Tab to focus, Enter/Space to activate, Escape to close)
    - Add `aria-label`, `aria-expanded`, `role="listbox"`, `role="option"` attributes
    - Ensure 44×44px minimum touch targets on mobile
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6_

  - [ ]* 5.3 Write property test for language switcher URL construction
    - **Property 11: Language Switcher URL Construction**
    - Generate random page paths and target languages, verify URL equals `{baseurl}/{lang}{page_path}` for non-default or `{baseurl}{page_path}` for default (en)
    - **Validates: Requirements 8.3**

  - [x] 5.4 Create embed-container.html include
    - Create `_includes/embed-container.html` accepting parameters: `src`, `type` (video/dashboard/app/document), `title`, `fallback_url`, `fallback_text`
    - Include loading spinner, iframe with `data-src`, `loading="lazy"`, `frameborder="0"`, `allowfullscreen`, `sandbox="allow-scripts allow-same-origin allow-popups"`, non-empty `title` attribute
    - Include hidden fallback div with explanation text and external link
    - Add fullscreen toggle button with `aria-label` and keyboard accessibility
    - _Requirements: 14.1, 14.2, 14.3, 14.5_

  - [ ]* 5.5 Write property test for embed iframe attributes
    - **Property 12: Embed Iframe Attributes**
    - Generate embed configurations, render HTML, verify each iframe includes: `frameborder="0"`, `allowfullscreen`, `sandbox="allow-scripts allow-same-origin allow-popups"`, non-empty `title`, `loading="lazy"`
    - **Validates: Requirements 14.3, 12.4, 10.5, 12.3**

  - [x] 5.6 Create head-fonts.html include
    - Create `_includes/head-fonts.html` with preconnect to Google Fonts, preload and stylesheet links for Plus Jakarta Sans and Playfair Display with `font-display: swap`
    - Conditionally load Noto Sans SC only when `site.active_lang == 'zh'`
    - _Requirements: 2.1, 2.4, 16.3_

  - [x] 5.7 Update default.html layout
    - Add `data-theme` attribute to `<html>` element (set by inline theme-toggle script in `<head>`)
    - Include `head-fonts.html` in the `<head>` section
    - Add inline FOUC-prevention script before `</head>`
    - Replace `site.lang` references with `site.active_lang` for Polyglot compatibility
    - Include `scroll-reveal.js`, `theme-toggle.js`, and `embed-loader.js` before `</body>`
    - _Requirements: 6.2, 6.3, 7.1, 16.3_

  - [x] 5.8 Update topbar.html with language switcher and theme toggle
    - Add `{% include language-switcher.html %}` and `{% include theme-toggle.html %}` to the navigation bar
    - Replace hardcoded navigation labels with locale string lookups: `{{ site.data[site.active_lang].strings.nav_home | default: site.data.en.strings.nav_home }}`
    - Apply glassmorphism classes to `#topbar-wrapper`
    - Add hamburger menu for mobile with slide-in panel
    - _Requirements: 6.1, 8.1, 15.1, 15.4, 15.5_

  - [x] 5.9 Update sidebar.html for Polyglot compatibility
    - Replace any `site.lang` references with `site.active_lang`
    - Ensure sidebar links use locale-aware URLs
    - _Requirements: 7.1_

  - [x] 5.10 Update footer.html with localized strings
    - Replace hardcoded text with locale string lookups using `| default:` filter for English fallback
    - _Requirements: 9.1_

- [x] 6. Implement premium hero section on homepage
  - [x] 6.1 Update home.html layout with premium hero
    - Rewrite hero section with animated gradient background, Abel's name, professional tagline (max 10 words), description (max 50 words), dual CTA buttons
    - Add metric cards (3000+ professionals, 1000+ learners, 10+ automation, 13 publications) in horizontal row
    - Use locale strings for all text content: `{{ site.data[site.active_lang].strings.hero_title | default: site.data.en.strings.hero_title }}`
    - Ensure explicit dimensions/aspect-ratio on media elements for CLS < 0.1
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 9.2_

  - [ ]* 6.2 Write property test for hero content word limits
    - **Property 6: Hero Content Word Limits**
    - For each locale (en, id, zh), verify hero tagline <= 10 words and description <= 50 words (Chinese: character count ÷ 2 as approximate word count)
    - **Validates: Requirements 4.2**

- [x] 7. Checkpoint - Verify visual design and navigation work end-to-end
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 8. Implement embedded content in posts
  - [x] 8.1 Update Interactive Data Portfolio post with Streamlit embed
    - Modify `_posts/2023-10-04-Data-Portofolio.md` to use `{% include embed-container.html src="https://dashboardabelkrw.streamlit.app/?embed=true" type="app" title="Interactive Data Portfolio - Streamlit App" fallback_url="https://dashboardabelkrw.streamlit.app/?embed=true" %}`
    - Ensure embed has min-height 600px on desktop, 400px on mobile, 100% width
    - _Requirements: 10.1, 10.3, 10.4, 10.5_

  - [x] 8.2 Update AI Chatbot Prototype post with Streamlit embed
    - Modify `_posts/2023-10-19-LLM-Example.md` to use `{% include embed-container.html src="https://llama2.streamlit.app/?embed=true" type="app" title="AI Chatbot Prototype - Streamlit App" fallback_url="https://llama2.streamlit.app/?embed=true" %}`
    - _Requirements: 10.2, 10.3, 10.4, 10.5_

  - [x] 8.3 Update Tableau Dashboard Collection post with Tableau embeds
    - Modify `_posts/2024-03-10-Tableau-Portofolio.md` to include multiple Tableau embeds using URL pattern `https://public.tableau.com/views/{workbook}/{view}?:embed=y&:display_count=no`
    - Use `type="dashboard"` for 4:3 aspect ratio (padding-bottom 75%)
    - Add fullscreen toggle button above each iframe with `aria-label` and keyboard accessibility
    - Include embeds for: Car Insurance Analysis, Spotify Analysis, Hotel Reservations Analysis, Mobile Sales Insight
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_

  - [ ]* 8.4 Write property test for Tableau embed URL pattern
    - **Property 13: Tableau Embed URL Pattern**
    - For each Tableau iframe, verify `src` matches `https://public.tableau.com/views/{workbook}/{view}?:embed=y&:display_count=no` with non-empty path segments
    - **Validates: Requirements 11.2**

  - [x] 8.5 Update Esploor Research Program post with YouTube embeds
    - Modify `_posts/2025-01-31-Esploor-Research-Program.md` to use `{% include embed-container.html %}` with `type="video"` for 16:9 aspect ratio
    - Use `youtube-nocookie.com` embed domain for privacy
    - Add `title` attribute with video title text on each iframe
    - Use `loading="lazy"` for all YouTube iframes
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5_

  - [ ]* 8.6 Write property test for YouTube privacy domain
    - **Property 14: YouTube Privacy Domain**
    - For each YouTube iframe, verify `src` domain is `www.youtube-nocookie.com` (not `www.youtube.com`)
    - **Validates: Requirements 12.1**

  - [x] 8.7 Create GitBook learning materials page/section with embed
    - Create a dedicated page or section embedding `https://data-science-learning.gitbook.io/repository-datalab` using `{% include embed-container.html type="document" %}`
    - Add header bar above iframe with link to GitBook URL (opens in new tab with `rel="noopener noreferrer"`)
    - Set min-height 700px on desktop, 500px on mobile
    - Implement fallback card if content fails to load (hide iframe, show explanation + external link)
    - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5_

  - [ ]* 8.8 Write property test for embed type to aspect ratio mapping
    - **Property 15: Embed Type to Aspect Ratio Mapping**
    - For type "video" verify 16:9 (padding-bottom 56.25% or aspect-ratio 16/9), for "dashboard" verify 4:3 (padding-bottom 75%), for "app"/"document" verify fixed min-height >= 600px at >= 768px
    - **Validates: Requirements 14.1, 10.3, 11.3, 12.2**

- [x] 9. Create translated page content
  - [x] 9.1 Create Indonesian translations for About, What I Do, Teaching & Community pages
    - Create Indonesian versions of `_tabs/about.md`, `_tabs/skills.md` (What I Do), and `_tabs/teaching-community.md` with `lang: id` front matter
    - Translate all headings, descriptions, and content to Indonesian
    - _Requirements: 9.3_

  - [x] 9.2 Create Chinese translations for About, What I Do, Teaching & Community pages
    - Create Chinese versions of `_tabs/about.md`, `_tabs/skills.md` (What I Do), and `_tabs/teaching-community.md` with `lang: zh` front matter
    - Translate all headings, descriptions, and content to Chinese
    - _Requirements: 9.3_

  - [x] 9.3 Add untranslated content notice for posts without translations
    - Create a partial or conditional block in the post layout that displays a visible notice (in the visitor's selected language) when a post doesn't have a translated version
    - Use locale string `untranslated_notice` from the active language's strings.yml
    - _Requirements: 9.4_

  - [x] 9.4 Add translated meta tags for SEO
    - Ensure each locale version outputs correct `<title>` and `<meta name="description">` from `lang_vars` in `_config.yml`
    - Add `<link rel="alternate" hreflang="...">` tags for each language version in the `<head>`
    - _Requirements: 9.5_

- [x] 10. Checkpoint - Verify multi-language and embeds work correctly
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 11. Design system validation and property tests
  - [ ]* 11.1 Write property test for color palette distinctness
    - **Property 1: Color Palette Distinctness**
    - For any pair of colors in the primary palette (primary, secondary, accent, background, surface), verify difference in hue or lightness >= 10%
    - **Validates: Requirements 1.1**

  - [ ]* 11.2 Write property test for dark mode WCAG contrast compliance
    - **Property 2: Dark Mode WCAG Contrast Compliance**
    - For text/background color pairs in dark theme, compute WCAG contrast ratio and verify >= 4.5:1 for body text, >= 3:1 for large text
    - **Validates: Requirements 1.3**

  - [ ]* 11.3 Write property test for type scale bounds
    - **Property 3: Type Scale Bounds**
    - Parse clamp() values from type scale custom properties, verify min >= 0.75rem and max <= 4rem
    - **Validates: Requirements 2.2**

  - [ ]* 11.4 Write property test for heading size hierarchy
    - **Property 4: Heading Size Hierarchy**
    - For consecutive heading pairs (h1/h2, h2/h3, h3/h4), verify max font-size of lower level is at least 0.25rem smaller than min of higher level
    - **Validates: Requirements 2.3**

  - [ ]* 11.5 Write property test for card border opacity per theme
    - **Property 7: Card Border Opacity Per Theme**
    - Extract card border-color alpha values for light and dark themes, verify between 0.05 and 0.2 inclusive
    - **Validates: Requirements 5.2**

  - [ ]* 11.6 Write property test for consistent border-radius
    - **Property 8: Consistent Border-Radius**
    - Verify all card components, buttons, and inputs reference the same CSS custom property for border-radius within their category
    - **Validates: Requirements 5.4**

- [x] 12. Performance and deployment verification
  - [x] 12.1 Verify Jekyll build succeeds with Polyglot
    - Run `bundle exec jekyll build` and verify exit code 0
    - Verify `_site/id/` and `_site/zh/` directories are generated
    - Verify `_site/id/assets/` and `_site/zh/assets/` do NOT exist (assets excluded from localization)
    - Verify html-proofer passes without errors
    - _Requirements: 16.1, 7.4, 7.5_

  - [x] 12.2 Verify performance requirements
    - Ensure `loading="lazy"` on all below-the-fold iframes and images
    - Ensure no more than 2 render-blocking CSS/JS resources in document head
    - Verify custom fonts use `font-display: swap`
    - Verify total initial page weight target < 2MB (excluding lazy-loaded iframes)
    - _Requirements: 16.2, 16.3, 16.4_

  - [x] 12.3 Wire all components together and verify integration
    - Ensure theme toggle, language switcher, glassmorphism nav, hero section, cards, embeds, and scroll-reveal all work together
    - Verify dark/light theme transitions apply to all components (300ms CSS transitions)
    - Verify language switching navigates to equivalent page preserving path structure
    - Verify embed fallbacks trigger correctly on timeout
    - _Requirements: 6.2, 8.3, 3.1, 3.2, 3.3_

- [x] 13. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties from the design document using fast-check (JavaScript PBT library)
- Unit tests validate specific examples and edge cases
- The design uses SCSS, HTML/Liquid, and JavaScript — no language selection needed
- `parallel_localization: false` is required for GitHub Actions compatibility
- All `site.lang` references in templates must be replaced with `site.active_lang` for Polyglot
- The `{% static_href %}` Liquid block tag is required for language switcher links

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "2.1"] },
    { "id": 1, "tasks": ["1.2", "1.3", "1.5", "1.7", "1.8", "1.9", "2.2"] },
    { "id": 2, "tasks": ["1.4", "1.6", "2.3", "3.1", "3.3", "3.4"] },
    { "id": 3, "tasks": ["3.2", "3.5", "5.1", "5.2", "5.4", "5.6"] },
    { "id": 4, "tasks": ["5.3", "5.5", "5.7", "5.8", "5.9", "5.10"] },
    { "id": 5, "tasks": ["6.1", "8.1", "8.2", "8.3", "8.5", "8.7"] },
    { "id": 6, "tasks": ["6.2", "8.4", "8.6", "8.8", "9.1", "9.2", "9.3", "9.4"] },
    { "id": 7, "tasks": ["11.1", "11.2", "11.3", "11.4", "11.5", "11.6"] },
    { "id": 8, "tasks": ["12.1", "12.2", "12.3"] }
  ]
}
```
