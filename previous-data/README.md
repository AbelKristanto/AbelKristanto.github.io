# previous-data

Archive of files that are no longer part of the site build.

Nothing in this folder is read by Jekyll — `previous-data` is listed under
`exclude:` in `_config.yml`, so these files are never copied into `_site` and
never referenced by a layout, include, or stylesheet.

## What is here

| Path | Why it was retired |
| --- | --- |
| `_sass/premium.scss`, `_sass/premium/` | The premium stylesheet. Replaced by `_sass/minimalist/`, which is the only stylesheet the site imports. |
| `_includes/topbar.html`, `sidebar.html`, `footer.html` | Chirpy-era chrome. Replaced by `topbar-minimalist.html` and `footer-minimalist.html`. |
| `_includes/language-switcher.html` | Superseded by the switcher built into the navigation drawer. |
| `_includes/head-fonts.html`, `metadata-hook.html` | Font and metadata hooks for the premium layout. `head-fonts-minimalist.html` is used instead. |
| `_includes/scroll-reveal.html`, `assets/js/scroll-reveal.js` | Inline IntersectionObserver reveals. Replaced by the GSAP ScrollTrigger reveals in `assets/js/site-motion.js`. |
| `_includes/search-loader.html` | Search UI from the Chirpy theme; the site has no search. |
| `assets/js/theme-init.js`, `assets/js/lang-switcher.js` | Superseded by the inline theme boot script in `_includes/head.html` and by `assets/js/theme-toggle.js`. |
| `_data/authors.yml`, `share.yml`, `contact.yml` | Chirpy data files. Site content comes from `_data/{en,id,zh}/strings.yml`. |
| `assets/img/additional/sa.png`, `hra.png`, `_posts/img.png` | Images no longer referenced by any page or post. |
| `assets/img/readme.md` | Note from the original theme. |

## Restoring something

Copy the file back to the path shown in the table and re-add its reference (an
`@import`, an `{% include %}`, or a `<script>` tag). Files here are plain
copies, so nothing else is needed.
