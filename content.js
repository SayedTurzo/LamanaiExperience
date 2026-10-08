/*
 * TEAM CONTENT EDITOR — this is the only file you need to edit.
 * Keep quotes and commas in place. Add gallery photos by copying one gallery
 * entry. Image paths are relative to index.html, with case-sensitive filenames.
 * Exactly THREE entries belong in highlights.items.
 * Replace the SAMPLE names, date and reflection before submitting the project.
 * Source images supplied in the chat are preserved as optimized local assets.
 */
window.siteContent = {
  meta: {
    title: "My Lamanai Experience | Belizean History Trip",
    description: "A student field journal from Lamanai, Belize: Maya history, a site map, three tour highlights, and photographs from our class visit."
  },
  ui: {
    skip: "Skip to content", navigation: "Main navigation", menuOpen: "Open navigation",
    menuClose: "Close navigation", closePhoto: "Close photograph", closeSymbol: "×", expandSymbol: "↗", viewPhoto: "View photograph",
    enlargeMap: "Explore the site map", backTop: "Back to top", imageUnavailable: "Photograph unavailable",
    previousPhoto: "Previous photograph", nextPhoto: "Next photograph", previousSymbol: "←", nextSymbol: "→",
    photoCounter: "{current} / {total}", galleryFilters: "Filter photographs", galleryCount: "{count} photographs",
    heroScenes: "Scenes from our journey", sceneLabel: "Show scene {number}: {caption}",
    pauseSlideshow: "Pause slideshow", playSlideshow: "Play slideshow", pauseSymbol: "Ⅱ", playSymbol: "▶",
    chapterLabel: "Explore this chapter", chapterEyebrow: "TRAVEL THROUGH TIME", chapterPhotoLabel: "From our field journal", sceneDuration: 6500
  },
  brand: { title: "Lamanai", subtitle: "A student field journal", monogram: "L" },
  navigation: [
    { label: "Home", href: "#home" }, { label: "History & Map", href: "#history" },
    { label: "Tour Highlights", href: "#highlights" }, { label: "Gallery", href: "#gallery" },
    { label: "Group Photo", href: "#group" }
  ],
  hero: {
    eyebrow: "BELIZEAN HISTORY TRIP · 2026", title: "Where the jungle\nremembers.",
    subtitle: "Our Lamanai experience", body: "Beyond the classroom, beneath the canopy. A journey through the temples, stories, and living heritage of an extraordinary Maya city.",
    action: "Explore Journey", actionHref: "#history", location: "Orange Walk District, Belize", image: "images/high-temple.jpg",
    imageAlt: "Lamanai’s High Temple rising above a grassy plaza beneath a blue sky",
    imageCaption: "The High Temple · Lamanai Archaeological Reserve",
    // Additional hero scenes. Keep photographs and captions together.
    scenes: [
      { image: "images/ball-court.jpg", imageAlt: "Lamanai’s ball court beneath the forest canopy", imageCaption: "The Ball Court · sport and ceremony" },
      { image: "images/temple-plaza.jpg", imageAlt: "Stone temple terraces in the tropical landscape", imageCaption: "Stone terraces · stories in every layer" }
    ],
    secondaryAction: "Through our lens", secondaryHref: "#gallery",
    fieldNote: { eyebrow: "FROM OUR FIELD JOURNAL", title: "History feels different\nwhen you’re standing in it.", image: "images/class-at-temple.jpg", alt: "Our class looking toward the High Temple", caption: "One class. A thousand new questions." }
  },
  intro: [
    { value: "3,000+", label: "years of history" },
    { value: "33 m", label: "the High Temple" },
    { value: "03", label: "tour highlights" },
    { value: "One journey", label: "a new perspective" }
  ],
  history: {
    eyebrow: "01 / HISTORY & MAP", title: "A city that endured.",
    introduction: "Lamanai means “submerged crocodile.” Beside the New River Lagoon in northern Belize, this Maya community has an unusually long history of occupation.",
    timelineLabel: "Lamanai through time",
    // Context photographs from our visit, not reconstructions of ancient periods.
    chapterPhotos: [
      { image: "images/entrance.jpg", alt: "The wooded entrance to Lamanai today" },
      { image: "images/high-temple.jpg", alt: "The High Temple photographed during our visit" },
      { image: "images/temple-plaza.jpg", alt: "Temple and plaza architecture at Lamanai today" },
      { image: "images/ball-court.jpg", alt: "The ball court amid the forest today" },
      { image: "images/maya-house.jpg", alt: "A modern visitor display of Maya house architecture" },
      { image: "images/guided-tour.jpg", alt: "Our class learning from a guide at Lamanai" }
    ],
    timeline: [
      { date: "c. 1500 BCE", title: "Roots beside the lagoon", text: "Maize pollen indicates early settlement. The lagoon connected the community to water and river travel." },
      { date: "c. 100 BCE", title: "Monumental beginnings", text: "The High Temple’s first major phase reshaped the ceremonial center." },
      { date: "250–900 CE", title: "A flourishing Maya city", text: "Temples, plazas, and elite residences supported public and ceremonial life." },
      { date: "900–1500 CE", title: "Continuity through change", text: "Lamanai survived regional decline. Trade continued as activity shifted southward." },
      { date: "1540s–1700s", title: "Contact & resistance", text: "Spanish missions built churches. A church burning was reported in 1641; Maya occupation continued." },
      { date: "1974 onward", title: "Research & preservation", text: "David Pendergast’s excavation program helped document the city. Continued research and conservation reveal its layered past." }
    ],
    map: {
      eyebrow: "FIND YOUR WAY", title: "Reading the landscape", image: "images/site-map.jpg",
      alt: "Lamanai site sign showing mapped structures, the ball court, harbor, churches, sugar mill, and north arrow",
      caption: "The reserve’s site-plan sign shows the archaeological grounds, from the harbor and ceremonial buildings to the churches and sugar mill. Open the photograph to inspect the labels.",
      note: "A photographed site plan; some small labels are weathered. Consult the research maps for greater detail.",
      linkLabel: "View archaeological research maps", link: "https://www.lamanai.org.uk/lamanai-maps.html",
      places: ["High Temple · N10-43", "Ball Court · ceremonial precinct", "Mask Temple · N9-56", "Jaguar Temple · N10-9"]
    }
  },
  highlights: {
    eyebrow: "02 / TOUR HIGHLIGHTS", title: "Three stops. Countless stories.",
    introduction: "Stone architecture becomes more meaningful when we connect it to the people, beliefs, and daily life behind it.",
    items: [
      { number: "01", category: "SPORT & CEREMONY", title: "The Ball Court", image: "images/ball-court.jpg",
        alt: "Lamanai ball court with low stone structures and a Ball Court sign under the forest canopy",
        caption: "The ball court, photographed during our visit.",
        paragraphs: ["Lamanai’s court sits near the High Temple. Its opposing stone structures frame a playing space where athletic skill met ceremonial meaning.", "The Maya ballgame, often called Pok-a-tok, used a solid rubber ball. In many versions players struck it with their hips or torso rather than hands and feet. Rules, scoring, and court designs varied across places and periods.", "The game was linked to mythology and, in some contexts, human sacrifice. Archaeologists do not establish a universal rule that either the winning or losing team was sacrificed. Nor should ring heights or ball weights from other courts be treated as confirmed rules at Lamanai."],
        sourceIds: ["ballgame", "overview"] },
      { number: "02", category: "ARCHITECTURE & PERSPECTIVE", title: "The High Temple", image: "images/high-temple.jpg",
        alt: "Front view of the High Temple and its stepped stone terraces",
        caption: "The High Temple’s monumental terraces and central stairway.",
        paragraphs: ["Structure N10-43 rises approximately 33 meters and is the tallest temple at Lamanai. Its stepped form reflects successive building campaigns over many centuries.", "Above the forest canopy, the summit provides a broad perspective on the lagoon landscape and the city’s setting. Seeing its scale from the plaza helped us appreciate the planning and labor behind Maya architecture."],
        sourceIds: ["temple", "history"] },
      { number: "03", category: "POWER & PUBLIC LIFE", title: "The Royal Plaza & Stelae", image: "images/temple-plaza.jpg",
        alt: "Stone temple terraces and grassy plaza photographed at Lamanai",
        caption: "Temple and plaza architecture from our visit; this photograph does not identify the Royal Complex or a stela.",
        paragraphs: ["Lamanai’s elite complexes combined plazas with residential and administrative buildings. The Ottawa group became a focus of Late Classic public life.", "Stelae are upright stone monuments that can commemorate rulers and ritual events. A carved stela was re-erected before Lamanai’s Mask Temple in the later Postclassic, showing the lasting significance of earlier monuments."],
        sourceIds: ["history"] }
    ]
  },
  gallery: {
    eyebrow: "03 / THROUGH OUR LENS", title: "Small moments. Lasting memories.",
    introduction: "A field journal in photographs—our class, the forest, and the details we stopped to notice.",
    // Match each photo's category to a filter id. "all" displays every photo.
    filters: [{ id: "all", label: "All moments" }, { id: "architecture", label: "Architecture" }, { id: "details", label: "Details & discoveries" }, { id: "class", label: "Our class" }],
    items: [
      { category: "class", image: "images/class-at-temple.jpg", alt: "Students gathered on the grass facing the High Temple", title: "History, in front of us", caption: "Our class pauses at the foot of the High Temple.", shape: "wide" },
      { category: "architecture", image: "images/maya-house.jpg", alt: "A timber and thatch Maya house display beside a visitor sign", title: "A different kind of architecture", caption: "A Maya house display, with timber walls and a thatched roof." },
      { category: "details", image: "images/stone-detail.jpg", alt: "Close view of a weathered circular carved stone", title: "Details in stone", caption: "A carved stone photographed during the guided tour; its specific function is not confirmed in our notes." },
      { category: "details", image: "images/entrance.jpg", alt: "Thatched shelter over the welcome signs and map at Lamanai", title: "The journey begins", caption: "Maps and welcome signs at the reserve entrance." },
      { category: "class", image: "images/guided-tour.jpg", alt: "Students listening to a guide beside a circular stone under trees", title: "Learning beneath the canopy", caption: "Listening, asking questions, and connecting the tour to our classroom learning.", shape: "wide" },
      { category: "architecture", image: "images/temple-plaza.jpg", alt: "Low-angle view of a stepped stone temple surrounded by trees", title: "Built to endure", caption: "Stone terraces, green spaces, and the tropical landscape." }
    ]
  },
  group: {
    eyebrow: "04 / OUR SHARED EXPERIENCE", title: "Together, beyond\nthe classroom.",
    image: "images/group-photo.jpg", alt: "Our class gathered in the High Temple plaza during the trip",
    caption: "Our class at Lamanai’s High Temple plaza. Replace with a formal group portrait if one becomes available.",
    // SAMPLE DATE: change both the machine-readable date and its visible label.
    date: "2026-03-20", dateLabel: "March 20, 2026", dateHeading: "Trip date", sampleLabel: "Sample date & attributions",
    reflectionLabel: "OUR REFLECTION", reflection: "Standing beside the temples made history feel tangible. We left with a deeper appreciation for Maya knowledge, the endurance of Lamanai, and our responsibility to respect Belize’s cultural heritage.",
    reflectionNote: "Draft reflection—replace with your group’s own words.",
    studentsLabel: "PREPARED BY", students: ["Maya Bennett", "Daniel Castillo", "Sofia Williams", "Ethan Martinez"]
  },
  sources: {
    eyebrow: "THE RESEARCH BEHIND THE JOURNEY", title: "Notes & references",
    introduction: "Our tour notes are supported by archaeological research and museum scholarship. Photographs come from the supplied project materials; the map is the supplied reserve-sign photograph.",
    items: [
      { id: "history", label: "Lamanai Archaeology Project", detail: "Settlement, temples, plazas, and long-term change", url: "https://www.lamanai.org.uk/index.html" },
      { id: "overview", label: "University of North Carolina Wilmington", detail: "Occupation history and the archaeological project", url: "https://people.uncw.edu/simmonss/Lamanai%20overview%20of%20LAP.htm" },
      { id: "nich", label: "National Institute of Culture and History", detail: "Site location, name, and cultural heritage", url: "https://nichbelize.org/ia-sites/lamanai/" },
      { id: "ballgame", label: "The Metropolitan Museum of Art", detail: "The Mesoamerican Ballgame · Caitlin C. Earley, 2017", url: "https://www.metmuseum.org/essays/the-mesoamerican-ballgame" },
      { id: "temple", label: "Lamanai Tourism Development Project", detail: "High Temple dimensions and conservation", url: "https://people.uncw.edu/simmonss/tourism_development_project_at_l.htm" }
    ]
  },
  footer: { title: "My Lamanai Experience", course: "Belizean History Trip", year: "2026", copyright: "Student project. All rights reserved.", closing: "Made with curiosity. Remembered together." }
};
