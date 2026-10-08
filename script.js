/* Render only from content.js. DOM APIs keep teammate-entered text safe. */
(() => {
  "use strict";
  const data = window.siteContent;
  if (!data) return;
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
  function image(item, eager = false) {
    const img = el("img", "", undefined, {
      src: item.image, alt: item.alt || item.imageAlt, loading: eager ? "eager" : "lazy", decoding: "async"
    });
    if (eager) img.setAttribute("fetchpriority", "high");
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
  $("home").append(image(data.hero, true), el("div", "hero-shade"));
  const heroInner = el("div", "hero-inner container");
  heroInner.append(el("p", "eyebrow", data.hero.eyebrow), el("h1", "", data.hero.title, { id: "hero-title" }), el("p", "hero-subtitle", data.hero.subtitle), el("p", "hero-body", data.hero.body));
  const cta = link(data.hero.action, data.hero.actionHref, "button button-gold");
  cta.append(arrow());
  heroInner.append(cta);
  const heroBottom = el("div", "hero-bottom container");
  heroBottom.append(el("span", "hero-location", data.hero.location), el("span", "hero-caption", data.hero.imageCaption));
  $("home").append(heroInner, heroBottom);
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
  data.history.timeline.forEach((item) => {
    const row = el("li", "timeline-item");
    const copy = el("div", "timeline-copy");
    copy.append(el("h3", "", item.title), el("p", "", item.text));
    row.append(el("span", "timeline-date", item.date), copy);
    timeline.append(row);
  });
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
  historyInner.append(historyGrid);
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
  const photos = el("div", "gallery-grid");
  data.gallery.items.forEach((item) => {
    const figure = el("figure", `gallery-item ${item.shape === "wide" ? "gallery-wide" : ""}`);
    const button = el("button", "gallery-photo photo-trigger", undefined, { type: "button", "aria-label": `${data.ui.viewPhoto}: ${item.title}` });
    button.append(image(item), el("span", "photo-expand", data.ui.expandSymbol, { "aria-hidden": "true" }));
    button.addEventListener("click", () => openPhoto(item, item.caption));
    const caption = el("figcaption");
    caption.append(el("h3", "", item.title), el("p", "", item.caption));
    figure.append(button, caption);
    photos.append(figure);
  });
  galleryInner.append(photos);
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
  groupCopy.append(date, el("p", "eyebrow students-label", group.studentsLabel), el("p", "students", group.students.join(" · ")), el("span", "sample-label", group.sampleLabel));
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
  $("photo-close").textContent = data.ui.closeSymbol;
  $("photo-close").setAttribute("aria-label", data.ui.closePhoto);
  function openPhoto(item, caption) {
    $("photo-image").src = item.image;
    $("photo-image").alt = item.alt;
    $("photo-caption").textContent = caption;
    dialog.showModal();
    document.body.classList.add("dialog-open");
  }
  $("photo-close").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener("close", () => document.body.classList.remove("dialog-open"));
})();
