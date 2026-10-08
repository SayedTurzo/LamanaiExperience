/* Render only from content.js. DOM APIs keep teammate-entered text safe. */
(() => {
  "use strict";
  const data = window.siteContent;
  if (!data) return;
  const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
  const $ = (id) => document.getElementById(id);
  const sourceById = new Map(data.sources.items.map((source) => [source.id, source]));

  // Small element factory: text is never interpreted as HTML.
  function el(tag, className, text, attributes = {}) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    Object.entries(attributes).forEach(([name, value]) => element.setAttribute(name, value));
    return element;
  }
  function link(label, href, className = "") {
    // Allow internal anchors, relative assets, and HTTPS references only.
    const safeHref = /^(#|https:\/\/|images\/)/.test(href) ? href : "#";
    return el("a", className, label, { href: safeHref });
  }
  function setImageSource(img, item, sizes = "(max-width: 600px) calc(100vw - 40px), (max-width: 900px) 50vw, 600px") {
    const asset = data.assets[item.image];
    if (asset) {
      img.width = asset.width; img.height = asset.height;
      img.sizes = sizes; img.srcset = asset.srcset;
    } else {
      img.removeAttribute("srcset"); img.removeAttribute("sizes");
      img.removeAttribute("width"); img.removeAttribute("height");
    }
    img.src = asset?.src || item.image;
  }
  function image(item, eager = false, sizes, loadNow = true) {
    const img = el("img", "", undefined, {
      alt: item.alt || item.imageAlt, loading: eager ? "eager" : "lazy", decoding: "async"
    });
    if (eager) img.setAttribute("fetchpriority", "high");
    if (loadNow) setImageSource(img, item, sizes);
    img.addEventListener("error", () => {
      img.classList.add("image-error");
      img.alt = `${data.ui.imageUnavailable}: ${img.alt}`;
    }, { once: true });
    return img;
  }
  function heading(item, id) {
    const wrap = el("div", "section-heading");
    wrap.append(el("p", "eyebrow", item.eyebrow), el("h2", "", item.title, { id }));
    if (item.introduction) wrap.append(el("p", "section-intro", item.introduction));
    return wrap;
  }
  function arrow() { return el("span", "arrow", data.ui.expandSymbol, { "aria-hidden": "true" }); }

  document.title = data.meta.title;
  document.querySelector('meta[name="description"]').content = data.meta.description;
  $("skip-link").textContent = data.ui.skip;
  const brand = link("", "#home", "brand");
  const brandText = el("span", "brand-text");
  brandText.append(el("strong", "", data.brand.title), el("small", "", data.brand.subtitle));
  brand.append(el("span", "brand-mark", data.brand.monogram, { "aria-hidden": "true" }), brandText);
  const nav = el("nav", "navigation", undefined, { id: "navigation", "aria-label": data.ui.navigation });
  data.navigation.forEach((item) => nav.append(link(item.label, item.href)));
  const menu = el("button", "menu-toggle", undefined, { type: "button", "aria-controls": "navigation", "aria-expanded": "false", "aria-label": data.ui.menuOpen });
  menu.append(el("span"), el("span"));
  const headerInner = el("div", "header-inner");
  headerInner.append(brand, nav, menu);
  $("header").append(headerInner);

  // Hero image is a real image for accessibility and loading priority.
  const heroScenes = [data.hero, ...data.hero.scenes];
  const sceneImages = heroScenes.map((scene, index) => {
    // Inactive scenes get no URL yet: opacity/lazy loading alone still fetches
    // viewport-sized hidden images and competes with the initial hero request.
    const img = image(scene, index === 0, "100vw", index === 0);
    img.classList.add("hero-scene");
    img.classList.toggle("scene-active", index === 0);
    img.setAttribute("aria-hidden", String(index !== 0));
    $("home").append(img);
    return img;
  });
  $("home").append(el("div", "hero-shade"));
  const heroInner = el("div", "hero-inner container");
  heroInner.append(el("p", "eyebrow", data.hero.eyebrow), el("h1", "", data.hero.title, { id: "hero-title" }), el("p", "hero-subtitle", data.hero.subtitle), el("p", "hero-body", data.hero.body));
  const cta = link(data.hero.action, data.hero.actionHref, "button button-gold");
  cta.append(arrow());
  const heroActions = el("div", "hero-actions");
  const secondaryCta = link(data.hero.secondaryAction, data.hero.secondaryHref, "hero-secondary");
  secondaryCta.append(arrow());
  heroActions.append(cta, secondaryCta);
  heroInner.append(heroActions);
  const fieldNote = data.hero.fieldNote;
  const noteCard = el("aside", "hero-note");
  const noteImage = image(fieldNote, false, "(max-width: 1100px) 199px, 231px", false);
  const noteMedia = window.matchMedia("(min-width: 901px)");
  function loadNoteImage() { if (noteMedia.matches && !noteImage.hasAttribute("src")) setImageSource(noteImage, fieldNote, "(max-width: 1100px) 199px, 231px"); }
  loadNoteImage(); noteMedia.addEventListener("change", loadNoteImage);
  noteCard.append(el("p", "eyebrow", fieldNote.eyebrow), el("h2", "", fieldNote.title), noteImage, el("p", "note-caption", fieldNote.caption));
  heroInner.append(noteCard);
  const heroBottom = el("div", "hero-bottom container");
  const sceneCaption = el("span", "hero-caption", data.hero.imageCaption);
  const sceneControls = el("div", "scene-controls", undefined, { role: "group", "aria-label": data.ui.heroScenes });
  const sceneButtons = heroScenes.map((scene, index) => {
    const button = el("button", "scene-dot", String(index + 1).padStart(2, "0"), {
      type: "button", "aria-label": data.ui.sceneLabel.replace("{number}", String(index + 1)).replace("{caption}", scene.imageCaption), "aria-pressed": String(index === 0)
    });
    button.addEventListener("click", () => { changeScene(index); scheduleScene(); });
    sceneControls.append(button);
    return button;
  });
  const scenePause = el("button", "scene-pause", undefined, { type: "button" });
  sceneControls.append(scenePause);
  heroBottom.append(el("span", "hero-location", data.hero.location), sceneControls, sceneCaption);
  $("home").append(heroInner, heroBottom);

  // Autoplay only while the hero is visible and idle. Pause, keyboard focus,
  // reduced motion and a background browser tab all stop automatic changes.
  let activeScene = 0;
  let sceneTimer = 0;
  let sceneRequest = 0;
  let scenePlaying = !motionPreference.matches;
  let heroReady = false;
  let heroVisible = true;
  let heroHovered = false;
  function updateScenePause() {
    $("home").classList.toggle("motion-paused", !scenePlaying);
    scenePause.textContent = scenePlaying ? data.ui.pauseSymbol : data.ui.playSymbol;
    scenePause.setAttribute("aria-label", scenePlaying ? data.ui.pauseSlideshow : data.ui.playSlideshow);
  }
  async function changeScene(index) {
    const request = ++sceneRequest;
    if (!sceneImages[index].hasAttribute("src")) {
      sceneImages[index].loading = "eager";
      setImageSource(sceneImages[index], heroScenes[index], "100vw");
    }
    try { await sceneImages[index].decode(); } catch { return; }
    if (request !== sceneRequest) return;
    activeScene = index;
    sceneImages.forEach((img, i) => { img.classList.toggle("scene-active", i === index); img.setAttribute("aria-hidden", String(i !== index)); });
    sceneButtons.forEach((button, i) => button.setAttribute("aria-pressed", String(i === index)));
    sceneCaption.textContent = heroScenes[index].imageCaption;
  }
  function scheduleScene() {
    window.clearTimeout(sceneTimer);
    $("home").classList.toggle("motion-suspended", !heroVisible || document.hidden || $("photo-dialog").open);
    if (!heroReady || !scenePlaying || !heroVisible || heroHovered || document.hidden || $("home").contains(document.activeElement) || $("photo-dialog").open) return;
    sceneTimer = window.setTimeout(async () => { await changeScene((activeScene + 1) % heroScenes.length); scheduleScene(); }, data.ui.sceneDuration);
  }
  scenePause.addEventListener("click", () => { scenePlaying = !scenePlaying; updateScenePause(); scheduleScene(); });
  $("home").addEventListener("pointerenter", (event) => { if (event.pointerType === "mouse") { heroHovered = true; scheduleScene(); } });
  $("home").addEventListener("pointerleave", () => { heroHovered = false; scheduleScene(); });
  $("home").addEventListener("focusin", scheduleScene);
  $("home").addEventListener("focusout", () => window.setTimeout(scheduleScene, 0));
  document.addEventListener("visibilitychange", scheduleScene);
  motionPreference.addEventListener("change", () => { if (motionPreference.matches) scenePlaying = false; updateScenePause(); scheduleScene(); });
  if ("IntersectionObserver" in window) new IntersectionObserver(([entry]) => { heroVisible = entry.isIntersecting; scheduleScene(); }).observe($("home"));
  updateScenePause();
  // Wait for the initial photograph before starting the scene timer.
  sceneImages[0].decode().catch(() => {}).then(() => { heroReady = true; scheduleScene(); });
  const stats = el("div", "stats container");
  data.intro.forEach((item) => {
    const stat = el("div", "stat");
    stat.append(el("strong", "", item.value), el("span", "", item.label));
    stats.append(stat);
  });
  $("intro").append(stats);

  const historyInner = el("div", "container");
  historyInner.append(heading(data.history, "history-title"));
  const historyGrid = el("div", "history-grid");
  const timeline = el("ol", "timeline", undefined, { "aria-label": data.history.timelineLabel });
  const chapterPanel = el("div", "chapter-panel");
  const chapterCopy = el("div", "chapter-copy", undefined, { "aria-live": "polite", "aria-atomic": "true" });
  const chapterDate = el("p", "chapter-date");
  const chapterTitle = el("h3", "");
  const chapterText = el("p", "chapter-text");
  chapterCopy.append(el("p", "eyebrow", data.ui.chapterEyebrow), chapterDate, chapterTitle, chapterText);
  const chapterFigure = el("figure", "chapter-photo");
  const chapterImage = image(data.history.chapterPhotos[0]);
  chapterFigure.append(chapterImage, el("figcaption", "", data.ui.chapterPhotoLabel));
  chapterPanel.append(chapterCopy, chapterFigure);
  const chapterButtons = [];
  function selectChapter(index) {
    const item = data.history.timeline[index];
    const photo = data.history.chapterPhotos[index] || data.history.chapterPhotos[0];
    chapterDate.textContent = item.date;
    chapterTitle.textContent = item.title;
    chapterText.textContent = item.text;
    setImageSource(chapterImage, photo); chapterImage.alt = photo.alt;
    chapterButtons.forEach((button, i) => button.setAttribute("aria-pressed", String(i === index)));
    if (!motionPreference.matches && chapterCopy.animate) chapterCopy.animate([{ opacity: 0, transform: "translateY(8px)" }, { opacity: 1, transform: "translateY(0)" }], { duration: 300 });
  }
  data.history.timeline.forEach((item, index) => {
    const row = el("li", "timeline-item");
    const copy = el("div", "timeline-copy");
    copy.append(el("h3", "", item.title), el("p", "", item.text));
    const chapterButton = el("button", "chapter-button", undefined, { type: "button", "aria-label": `${data.ui.chapterLabel}: ${item.date} · ${item.title}` });
    chapterButton.append(el("span", "timeline-date", item.date), copy, el("span", "chapter-arrow", data.ui.expandSymbol, { "aria-hidden": "true" }));
    chapterButton.addEventListener("click", () => {
      selectChapter(index);
      if (chapterPanel.getBoundingClientRect().top < 80) chapterPanel.scrollIntoView({ behavior: motionPreference.matches ? "instant" : "smooth", block: "start" });
    });
    chapterButtons.push(chapterButton);
    row.append(chapterButton);
    timeline.append(row);
  });
  selectChapter(0);
  const map = data.history.map;
  const mapCard = el("aside", "map-card");
  const mapFigure = el("figure");
  const mapButton = el("button", "map-image photo-trigger", undefined, { type: "button", "aria-label": data.ui.enlargeMap });
  mapButton.append(image(map), el("span", "map-zoom", data.ui.enlargeMap));
  mapButton.addEventListener("click", () => openPhoto(map, map.caption));
  mapFigure.append(mapButton, el("figcaption", "", map.caption));
  const places = el("ul", "map-places");
  map.places.forEach((place) => places.append(el("li", "", place)));
  const mapLink = link(map.linkLabel, map.link, "text-link");
  mapLink.append(arrow());
  mapCard.append(el("p", "eyebrow", map.eyebrow), el("h3", "", map.title), mapFigure, places, el("p", "small-note", map.note), mapLink);
  historyGrid.append(timeline, mapCard);
  historyInner.append(chapterPanel, historyGrid);
  $("history").append(historyInner);

  const highlightsInner = el("div", "container");
  highlightsInner.append(heading(data.highlights, "highlights-title"));
  const cards = el("div", "highlight-grid");
  data.highlights.items.forEach((item) => {
    const card = el("article", "highlight-card");
    const figure = el("figure", "highlight-image");
    figure.append(image(item), el("span", "highlight-number", item.number), el("figcaption", "", item.caption));
    const copy = el("div", "highlight-copy");
    copy.append(el("p", "eyebrow", item.category), el("h3", "", item.title));
    item.paragraphs.forEach((paragraph) => copy.append(el("p", "", paragraph)));
    const refs = el("div", "card-sources");
    item.sourceIds.forEach((id) => {
      const source = sourceById.get(id);
      if (source) refs.append(link(source.label, source.url));
    });
    copy.append(refs);
    card.append(figure, copy);
    cards.append(card);
  });
  highlightsInner.append(cards);
  $("highlights").append(highlightsInner);

  const galleryInner = el("div", "container");
  galleryInner.append(heading(data.gallery, "gallery-title"));
  const galleryToolbar = el("div", "gallery-toolbar");
  const filterGroup = el("div", "gallery-filters", undefined, { role: "group", "aria-label": data.ui.galleryFilters });
  const galleryCount = el("p", "gallery-count", undefined, { "aria-live": "polite", "aria-atomic": "true" });
  galleryToolbar.append(filterGroup, galleryCount);
  let visiblePhotos = data.gallery.items.slice();
  const photos = el("div", "gallery-grid");
  const galleryFigures = [];
  data.gallery.items.forEach((item) => {
    const figure = el("figure", `gallery-item ${item.shape === "wide" ? "gallery-wide" : ""}`);
    const button = el("button", "gallery-photo photo-trigger", undefined, { type: "button", "aria-label": `${data.ui.viewPhoto}: ${item.title}` });
    const gallerySizes = item.shape === "wide" ? "(max-width: 900px) calc(100vw - 40px), 600px" : "(max-width: 600px) calc((100vw - 56px) / 2), (max-width: 900px) calc((100vw - 70px) / 2), 300px";
    button.append(image(item, false, gallerySizes), el("span", "photo-expand", data.ui.expandSymbol, { "aria-hidden": "true" }));
    button.addEventListener("click", () => openPhoto(item, item.caption, visiblePhotos));
    const caption = el("figcaption");
    caption.append(el("h3", "", item.title), el("p", "", item.caption));
    figure.append(button, caption);
    photos.append(figure);
    galleryFigures.push({ figure, item });
  });
  function filterPhotos(category) {
    visiblePhotos = data.gallery.items.filter((item) => category === "all" || item.category === category);
    galleryFigures.forEach(({ figure, item }) => { figure.hidden = !visiblePhotos.includes(item); });
    filterGroup.querySelectorAll("button").forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.filter === category)));
    galleryCount.textContent = data.ui.galleryCount.replace("{count}", String(visiblePhotos.length));
  }
  data.gallery.filters.forEach((filter) => {
    const button = el("button", "gallery-filter", filter.label, { type: "button", "data-filter": filter.id });
    button.addEventListener("click", () => filterPhotos(filter.id));
    filterGroup.append(button);
  });
  filterPhotos("all");
  galleryInner.append(galleryToolbar, photos);
  $("gallery").append(galleryInner);

  const group = data.group;
  const groupInner = el("div", "container group-grid");
  const groupFigure = el("figure", "group-photo");
  const groupButton = el("button", "photo-trigger", undefined, { type: "button", "aria-label": `${data.ui.viewPhoto}: ${group.title.replace(/\n/g, " ")}` });
  groupButton.append(image(group));
  groupButton.addEventListener("click", () => openPhoto(group, group.caption));
  groupFigure.append(groupButton, el("figcaption", "", group.caption));
  const groupCopy = el("div", "group-copy");
  groupCopy.append(heading(group, "group-title"), el("p", "eyebrow", group.reflectionLabel), el("blockquote", "", group.reflection), el("p", "small-note", group.reflectionNote));
  const date = el("p", "trip-date");
  date.append(el("span", "", `${group.dateHeading} · `), el("time", "", group.dateLabel, { datetime: group.date }));
  groupCopy.append(date, el("p", "eyebrow students-label", group.studentsLabel), el("p", "students", group.students.join(" · ")));
  if (group.sampleLabel) groupCopy.append(el("span", "sample-label", group.sampleLabel));
  groupInner.append(groupFigure, groupCopy);
  $("group").append(groupInner);

  const sourcesInner = el("div", "container sources-grid");
  sourcesInner.append(heading(data.sources, "sources-title"));
  const sourceList = el("ul", "source-list");
  data.sources.items.forEach((source) => {
    const row = el("li");
    const anchor = link(source.label, source.url);
    anchor.append(arrow());
    row.append(anchor, el("p", "", source.detail));
    sourceList.append(row);
  });
  sourcesInner.append(sourceList);
  $("sources").append(sourcesInner);
  const footerInner = el("div", "container footer-inner");
  const footerBrand = el("div");
  footerBrand.append(el("strong", "", data.footer.title), el("p", "", `${data.footer.course} · ${data.footer.year}`));
  const footerCopy = el("div", "footer-copy");
  footerCopy.append(el("p", "", data.footer.closing), el("small", "", `© ${data.footer.year} ${group.students.join(", ")}. ${data.footer.copyright}`));
  footerInner.append(footerBrand, footerCopy, link(data.ui.backTop, "#home", "text-link"));
  $("footer").append(footerInner);

  // Mobile menu: state, keyboard dismissal, and reset at desktop widths.
  function setMenu(open) {
    menu.setAttribute("aria-expanded", String(open));
    menu.setAttribute("aria-label", open ? data.ui.menuClose : data.ui.menuOpen);
    nav.classList.toggle("is-open", open);
  }
  menu.addEventListener("click", () => setMenu(menu.getAttribute("aria-expanded") !== "true"));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menu.getAttribute("aria-expanded") === "true") { setMenu(false); menu.focus(); }
  });
  document.addEventListener("click", (event) => { if (!$("header").contains(event.target)) setMenu(false); });
  window.matchMedia("(min-width: 901px)").addEventListener("change", (event) => { if (event.matches) setMenu(false); });

  // CSS supplies reduced-motion-aware smooth scrolling. Preserve native links,
  // hashes and browser history; focus the destination for keyboard navigation.
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", () => {
      setMenu(false);
      const target = document.querySelector(anchor.getAttribute("href"));
      if (target) { target.setAttribute("tabindex", "-1"); target.focus({ preventScroll: true }); }
    });
  });
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) nav.querySelectorAll("a").forEach((anchor) => {
          if (anchor.hash === `#${entry.target.id}`) anchor.setAttribute("aria-current", "location");
          else anchor.removeAttribute("aria-current");
        });
      });
    }, { rootMargin: "-15% 0px -65% 0px" });
    data.navigation.forEach((item) => observer.observe(document.querySelector(item.href)));
  }

  // The same accessible lightbox serves the map, gallery, and class photograph.
  const dialog = $("photo-dialog");
  let photoSequence = [];
  let photoIndex = 0;
  const photoControls = el("div", "photo-controls");
  const previousPhoto = el("button", "photo-step", data.ui.previousSymbol, { type: "button", "aria-label": data.ui.previousPhoto });
  const nextPhoto = el("button", "photo-step", data.ui.nextSymbol, { type: "button", "aria-label": data.ui.nextPhoto });
  const photoCounter = el("span", "photo-counter", undefined, { "aria-live": "polite", "aria-atomic": "true" });
  photoControls.append(previousPhoto, photoCounter, nextPhoto);
  dialog.append(photoControls);
  $("photo-close").textContent = data.ui.closeSymbol;
  $("photo-close").setAttribute("aria-label", data.ui.closePhoto);
  function displayPhoto(item, caption) {
    setImageSource($("photo-image"), item, "90vw");
    $("photo-image").alt = item.alt;
    $("photo-caption").textContent = caption;
    photoCounter.textContent = data.ui.photoCounter.replace("{current}", String(photoIndex + 1)).replace("{total}", String(photoSequence.length));
  }
  function openPhoto(item, caption, sequence = [item]) {
    photoSequence = sequence;
    photoIndex = Math.max(0, sequence.indexOf(item));
    photoControls.hidden = sequence.length < 2;
    displayPhoto(item, caption);
    dialog.showModal();
    document.body.classList.add("dialog-open");
    scheduleScene();
  }
  function stepPhoto(direction) {
    photoIndex = (photoIndex + direction + photoSequence.length) % photoSequence.length;
    const item = photoSequence[photoIndex];
    displayPhoto(item, item.caption);
  }
  previousPhoto.addEventListener("click", () => stepPhoto(-1));
  nextPhoto.addEventListener("click", () => stepPhoto(1));
  dialog.addEventListener("keydown", (event) => {
    if (photoSequence.length < 2) return;
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault(); stepPhoto(event.key === "ArrowLeft" ? -1 : 1);
    }
  });
  $("photo-close").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener("close", () => { document.body.classList.remove("dialog-open"); scheduleScene(); });

  // Animate once on entry. Content remains visible if motion is reduced or the
  // observer API is unavailable. Focus immediately reveals offscreen controls.
  if ("IntersectionObserver" in window && !motionPreference.matches) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(({ target, isIntersecting }) => {
        if (isIntersecting) { target.classList.add("is-visible"); revealObserver.unobserve(target); }
      });
    }, { threshold: 0.08 });
    document.querySelectorAll(".section-heading,.timeline-item,.map-card,.highlight-card,.gallery-item,.group-grid,.source-list").forEach((element, index) => {
      element.classList.add("reveal");
      element.style.setProperty("--reveal-delay", `${(index % 3) * 65}ms`);
      revealObserver.observe(element);
    });
  }
  // A passive, frame-batched listener updates reading progress without layout
  // changes. Background slideshow activity is managed separately above.
  const progress = el("div", "reading-progress", undefined, { "aria-hidden": "true" });
  $("header").append(progress);
  let scrollFrame = 0;
  function updateScroll() {
    scrollFrame = 0;
    const range = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.transform = `scaleX(${range > 0 ? Math.min(1, Math.max(0, window.scrollY / range)) : 0})`;
    $("header").classList.toggle("is-scrolled", window.scrollY > 30);
  }
  function requestScrollUpdate() { if (!scrollFrame) scrollFrame = window.requestAnimationFrame(updateScroll); }
  window.addEventListener("scroll", requestScrollUpdate, { passive: true });
  window.addEventListener("resize", requestScrollUpdate);
  if ("ResizeObserver" in window) new ResizeObserver(requestScrollUpdate).observe($("main"));
  updateScroll();

  // Fine-pointer interaction uses a CSS highlight rather than moving text.
  // A single animation frame per event burst keeps hovering inexpensive.
  if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    document.querySelectorAll(".highlight-card,.map-card").forEach((card) => {
      let hoverFrame = 0;
      card.addEventListener("pointermove", (event) => {
        if (motionPreference.matches || hoverFrame) return;
        const { clientX, clientY } = event;
        hoverFrame = requestAnimationFrame(() => {
          const rect = card.getBoundingClientRect();
          card.style.setProperty("--pointer-x", `${clientX - rect.left}px`);
          card.style.setProperty("--pointer-y", `${clientY - rect.top}px`);
          hoverFrame = 0;
        });
      });
    });
  }
})();
