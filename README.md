# My Lamanai Experience

A dependency-free student field journal, ready for static hosting on Vercel.

## Edit the content

Open `content.js`. All visible text, accessibility labels, page metadata, captions,
image paths, student names, and the trip date are there. Keep quotes and commas in
place. Change `group.date` (YYYY-MM-DD) and `group.dateLabel` together. Replace the
sample names and draft reflection before submission. Keep exactly three highlights.
The supplied class-at-temple image serves as the group photograph; replace
`images/group-photo.jpg` with a formal group portrait if available.

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

## Content accuracy

References are linked in the website. Lamanai’s High Temple is not labeled El
Castillo (the name commonly associated with Xunantunich). The history explains
Lamanai’s persistence after regional decline. Ballgame rules are described as
variable, and universal winner/loser sacrifice claims are avoided. The third
highlight’s photo is explicitly identified as general temple/plaza architecture,
not a confirmed photograph of the Royal Complex. The map is the supplied sign
photograph, with an enlargement and links to archaeological research maps.
