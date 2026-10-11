# My Lamanai Experience

A dependency-free student field journal, ready for static hosting on Vercel.

## Edit the content

Open `content.js`. All visible text, accessibility labels, page metadata, captions,
image paths, student names, and the trip date are there. Keep quotes and commas in
place. Change `group.date` (YYYY-MM-DD) and `group.dateLabel` together. The ending
reflection is supplied by the team. Keep exactly three highlights. Names and
September 12, 2026 come from the supplied team photo card; its full composition
is preserved in the group section.

## Preview

Open `index.html`, or serve this directory with `python -m http.server 4173` and
visit http://localhost:4173. There is no install or build step.

## Deploy on Vercel

Import this repository. Select **Other** as the framework preset, leave the build
command empty, and use `.` as the output directory. The root `index.html` is the
entry point. No backend or environment variables are required.

## Structure

- `index.html`: semantic section containers, ordered deferred scripts, image dialog.
- `style.css`: responsive design, visible focus states, reduced-motion support.
- `content.js`: teammate-editable content and reference links.
- `script.js`: safe DOM rendering, responsive menu, active navigation, lightbox.
- `images/`: optimized local photographs; no third-party image requests.

## Interactive journal

Gallery filter labels live in `gallery.filters` in `content.js`; match each photo's
`category` to its filter id. The photo viewer browses the current selection with
buttons or the left/right arrow keys. Escape closes the viewer. The map and group
photo use standalone views. Scroll reveals respect reduced-motion preferences,
and the thin line below the header indicates reading progress.

The hero cycles through `hero.scenes`. Change its interval with
`ui.sceneDuration` (milliseconds). Visitors can select or pause scenes; autoplay
stops during hover, keyboard focus, while the hero is offscreen, and while the
browser tab is hidden. Reduced-motion preferences disable autoplay by default
and remove image movement. Timeline buttons update a chapter preview using
`history.chapterPhotos`, in the same order as `history.timeline`. These images
are present-day context photographs, not historical reconstructions.

## Image performance

`content.js` contains an `assets` catalog with responsive WebP paths and image
dimensions. Keep editing the existing `image` fields as before; the renderer
automatically selects optimized files when a catalog entry exists. New uncataloged
paths continue to work. The original JPEGs remain available. Slideshow scenes are
loaded on demand, and the desktop-only photo card does not load on mobile. The
first hero image is preloaded directly from the content configuration. Above-fold
headings appear immediately, and the header reserves its space before rendering.

## Content accuracy

References are linked in the website. Lamanai’s High Temple is not labeled El
Castillo (the name commonly associated with Xunantunich). The history explains
Lamanai’s persistence after regional decline. Ballgame rules are described as
variable, and universal winner/loser sacrifice claims are avoided. The third
highlight features the Maya Calendar, using the team’s supplied explanation and
the existing calendar-stone photograph. High Temple text and the ending reflection
also use the team’s supplied wording.
The map is the supplied sign
photograph, with an enlargement and links to archaeological research maps.

The second upload contains 17 project images and two reference screenshots. Six
project photos repeat earlier uploads; those files are reused. Eleven are new:
ten site photos and the dedicated team photo. Different angles are retained,
and the gallery has 16 distinct photographs. Screenshot instructions are reference
material; personal student explanations should be supplied by the team.
